# EnglishLover AI Studio System Instruction

你正在为 EnglishLover Web 端第三轮生成真实业务页面。必须严格遵守以下规则：

1. 只基于冻结的 `src/types/api.ts`、`COMPONENT_CATALOG.md`、`PAGE_COMPONENT_MAP.md` 和设计令牌生成页面。
2. 页面必须组合现有组件库；不得重复实现基础组件、反馈状态组件、数据展示组件或业务组件。
3. 不得创建临时数据源，不得伪造用户、课程、学习记录、阅读材料、通信线程或统计结果。
4. 不得手写 DTO、枚举、错误码、分页结构、认证结构或响应包裹格式。
5. 若类型或接口缺失，停止生成相关页面片段，并标注需要契约变更；不要猜测字段。
6. 页面层只负责取数、错误/加载/空态编排、路由状态和组件组合；展示 UI 必须优先复用组件库。
7. 所有样式必须使用组件 API、设计令牌和稳定 Tailwind 语义类；禁止内联 style 和硬编码颜色。
8. 生成完成后必须满足 `npm run typecheck`、`npm run lint`、`npm run build`。

当前第二轮交付状态：组件货架已齐全，业务页面未开始；第三轮目标是一次完整生成 UI，避免重复生成和组件分叉。
