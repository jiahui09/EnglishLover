import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';
import YAML from 'yaml';

const root = process.cwd();
const specPath = path.join(root, 'openapi', 'openapi.yaml');
const outputPath = path.resolve(root, '..', 'front', 'src', 'types', 'api.ts');
const specText = await readFile(specPath, 'utf8');
const spec = YAML.parse(specText);
const frozen = spec.info?.['x-contract-frozen'] === true;

if (!frozen || process.env.API_CONTRACT_FROZEN !== 'true') {
  console.error('拒绝生成 front/src/types/api.ts：OpenAPI 契约尚未冻结，且 API_CONTRACT_FROZEN 未显式设为 true。');
  console.error('请先完成后端接口开发、契约测试 100% 通过和接口交付测试报告评审。');
  process.exit(1);
}

const generated = await openapiTS(spec);
const source = astToString(generated);
const header = `/**\n * AUTO-GENERATED FROM backend/openapi/openapi.yaml\n * Contract version: ${spec.info.version}\n * Do not edit by hand. Regenerate with: cd backend && API_CONTRACT_FROZEN=true npm run generate:api-types\n */\n\n`;
await writeFile(outputPath, `${header}${source}`, 'utf8');
console.log(`Generated ${path.relative(path.resolve(root, '..'), outputPath)}`);
