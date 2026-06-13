# 页面-组件映射表

第二轮结束时只确认页面生成边界，不提前实现业务页面。第三轮 AI Studio 生成真实页面时必须基于 `src/types/api.ts`、组件 catalog 和设计令牌执行。

| 路由 | 当前状态 | 后续生成约束 |
|---|---|---|
| `/today` | 空壳 | 基于冻结后的学习概览/复习/统计类型生成，不得自造指标。 |
| `/vocabulary` | 空壳 | 基于词汇与复习相关类型生成，优先复用 DataList、StatCard、ProgressIndicator、RetryPanel。 |
| `/reading` | 空壳 | 基于阅读材料与加入生词队列相关类型生成，优先复用 Card、InlineAlert、ConfirmDialog、SaveStatus。 |
| `/penpal` | 空壳 | 基于笔友线程与信件提交相关类型生成，优先复用 Textarea、FeedbackPanel、SaveStatus、Timeline。 |
| `/results` | 空壳 | 基于学习统计类型生成，优先复用 SummaryPanel、StatCard、ProgressChartContainer、TagList。 |
| `/components` | 组件示例 | 只能展示组件状态，不承载业务语义或接口数据。 |
