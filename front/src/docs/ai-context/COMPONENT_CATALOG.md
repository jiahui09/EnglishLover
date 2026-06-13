# EnglishLover Component Catalog

> 用途：供 AI Studio 在后续页面生成前快速理解组件边界。每条摘要只包含组件名、路径、Props 签名、一句话使用场景和一句话反模式。

| Component | Path | Props signature | Use case | Anti-pattern |
|---|---|---|---|---|
| Button | `src/components/ui/Button.tsx` | `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>; variant primary/secondary/ghost/danger; size sm/md/lg; isLoading; fullWidth` | 统一操作按钮、加载按钮和危险操作按钮。 | 页面层自绘 button、硬编码颜色或重复按钮状态。 |
| Card | `src/components/ui/Card.tsx` | `CardProps extends HTMLAttributes<HTMLDivElement>; variant default/subtle/outlined` | 统一内容容器、分组和区域层级。 | 页面层复制阴影、圆角、边框形成新卡片体系。 |
| Input | `src/components/ui/Input.tsx` | `InputProps extends InputHTMLAttributes<HTMLInputElement>; label; helperText; error; fieldId` | 单行输入及标签、帮助文案、错误状态。 | 页面层拆开 label/error/input 并自行写状态样式。 |
| Textarea | `src/components/ui/Textarea.tsx` | `TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>; label; helperText; error; fieldId` | 多行输入及标签、帮助文案、错误状态。 | 页面层自定义文本域边框、焦点和错误样式。 |
| Select | `src/components/ui/Select.tsx` | `SelectProps extends SelectHTMLAttributes<HTMLSelectElement>; label; helperText; error; fieldId; placeholder; options` | 统一选择器及字段说明。 | 页面层使用未统一样式的原生 select 或临时业务枚举。 |
| Modal | `src/components/ui/Modal.tsx` | `ModalProps; open; title; description; children; footer; closeLabel; onClose` | 标准对话框、短任务弹层和上下文提示。 | 页面层自绘遮罩、焦点语义和弹层结构。 |
| Loading | `src/components/ui/Loading.tsx` | `LoadingProps; label; variant inline/block; className` | 统一行内或块级加载提示。 | 整页白屏或只用动画、不提供可读加载文案。 |
| Badge | `src/components/ui/Badge.tsx` | `BadgeProps extends HTMLAttributes<HTMLSpanElement>; variant neutral/info/success/warning/danger; size sm/md` | 短状态标签和分类标记。 | 仅靠颜色表达状态或散落自定义 tag 样式。 |
| Tabs | `src/components/ui/Tabs.tsx` | `TabsProps; items; value; defaultValue; onValueChange; label` | 局部内容切换并支持键盘导航。 | 页面层重复实现 tab 状态和键盘行为。 |
| Toast | `src/components/ui/Toast.tsx` | `ToastProviderProps; children; useToast().notify({ title, description, tone })` | 非阻断短提示。 | 用 Toast 替代关键错误、保存状态或真实流程反馈。 |
| EmptyState | `src/components/feedback/EmptyState.tsx` | `EmptyStateProps; title; description; icon; action` | 统一空状态说明和可选下一步行动。 | 用空列表、灰色占位或“敬请期待”替代明确说明。 |
| ErrorState | `src/components/feedback/ErrorState.tsx` | `ErrorStateProps; title; description; actionLabel; onAction; secondaryAction` | 统一错误说明和恢复入口。 | 吞掉错误上下文或只显示技术异常。 |
| SaveStatus | `src/components/feedback/SaveStatus.tsx` | `SaveStatusProps; status idle/saving/saved/error/offline; label` | 展示保存中、已保存、保存失败和离线待同步。 | 用 Toast 或临时文案替代持续可见保存状态。 |
| FeedbackPanel | `src/components/feedback/FeedbackPanel.tsx` | `FeedbackPanelProps; tone info/success/warning/danger; title; children; actions` | 展示明确反馈、解释和后续行动。 | 在组件内部计算业务结果或伪造结论。 |
| ProgressIndicator | `src/components/feedback/ProgressIndicator.tsx` | `ProgressIndicatorProps; value; max; label; showValue; tone primary/success/warning/danger` | 展示传入进度值。 | 自行推断学习进度或用硬编码宽度样式。 |
| Skeleton | `src/components/feedback/Skeleton.tsx` | `SkeletonProps; lines; variant text/card/avatar; className` | 展示加载骨架结构。 | 用骨架屏伪装已加载业务内容。 |
| RetryPanel | `src/components/feedback/RetryPanel.tsx` | `RetryPanelProps; title; description; retryLabel; isRetrying; onRetry` | 可恢复失败状态的重试入口。 | 隐藏失败原因或无限自动重试。 |
| InlineAlert | `src/components/feedback/InlineAlert.tsx` | `InlineAlertProps extends HTMLAttributes<HTMLDivElement>; tone info/success/warning/danger; title; children` | 页内信息、成功、警告和错误提示。 | 只靠颜色传达信息或承载复杂业务状态机。 |
| ConfirmDialog | `src/components/feedback/ConfirmDialog.tsx` | `ConfirmDialogProps; open; title; description; confirmLabel; cancelLabel; isConfirming; children; onConfirm; onCancel` | 明确确认或取消的短决策弹窗。 | 在组件内执行接口请求或隐藏取消路径。 |
| StepIndicator | `src/components/feedback/StepIndicator.tsx` | `StepIndicatorProps; steps; orientation horizontal/vertical` | 展示流程步骤状态。 | 用它表达未冻结业务流程或自行创造步骤数据。 |
| StatCard | `src/components/data-display/StatCard.tsx` | `StatCardProps; label; value; description; tone; trendLabel` | 展示传入的单个指标。 | 自行计算指标或展示未确认业务统计。 |
| DataList | `src/components/data-display/DataList.tsx` | `DataListProps; items; empty; ariaLabel` | 展示传入的通用列表项。 | 绑定业务接口字段或伪造列表数据。 |
| Timeline | `src/components/data-display/Timeline.tsx` | `TimelineProps; items; ariaLabel` | 展示传入的时间线项。 | 自行生成学习记录或事件流。 |
| ProgressChartContainer | `src/components/data-display/ProgressChartContainer.tsx` | `ProgressChartContainerProps; title; description; children; footer` | 作为图表区域容器和说明外框。 | 在容器内定义统计口径或假图表数据。 |
| SummaryPanel | `src/components/data-display/SummaryPanel.tsx` | `SummaryPanelProps; title; description; items; actions` | 组合展示若干传入摘要项。 | 在组件中拼接后端 DTO 或计算业务总结。 |
| TagList | `src/components/data-display/TagList.tsx` | `TagListProps; tags; label` | 展示标签集合。 | 在页面层重复实现 Badge 列表或创造临时业务标签。 |
| TaskActionCard | `src/components/business/TaskActionCard.tsx` | `TaskActionCardProps; module LearningModule; title; description; status SessionStatus; progressValue; progressMax; action; meta` | 展示单个学习任务入口和状态。 | 页面层自造任务卡片或绕过 SessionStatus。 |
| TodayTaskList | `src/components/business/TodayTaskList.tsx` | `TodayTaskListProps; items TodayTaskListItem[]; emptyTitle; emptyDescription` | 展示今日任务集合并统一空态。 | 页面层用普通列表拼任务或伪造任务数据。 |
| PracticeQuestion | `src/components/business/PracticeQuestion.tsx` | `PracticeQuestionProps; word WordSummary; mode ReviewMode; prompt; options; selectedOptionId; rating; feedback; callbacks` | 展示词汇练习题和提交入口。 | 组件内生成题目、选项或请求提交接口。 |
| VocabularyReviewPanel | `src/components/business/VocabularyReviewPanel.tsx` | `VocabularyReviewPanelProps; wordList WordListData; activeWordId; lastResult ReviewSubmitResult; action` | 组合词汇分页概览、词表和最近复习反馈。 | 页面层重复拼词汇复习区域或手写分页 DTO。 |
| ReviewResultFeedback | `src/components/business/ReviewResultFeedback.tsx` | `ReviewResultFeedbackProps; result ReviewSubmitResult; title` | 展示复习提交后的统一反馈。 | 用 Toast 替代复习结果面板或自行解释算法结果。 |
| WordStatusBadge | `src/components/business/WordStatusBadge.tsx` | `WordStatusBadgeProps; stage WordStage` | 展示词库阶段标签。 | 页面层手写阶段文案或临时枚举映射。 |
| LearningProgressSummary | `src/components/business/LearningProgressSummary.tsx` | `LearningProgressSummaryProps; summary DailySummary` | 组合今日目标进度和模块摘要。 | 页面层自行计算 DailySummary 外的统计口径。 |
| ReadingArticlePanel | `src/components/business/ReadingArticlePanel.tsx` | `ReadingArticlePanelProps; article ReadingArticleDetail; toolbar; footer` | 展示阅读文章标题、正文和辅助区域。 | 页面层自造文章容器或改写 article 字段结构。 |
| ReadingQuestionPanel | `src/components/business/ReadingQuestionPanel.tsx` | `ReadingQuestionPanelProps; articleId; title; prompt; options; selectedOptionId; feedback; callbacks` | 展示阅读题选项、反馈和提交入口。 | 组件内生成答案或请求接口。 |
| ReadingWordAction | `src/components/business/ReadingWordAction.tsx` | `ReadingWordActionProps; articleId; wordId; status WordQueueStatus; source WordLearningSource; result AddToWordLearningQueueResult; callbacks` | 展示阅读中加入生词队列的状态和操作。 | 页面层自造加入队列状态或硬编码 source/status。 |
| ReadingProgressHeader | `src/components/business/ReadingProgressHeader.tsx` | `ReadingProgressHeaderProps; article ReadingArticleSummary; progressValue; progressMax` | 展示阅读材料摘要和传入进度。 | 在组件中推断阅读百分比或生成阅读记录。 |
| LetterEditor | `src/components/business/LetterEditor.tsx` | `LetterEditorProps; draft SendPenpalLetterRequest; saveStatus SaveStatusValue; helperText; safetySlot; actions; callbacks` | 展示写信编辑器、保存状态和安全插槽。 | 组件内发送信件、保存草稿或自造安全结果。 |
| SafetyNotice | `src/components/business/SafetyNotice.tsx` | `SafetyNoticeProps; tone info/success/warning/danger; title; children` | 展示写作安全或合规提醒。 | 页面层散落警告文案或只靠颜色提示风险。 |
| SafetyCheckStatus | `src/components/business/SafetyCheckStatus.tsx` | `SafetyCheckStatusProps; state idle/checking/passed/blocked/needs_review; errorCode ErrorCode; description` | 展示安全检查过程状态。 | 用未冻结安全枚举替代组件状态。 |
| SafetyHighlight | `src/components/business/SafetyHighlight.tsx` | `SafetyHighlightProps; label; children` | 标记需要用户关注的安全片段。 | 用任意颜色 mark 或在组件内判断敏感内容。 |
| PenpalThreadList | `src/components/business/PenpalThreadList.tsx` | `PenpalThreadListProps; threads PenpalThreadSummary[]; onOpenThread` | 展示笔友线程列表和状态。 | 页面层手写线程状态标签或自造关系字段。 |
| LetterTimeline | `src/components/business/LetterTimeline.tsx` | `LetterTimelineProps; items LetterTimelineItem[]` | 展示信件发送活动时间线。 | 自行生成通信事件或伪造历史信件。 |
| ResultSummary | `src/components/business/ResultSummary.tsx` | `ResultSummaryProps; summary DailySummary` | 展示今日成果摘要。 | 页面层重新定义统计口径或补不存在字段。 |
| ModuleSummaryGrid | `src/components/business/ModuleSummaryGrid.tsx` | `ModuleSummaryGridProps; summary DailySummary; items ModuleSummaryGridItem[]` | 展示单词、阅读、写作模块摘要。 | 为不存在模块生成统计卡片或引入图表库。 |
| DailyGoalProgress | `src/components/business/DailyGoalProgress.tsx` | `DailyGoalProgressProps; summary DailySummary` | 展示 DailySummary 的今日完成率。 | 组件内自行计算目标完成率。 |
| RecentActivityList | `src/components/business/RecentActivityList.tsx` | `RecentActivityListProps; events ReviewEvent[]` | 展示近期学习事件时间线。 | 页面层伪造事件流或临时活动类型。 |
