# API 字段形态参考

> 本文件只说明冻结契约字段形态，帮助 AI Studio 识别页面需要传入哪些字段；它不是页面数据源，也不得被复制成运行时数据。真实值必须来自第三轮接入的测试环境接口响应。

## Word / Review

- `WordSummary`：`wordId`、`text`、可选 `phonetic`、`stage`。
- `WordListData`：`items`、`page`、`pageSize`、`total`。
- `ReviewSubmitRequest`：`wordId`、`mode`、`rating`、`isCorrect`、`durationMs`、`clientOccurredAt`。
- `ReviewSubmitResult`：`reviewEventId`、`status`、可选 `nextReviewAt`。
- `ReviewEvent`：`eventId`、`module`、`occurredAt`。

## Reading

- `ReadingArticleSummary`：`articleId`、`title`、可选 `level`。
- `ReadingArticleDetail`：`articleId`、`title`、`content`。
- `AddToWordLearningQueueResult`：`status`、可选 `source`。

## Penpal

- `PenpalThreadSummary`：`threadId`、`status`。
- `SendPenpalLetterRequest`：`threadId`、`body`。
- `SendPenpalLetterResult`：`letterId`、`activityType`。

## Analytics

- `DailySummary`：`date`、`wordCompletedCount`、`readingCompletedCount`、`writingCompletedCount`、`taskCompletionRate`、`streakIncluded`。

## Error and pagination

- `ErrorEnvelope`：`requestId`、`error.code`、`error.message`、可选 `error.details`。
- 页码分页：`page`、`pageSize`、`total`。
- 游标分页：`cursor`、`limit`、`nextCursor`。

## 使用边界

- 本文件字段名必须与 `src/types/api.ts` 保持一致。
- 不得根据本文补写未冻结字段。
- 不得把本文中的字段形态说明转换为页面运行时数据。
