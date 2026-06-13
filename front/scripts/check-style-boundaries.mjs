import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const allowedHexFile = path.join(sourceRoot, 'styles', 'tokens.css');
const targetExtensions = new Set(['.ts', '.tsx', '.css']);
const violations = [];

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

function report(file, message) {
  violations.push(`${path.relative(root, file)}: ${message}`);
}

const files = await walk(sourceRoot);

for (const file of files) {
  const content = await readFile(file, 'utf8');

  if (file !== allowedHexFile && /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/.test(content)) {
    report(file, '颜色值只能写在 src/styles/tokens.css 中。');
  }

  if (/style\s*=\s*\{\{/.test(content)) {
    report(file, '禁止内联 style，请使用组件 API、Tailwind 工具类或设计令牌。');
  }

  if (/(?:bg|text|border|ring|from|via|to|shadow)-\[#/.test(content)) {
    report(file, '禁止 Tailwind 任意颜色值，请使用设计令牌映射。');
  }

  if (/(?:m|p|gap|top|right|bottom|left|w|h|min-w|max-w|min-h|max-h)-\[/.test(content)) {
    report(file, '禁止 Tailwind 任意间距/尺寸值，请使用令牌、组件或稳定工具类。');
  }
}

if (violations.length > 0) {
  console.error('样式边界检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('样式边界检查通过。');
