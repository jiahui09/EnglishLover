import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');
const watched = /^(docs\/|backend\/openapi\/|backend\/contracts\/|tests\/specs\/|tests\/baselines\/)/;
const rtm = JSON.parse(await readFile(path.join(repoRoot, 'docs', 'rtm.json'), 'utf8'));

function git(args) {
  try {
    return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
const working = git(['diff', '--name-only']).split('\n').filter(Boolean);
const untracked = git(['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
const changed = [...new Set([...staged, ...working, ...untracked])].filter((file) => watched.test(file));

function impactedIdsForFile(file) {
  const ids = new Set();
  for (const requirement of rtm.requirements ?? []) {
    if (requirement.source?.path === file) ids.add(requirement.id);
  }
  for (const nfr of rtm.nfrs ?? []) {
    if (nfr.source?.path === file) ids.add(nfr.id);
  }
  for (const rule of rtm.rules ?? []) {
    if (rule.source?.path === file) ids.add(rule.id);
  }
  for (const test of rtm.tests ?? []) {
    if (test.source?.path === file) ids.add(test.id);
  }
  for (const api of rtm.apis ?? []) {
    if (file === 'backend/openapi/openapi.yaml' || file === 'backend/contracts/schema-validator-config.json') ids.add(api.id);
  }
  if (file === 'docs/rtm.json') {
    for (const section of ['requirements', 'features', 'apis', 'tests', 'nfrs', 'rules']) {
      for (const item of rtm[section] ?? []) ids.add(item.id);
    }
  }
  return [...ids].sort();
}

const impact = changed.map((file) => ({ file, impactedIds: impactedIdsForFile(file) }));
const summary = {
  schemaVersion: '1.0.0',
  changedFiles: changed,
  impact,
  note: changed.length === 0 ? '未检测到文档/规约相关变更。' : '请在提交或 PR 描述中说明这些 ID 的影响范围。',
};
await mkdir(path.join(repoRoot, 'docs', 'index'), { recursive: true });
await writeFile(path.join(repoRoot, 'docs', 'index', 'last-impact-report.json'), JSON.stringify(summary, null, 2) + '\n');

if (changed.length === 0) {
  console.log('文档变更影响检查通过：未检测到文档/规约相关变更。');
} else {
  console.log(`文档变更影响检查完成：${changed.length} 个文件，报告 docs/index/last-impact-report.json。`);
  for (const item of impact) {
    console.log(`- ${item.file}: ${item.impactedIds.slice(0, 12).join(', ')}${item.impactedIds.length > 12 ? ', ...' : ''}`);
  }
}
