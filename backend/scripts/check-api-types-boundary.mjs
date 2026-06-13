import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const spec = YAML.parse(await readFile(path.join(root, 'openapi', 'openapi.yaml'), 'utf8'));
const apiTypesPath = path.resolve(root, '..', 'front', 'src', 'types', 'api.ts');
const content = await readFile(apiTypesPath, 'utf8');
const frozen = spec.info?.['x-contract-frozen'] === true;
const violations = [];

if (!frozen) {
  if (/\b(interface|enum)\b|type\s+\w+\s*=\s*\{/.test(content)) {
    violations.push('契约冻结前 front/src/types/api.ts 只能保留占位说明，不能包含手写接口、枚举或响应结构。');
  }
} else {
  if (!content.includes('AUTO-GENERATED FROM backend/openapi/openapi.yaml')) {
    violations.push('契约冻结后 front/src/types/api.ts 必须由 OpenAPI 自动生成并包含生成标记。');
  }
  if (!content.includes(`Contract version: ${spec.info.version}`)) {
    violations.push('生成类型版本必须与 OpenAPI info.version 一致。');
  }
  if (!content.includes('export interface paths') || !content.includes('/api/v1/health')) {
    violations.push('生成类型必须包含 OpenAPI paths。');
  }
}

if (violations.length > 0) {
  console.error('前端 API 类型边界检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(frozen ? '前端 API 类型已按冻结契约生成。' : '前端 API 类型边界检查通过：契约未冻结，api.ts 仍为占位文件。');
