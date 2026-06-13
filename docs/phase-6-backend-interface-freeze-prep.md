# EnglishLover 后端接口冻结与交付记录

> 日期：2026-06-13  
> 阶段：第六阶段第二轮后端接口冻结与交付  
> 状态：原“冻结前准备”已收口；正式交付报告见 `docs/backend-interface-delivery-test-report.md`。

## 1. 已完成范围

- 按设计文档既定路线建立 `backend/` 后端工程：`Go + Chi + pgx + PostgreSQL + Redis`。
- 建立模块化单体目录边界：认证、用户相关、单词、复习、阅读、笔友写信、学习统计。
- 建立统一接口规范：
  - 路由前缀：`/api/v1`；
  - 认证方式：Access Token + Refresh Token，Web 端使用 HttpOnly/Secure/SameSite Cookie；
  - 响应包裹：成功响应包含 `requestId` 与 `data`，错误响应包含 `requestId` 与 `error`；
  - 分页结构：普通分页 `page/pageSize/total/items`，大列表使用 `cursor/limit/nextCursor/items`；
  - 高风险写接口要求 `Idempotency-Key`；
  - 错误码、枚举字典统一写入 OpenAPI。
- `backend/openapi/openapi.yaml` 已冻结为契约版本 `1.0.0`，`info.x-contract-frozen: true`。
- 建立并通过契约检查、契约测试、类型生成边界检查和文档知识库检查。
- `front/src/types/api.ts` 已由 OpenAPI 自动生成；前端不得手写真实接口类型。

## 2. 接口清单

| 模块 | 方法 | 路径 | operationId | 当前状态 |
|---|---|---|---|---|
| Health | GET | `/api/v1/health` | `getHealth` | 已实现并纳入契约测试 |
| Auth | POST | `/api/v1/auth/login` | `login` | 已实现并纳入契约测试 |
| Auth | POST | `/api/v1/auth/refresh` | `refreshAuthToken` | 已实现并纳入契约测试 |
| Auth | POST | `/api/v1/auth/logout` | `logout` | 已实现并纳入契约测试 |
| Auth | GET | `/api/v1/auth/me` | `getCurrentUser` | 已实现并纳入契约测试 |
| Word | GET | `/api/v1/words` | `listWords` | 已实现并纳入契约测试 |
| Review | POST | `/api/v1/reviews/submit` | `submitReview` | 已实现并纳入契约测试 |
| Review | GET | `/api/v1/review-events` | `listReviewEvents` | 已实现并纳入契约测试 |
| Reading | GET | `/api/v1/reading/articles` | `listReadingArticles` | 已实现并纳入契约测试 |
| Reading | GET | `/api/v1/reading/articles/{articleId}` | `getReadingArticle` | 已实现并纳入契约测试 |
| Reading/Word | POST | `/api/v1/reading/articles/{articleId}/words/{wordId}/queue` | `addToWordLearningQueue` | 已实现并纳入契约测试 |
| Penpal | GET | `/api/v1/penpal/threads` | `listPenpalThreads` | 已实现并纳入契约测试 |
| Penpal | POST | `/api/v1/penpal/letters` | `sendPenpalLetter` | 已实现并纳入契约测试 |
| Analytics | GET | `/api/v1/analytics/daily-summary` | `getDailySummary` | 已实现并纳入契约测试 |

## 3. 错误码与枚举字典

### 错误码

- `AUTH_REQUIRED`
- `AUTH_INVALID`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `CONFLICT`
- `IDEMPOTENCY_CONFLICT`
- `RATE_LIMITED`
- `INTERNAL_ERROR`

### 枚举字典

- `LearningModule`: `word`、`reading`、`writing`
- `SessionStatus`: `active`、`completed`、`interrupted`、`discarded`
- `WordStage`: `cet4`、`cet6`、`kaoyan`、`toefl`、`ielts`、`general`
- `ReviewMode`: `recognition`、`recall`、`spelling`
- `ReviewRating`: 1-5
- `WordLearningSource`: `reading`、`manual`、`system`
- `WordQueueStatus`: `success`、`duplicate`
- `PenpalActivityType`: `letter_sent`
- `UserRole`: `learner`、`content_admin`、`admin`、`ops`

## 4. 验证结果

已执行并通过：

```bash
cd backend
go test ./...
npm run verify
```

验证结论：

- Go 后端工程可编译；
- `internal/app` 路由和业务流测试通过；
- OpenAPI 契约检查通过：14 个接口、9 个错误码、10 组枚举/字典；
- 契约测试通过率 100%，报告文件为 `backend/reports/contract-test-result.json`；
- `front/src/types/api.ts` 已按冻结契约生成。

## 5. 后续变更规则

1. 字段、枚举、错误码或响应结构不得直接修改；
2. 任何变更必须先提交契约变更说明并通过评审；
3. 更新 `backend/openapi/openapi.yaml`、后端实现和契约测试；
4. 执行 `cd backend && npm run verify`，确保契约测试 100% 通过；
5. 执行 `API_CONTRACT_FROZEN=true npm run generate:api-types` 重新生成前端类型；
6. 同步更新 `docs/backend-interface-delivery-test-report.md`。

冻结完成不代表前端已开始业务页面开发。第三轮 AI Studio 页面生成仍必须基于生成类型、组件 catalog 和页面生成规则执行，不得引入 Mock 数据或猜测字段。
