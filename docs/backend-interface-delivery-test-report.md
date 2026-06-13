# EnglishLover 接口交付测试报告

> 交付日期：2026-06-13  
> 契约版本：1.0.0  
> 契约状态：已冻结  
> 测试环境 Base URL：`http://127.0.0.1:18080/api/v1`

## 1. 接口清单

| 模块 | 方法 | 路径 | operationId | 状态 |
|---|---|---|---|---|
| Health | GET | `/api/v1/health` | `getHealth` | 已实现 |
| Auth | POST | `/api/v1/auth/login` | `login` | 已实现 |
| Auth | POST | `/api/v1/auth/refresh` | `refreshAuthToken` | 已实现 |
| Auth | POST | `/api/v1/auth/logout` | `logout` | 已实现 |
| Auth | GET | `/api/v1/auth/me` | `getCurrentUser` | 已实现 |
| Word | GET | `/api/v1/words` | `listWords` | 已实现 |
| Review | POST | `/api/v1/reviews/submit` | `submitReview` | 已实现 |
| Review | GET | `/api/v1/review-events` | `listReviewEvents` | 已实现 |
| Reading | GET | `/api/v1/reading/articles` | `listReadingArticles` | 已实现 |
| Reading | GET | `/api/v1/reading/articles/{articleId}` | `getReadingArticle` | 已实现 |
| Reading/Word | POST | `/api/v1/reading/articles/{articleId}/words/{wordId}/queue` | `addToWordLearningQueue` | 已实现 |
| Penpal | GET | `/api/v1/penpal/threads` | `listPenpalThreads` | 已实现 |
| Penpal | POST | `/api/v1/penpal/letters` | `sendPenpalLetter` | 已实现 |
| Analytics | GET | `/api/v1/analytics/daily-summary` | `getDailySummary` | 已实现 |

## 2. 契约测试结果

| 契约版本 | 测试命令 | 通过率 | 报告文件 | 执行日期 |
|---|---|---:|---|---|
| 1.0.0 | `cd backend && npm run verify` | 100% | `backend/reports/contract-test-result.json` | 2026-06-13 |

覆盖口径：OpenAPI 14 个 operation 全部覆盖；每个 operation 至少覆盖成功响应或关键错误响应，认证失败、参数错误、资源不存在、幂等冲突均有验证。

## 3. 错误码清单

| 错误码 | HTTP 状态 | 语义 | 前端展示建议 |
|---|---:|---|---|
| `AUTH_REQUIRED` | 401 | 未登录或会话缺失 | 引导用户重新登录 |
| `AUTH_INVALID` | 401 | 登录凭据错误或令牌无效 | 提示检查账号或重新登录 |
| `FORBIDDEN` | 403 | 已登录但权限不足 | 提示无权访问 |
| `VALIDATION_ERROR` | 400 | 请求参数不合法 | 展示字段级或表单级错误 |
| `NOT_FOUND` | 404 | 资源不存在 | 展示资源不存在或返回列表 |
| `CONFLICT` | 409 | 普通业务冲突 | 展示冲突原因并引导刷新 |
| `IDEMPOTENCY_CONFLICT` | 409 | 幂等键被不同请求复用 | 提示重试或刷新页面 |
| `RATE_LIMITED` | 429 | 请求频率过高 | 提示稍后再试 |
| `INTERNAL_ERROR` | 500 | 服务端内部错误 | 展示可重试错误并保留 requestId |

## 4. 枚举字段说明

| 枚举名称 | 取值 | 含义 | 变更风险 |
|---|---|---|---|
| `LearningModule` | `word`、`reading`、`writing` | 学习模块 | 高，影响统计和页面分组 |
| `SessionStatus` | `active`、`completed`、`interrupted`、`discarded` | 流程/会话状态 | 中，影响状态展示 |
| `WordStage` | `cet4`、`cet6`、`kaoyan`、`toefl`、`ielts`、`general` | 词库阶段 | 中，影响筛选项 |
| `ReviewMode` | `recognition`、`recall`、`spelling` | 复习模式 | 高，影响复习提交 |
| `ReviewRating` | 1-5 | 复习评分 | 高，影响复习算法 |
| `WordLearningSource` | `reading`、`manual`、`system` | 单词加入来源 | 中，影响追踪来源 |
| `WordQueueStatus` | `success`、`duplicate` | 加入队列结果 | 中，影响反馈提示 |
| `PenpalActivityType` | `letter_sent` | 笔友活动类型 | 中，影响写作统计 |
| `UserRole` | `learner`、`content_admin`、`admin`、`ops` | 用户角色 | 高，影响权限 |

## 5. 测试环境地址

- Base URL：`http://127.0.0.1:18080/api/v1`
- 启动方式一：`docker compose -f docker-compose.backend-test.yml up --build`
- 启动方式二：当前机器无 Docker Compose 插件或 daemon 时，执行 `cd backend && npm run test-env:start`
- 测试账号：`learner@example.com`
- 测试密码：由本地测试环境变量 `CONTRACT_TEST_PASSWORD` 控制，默认仅用于本地契约测试。
- 认证方式：`access_token` 与 `refresh_token` HttpOnly Cookie。

## 6. `src/types/api.ts` 生成方式与版本号

- 契约来源：`backend/openapi/openapi.yaml`
- 契约版本：`1.0.0`
- 生成命令：`cd backend && API_CONTRACT_FROZEN=true npm run generate:api-types`
- 生成工具：`openapi-typescript`，版本以后端 `package-lock.json` 为准
- 生成产物：`front/src/types/api.ts`
- 生成状态：已生成并带有 `AUTO-GENERATED FROM backend/openapi/openapi.yaml` 标记

## 7. 已知限制与后续变更流程

已知限制：

- 当前稳定环境为本地 Compose，不是公网测试环境。
- 当前初始化数据仅用于后端契约测试和真实接口可用性验证，不允许作为前端 Mock 数据或业务页面素材。
- Redis 连接配置已预留，当前核心幂等记录落在 PostgreSQL。

变更流程：

1. 提交接口变更说明，说明字段、枚举、错误码或响应结构变化原因。
2. 更新 `backend/openapi/openapi.yaml`。
3. 更新后端实现和契约测试。
4. 执行 `cd backend && npm run verify`，确保契约测试 100% 通过。
5. 执行 `API_CONTRACT_FROZEN=true npm run generate:api-types` 重新生成前端类型。
6. 更新本报告的接口清单、错误码、枚举和已知限制。
7. 未完成评审前不得直接修改冻结字段或让前端页面消费未评审接口。
