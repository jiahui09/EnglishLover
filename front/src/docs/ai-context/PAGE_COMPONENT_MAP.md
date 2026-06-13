# 页面-组件映射表

第二轮结束时只确认页面生成边界，不提前实现业务页面。第三轮 AI Studio 生成真实页面时必须基于 `src/types/api.ts`、组件 catalog 和设计令牌执行，优先复用业务组件，避免重复生成 UI。

| 路由 | 当前状态 | 第三轮页面职责 | 必用/优先组件 | 类型来源 |
|---|---|---|---|---|
| `/today` | 空壳 | 展示当天任务、目标进度和近期活动。 | `TodayTaskList`、`TaskActionCard`、`LearningProgressSummary`、`DailyGoalProgress`、`RecentActivityList`、`EmptyState`、`RetryPanel` | `DailySummary`、`ReviewEvent`、`LearningModule`、`SessionStatus` |
| `/vocabulary` | 空壳 | 展示词库分页、复习题和提交反馈。 | `VocabularyReviewPanel`、`PracticeQuestion`、`ReviewResultFeedback`、`WordStatusBadge`、`DataList`、`ProgressIndicator` | `WordListData`、`WordSummary`、`ReviewSubmitRequest`、`ReviewSubmitResult`、`ReviewMode` |
| `/reading` | 空壳 | 展示阅读材料、阅读题和加入生词队列状态。 | `ReadingProgressHeader`、`ReadingArticlePanel`、`ReadingQuestionPanel`、`ReadingWordAction`、`InlineAlert`、`ConfirmDialog` | `ReadingArticleSummary`、`ReadingArticleDetail`、`AddToWordLearningQueueResult`、`WordQueueStatus` |
| `/penpal` | 空壳 | 展示受控笔友线程、写信编辑器、安全提示和发送反馈。 | `PenpalThreadList`、`LetterEditor`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight`、`LetterTimeline`、`SaveStatus` | `PenpalThreadSummary`、`SendPenpalLetterRequest`、`SendPenpalLetterResult`、`PenpalActivityType`、`ErrorCode` |
| `/results` | 空壳 | 展示学习成果摘要、模块指标和趋势容器。 | `ResultSummary`、`ModuleSummaryGrid`、`DailyGoalProgress`、`ProgressChartContainer`、`SummaryPanel`、`StatCard`、`TagList` | `DailySummary`、`ReviewEvent` |
| `/components` | 组件示例 | 只展示组件状态和组合方式。 | 全部 P0/P1/业务组件 | 字段形态演示，不接真实接口 |

## 页面生成原则

- 页面负责取数、错误处理、路由状态和组件编排；组件负责展示和交互外观。
- 页面不得重新实现组件 catalog 已覆盖的 UI 单元。
- 页面不得在缺少接口字段时临时扩展 DTO；必须先走契约变更。
