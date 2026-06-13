import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const scanRoots = [path.join(root, 'src', 'pages'), path.join(root, 'src', 'features')];
const targetExtensions = new Set(['.ts', '.tsx']);
const violations = [];

async function walk(directory) {
  let entries = [];
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }

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

const files = [];
for (const directory of scanRoots) {
  files.push(...(await walk(directory)));
}

for (const file of files) {
  const content = await readFile(file, 'utf8');

  if (/<button\b/.test(content)) {
    report(file, '页面/feature 层禁止自绘 button，请使用 Button 组件。');
  }

  if (/<input\b/.test(content)) {
    report(file, '页面/feature 层禁止自绘 input，请使用 Input 组件。');
  }

  if (/<textarea\b/.test(content)) {
    report(file, '页面/feature 层禁止自绘 textarea，请使用 Textarea 组件。');
  }

  if (/<select\b/.test(content)) {
    report(file, '页面/feature 层禁止自绘 select，请使用 Select 组件。');
  }

  if (/role=["']dialog["']/i.test(content)) {
    report(file, '页面/feature 层禁止自绘对话框，请使用 Modal 或 ConfirmDialog。');
  }
}

if (violations.length > 0) {
  console.error('组件复用合规检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('组件复用合规检查通过。');
