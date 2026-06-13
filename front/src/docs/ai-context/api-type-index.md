# API 类型索引

当前 `src/types/api.ts` 已由 `backend/openapi/openapi.yaml` 自动生成，契约版本为 `1.0.0`，文件头包含 `AUTO-GENERATED FROM backend/openapi/openapi.yaml` 标记。

## 使用规则

- 页面、feature 和业务组件只能引用自动生成类型或由自动生成类型派生的展示层别名。
- 不得手写请求参数、响应结构、错误码、业务枚举或 DTO。
- 字段、枚举、错误码和响应包裹格式以 `src/types/api.ts` 为唯一前端类型来源。
- 接口字段变更必须先完成后端契约变更评审，再重新执行 `cd backend && API_CONTRACT_FROZEN=true npm run generate:api-types`。
- 当前处于 M3 页面生成前准备阶段；真实业务页面必须在 G2/G3 审核通过后由 AI Studio 一次性生成，M4 才接真实接口。

## 当前契约覆盖

- Health：`getHealth`
- Auth：`login`、`refreshAuthToken`、`logout`、`getCurrentUser`
- Word：`listWords`
- Review：`submitReview`、`listReviewEvents`
- Reading：`listReadingArticles`、`getReadingArticle`、`addToWordLearningQueue`
- Penpal：`listPenpalThreads`、`sendPenpalLetter`
- Analytics：`getDailySummary`

## 页面常用 schema

- 通用：`ErrorCode`、`ApiError`、`ErrorEnvelope`、`PageMeta`、`CursorMeta`
- 认证：`LoginRequest`、`UserProfile`、`AuthResponse`、`UserProfileResponse`
- 单词/复习：`WordSummary`、`WordListData`、`ReviewSubmitRequest`、`ReviewSubmitResult`、`ReviewEvent`、`ReviewEventListData`
- 阅读：`ReadingArticleSummary`、`ReadingArticleListData`、`ReadingArticleDetail`、`AddToWordLearningQueueResult`
- 笔友：`PenpalThreadSummary`、`PenpalThreadListData`、`SendPenpalLetterRequest`、`SendPenpalLetterResult`
- 结果：`DailySummary`

## 枚举

- `LearningModule`：`word`、`reading`、`writing`
- `SessionStatus`：`active`、`completed`、`interrupted`、`discarded`
- `WordStage`：`cet4`、`cet6`、`kaoyan`、`toefl`、`ielts`、`general`
- `ReviewMode`：`recognition`、`recall`、`spelling`
- `WordLearningSource`：`reading`、`manual`、`system`
- `WordQueueStatus`：`success`、`duplicate`
- `PenpalActivityType`：`letter_sent`
- `ErrorCode`：以 `src/types/api.ts` 为准，不得手写扩展。
