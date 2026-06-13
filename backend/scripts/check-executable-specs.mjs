import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const repoRoot = path.resolve(process.cwd(), '..');
const backendRoot = process.cwd();
const violations = [];

function fail(message) {
  violations.push(message);
}

async function readJSON(relativePath) {
  return JSON.parse(await readFile(path.join(repoRoot, relativePath), 'utf8'));
}

async function readText(relativePath) {
  return readFile(path.join(repoRoot, relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await stat(path.join(repoRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function listFiles(relativeDir, extension) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(relativeDir, entry.name));
}

function collectIds(section, prefix, seen) {
  for (const item of section ?? []) {
    if (!item?.id) {
      fail(`${prefix}: 存在缺少 id 的条目。`);
      continue;
    }
    if (!item.id.startsWith(prefix)) {
      fail(`${item.id}: ID 必须使用 ${prefix} 前缀。`);
    }
    if (seen.has(item.id)) {
      fail(`${item.id}: ID 重复。`);
    }
    seen.add(item.id);
  }
}

function mustReferenceKnown(owner, field, known, allowedEmpty = true) {
  const values = owner[field] ?? [];
  if (!allowedEmpty && values.length === 0) {
    fail(`${owner.id}: ${field} 不能为空。`);
  }
  for (const value of values) {
    if (!known.has(value)) {
      fail(`${owner.id}: ${field} 引用了不存在的 ID: ${value}`);
    }
  }
}

function tagsFromFeature(content) {
  const tags = new Set();
  for (const match of content.matchAll(/@([A-Z]+(?:-[A-Z0-9]+)+)/g)) {
    tags.add(match[1]);
  }
  return tags;
}

function hiddenTagPattern(kind, id) {
  return `<!-- ${kind}:${id} -->`;
}

const rtm = await readJSON('docs/rtm.json');
const baseline = await readJSON('tests/baselines/nonfunctional.json');
const contractConfig = await readJSON('backend/contracts/schema-validator-config.json');
const openapi = YAML.parse(await readText('backend/openapi/openapi.yaml'));

if (rtm.schemaVersion !== '1.0.0') {
  fail('docs/rtm.json: schemaVersion 必须为 1.0.0。');
}

const allIds = new Set();
collectIds(rtm.requirements, 'REQ-', allIds);
collectIds(rtm.features, 'FEAT-', allIds);
collectIds(rtm.apis, 'API-', allIds);
collectIds(rtm.tests, 'TEST-', allIds);
collectIds(rtm.nfrs, 'NFR-', allIds);
collectIds(rtm.rules, 'RULE-', allIds);

const requirementIds = new Set((rtm.requirements ?? []).map((item) => item.id));
const featureIds = new Set((rtm.features ?? []).map((item) => item.id));
const apiIds = new Set((rtm.apis ?? []).map((item) => item.id));
const testIds = new Set((rtm.tests ?? []).map((item) => item.id));
const nfrIds = new Set((rtm.nfrs ?? []).map((item) => item.id));

for (const requirement of rtm.requirements ?? []) {
  mustReferenceKnown(requirement, 'featureIds', featureIds, false);
  mustReferenceKnown(requirement, 'apiIds', apiIds, true);
  mustReferenceKnown(requirement, 'testIds', testIds, true);
  mustReferenceKnown(requirement, 'nfrIds', nfrIds, true);
  if (!requirement.source?.path || !requirement.source?.hiddenTag) {
    fail(`${requirement.id}: 必须声明 source.path 和 source.hiddenTag。`);
  }
}

for (const feature of rtm.features ?? []) {
  mustReferenceKnown(feature, 'requirementIds', requirementIds, false);
  mustReferenceKnown(feature, 'apiIds', apiIds, true);
  mustReferenceKnown(feature, 'testIds', testIds, true);
  mustReferenceKnown(feature, 'nfrIds', nfrIds, true);
}

for (const api of rtm.apis ?? []) {
  mustReferenceKnown(api, 'requirementIds', requirementIds, true);
  mustReferenceKnown(api, 'testIds', testIds, false);
  mustReferenceKnown(api, 'nfrIds', nfrIds, true);
  if (!api.method || !api.path || !api.operationId) {
    fail(`${api.id}: 必须声明 method/path/operationId。`);
  }
}

for (const test of rtm.tests ?? []) {
  mustReferenceKnown(test, 'requirementIds', requirementIds, false);
  mustReferenceKnown(test, 'apiIds', apiIds, true);
  mustReferenceKnown(test, 'nfrIds', nfrIds, true);
  if (!test.kind || !test.source?.path) {
    fail(`${test.id}: 必须声明 kind 和 source.path。`);
  }
}

for (const nfr of rtm.nfrs ?? []) {
  if (!nfr.baselineKey) {
    fail(`${nfr.id}: 必须声明 baselineKey。`);
  }
  if (!nfr.source?.path || !nfr.source?.hiddenTag) {
    fail(`${nfr.id}: 必须声明 source.path 和 source.hiddenTag。`);
  }
}

for (const rule of rtm.rules ?? []) {
  mustReferenceKnown(rule, 'requirementIds', requirementIds, false);
}

const sourceCache = new Map();
async function sourceContains(relativePath, pattern) {
  if (!await exists(relativePath)) {
    fail(`${relativePath}: 源文件不存在。`);
    return false;
  }
  if (!sourceCache.has(relativePath)) {
    sourceCache.set(relativePath, await readText(relativePath));
  }
  return sourceCache.get(relativePath).includes(pattern);
}

for (const requirement of rtm.requirements ?? []) {
  if (!await sourceContains(requirement.source.path, requirement.source.hiddenTag)) {
    fail(`${requirement.id}: 在 ${requirement.source.path} 中未找到隐藏标签 ${requirement.source.hiddenTag}`);
  }
}
for (const nfr of rtm.nfrs ?? []) {
  if (!await sourceContains(nfr.source.path, nfr.source.hiddenTag)) {
    fail(`${nfr.id}: 在 ${nfr.source.path} 中未找到隐藏标签 ${nfr.source.hiddenTag}`);
  }
}
for (const rule of rtm.rules ?? []) {
  if (!await sourceContains(rule.source.path, rule.source.hiddenTag)) {
    fail(`${rule.id}: 在 ${rule.source.path} 中未找到隐藏标签 ${rule.source.hiddenTag}`);
  }
}
for (const feature of rtm.features ?? []) {
  if (!await sourceContains(feature.source.path, hiddenTagPattern('FEAT', feature.id))) {
    fail(`${feature.id}: 在 ${feature.source.path} 中未找到隐藏标签 ${hiddenTagPattern('FEAT', feature.id)}`);
  }
}
for (const api of rtm.apis ?? []) {
  if (!await sourceContains('docs/executable-specification-system.md', hiddenTagPattern('API', api.id))) {
    fail(`${api.id}: docs/executable-specification-system.md 缺少 API 隐藏标签。`);
  }
}

const openapiOperations = new Map();
for (const [route, methods] of Object.entries(openapi.paths ?? {})) {
  for (const [method, operation] of Object.entries(methods ?? {})) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
      continue;
    }
    openapiOperations.set(operation.operationId, { route, method: method.toUpperCase(), operation });
  }
}

for (const api of rtm.apis ?? []) {
  const found = openapiOperations.get(api.operationId);
  if (!found) {
    fail(`${api.id}: OpenAPI 缺少 operationId ${api.operationId}。`);
    continue;
  }
  if (found.route !== api.path || found.method !== api.method) {
    fail(`${api.id}: RTM 路径/方法 ${api.method} ${api.path} 与 OpenAPI ${found.method} ${found.route} 不一致。`);
  }
  if (found.operation['x-api-id'] !== api.id) {
    fail(`${api.id}: OpenAPI operation 必须声明 x-api-id: ${api.id}。`);
  }
  for (const field of ['x-requirement-ids', 'x-test-ids', 'x-nfr-ids']) {
    const expected = field === 'x-requirement-ids' ? api.requirementIds : field === 'x-test-ids' ? api.testIds : api.nfrIds;
    const actual = found.operation[field] ?? [];
    const missing = expected.filter((value) => !actual.includes(value));
    if (missing.length > 0) {
      fail(`${api.id}: OpenAPI ${field} 缺少 ${missing.join(', ')}。`);
    }
  }
}

for (const operationId of openapiOperations.keys()) {
  if (![...rtm.apis].some((api) => api.operationId === operationId)) {
    fail(`OpenAPI operationId ${operationId} 未登记到 docs/rtm.json。`);
  }
}

const featureFiles = await listFiles('tests/specs', '.feature');
if (featureFiles.length === 0) {
  fail('tests/specs: 必须至少包含一个 Gherkin .feature 文件。');
}
const featureTags = new Map();
for (const file of featureFiles) {
  const content = await readText(file);
  if (!/^Feature:/m.test(content)) {
    fail(`${file}: 缺少 Feature 声明。`);
  }
  if (!/Scenario:/m.test(content)) {
    fail(`${file}: 缺少 Scenario 声明。`);
  }
  const tags = tagsFromFeature(content);
  featureTags.set(file, tags);
  for (const tag of tags) {
    if (/^(REQ|FEAT|API|TEST|NFR)-/.test(tag) && !allIds.has(tag)) {
      fail(`${file}: 标签 @${tag} 未登记到 docs/rtm.json。`);
    }
  }
}

for (const test of (rtm.tests ?? []).filter((item) => item.kind === 'bdd')) {
  const file = test.source.path;
  const tags = featureTags.get(file);
  if (!tags) {
    fail(`${test.id}: feature 文件不存在或未扫描: ${file}`);
    continue;
  }
  if (!tags.has(test.id)) {
    fail(`${test.id}: ${file} 缺少 @${test.id}。`);
  }
  for (const id of [...test.requirementIds, ...test.apiIds, ...test.nfrIds]) {
    if (!tags.has(id)) {
      fail(`${test.id}: ${file} 缺少关联标签 @${id}。`);
    }
  }
}

function hasBaselineKey(key) {
  const segments = key.split('.');
  let cursor = baseline.thresholds;
  for (const segment of segments) {
    if (!cursor || !(segment in cursor)) {
      return false;
    }
    cursor = cursor[segment];
  }
  return true;
}
for (const item of rtm.nfrs ?? []) {
  if (!hasBaselineKey(item.baselineKey)) {
    fail(`${item.id}: tests/baselines/nonfunctional.json 缺少 baselineKey ${item.baselineKey}。`);
  }
}

if (contractConfig.openapi !== 'backend/openapi/openapi.yaml') {
  fail('backend/contracts/schema-validator-config.json: openapi 路径必须为 backend/openapi/openapi.yaml。');
}
if (contractConfig.rtm !== 'docs/rtm.json') {
  fail('backend/contracts/schema-validator-config.json: rtm 路径必须为 docs/rtm.json。');
}
const contractApiIds = new Set((contractConfig.operations ?? []).map((operation) => operation.apiId));
for (const api of rtm.apis ?? []) {
  if (!contractApiIds.has(api.id)) {
    fail(`${api.id}: schema-validator-config.json 缺少对应 operation。`);
  }
}

if (violations.length > 0) {
  console.error('可执行规约检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`可执行规约检查通过：${requirementIds.size} 条需求，${featureIds.size} 个功能，${apiIds.size} 个接口，${testIds.size} 个测试，${nfrIds.size} 个非功能约束。`);
