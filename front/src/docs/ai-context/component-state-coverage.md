# 组件状态覆盖说明

> 这是测试负责人视角的状态覆盖清单，不替代组件 API 摘要。

## P0 基础组件

- Button：primary、secondary、ghost、danger、loading、disabled、size。
- Card：default、subtle、outlined、header/content/footer 组合。
- Input/Textarea/Select：label、helper、error、disabled、placeholder。
- Modal/ConfirmDialog：open、close、footer、Escape/遮罩关闭。
- Loading：inline、block。
- Badge：neutral、info、success、warning、danger。
- Tabs：默认选中、受控值、禁用项、方向键切换。
- Toast：info、success、warning、danger、手动关闭、自动关闭。

## 反馈与状态组件

- EmptyState：无 action、有 action、带 icon。
- ErrorState：仅说明、有主行动、有次行动。
- SaveStatus：idle、saving、saved、error、offline。
- FeedbackPanel / InlineAlert：info、success、warning、danger。
- ProgressIndicator：0%、中间值、100%、超界值裁剪。
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

## 当前验证方式

第一轮/第二轮当前以组件示例页人工走查、TypeScript、ESLint、自定义边界脚本和 Vite build 作为基础检查。后续如引入 Vitest/RTL，需要补充交互断言和可访问性 smoke。
