import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');
const outputDir = path.join(repoRoot, 'docs', 'index');
const rtm = JSON.parse(await readFile(path.join(repoRoot, 'docs', 'rtm.json'), 'utf8'));
const violations = [];

function fail(message) {
  violations.push(message);
}

async function walk(dir, accept) {
  const absolute = path.join(repoRoot, dir);
  const entries = await readdir(absolute, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.omx'].includes(entry.name)) continue;
      if (relative === 'docs/index') continue;
      files.push(...await walk(relative, accept));
    } else if (accept(relative)) {
      files.push(relative);
    }
  }
  return files;
}

function extractIds(text) {
  const ids = new Set();
  for (const match of text.matchAll(/(?:<!--\s*(?:REQ|FEAT|API|NFR|RULE|ADR):\s*([A-Z]+(?:-[A-Z0-9]+)+)\s*-->|@([A-Z]+(?:-[A-Z0-9]+)+)|\b((?:REQ|FEAT|API|TEST|NFR|RULE|ADR)-[A-Z0-9-]+)\b)/g)) {
    ids.add(match[1] || match[2] || match[3]);
  }
  return [...ids];
}

function classify(relativePath) {
  if (relativePath === 'docs/rtm.json') return 'traceability_matrix';
  if (relativePath === 'backend/openapi/openapi.yaml') return 'openapi_contract';
  if (relativePath.startsWith('tests/specs/')) return 'gherkin_acceptance';
  if (relativePath.startsWith('tests/baselines/')) return 'nonfunctional_baseline';
  if (relativePath.startsWith('docs/adr/')) return 'architecture_decision';
  if (relativePath.startsWith('docs/diagrams/')) return 'diagram_source';
  if (relativePath === 'docs/GLOSSARY.md') return 'glossary';
  if (relativePath.startsWith('docs/agent-workflows/')) return 'agent_workflow';
  return 'documentation';
}

function moduleFromIds(ids) {
  for (const id of ids) {
    const found = [...rtm.requirements, ...rtm.features, ...rtm.apis, ...rtm.nfrs, ...rtm.rules].find((item) => item.id === id);
    if (found?.module) return found.module;
  }
  return 'general';
}

function summarize(text) {
  const clean = text
    .split('\n')
    .map((line) => line.replace(/<!--.*?-->/g, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ');
  return clean.slice(0, 220);
}

function chunkMarkdown(relativePath, text) {
  const lines = text.split('\n');
  const chunks = [];
  let currentHeading = 'Document';
  let currentLevel = 0;
  let buffer = [];
  let startLine = 1;
  function flush(endLine) {
    const body = buffer.join('\n').trim();
    if (!body) return;
    const ids = extractIds(body);
    chunks.push({
      id: `${relativePath}#L${startLine}`,
      sourcePath: relativePath,
      type: classify(relativePath),
      heading: currentHeading,
      level: currentLevel,
      startLine,
      endLine,
      ids,
      requirementIds: ids.filter((id) => id.startsWith('REQ-')),
      featureIds: ids.filter((id) => id.startsWith('FEAT-')),
      apiIds: ids.filter((id) => id.startsWith('API-')),
      testIds: ids.filter((id) => id.startsWith('TEST-')),
      nfrIds: ids.filter((id) => id.startsWith('NFR-')),
      module: moduleFromIds(ids),
      summary: summarize(body),
      text: body,
    });
  }
  lines.forEach((line, index) => {
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading && buffer.length > 0) {
      flush(index);
      buffer = [];
      startLine = index + 1;
    }
    if (heading) {
      currentLevel = heading[1].length;
      currentHeading = heading[2].trim();
    }
    buffer.push(line);
  });
  flush(lines.length);
  return chunks;
}

function chunkWholeFile(relativePath, text) {
  const ids = extractIds(text);
  return [{
    id: `${relativePath}#file`,
    sourcePath: relativePath,
    type: classify(relativePath),
    heading: path.basename(relativePath),
    level: 0,
    startLine: 1,
    endLine: text.split('\n').length,
    ids,
    requirementIds: ids.filter((id) => id.startsWith('REQ-')),
    featureIds: ids.filter((id) => id.startsWith('FEAT-')),
    apiIds: ids.filter((id) => id.startsWith('API-')),
    testIds: ids.filter((id) => id.startsWith('TEST-')),
    nfrIds: ids.filter((id) => id.startsWith('NFR-')),
    module: moduleFromIds(ids),
    summary: summarize(text),
    text: text.trim(),
  }];
}

const files = [
  ...await walk('docs', (relative) => /\.(md|json|mmd|puml)$/.test(relative)),
  ...await walk('tests/specs', (relative) => relative.endsWith('.feature')),
  ...await walk('tests/baselines', (relative) => relative.endsWith('.json')),
  'backend/openapi/openapi.yaml',
  'backend/contracts/schema-validator-config.json',
];

const chunks = [];
for (const relativePath of [...new Set(files)].sort()) {
  const absolutePath = path.join(repoRoot, relativePath);
  try {
    await stat(absolutePath);
  } catch {
    fail(`${relativePath}: 索引源文件不存在。`);
    continue;
  }
  const text = await readFile(absolutePath, 'utf8');
  if (relativePath.endsWith('.md')) {
    chunks.push(...chunkMarkdown(relativePath, text));
  } else {
    chunks.push(...chunkWholeFile(relativePath, text));
  }
}

const nodes = [];
const edges = [];
function addNode(id, type, attributes = {}) {
  nodes.push({ id, type, ...attributes });
}
function addEdge(from, to, type) {
  edges.push({ from, to, type });
}

for (const item of rtm.requirements ?? []) addNode(item.id, 'requirement', { title: item.title, module: item.module, priority: item.priority });
for (const item of rtm.features ?? []) addNode(item.id, 'feature', { title: item.title, module: item.module });
for (const item of rtm.apis ?? []) addNode(item.id, 'api', { operationId: item.operationId, method: item.method, path: item.path, module: item.module });
for (const item of rtm.tests ?? []) addNode(item.id, 'test', { title: item.title, kind: item.kind });
for (const item of rtm.nfrs ?? []) addNode(item.id, 'nfr', { title: item.title, module: item.module, baselineKey: item.baselineKey });
for (const item of rtm.rules ?? []) addNode(item.id, 'rule', { title: item.title, module: item.module });

for (const requirement of rtm.requirements ?? []) {
  for (const id of requirement.featureIds ?? []) addEdge(requirement.id, id, 'implemented_by');
  for (const id of requirement.apiIds ?? []) addEdge(requirement.id, id, 'exposed_by');
  for (const id of requirement.testIds ?? []) addEdge(requirement.id, id, 'verified_by');
  for (const id of requirement.nfrIds ?? []) addEdge(requirement.id, id, 'constrained_by');
}
for (const feature of rtm.features ?? []) {
  for (const id of feature.apiIds ?? []) addEdge(feature.id, id, 'uses_api');
  for (const id of feature.testIds ?? []) addEdge(feature.id, id, 'verified_by');
  for (const id of feature.nfrIds ?? []) addEdge(feature.id, id, 'constrained_by');
}
for (const api of rtm.apis ?? []) {
  for (const id of api.testIds ?? []) addEdge(api.id, id, 'contract_verified_by');
  for (const id of api.nfrIds ?? []) addEdge(api.id, id, 'constrained_by');
}
for (const rule of rtm.rules ?? []) {
  for (const id of rule.requirementIds ?? []) addEdge(rule.id, id, 'constrains');
}
for (const chunk of chunks) {
  addNode(chunk.id, 'document_chunk', { sourcePath: chunk.sourcePath, heading: chunk.heading, module: chunk.module, type: chunk.type });
  for (const id of chunk.ids) addEdge(chunk.id, id, 'mentions');
}

const knownNodeIds = new Set(nodes.map((node) => node.id));
const auxiliaryIds = new Set();
for (const edge of edges) {
  if (!knownNodeIds.has(edge.from)) auxiliaryIds.add(edge.from);
  if (!knownNodeIds.has(edge.to)) auxiliaryIds.add(edge.to);
}
for (const id of [...auxiliaryIds].sort()) {
  const type = id.startsWith('ADR-') ? 'architecture_decision' : id.startsWith('SRC-') ? 'source_reference' : id.startsWith('SEC-RULE-') ? 'security_rule' : 'external_identifier';
  addNode(id, type, { title: id, module: 'governance', auxiliary: true });
  knownNodeIds.add(id);
}
for (const edge of edges) {
  if (!knownNodeIds.has(edge.from)) fail(`知识图谱边缺少 from 节点: ${edge.from}`);
  if (!knownNodeIds.has(edge.to)) fail(`知识图谱边缺少 to 节点: ${edge.to}`);
}

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, 'chunks.jsonl'), chunks.map((chunk) => JSON.stringify(chunk)).join('\n') + '\n');
await writeFile(path.join(outputDir, 'knowledge-graph.json'), JSON.stringify({ schemaVersion: '1.0.0', nodes, edges }, null, 2) + '\n');

if (violations.length > 0) {
  console.error('文档知识库构建失败：');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`文档知识库构建完成：${chunks.length} 个 chunks，${nodes.length} 个节点，${edges.length} 条边。`);
