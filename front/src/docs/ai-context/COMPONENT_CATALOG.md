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
