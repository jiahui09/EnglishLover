# 组件状态覆盖说明

> 这是测试负责人视角的状态覆盖清单，不替代组件 API 摘要。覆盖范围用于指导组件级检查和第三轮 AI Studio 生成后的页面走查。

## P0 基础组件

- Button：primary、secondary、ghost、danger、loading、disabled、size、fullWidth。
- Card：default、subtle、outlined、header/content/footer 组合。
- Input/Textarea/Select：label、helper、error、disabled、placeholder、受控值。
- Modal/ConfirmDialog：open、close、footer、确认中、Escape/遮罩关闭。
- Loading：inline、block。
- Badge：neutral、info、success、warning、danger、sm/md。
- Tabs：默认选中、受控值、禁用项、方向键切换。
- Toast：info、success、warning、danger、手动关闭、自动关闭。

## 反馈与状态组件

- EmptyState：无 action、有 action、带 icon。
- ErrorState：仅说明、有主行动、有次行动。
- SaveStatus：idle、saving、saved、error、offline。
- FeedbackPanel / InlineAlert：info、success、warning、danger、actions 插槽。
- ProgressIndicator：0%、中间值、100%、超界值裁剪、不同 tone。
- Skeleton：text、card、avatar。
- RetryPanel：普通、retrying。
- StepIndicator：complete、current、pending、blocked；horizontal、vertical。

## 数据展示组件

- StatCard：普通指标、带趋势标签、不同 tone。
- DataList：空列表、有列表、leading/meta/action 插槽。
- Timeline：无时间、有时间、不同 tone。
- ProgressChartContainer：仅容器、带 footer。
- SummaryPanel：多项摘要、带 actions。
- TagList：空标签、有标签、不同 tone。

## 业务组件

- TaskActionCard：word/reading/writing 模块、active/completed/interrupted/discarded 状态、有/无进度、有/无 action/meta。
- TodayTaskList：空列表、有列表、不同模块、不同状态、有/无行动入口。
- PracticeQuestion：recognition/recall/spelling 模式、无选项/有选项、选中态、rating、feedback、提交入口。
- VocabularyReviewPanel：空词表、有词表、activeWordId、lastResult、action 插槽。
- ReviewResultFeedback：accepted 状态、有/无 nextReviewAt。
- WordStatusBadge：cet4、cet6、kaoyan、toefl、ielts、general。
- LearningProgressSummary：DailySummary 标准组合展示。
- ReadingProgressHeader：有/无 level、不同 progressValue/progressMax。
- ReadingArticlePanel：toolbar、footer、长正文换行。
- ReadingQuestionPanel：选项选中态、feedback、提交入口。
- ReadingWordAction：无状态、有 status、有 result、success/duplicate、submitting。
- LetterEditor：idle/saving/saved/error/offline 保存状态、有/无 safetySlot、actions、onSubmit。
- SafetyNotice：info/success/warning/danger。
- SafetyCheckStatus：idle、checking、passed、blocked、needs_review、有/无 ErrorCode。
- SafetyHighlight：短片段和长片段。
- PenpalThreadList：空列表、有列表、active/completed/interrupted/discarded。
- LetterTimeline：空时间、带 occurredAt、letter_sent 活动。
- ResultSummary：streakIncluded true/false。
- ModuleSummaryGrid：由 DailySummary 派生、显式 items 覆盖。
- DailyGoalProgress：0%、中间值、100%。
- RecentActivityList：空事件、有事件、word/reading/writing 模块。

## 当前验证方式

第二轮当前以 `/components` 组件示例页人工走查、TypeScript、ESLint、自定义边界脚本和 Vite build 作为基础检查。后续如引入 Vitest/RTL，需要补充交互断言、键盘操作和可访问性 smoke。
