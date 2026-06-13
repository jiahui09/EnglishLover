# AI Studio 生成规则

当前状态：第二轮已完成组件库扩展、组件 API 摘要、后端契约冻结和 `src/types/api.ts` 自动生成；业务页面仍未开始，必须留到第三轮由 AI Studio 基于冻结契约和组件上下文一次性生成。

进入页面生成前必须满足：

1. 使用 `front/src/types/api.ts` 作为唯一 API 类型来源；
2. 使用 `COMPONENT_CATALOG.md` 中列出的组件，不重复实现基础 UI、反馈状态组件或数据展示组件；
3. 遵守页面-组件映射表、设计令牌摘要和组件状态覆盖说明；
4. 生成结果必须通过类型检查、组件复用检查、样式令牌检查、组件 catalog 检查和无临时数据检查；
5. 任何字段、枚举、错误码或响应结构缺失时，不得猜测补写，必须回到契约变更流程。

禁止事项：

- 不得重复实现 Button、Card、Input、Textarea、Select、Modal、Loading、Badge、Tabs、Toast；
- 不得重复实现 EmptyState、ErrorState、SaveStatus、FeedbackPanel、ProgressIndicator、Skeleton、RetryPanel、InlineAlert、ConfirmDialog、StepIndicator；
- 不得重复实现 StatCard、DataList、Timeline、ProgressChartContainer、SummaryPanel、TagList；
- 不得硬编码颜色、阴影、圆角、任意间距或内联样式；
- 不得创造 `src/types/api.ts` 中不存在的字段、枚举或错误码；
- 不得加入临时数据、猜测式接口或未评审业务流程。
