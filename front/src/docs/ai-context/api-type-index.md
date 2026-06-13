# API 类型索引

当前 `src/types/api.ts` 已由 `backend/openapi/openapi.yaml` 自动生成，契约版本为 `1.0.0`，文件头包含 `AUTO-GENERATED FROM backend/openapi/openapi.yaml` 标记。

## 使用规则

- 页面和 feature 层只能引用自动生成类型，不得手写请求参数、响应结构、错误码、业务枚举或 DTO。
- 字段、枚举、错误码和响应包裹格式以 `src/types/api.ts` 为唯一前端类型来源。
- 接口字段变更必须先完成后端契约变更评审，再重新执行 `cd backend && API_CONTRACT_FROZEN=true npm run generate:api-types`。
- 第二轮仍不得开发依赖接口的业务页面；真实页面接入留到第三轮 AI Studio 一次性生成。

## 当前契约覆盖

- Health：`getHealth`
- Auth：`login`、`refreshAuthToken`、`logout`、`getCurrentUser`
- Word：`listWords`
- Review：`submitReview`、`listReviewEvents`
- Reading：`listReadingArticles`、`getReadingArticle`、`addToWordLearningQueue`
- Penpal：`listPenpalThreads`、`sendPenpalLetter`
- Analytics：`getDailySummary`
