import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');
const watched = /^(docs\/|backend\/openapi\/|backend\/contracts\/|tests\/specs\/|tests\/baselines\/)/;
const ignoredGenerated = /^(docs\/index\/last-impact-report\.json)$/;
const rtm = JSON.parse(await readFile(path.join(repoRoot, 'docs', 'rtm.json'), 'utf8'));

function git(args) {
  try {
    return { ok: true, output: execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim() };
  } catch (error) {
    return { ok: false, output: '', error };
  }
}

async function walk(relativeDir) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  try {
    await stat(absoluteDir);
  } catch {
    return [];
  }
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist'].includes(entry.name)) continue;
      files.push(...await walk(relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files;
}

const gitResults = [
  git(['diff', '--cached', '--name-only']),
  git(['diff', '--name-only']),
  git(['ls-files', '--others', '--exclude-standard']),
];
const gitAvailable = gitResults.every((result) => result.ok);
let changed;
let mode;

if (gitAvailable) {
  mode = 'git-diff';
  changed = gitResults.flatMap((result) => result.output.split('\n').filter(Boolean));
} else {
  mode = 'filesystem-conservative-fallback';
  changed = [
    ...await walk('docs'),
    ...await walk('backend/openapi'),
    ...await walk('backend/contracts'),
    ...await walk('tests/specs'),
    ...await walk('tests/baselines'),
  ];
}

changed = [...new Set(changed)]
  .filter((file) => watched.test(file))
  .filter((file) => !ignoredGenerated.test(file))
  .sort();

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
    if (file.startsWith('tests/specs/') && test.source?.path === file) {
      for (const id of [...(test.requirementIds ?? []), ...(test.apiIds ?? []), ...(test.nfrIds ?? [])]) ids.add(id);
    }
  }
  for (const feature of rtm.features ?? []) {
    if (feature.source?.path === file) ids.add(feature.id);
  }
  for (const api of rtm.apis ?? []) {
    if (file === 'backend/openapi/openapi.yaml' || file === 'backend/contracts/schema-validator-config.json') ids.add(api.id);
  }
  if (file === 'tests/baselines/nonfunctional.json') {
    for (const item of rtm.nfrs ?? []) ids.add(item.id);
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
  mode,
  changedFiles: changed,
  impact,
  note: changed.length === 0 ? '未检测到文档/规约相关变更。' : '请在提交或 PR 描述中说明这些 ID 的影响范围。',
};
await mkdir(path.join(repoRoot, 'docs', 'index'), { recursive: true });
await writeFile(path.join(repoRoot, 'docs', 'index', 'last-impact-report.json'), JSON.stringify(summary, null, 2) + '\n');

if (changed.length === 0) {
  console.log(`文档变更影响检查通过：未检测到文档/规约相关变更。mode=${mode}`);
} else {
  console.log(`文档变更影响检查完成：${changed.length} 个文件，mode=${mode}，报告 docs/index/last-impact-report.json。`);
  for (const item of impact.slice(0, 30)) {
    console.log(`- ${item.file}: ${item.impactedIds.slice(0, 12).join(', ')}${item.impactedIds.length > 12 ? ', ...' : ''}`);
  }
  if (impact.length > 30) console.log(`... 其余 ${impact.length - 30} 个文件见报告。`);
}
