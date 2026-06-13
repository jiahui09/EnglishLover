import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root = process.cwd();
const specPath = path.join(root, 'openapi', 'openapi.yaml');
const spec = YAML.parse(await readFile(specPath, 'utf8'));
const repoRoot = path.resolve(root, '..');
const rtm = JSON.parse(await readFile(path.join(repoRoot, 'docs', 'rtm.json'), 'utf8'));
const schemaValidatorConfig = JSON.parse(await readFile(path.join(root, 'contracts', 'schema-validator-config.json'), 'utf8'));
const violations = [];

const expectedOperations = new Set([
  'getHealth',
  'login',
  'refreshAuthToken',
  'logout',
  'getCurrentUser',
  'listWords',
  'submitReview',
  'listReviewEvents',
  'listReadingArticles',
  'getReadingArticle',
  'addToWordLearningQueue',
  'listPenpalThreads',
  'sendPenpalLetter',
  'getDailySummary',
]);

const expectedErrorCodes = [
  'AUTH_REQUIRED',
  'AUTH_INVALID',
  'FORBIDDEN',
  'VALIDATION_ERROR',
  'NOT_FOUND',
  'CONFLICT',
  'IDEMPOTENCY_CONFLICT',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
];

const expectedEnums = [
  'ErrorCode',
  'LearningModule',
  'SessionStatus',
  'WordStage',
  'ReviewMode',
  'ReviewRating',
  'WordLearningSource',
  'WordQueueStatus',
  'PenpalActivityType',
  'UserRole',
];

function fail(message) {
  violations.push(message);
}

if (spec.openapi !== '3.1.0') {
  fail('OpenAPI 版本必须为 3.1.0。');
}

if (spec.info?.['x-contract-frozen'] !== true) {
  fail('第二轮交付必须保持 info.x-contract-frozen: true。');
}

if (spec.info?.version !== '1.0.0') {
  fail('冻结契约版本必须为 1.0.0。');
}

if (spec.servers?.[0]?.url !== 'http://127.0.0.1:18080') {
  fail('稳定本地测试环境地址必须为 http://127.0.0.1:18080。');
}

if (!spec.components?.securitySchemes?.accessCookie || !spec.components?.securitySchemes?.refreshCookie) {
  fail('必须声明 accessCookie 与 refreshCookie 认证方式。');
}

const paths = spec.paths ?? {};
const foundOperations = new Set();
const rtmApisByOperation = new Map((rtm.apis ?? []).map((api) => [api.operationId, api]));
const rtmApisById = new Map((rtm.apis ?? []).map((api) => [api.id, api]));
const contractOperationsByApiId = new Map((schemaValidatorConfig.operations ?? []).map((operation) => [operation.apiId, operation]));

for (const [route, methods] of Object.entries(paths)) {
  if (!route.startsWith('/api/v1/')) {
    fail(`${route}: 所有接口路径必须使用 /api/v1 前缀。`);
  }

  for (const [method, operation] of Object.entries(methods ?? {})) {
    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
      continue;
    }

    if (!operation.operationId) {
      fail(`${method.toUpperCase()} ${route}: 必须声明 operationId。`);
      continue;
    }

    foundOperations.add(operation.operationId);

    const rtmApi = rtmApisByOperation.get(operation.operationId);
    if (!rtmApi) {
      fail(`${operation.operationId}: 必须登记到 docs/rtm.json 的 apis 中。`);
    } else {
      if (operation['x-api-id'] !== rtmApi.id) {
        fail(`${operation.operationId}: x-api-id 必须为 ${rtmApi.id}。`);
      }
      if (rtmApi.method !== method.toUpperCase() || rtmApi.path !== route) {
        fail(`${operation.operationId}: OpenAPI 路径/方法与 RTM 不一致，应为 ${rtmApi.method} ${rtmApi.path}。`);
      }
      const extensionChecks = [
        ['x-requirement-ids', rtmApi.requirementIds ?? []],
        ['x-test-ids', rtmApi.testIds ?? []],
        ['x-nfr-ids', rtmApi.nfrIds ?? []],
      ];
      for (const [field, expected] of extensionChecks) {
        const actual = operation[field] ?? [];
        for (const expectedId of expected) {
          if (!actual.includes(expectedId)) {
            fail(`${operation.operationId}: ${field} 缺少 ${expectedId}。`);
          }
        }
      }
      if (!contractOperationsByApiId.has(rtmApi.id)) {
        fail(`${operation.operationId}: schema-validator-config.json 缺少 ${rtmApi.id}。`);
      }
    }

    if (!operation.responses) {
      fail(`${operation.operationId}: 必须声明 responses。`);
      continue;
    }

    if (operation.responses['501']) {
      fail(`${operation.operationId}: 冻结后不得保留 CONTRACT_NOT_FROZEN 响应。`);
    }

    if (['post', 'put', 'patch', 'delete'].includes(method) && !['login', 'refreshAuthToken', 'logout'].includes(operation.operationId)) {
      const parameters = operation.parameters ?? [];
      const hasIdempotency = parameters.some((parameter) => parameter?.$ref === '#/components/parameters/IdempotencyKey');
      if (!hasIdempotency) {
        fail(`${operation.operationId}: 高风险写接口必须声明 Idempotency-Key。`);
      }
    }
  }
}

for (const operationId of expectedOperations) {
  if (!foundOperations.has(operationId)) {
    fail(`缺少必需接口 operationId: ${operationId}`);
  }
}

for (const operationId of foundOperations) {
  if (!expectedOperations.has(operationId)) {
    fail(`发现未纳入冻结清单的 operationId: ${operationId}`);
  }
}

for (const api of rtm.apis ?? []) {
  if (!foundOperations.has(api.operationId)) {
    fail(`${api.id}: RTM 登记的 operationId ${api.operationId} 未出现在 OpenAPI。`);
  }
}

for (const operation of schemaValidatorConfig.operations ?? []) {
  const api = rtmApisById.get(operation.apiId);
  if (!api) {
    fail(`schema-validator-config.json: ${operation.apiId} 未登记到 RTM。`);
    continue;
  }
  if (operation.operationId !== api.operationId || operation.method !== api.method || operation.path !== api.path) {
    fail(`schema-validator-config.json: ${operation.apiId} 与 RTM/OpenAPI operation 元数据不一致。`);
  }
}

const errorCodes = spec.components?.schemas?.ErrorCode?.enum ?? [];
for (const code of expectedErrorCodes) {
  if (!errorCodes.includes(code)) {
    fail(`错误码缺失: ${code}`);
  }
}
if (errorCodes.includes('CONTRACT_NOT_FROZEN')) {
  fail('冻结后错误码不得包含 CONTRACT_NOT_FROZEN。');
}

for (const enumName of expectedEnums) {
  const schema = spec.components?.schemas?.[enumName];
  if (!schema) {
    fail(`枚举/字典 schema 缺失: ${enumName}`);
  } else if (enumName !== 'ReviewRating' && !Array.isArray(schema.enum)) {
    fail(`${enumName}: 必须显式声明 enum 取值。`);
  }
}

for (const schemaName of ['PageMeta', 'CursorMeta', 'ErrorEnvelope', 'ApiError']) {
  if (!spec.components?.schemas?.[schemaName]) {
    fail(`统一结构 schema 缺失: ${schemaName}`);
  }
}

if (violations.length > 0) {
  console.error('OpenAPI 契约检查失败：');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`OpenAPI 冻结契约检查通过：${foundOperations.size} 个接口，${expectedErrorCodes.length} 个错误码，${expectedEnums.length} 组枚举/字典。`);
