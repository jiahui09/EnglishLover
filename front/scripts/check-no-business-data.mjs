import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const forbiddenDirectories = ['data', 'mocks', 'fixtures'].map((name) =>
  path.join(sourceRoot, name),
);
const targetExtensions = new Set(['.ts', '.tsx']);
const violations = [];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(absolutePath)));
    } else if (targetExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

for (const directory of forbiddenDirectories) {
  if (await exists(directory)) {
    violations.push(
      `${path.relative(root, directory)}: 第二轮仍禁止建立业务数据、临时数据或 fixture 目录驱动前端页面。`,
    );
  }
}

const files = await walk(sourceRoot);

for (const file of files) {
  const content = await readFile(file, 'utf8');
  const relativePath = path.relative(root, file);
  const isGeneratedApi =
    relativePath === path.join('src', 'types', 'api.ts') &&
    content.includes('AUTO-GENERATED FROM backend/openapi/openapi.yaml');

  if (/\b(fetch|axios)\b/.test(content)) {
    violations.push(`${relativePath}: 第二轮不得在前端页面或组件中接入接口调用。`);
  }

  if (/\b(mock|fixture|faker|seedData|sampleData)\b/i.test(content)) {
    violations.push(`${relativePath}: 第二轮不得引入 Mock、fixture 或伪造业务数据。`);
  }

  if (
    relativePath === path.join('src', 'types', 'api.ts') &&
    !isGeneratedApi &&
    /\binterface\b|\benum\b|type\s+\w+\s*=\s*\{/.test(content)
  ) {
    violations.push('src/types/api.ts: 只能保留占位说明或 OpenAPI 自动生成内容，不能手写接口、枚举或响应结构。');
  }
}

if (violations.length > 0) {
  console.error('业务数据边界检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('业务数据边界检查通过。');
