# 第五阶段：组件库建设与复用详细设计方案

> 项目名称：EnglishLover 在线英语学习平台 Web 端  
> 阶段名称：第五阶段——组件库建设与复用  
> 文档状态：最终执行稿  
> 依据材料：`README.md`、`DESIGN.md`、`docs/README.md`、`docs/online-english-learning-platform-development-process.md`、`docs/phase-1-project-initiation-and-requirements-analysis.md`、`docs/phase-2-requirements-specification-and-scope-control.md`、`docs/phase-3-product-and-user-experience-design.md`、`docs/phase-4-technical-architecture-design.md`、`docs/asset-baseline-investigation-report.md`、`docs/performance-test-plan.md`、`docs/docker-compose-guide.md`  
> 关联文档：第六阶段开发实施流程文档（后端先行、接口契约驱动、AI Studio 一次性生成前端、生成后自动化检查与回溯式重构；若仓库后续落地独立文件，建议命名为 `docs/phase-6-development-implementation-process.md`）  
> 核心范围：今日学习、单词记忆、阅读练习、受控笔友写信、今日成果记录相关页面的组件沉淀、复用治理、文档化、测试与发布流程；组件库建设与后端接口交付之间的时序关系；组件库、接口类型文件与 AI Studio 一次性生成前端页面之间的衔接机制  
> 事实边界：当前仓库可核查内容以文档为主，未核验到完整 `front/` 源码目录。本文中的目录结构、组件 API、测试、AI 生成流程和发布流程均为第五阶段最终执行方案，不声明当前已有真实源码实现。后续恢复或创建 `front/` 后，应以后端真实 OpenAPI、自动生成的 `src/types/api.ts`、真实组件、真实页面和测试结果同步更新本文。

---

## 1. 结论概述

第五阶段不应建设“大而全”的独立设计系统，也不应直接引入重型第三方 UI 框架替代业务设计，而应建设一个**仓内轻量组件库**：以 EnglishLover 已确定的学习闭环、页面模板、交互状态、安全约束和后端接口契约为中心，将重复出现的界面结构、状态反馈和业务展示沉淀为可复用组件。

在第六阶段确定“后端先行 + 接口契约驱动 + AI Studio 一次性生成前端页面”的开发模式后，第五阶段组件库的定位进一步明确：组件库不是前端开发完成后再整理的结果，而是 AI 生成前端页面之前必须冻结的 UI 能力边界。AI 生成页面时只能使用组件库提供的组件、设计令牌和页面-组件映射表，不允许自行绘制按钮、卡片、表单、空态、错误态、保存状态、安全提示等通用 UI。

推荐路线如下：

```text
设计规范 DESIGN.md
  |
  |-- design tokens / 全局样式规则
  |-- 基础 UI 组件：Button、Card、Input、Textarea、Tag、Modal、Loading
  |-- 布局与导航组件：AppShell、PrimaryNav、PageHeader、SectionLayout
  |-- 反馈组件：EmptyState、ErrorState、SystemErrorPage、FeedbackPanel、SaveStatus
  |-- 数据展示组件：ProgressIndicator、ProgressSummary、CompletionSummary、LearningCard
  |-- 业务组件：TaskActionCard、PracticeQuestion、RecoveryPrompt、SafetyNotice、SafetyCheckStatus、SafetyHighlight、LetterEditor
  |-- 页面模板：TodayTemplate、StudySessionTemplate、PenPalEditorTemplate、ResultTemplate
  |-- AI 上下文物料：组件清单、API 文档、设计令牌摘要、页面-组件映射表、接口类型索引
  |
后端 OpenAPI 契约
  |
  |-- 契约测试通过
  |-- 自动生成 src/types/api.ts
  |
AI Studio 一次性生成前端页面
  |
  |-- 组件复用合规检查
  |-- TypeScript 编译检查
  |-- 接口字段拼写检查
  |-- 回溯式局部重构
  |
业务页面 today / vocabulary / reading / penpal / analytics
```

本阶段的关键原则调整为：**后端开发期间先完成基础组件与状态组件；后端接口交付后立即基于 `src/types/api.ts` 完成业务组件并冻结组件库；随后将组件文档、接口类型、页面-组件映射表作为 AI Studio 的强制上下文，一次性生成全部前端页面；生成后通过自动化检查和回溯式重构保证组件复用、接口对齐和样式合规。**

---

## 2. 协作前提与流程约束

### 2.1 后端先行与无传统联调阶段

本组件库建设运行在第六阶段确定的“后端接口先全部交付”前提下。后端团队先完成核心业务接口、OpenAPI 契约、错误码、枚举字典、字段字典和契约测试；前端不再基于长期 Mock 分阶段开发页面，也不采用传统“前后端边写边联调”的流程。

前端页面由 AI Studio 在组件库冻结、接口类型文件生成、页面-组件映射表完成后一次性生成。所谓“无传统联调阶段”，不是不验证真实环境，而是将风险前移到接口契约和类型生成阶段：前端生成时已经使用真实接口字段和真实 TypeScript 类型，生成后只进行真实环境对接验证、异常链路验证和发布前回归。

### 2.2 组件库对该流程的支撑要求

在该流程下，组件库必须满足以下硬性要求：

| 要求 | 说明 | 影响 |
|---|---|---|
| 基础组件与状态组件可独立开发 | `Button`、`Card`、`Input`、`Textarea`、`Loading`、`EmptyState`、`ErrorState`、`SaveStatus` 等不依赖最终接口字段 | 后端开发期间即可完成 M1-M2 |
| 业务组件 props 必须类型精确 | `TaskActionCard`、`PracticeQuestion`、`LetterEditor`、`SafetyNotice` 等涉及业务数据的 props 必须直接引用 `src/types/api.ts` | 后端契约交付后才能最终冻结 M3 |
| 组件文档必须可被 AI 消费 | 每个组件需要说明用途、禁止事项、props、示例、组合方式和反模式 | 作为 AI Studio 系统指令和上下文材料 |
| 页面-组件映射表必须明确 | 每个页面使用哪些组件、哪些数据字段传入、哪些事件触发 API | 避免 AI 自行设计页面结构 |
| 自动化检查必须覆盖复用合规 | 生成后检查原生 `<button>`、硬编码颜色、重复卡片、接口字段拼写等 | 发现违规后进入回溯式局部重构 |

### 2.3 组件库是 AI 生成页面的唯一合法 UI 来源

AI Studio 生成前端页面时，组件库是唯一合法 UI 来源。除必要的语义结构标签和布局容器外，页面不得绕过组件库自绘以下内容：

- 按钮、链接按钮、危险操作按钮；
- 卡片、任务卡、学习卡片；
- 输入框、文本域、表单字段；
- 加载、空态、错误态、成功态、保存状态；
- 答题反馈、进度展示、完成摘要；
- 写信安全提示、安全检查状态、正文高亮；
- 系统错误页和恢复提示。

这条规则的目的不是限制页面表达，而是让 AI 生成结果天然符合 EnglishLover 的设计语言、状态表达和可访问性要求。若 AI 生成代码出现自绘按钮、硬编码颜色、重复卡片结构或绕过业务组件的情况，应视为生成违规，不进入人工美化，而是进入自动检查与回溯式重构流程。

### 2.4 信息缺失、冲突与最小化假设

| 项目 | 设计依据 | 问题说明 | 处理方式 |
|---|---|---|---|
| 源码目录缺失 | `README.md`、`docs/README.md`、`docs/asset-baseline-investigation-report.md` | 文档提到 `front/`、React/Vite/TypeScript/Express，但当前仓库快照未核验到完整 `front/` 源码 | 本文只给最终执行方案；不把任何组件或页面写成“已实现” |
| 第六阶段文档尚未在仓库中核验 | 用户提供了第六阶段流程说明，但当前文档列表中尚未核验独立第六阶段文件 | 需要在本方案中内化后端先行、AI 一次性生成、自动化回溯重构等流程约束 | 在头部“关联文档”和本节明确以用户提供的第六阶段流程说明作为执行前提 |
| 组件现状无法逐文件盘点 | `DESIGN.md` 已列出目标组件，但未提供真实源码 | 无法确认已有 `Button`、`Card`、`WordTrainer` 等组件是否存在、质量如何 | 采用“源码与设计资产盘点 + 页面-组件映射设计 + AI 生成前冻结组件库”的方案 |
| 样式体系未最终核验 | 仓库指南提到 Tailwind/CSS，`DESIGN.md` 只约束视觉原则 | 不确认项目已配置 Tailwind、CSS Modules 或 tokens 文件 | 先采用 CSS 变量 + React 组件 props 的最小方案；如已有 Tailwind，则用 CSS 变量挂载 Tailwind 主题 |
| 测试框架缺失 | 仓库指南说明当前无 dedicated test framework | 单元测试、视觉回归、交互测试和 AI 生成合规检查需要补工具链 | 第五阶段将测试工具与合规检查脚本作为建设任务，不假设已存在 |
| 图表需求不明确 | 需求和 UX 文档提到学习记录、进度、今日成果 | 未明确复杂图表类型和指标口径 | 首版只做进度摘要和轻量趋势展示接口，复杂图表后置 |
| 发布流程仍是目标方案 | 第四阶段与 Docker 文档提出 CI/CD 和 Compose 目标 | 当前未核验真实 Dockerfile、Compose、流水线 | 组件库发布跟随应用版本，独立发布后置；发布前必须通过生成代码合规检查 |

### 2.5 最小化设计假设

| 假设 | 依据 | 影响 |
|---|---|---|
| A1：第五阶段面向 Web 端 React/Vite/TypeScript 应用 | 仓库指南和第四阶段目标架构均指向 React/Vite + TypeScript | 组件 API 采用 React 函数组件和 TypeScript props |
| A2：组件库先作为 `front/src/components` 内部共享层存在 | 当前无多端、多项目复用证据 | 避免独立 npm 包、monorepo 和发布复杂度过早引入 |
| A3：首版组件只服务 MVP 核心闭环 | 第一至三阶段限定单词、阅读、写信、今日成果 | 不建设商城、社区、实时聊天、复杂运营组件 |
| A4：AI 与安全检查能力可能不可用或降级 | 第二、四阶段均要求 AI 可选、可降级 | 安全和保存组件必须支持超时、失败、重试和手动提示 |
| A5：学习记录必须来自真实学习行为 | 第一、二、四阶段均强调不造数、不用固定假数据替代 | 统计/图表组件只展示传入数据，不自行生成学习结论 |
| A6：后端会交付 OpenAPI 与契约测试结果 | 第六阶段流程要求后端先全部完成接口并通过契约测试 | 前端业务组件 props 以 `src/types/api.ts` 为唯一类型来源 |
| A7：AI Studio 生成页面前可上传或引用上下文文件 | 第六阶段流程要求 AI 一次性生成页面 | 需要维护 `src/docs/ai-context/` 作为 AI 可读上下文物料 |

### 2.6 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | `README.md` 与 `docs/README.md` 的事实边界、`DESIGN.md` 的组件清单、第四阶段技术架构、第六阶段后端先行与 AI 生成流程说明 |
| 设计目标 | 明确组件库建设在后端先行和 AI 一次性生成流程中的位置，避免前端页面生成脱离组件规范和接口类型 |
| 具体方案 | 基础/状态组件前置开发，业务组件后端契约交付后冻结，组件文档和页面映射表作为 AI 系统指令核心上下文 |
| 预期收益 | 让 AI 生成页面天然复用组件库、对齐真实接口类型，降低传统联调和人工返工成本 |
| 实施代价 | 需要额外维护 OpenAPI 类型生成、AI 上下文摘要、合规检查脚本和回溯式重构流程 |
| 潜在风险 | 若后端契约延迟或字段频繁变更，业务组件冻结和 AI 生成节点会被推迟；需通过契约测试和版本冻结控制风险 |

---

## 3. 建设目标、范围边界与成功标准

### 3.1 为什么现在进入组件库建设阶段

第一阶段明确 EnglishLover 的定位是免费、低干扰、任务导向的英语学习平台，非目标包括开放社区、付费商城、复杂成就系统和实时聊天。第二阶段把范围收敛到今日学习、单词、阅读、受控笔友写信和学习记录。第三阶段进一步明确了页面路径、状态表达、文案风格、组件组合和 UX 验收。第四阶段提出 React/Vite Web、模块化前端、可恢复状态、REST API、CI/CD、性能和可部署性目标。第六阶段进一步规定后端接口先完成、契约测试先通过、前端基于真实接口类型一次性生成页面。

因此，第五阶段进入组件库建设是必要的：如果没有预先冻结组件库和页面-组件映射表，AI 一次性生成前端页面时会倾向于自绘重复 UI，造成按钮、卡片、表单、空态、错误态、保存状态、安全提示和进度展示风格不一致；如果业务组件不引用真实接口类型，页面生成后仍会出现字段拼写错误、枚举不一致和运行时联调问题。第五阶段必须在 AI 生成前把“可用组件、接口类型、页面组合规则、禁止事项和验证脚本”准备完整。

### 3.2 本阶段建设目标

| 目标编号 | 建设目标 | 说明 |
|---|---|---|
| CL-01 | 统一基础视觉和交互状态 | 统一颜色、间距、圆角、焦点、加载、空态、错误、成功、禁用、处理中等表现 |
| CL-02 | 降低核心页面重复开发 | 今日学习、单词、阅读、写信、记录页复用同一套基础和业务组件；AI 生成时禁止重复自绘 |
| CL-03 | 保证学习闭环体验一致 | 复习、答题、阅读、写信、完成反馈使用一致的进度、反馈和恢复机制 |
| CL-04 | 强化可恢复与安全体验 | 写信草稿保存、安全检查失败、网络失败、恢复提示必须有稳定组件承载 |
| CL-05 | 建立组件文档和准入机制 | 每个组件有适用场景、反模式、API、示例、测试要求和 AI 使用约束 |
| CL-06 | 为后续迭代留出扩展点 | 允许后续增加图表、AI 建议、内容管理和学习报告，但不在 MVP 暴露不可用入口 |
| CL-07 | 确保组件库 API 与后端接口类型完全一致 | 所有业务组件 props 直接引用 `src/types/api.ts` 或其字段子集，支撑 AI 一次性生成类型安全的页面代码 |

### 3.3 范围边界

**本阶段包含：**

- 基础组件：`Button`、`Card`、`Input`、`Textarea`、`Tag`、`Modal`、`Loading`；
- 布局与导航：`AppShell`、`PrimaryNav`、`PageHeader`、`SectionLayout`；
- 反馈组件：`EmptyState`、`ErrorState`、`SystemErrorPage`、`FeedbackPanel`、`SaveStatus`；
- 学习展示组件：`ProgressIndicator`、`ProgressSummary`、`LearningCard`、`CompletionSummary`；
- 业务组件：`TaskActionCard`、`PracticeQuestion`、`RecoveryPrompt`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight`、`LetterEditor`；
- `src/types/api.ts` 的使用规范、字段字典和枚举字典引用规则；
- 页面-组件映射表、AI 上下文摘要、系统指令模板、生成后合规检查脚本要求；
- 组件文档、示例、测试策略、版本和准入流程；
- AI 生成后回溯式重构路径。

**本阶段不包含：**

- 独立 npm 包发布、跨项目组件市场、复杂主题编辑器；
- 大型第三方 UI 框架替换已有设计；
- 未在需求中出现的社区、支付、商城、实时聊天组件；
- 复杂数据可视化平台或 BI 报表；
- 后端算法、AI 审核规则、单词复习算法和内容生成逻辑；
- 由前端绕过真实接口契约自行维护 Mock 数据模型；
- 允许 AI Studio 自行设计新的 UI 体系或新增未评审组件。

### 3.4 成功标准

| 类别 | 成功标准 | 验收方式 |
|---|---|---|
| 复用覆盖 | 今日学习、单词、阅读、写信、今日成果页面的通用按钮、卡片、状态反馈全部来自组件库 | 组件引用清单 + 合规检查脚本 + 代码审查 |
| 状态一致 | 加载、空态、错误、保存失败、安全拦截、完成反馈在核心页面使用统一组件 | UX 状态用例走查 |
| 业务边界清晰 | 通用组件不包含单词排程、阅读判题、笔友关系、安全规则等业务逻辑 | 代码审查 + 组件 API 审查 |
| 类型一致 | 所有业务组件 props 均引用自 `src/types/api.ts` 或其字段子集，通过 TypeScript 编译检查 | `npm run lint` / `tsc --noEmit` |
| AI 复用合规 | AI 生成的页面代码通过组件复用合规检查，无自绘按钮、卡片、输入、空态、错误态等重复实现 | 自定义检查脚本 + 代码审查 |
| 样式合规 | 页面不硬编码核心颜色、间距、圆角和状态色，统一使用设计令牌和组件样式 | 样式扫描 + 视觉走查 |
| 可访问性 | 主流程键盘可达、焦点可见、错误提示可读、颜色不作为唯一表达 | 手动检查 + a11y 自动检查 |
| 文档完整 | P0/P1 组件具备说明、适用场景、反模式、API、示例、测试说明和 AI 使用约束 | 文档审查 |
| 质量保障 | 组件变更和 AI 生成页面通过类型检查、构建、关键单元测试、核心交互测试 | CI 或本地验证记录 |
| 可演进 | 新增页面能优先复用组件，不需要重新定义基础状态和视觉规则 | 页面-组件映射表与生成代码比对 |

### 3.5 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 第一阶段项目定位、第二阶段范围控制、第三阶段 UX 组件清单、第四阶段模块化前端与 CI/CD 目标、第六阶段后端先行和 AI 一次性生成流程 |
| 设计目标 | 建立服务核心学习闭环、后端接口契约和 AI 页面生成的轻量组件库，提高一致性和生成代码可用性 |
| 具体方案 | 明确 P0/P1/P2 组件范围、类型对齐要求、AI 复用约束和可验收成功标准 |
| 预期收益 | 降低重复 UI、提升页面一致性、减少字段错配，让 AI 生成代码可直接进入验证和回溯重构 |
| 实施代价 | 需要进行源码/设计盘点、组件开发、接口类型生成、AI 上下文编写、检查脚本建设和测试补齐 |
| 潜在风险 | 若一次性抽象过多或接口契约不稳定，会拖慢 AI 生成节点；应以核心页面真实需要和已冻结接口为边界 |

---

## 4. 组件库定位与分层设计

### 4.1 定位：仓内轻量共享 UI 层

第五阶段组件库定位为 EnglishLover Web 端内部共享 UI 层，短期位于 `front/src/components`，由前端应用和 AI 生成页面直接引用。它不是独立业务模块，不直接请求后端 API，不自行维护学习状态，也不生成业务数据。容器页面或 feature 层负责调用真实 API、处理路由、维护业务状态和提交数据；组件库负责展示、输入、状态表达和回调触发。

选择仓内轻量组件库优于独立 npm 包，原因如下：

1. 当前只有一个 Web 应用，没有多项目复用压力；
2. 当前源码目录尚未核验，独立包会增加构建、发布、版本和调试成本；
3. MVP 更需要快速统一核心页面体验，而不是建设组件平台；
4. 仓内组件可以和真实接口类型、AI 上下文物料同步迭代，减少设计与实现脱节。

后续当出现管理后台、移动端 Web、多个前端仓库共同复用时，再评估迁移到 `packages/ui` 或独立包。

### 4.2 分层结构

| 层级 | 组件类型 | 代表组件 | 职责边界 | 不允许做的事 |
|---|---|---|---|---|
| L0 设计 Token 与样式基础 | token、主题、全局 CSS | `tokens.css`、`theme.ts` | 定义颜色、间距、字号、圆角、焦点、状态色 | 不写具体业务文案，不依赖接口 |
| L1 基础组件 | 基础 UI 原子 | `Button`、`Card`、`Tag`、`Input`、`Textarea`、`Modal`、`Loading` | 提供最小可复用视觉与交互能力 | 不知道单词、阅读、笔友等业务概念 |
| L2 布局组件 | 页面框架 | `AppShell`、`PrimaryNav`、`PageHeader`、`SectionLayout` | 统一页面骨架、导航、区域布局 | 不决定页面业务数据，不发请求 |
| L3 表单组件 | 输入与校验展示 | `FormField`、`Input`、`Textarea`、`LetterEditor` 的通用输入部分 | 统一标签、提示、错误、字数、焦点 | 不内置业务审核规则 |
| L4 反馈组件 | 状态反馈 | `EmptyState`、`ErrorState`、`SystemErrorPage`、`FeedbackPanel`、`SaveStatus` | 统一加载、空、错、保存、成功、警告提示 | 不吞掉错误原因，不用短暂提示替代关键状态 |
| L5 数据展示组件 | 学习进度与结果 | `ProgressIndicator`、`ProgressSummary`、`CompletionSummary`、`LearningCard` | 展示传入的进度、完成结果和摘要 | 不自行计算真实学习记录，不造统计数据 |
| L6 导航组件 | 主导航与路径入口 | `PrimaryNav`、`Breadcrumb`（如需要） | 统一今日学习、单词、阅读、写信、记录入口 | 不展示不可用功能入口 |
| L7 图表/可视化组件 | 轻量趋势展示 | `ModuleProgressChart`、`DailyStudyTrend`（P2） | 仅展示后端或统计层传入数据 | 不替代统计口径，不引入重型图表库作为 MVP 前置依赖 |
| L8 业务展示组件 | 学习业务 UI | `TaskActionCard`、`PracticeQuestion`、`RecoveryPrompt`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight` | 承载稳定业务语义，props 直接引用 `src/types/api.ts` | 不直接写入数据库，不实现算法和安全规则 |
| L9 复合组件/页面模板 | 页面组合模板 | `TodayTemplate`、`StudySessionTemplate`、`PenPalEditorTemplate`、`ResultTemplate` | 固化页面组合方式和状态槽位 | 不成为所有页面的万能大组件 |
| L10 AI 上下文物料 | 文档摘要 | 组件清单、API 类型索引、页面-组件映射表 | 向 AI Studio 明确可用组件和禁止事项 | 不替代真实源码和类型检查 |

### 4.3 依赖方向

依赖方向必须单向：

```text
features/pages / AI generated pages
  -> templates
    -> business components
      -> feedback / data-display / form / navigation / layout
        -> base ui
          -> tokens/styles
            -> src/types/api.ts（仅业务展示类型引用，不由组件修改）
```

禁止反向依赖：`components/ui` 不得引用 `features/vocabulary`、`features/reading`、`features/penpal`；基础组件不得导入 API service、store 或路由页面；`src/types/api.ts` 由 OpenAPI 自动生成，任何组件不得手动修改该文件。

### 4.4 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | `DESIGN.md` 的组件清单和组合规则、第四阶段前端模块化目录建议、第六阶段接口契约和 AI 生成约束 |
| 设计目标 | 建立职责清晰、依赖单向、便于 AI 引用和人工审查的组件分层 |
| 具体方案 | 采用 L0-L10 分层，先仓内复用，基础组件不含业务，业务组件不直接访问后端但引用真实 API 类型 |
| 预期收益 | AI 生成页面能快速找到可用组件，组件变更影响范围可控，类型错配风险降低 |
| 实施代价 | 需要在代码审查和自动化脚本中持续维护边界，避免页面逻辑反向进入组件库 |
| 潜在风险 | 业务组件和页面模板边界容易膨胀；应通过 props、slot、类型引用和文档限制适用场景 |

---

## 5. 页面模块与组件的映射设计

### 5.1 设计方法

由于第六阶段前端页面将由 AI Studio 一次性新生成，本阶段不再以“替换存量页面散落实现”为主线，而是以“页面模块与组件的映射设计”为主线。页面生成前必须形成《页面-组件映射表》，并作为 AI Studio 的强制引用材料。

映射设计按以下顺序执行：

1. **UX 原型和页面路径确认**：基于第三阶段 UX 文档确认今日学习、单词、阅读、写信、记录、系统错误页等页面；
2. **接口响应确认**：基于后端 OpenAPI、字段字典、枚举字典和 `src/types/api.ts` 确认每个页面的数据来源；
3. **组件组合定义**：为每个页面指定必须使用的组件、传入数据字段、状态组件和事件回调；
4. **容器与展示分离**：页面或 feature 容器负责真实 API 调用，展示组件只接收 props 和触发回调；
5. **AI 指令固化**：将页面-组件映射表写入 `src/docs/ai-context/page-component-map.md`，在 AI Studio 生成时作为系统上下文；
6. **生成后比对**：用脚本和人工审查比对实际生成代码与映射表是否一致。

### 5.2 页面-组件映射表

| 页面/模块 | 后端接口/类型来源 | 必须使用组件 | 组合方式 | AI 生成禁止事项 |
|---|---|---|---|---|
| 今日学习首页 | 今日任务列表、进度摘要、恢复快照类型，来源于 `src/types/api.ts` | `AppShell`、`PrimaryNav`、`ProgressSummary`、`TaskActionCard`、`RecoveryPrompt`、`EmptyState`、`ErrorState`、`Loading` | 页面容器请求今日任务；用 `ProgressSummary` 展示总进度；每个任务使用 `TaskActionCard`；存在中断记录时显示 `RecoveryPrompt` | 禁止自绘任务卡；禁止把单词、阅读、写信硬编码为三块静态 HTML；禁止伪造完成数 |
| 单词记忆页 | 单词复习会话、题目、选项、答题结果类型 | `LearningCard`、`PracticeQuestion`、`ProgressIndicator`、`FeedbackPanel`、`CompletionSummary`、`Tag`、`Button` | 容器请求题目并提交答案；`PracticeQuestion` 展示题干和选项；判题结果返回后用 `FeedbackPanel` 展示 | 禁止在组件内部判分；禁止自定义 option 按钮样式；禁止使用本地假题替代接口数据 |
| 阅读练习页 | 阅读文章、重点词、题目、解析、阅读进度类型 | `LearningCard`、`PracticeQuestion`、`FeedbackPanel`、`ProgressIndicator`、`Tag`、`EmptyState` | 容器请求文章与题目；正文区域使用页面结构承载长文本；题目统一使用 `PracticeQuestion`；重点词用 `Tag` 或轻提示 | 禁止把重点词提示做成阻断弹窗；禁止自绘选择题；禁止在前端伪造解析 |
| 受控笔友写信页 | 笔友关系、草稿、保存状态、安全检查结果、发送结果类型 | `LetterEditor`、`SaveStatus`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight`、`Modal`、`ErrorState`、`Button` | 容器加载草稿和关系状态；`LetterEditor` 受控输入；保存、检查、发送通过回调调用真实 API；安全失败使用 `SafetyNotice` 和 `SafetyHighlight` | 禁止用 `alert()` 展示安全失败；禁止清空正文；禁止绕过保存状态；禁止组件内部直接请求 API |
| 今日成果/学习记录页 | 学习摘要、完成记录、模块进度、趋势数据类型 | `ProgressSummary`、`CompletionSummary`、`LearningCard`、`EmptyState`、轻量 `DailyStudyTrend`（P2） | 容器请求真实学习记录；摘要用 `ProgressSummary`；模块结果用 `LearningCard`；无记录用 `EmptyState` | 禁止造学习数据；禁止用静态图表展示不存在的趋势；P2 图表未启用时用摘要卡替代 |
| 系统错误/离线页 | 路由错误、权限错误、接口错误、网络状态 | `SystemErrorPage`、`ErrorState`、`Button` | 根据错误类型传入标题、说明、重试或返回入口 | 禁止整页空白；禁止只显示错误码；禁止无重试入口 |

### 5.3 抽取与组件选择判定标准

虽然不再以存量页面替换为主，但抽取判定标准仍然保留，用于指导 AI 生成时的组件选择，以及人工代码审查时识别反模式。

一个页面片段只有满足以下条件中的多数项，才应作为组件库能力使用或新增候选组件：

- 至少在两个页面或两个业务场景中出现；
- 样式、交互、状态语义稳定；
- 可以通过 props 描述，不需要读取全局业务状态；
- 不包含后端请求、算法、权限判断或安全规则；
- 使用后能减少重复代码或统一用户体验；
- 可以写出清晰的适用场景和反模式；
- 对 AI 生成页面具有明确约束价值，例如禁止自绘按钮、卡片、错误态。

若一个组件只在单个页面出现，但属于 `DESIGN.md` 明确要求的关键状态组件，例如 `SaveStatus`、`SafetyNotice`、`SafetyHighlight`，也必须进入组件库，因为它承载的是安全、可恢复和可解释体验的一致性。

### 5.4 避免 AI 过度抽象和自绘的规则

- 不为“未来可能复用”提前设计复杂参数；
- 不把单词、阅读、写信三种任务强行压成同一种内容模型；
- 不把所有卡片合并成一个包含大量 `type` 分支的万能组件；
- 不在基础组件中内置业务文案；
- 不用组件库掩盖真实业务流程缺失；
- 不展示“敬请期待”“灰色入口”等不可用扩展；
- 不允许 AI Studio 在页面内新写一套按钮、卡片、输入、错误态样式；
- 三处以内的小差异，优先通过组合、slot 和样式 token 解决，不急于新增组件。

### 5.5 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 第三阶段页面路径和组件组合规则、第二阶段需求模块、第四阶段前端模块划分、第六阶段 AI 一次性生成流程 |
| 设计目标 | 在页面生成前明确每个页面的数据来源、组件组合和禁止事项，减少 AI 自由发挥 |
| 具体方案 | 建立页面-组件映射表，作为 AI 生成时的强制引用表；保留抽取标准用于组件选择和反模式审查 |
| 预期收益 | AI 生成页面结构可控，组件引用可检查，接口字段和 UI 状态更容易对齐 |
| 实施代价 | 需要在后端契约交付后补充每个页面的接口类型来源和字段映射 |
| 潜在风险 | 若页面-组件映射表不完整，AI 可能补充未评审 UI；必须将映射表纳入生成前检查项 |

---

## 6. 统一设计语言与技术规范

### 6.1 Design Token

首版 token 应覆盖必要的视觉和状态变量，不建设复杂主题平台。建议 token 分为：

| 类型 | 示例命名 | 用途 |
|---|---|---|
| 颜色 | `--color-primary`、`--color-bg-page`、`--color-text-main`、`--color-danger` | 主按钮、导航、背景、正文、状态提示 |
| 间距 | `--space-1` 至 `--space-8` | 页面边距、卡片间距、表单间距 |
| 字号 | `--font-size-sm`、`--font-size-md`、`--font-size-lg` | 正文、提示、标题 |
| 行高 | `--line-height-body`、`--line-height-reading` | 普通正文和英文阅读正文 |
| 圆角 | `--radius-sm`、`--radius-md`、`--radius-lg` | 按钮、输入框、卡片 |
| 阴影 | `--shadow-card`、`--shadow-popover` | 卡片和弹层，保持克制 |
| 焦点 | `--focus-ring`、`--focus-ring-offset` | 键盘可访问焦点样式 |
| 状态 | `--color-success`、`--color-warning`、`--color-error`、`--color-info` | 成功、警告、错误、信息提示 |

Token 文件建议先放在：

```text
front/src/styles/tokens.css
front/src/styles/theme.ts
front/src/styles/global.css
```

如后续核验已有 Tailwind 配置，可将 CSS 变量映射到 Tailwind theme；如无 Tailwind，则直接用 CSS 变量和组件 className。AI 生成页面时不得直接写十六进制颜色值、任意间距值和自定义状态色，应优先使用组件样式和 token。

### 6.2 主题机制

首版只提供默认浅色主题，不做用户可配置换肤。原因是 EnglishLover 的 MVP 目标是低干扰学习和核心闭环验证，复杂主题会增加设计、测试和视觉回归成本。可以在 token 层保留暗色主题扩展接口，但不在 UI 中暴露切换入口。

建议结构：

```css
:root {
  --color-primary: #2563eb;
  --color-bg-page: #f8fafc;
  --color-text-main: #0f172a;
}

[data-theme='dark'] {
  /* P2：仅保留扩展位，MVP 不启用 */
}
```

### 6.3 样式策略

- 基础组件使用稳定 className 和 token，不在页面内重复写颜色值；
- 页面只负责布局差异和业务组合，不直接重写组件内部状态样式；
- 组件支持 `className` 扩展，但文档中说明可扩展范围；
- 禁止在业务页面复制一套按钮、错误提示、保存状态样式；
- 状态色必须配文字或图标，不允许只靠颜色传达含义；
- AI 生成后的样式扫描必须检查硬编码颜色、散落阴影、重复圆角、重复按钮样式和未使用 token 的状态色。

### 6.4 响应式适配

对齐第三阶段响应式要求：

| 设备 | 适配策略 |
|---|---|
| 桌面端 | 主导航清晰，学习内容居中，阅读正文控制行宽，写信编辑区与提示区可并列或上下组合 |
| 平板端 | 卡片可双列或单列，导航保持可访问，写信提示区不遮挡正文 |
| 移动端 | 今日任务纵向排列，主行动按钮明显，阅读正文单列，写信编辑器优先占满宽度，安全提示紧邻编辑器 |

断点建议先采用：`sm 640px`、`md 768px`、`lg 1024px`、`xl 1280px`。若已有 Tailwind，沿用 Tailwind 默认断点；若没有，则在 CSS 中定义媒体查询。

### 6.5 无障碍要求

首版以 WCAG 2.1 AA 意图为目标：

- 所有按钮、导航、答题选项、输入框、弹窗可键盘操作；
- 焦点状态清晰，不被自定义样式移除；
- 表单错误通过文本、`aria-describedby` 和视觉样式共同表达；
- 弹窗需要焦点管理和关闭方式；
- 错误、空态、保存失败和安全拦截不能只靠颜色；
- 支持 `prefers-reduced-motion: reduce`；
- 英文阅读正文保持可读行高和行宽。

### 6.6 国际化能力

当前文档主要面向中文学习者，首版文案可以以中文为主，但组件 API 不应把固定中文写死在基础组件中。建议：

- 基础组件不内置业务文案；
- 反馈组件允许通过 props 传入 `title`、`description`、`actionLabel`；
- 业务组件默认文案集中在 `features/*/copy.ts` 或 `src/i18n/copy.ts`；
- 后续如需要英文界面，可迁移到 i18n 字典，不需要重写组件。

### 6.7 状态表达、动效、错误态与空态

| 状态 | 统一表达 |
|---|---|
| 加载 | 保留页面结构的骨架或短文案，超过 300ms 显示处理中 |
| 空态 | 说明原因 + 下一步，例如“今天还没有阅读任务，可先完成单词复习” |
| 错误 | 说明发生了什么、可能原因、下一步操作，提供重试或返回入口；错误码映射应对齐后端错误码字典 |
| 成功 | 给出完成反馈和下一步建议，不夸大成就 |
| 保存中 | `SaveStatus` 持续展示，不用短暂 Toast 替代 |
| 保存失败 | 编辑器附近持久提示，提供重试，说明本地暂存情况 |
| 安全拦截 | `SafetyNotice` + `SafetyHighlight` + 重新检查，不清空正文、不跳页 |
| 离线 | 弱提示 + 本地保存说明 + 恢复后重试 |

动效只用于状态过渡和轻量反馈，避免大体积动画库和干扰学习流程的复杂动画。

### 6.8 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | `DESIGN.md` 视觉语言、状态映射、响应式、无障碍和文案规则；第四阶段性能目标；第六阶段 AI 生成合规要求 |
| 设计目标 | 统一组件视觉基础和交互状态，保证低干扰、清晰、可访问，并让 AI 生成代码可被样式规则检查 |
| 具体方案 | 建立 token、默认主题、样式边界、响应式断点、a11y 规则、状态表达规范和硬编码样式检查 |
| 预期收益 | 组件风格一致，页面状态可预期，AI 生成代码不容易产生样式碎片化 |
| 实施代价 | 需要补 token 文件、全局样式、组件状态样式、基础 a11y 测试和样式扫描脚本 |
| 潜在风险 | 若 token 过细会增加维护成本；首版应控制 token 数量，只覆盖高频样式 |

---

## 7. 组件 API 设计原则

### 7.1 命名规范

- React 组件使用 PascalCase：`TaskActionCard`、`SaveStatus`；
- props 类型使用 `ComponentNameProps`：`ButtonProps`、`LetterEditorProps`；
- 事件使用 `on + 动作`：`onClick`、`onRetry`、`onSubmit`、`onRecover`、`onSafetyCheck`；
- 布尔属性使用清楚语义：`disabled`、`loading`、`required`、`showProgress`；
- 状态枚举优先引用 `src/types/api.ts` 中后端枚举；纯 UI 状态可使用小写字符串联合类型：`'idle' | 'loading' | 'error' | 'success'`；
- 文件名与组件名保持一致：`TaskActionCard.tsx`。

### 7.2 后端类型引用硬性规定

所有与后端数据交互的业务组件，其 props 中涉及业务数据的字段，必须直接使用 `src/types/api.ts` 中定义的接口类型、枚举类型或其字段子集，不得重复定义一份“前端相似类型”。该规则适用于但不限于：

- `TaskActionCard` 的任务类型、任务状态、进度字段；
- `PracticeQuestion` 的题目、选项、答题结果、解析字段；
- `LetterEditor` 的草稿、收件关系、保存状态、字数限制；
- `SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight` 的安全检查结果、风险等级、命中范围、规则说明；
- `ProgressSummary`、`CompletionSummary` 的今日学习记录和统计字段。

推荐写法：

```ts
import type {
  TodayTaskDto,
  PracticeQuestionDto,
  PracticeAnswerResultDto,
  LetterDraftDto,
  SafetyCheckResultDto,
} from '@/types/api';

export interface TaskActionCardProps {
  task: TodayTaskDto;
  action?: React.ReactNode;
  onStart?: (taskId: TodayTaskDto['id']) => void;
  onRecover?: (taskId: TodayTaskDto['id']) => void;
}

export interface PracticeQuestionProps {
  question: PracticeQuestionDto;
  selectedOptionId?: PracticeQuestionDto['options'][number]['id'];
  result?: PracticeAnswerResultDto;
  onSelect?: (optionId: PracticeQuestionDto['options'][number]['id']) => void;
}

export interface SafetyNoticeProps {
  result: SafetyCheckResultDto;
  onRetry?: () => void;
  onOpenGuide?: () => void;
}
```

不允许写法：

```ts
// 禁止：重复定义后端字段，容易和 api.ts 漂移
interface LocalQuestion {
  id: string;
  title: string;
  choices: Array<{ value: string; text: string }>;
}
```

如组件只需要后端类型的一部分字段，优先使用 `Pick<ApiType, 'fieldA' | 'fieldB'>`、索引访问类型或从 `api.ts` 导出的专用响应类型；不得为方便展示而新造命名相近但字段不同的类型。

### 7.3 属性设计

组件 props 应遵循“少而稳定、语义明确、默认安全”的原则。基础组件可以使用纯 UI 类型：

```ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

说明：

- `variant` 控制语义，不直接暴露颜色名；
- `loading` 自动禁用重复点击；
- `className` 只作为外层布局扩展，不建议覆盖内部状态；
- 默认值应覆盖最常用场景，例如 `variant='primary'`、`size='md'`；
- 一旦 props 涉及业务字段，应回到 `src/types/api.ts` 查找类型来源。

### 7.4 插槽与扩展点

React 中建议使用 `children` 和命名 ReactNode props 作为插槽：

```ts
export interface TaskActionCardProps {
  task: TodayTaskDto;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  onStart?: (taskId: TodayTaskDto['id']) => void;
}
```

`TaskActionCard` 采用“统一容器 + 模块内容插槽”，原因是今日任务中单词、阅读、写信的业务信息不同。相比用 `type='vocabulary' | 'reading' | 'penpal'` 在组件内部硬编码分支，插槽方式更容易保持组件边界，避免把业务判断塞进通用容器。若后端已在 `TodayTaskDto` 中提供 `type` 和 `status` 枚举，组件只负责展示该枚举对应的状态，不负责决定任务是否可进入。

### 7.5 事件约定

| 场景 | 事件命名 | 说明 |
|---|---|---|
| 点击主操作 | `onClick` / `onStart` | 基础按钮用 `onClick`，业务开始动作用 `onStart` |
| 重试 | `onRetry` | 错误态、保存失败、接口失败统一使用 |
| 恢复中断 | `onRecover` | `RecoveryPrompt` 使用 |
| 保存草稿 | `onSave` | 容器组件或页面调用真实保存 API；展示组件只触发回调 |
| 安全检查 | `onSafetyCheck` | 容器组件调用真实安全检查 API；展示组件只触发检查意图 |
| 发送信件 | `onSubmit` | 页面层负责调用 API、处理返回和更新状态 |
| 关闭提示 | `onDismiss` | 仅用于允许关闭的弱提示；阻断安全提示不可直接关闭 |
| 字段变化 | `onChange` | 输入组件和 `LetterEditor` 使用，页面层维护受控状态 |

硬性约束：`onSave`、`onSafetyCheck`、`onSubmit` 等事件不得在展示组件内部直接调用 fetch 或 service。真实 API 调用只能发生在页面容器、feature hooks 或 service 层。这样可以保证组件库既能被 AI 安全复用，又不会把业务流程、鉴权和错误处理散落到展示组件中。

### 7.6 受控与非受控模式

- 基础输入组件应支持受控模式：`value` + `onChange`；
- 对简单表单可支持 `defaultValue`，但文档中说明不适用于需要自动保存的写信场景；
- `LetterEditor` 首选受控模式，因为草稿保存、未保存退出、安全高亮都依赖页面或 feature 层状态；
- `Modal` 的打开状态使用受控 `open` + `onOpenChange`，避免内部状态与路由或表单状态冲突。

示例：

```ts
import type { LetterDraftDto, SafetyCheckResultDto } from '@/types/api';

export interface LetterEditorProps {
  draft: LetterDraftDto;
  value: LetterDraftDto['content'];
  onChange: (value: LetterDraftDto['content']) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  saveStatus?: LetterDraftDto['saveStatus'];
  safetyResult?: SafetyCheckResultDto;
  footer?: React.ReactNode;
}
```

### 7.7 默认值与向后兼容

- 默认 props 必须对应最常用、最低风险的状态；
- 新增可选属性优先，不轻易修改已有属性语义；
- 删除或重命名属性前先标记 deprecated，并在升级说明中给替代方案；
- P0 组件一旦被多个页面使用，API 调整必须通过组件评审；
- 业务组件 API 一旦与 `src/types/api.ts` 对齐并在 M3 冻结，AI 生成前不得再随意修改；
- 不为了短期页面需求随意加入业务特定 props，应通过 `children` 或 feature 层组合解决。

### 7.8 关键业务组件 API 草案

| 组件 | 典型 props | 使用场景 | 边界条件 | 未来扩展 |
|---|---|---|---|---|
| `ProgressIndicator` | `current`、`total`、`label`、`showPercent` | 单词、阅读、写信步骤进度 | `total=0` 时不显示百分比，避免除零 | 支持分段进度 |
| `FeedbackPanel` | `type`、`title`、`description`、`action` | 答题反馈、语言建议、普通提示 | 安全拦截不用普通 info 样式 | 支持折叠详情 |
| `SaveStatus` | `status`、`updatedAt`、`onRetry`，状态类型对齐后端草稿保存枚举 | 写信草稿自动保存 | 失败状态必须可见且可重试 | 支持冲突提示 |
| `SafetyNotice` | `result: SafetyCheckResultDto`、`onRetry`、`onOpenGuide` | 写信安全提示 | 阻断提示不可直接关闭 | 支持规则详情链接 |
| `PracticeQuestion` | `question: PracticeQuestionDto`、`selectedOptionId`、`result`、`onSelect` | 单词 4 选 1、阅读选择题 | 不负责判分，只展示结果 | 支持多选/填空（P2） |
| `TaskActionCard` | `task: TodayTaskDto`、`action`、`onStart`、`onRecover` | 今日任务入口 | 不负责聚合任务或计算推荐顺序 | 支持更多任务类型 |
| `LetterEditor` | `draft: LetterDraftDto`、`value`、`onChange`、`safetyResult`、`footer` | 写信草稿编辑 | 不负责保存、安全检查和发送 API | 支持语言建议提示 |

### 7.9 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 仓库代码规范、`DESIGN.md` 组件组合规则、第四阶段前端模块化和可恢复状态设计、第六阶段接口契约驱动流程 |
| 设计目标 | 让组件 API 稳定、可读、可测试，并与后端真实类型严格一致，避免 AI 生成字段错配 |
| 具体方案 | 规定命名、后端类型引用、props、slot、事件、受控模式、默认值和兼容策略，并给出关键 API 草案 |
| 预期收益 | 降低误用成本，提高组件复用和重构安全性，使 TypeScript 编译成为接口对齐的主要防线 |
| 实施代价 | 需要为 P0/P1 组件补 TypeScript 类型、示例、API 文档，并在后端契约交付后统一更新 |
| 潜在风险 | props 设计过度会造成组件臃肿；接口类型如果频繁变更会影响组件冻结节点，应通过契约版本管理控制 |

---

## 8. 目录结构与工程组织方式

### 8.1 推荐源码结构

恢复或创建 `front/` 后，建议按以下结构组织：

```text
front/
  src/
    app/
      App.tsx
      routes.tsx
    components/
      ui/
        Button.tsx
        Card.tsx
        Tag.tsx
        Modal.tsx
        Loading.tsx
        index.ts
      form/
        FormField.tsx
        Input.tsx
        Textarea.tsx
        index.ts
      feedback/
        EmptyState.tsx
        ErrorState.tsx
        FeedbackPanel.tsx
        SaveStatus.tsx
        SystemErrorPage.tsx
        index.ts
      layout/
        AppShell.tsx
        PageHeader.tsx
        SectionLayout.tsx
        index.ts
      navigation/
        PrimaryNav.tsx
        index.ts
      data-display/
        ProgressIndicator.tsx
        ProgressSummary.tsx
        CompletionSummary.tsx
        LearningCard.tsx
        index.ts
      charts/
        DailyStudyTrend.tsx
        ModuleProgressChart.tsx
        index.ts
      learning/
        TaskActionCard.tsx
        PracticeQuestion.tsx
        RecoveryPrompt.tsx
        index.ts
      penpal/
        LetterEditor.tsx
        SafetyNotice.tsx
        SafetyCheckStatus.tsx
        SafetyHighlight.tsx
        index.ts
    features/
      today/
      vocabulary/
      reading/
      penpal/
      analytics/
    services/
      apiClient.ts
    styles/
      tokens.css
      global.css
      theme.ts
    types/
      api.ts
    utils/
    docs/
      ai-context/
        component-catalog.md
        design-token-summary.md
        api-type-index.md
        page-component-map.md
        ai-generation-rules.md
```

说明：

- `components/ui`、`form`、`feedback` 等为跨业务复用层；
- `components/learning`、`components/penpal` 是带业务语义但不直接请求接口的业务组件；
- `features/*` 负责业务状态、接口调用、路由页面和数据转换；
- `services` 负责 API 访问；
- `types/api.ts` 由后端交付的 OpenAPI 规范自动生成，前端不得手动修改；
- `src/docs/ai-context/` 存放供 AI Studio 消费的摘要文件，用于生成前端页面时作为系统指令或上下文上传。

### 8.2 `src/types/api.ts` 生成与使用规则

`src/types/api.ts` 是前端与后端接口契约对齐的唯一类型来源。生成流程如下：

```text
后端 OpenAPI 规范
  -> 契约测试通过
  -> openapi-typescript / 等价工具生成 src/types/api.ts
  -> 前端业务组件引用类型
  -> AI Studio 基于类型文件生成页面
  -> TypeScript 编译验证字段和枚举
```

硬性规则：

- 不得手动编辑 `src/types/api.ts`；
- 不得在组件或页面中复制后端 DTO 类型；
- 字段名、枚举值、错误码以前端生成文件为准；
- 若类型不满足展示需要，应回到 OpenAPI 或后端契约修订，而不是在前端私自扩展；
- 生成工具和命令应写入 `package.json`，例如 `npm run generate:api-types`；
- API 类型文件变更后，必须重新运行类型检查和组件测试。

### 8.3 AI 上下文目录

新增 `src/docs/ai-context/` 目录，建议包含：

| 文件 | 内容 | 用途 |
|---|---|---|
| `component-catalog.md` | P0/P1/P2 组件清单、导入路径、使用场景、禁止事项 | 告诉 AI 只能使用哪些组件 |
| `design-token-summary.md` | 设计令牌、状态色、响应式规则、样式禁止事项 | 告诉 AI 不得硬编码样式 |
| `api-type-index.md` | `src/types/api.ts` 中核心类型、枚举、错误码索引 | 告诉 AI 页面数据字段来自哪里 |
| `page-component-map.md` | 页面-组件映射表、接口来源、事件回调说明 | 告诉 AI 每个页面如何组合组件 |
| `ai-generation-rules.md` | 系统指令摘要、生成后检查项、反模式 | 作为 AI Studio 生成入口规则 |

这些文件不是替代源代码的文档，而是 AI 生成页面时的上下文压缩层。每次组件 API、后端类型或页面映射发生变化，都需要同步更新对应摘要。

### 8.4 文档结构

建议新增组件文档目录：

```text
docs/component-library/
  README.md
  design-tokens.md
  component-api-guidelines.md
  migration-guide.md
  review-checklist.md
  ai-generation-guide.md
  CHANGELOG.md
  components/
    Button.md
    TaskActionCard.md
    PracticeQuestion.md
    LetterEditor.md
    SafetyNotice.md
    SaveStatus.md
```

每个组件文档采用统一模板：

```markdown
# ComponentName

## 定位
## 适用场景
## 不适用场景 / 反模式
## API
## 与 src/types/api.ts 的关系
## 状态与交互
## 无障碍要求
## AI 生成时使用规则
## 示例代码
## 测试要求
## 变更记录
```

### 8.5 示例结构

如果暂不引入 Storybook，可先使用文档示例和开发页：

```text
front/src/dev/ComponentGallery.tsx
```

`ComponentGallery` 仅在开发环境启用，用于展示 P0/P1 组件的默认、加载、空、错误、禁用、保存失败、安全拦截等状态。后续组件数量增加后，再评估 Storybook 或类似工具。

### 8.6 测试与检查结构

在新增测试框架后，建议组件测试与组件同目录或集中在 `__tests__`：

```text
front/src/components/ui/Button.test.tsx
front/src/components/feedback/SaveStatus.test.tsx
front/src/components/penpal/LetterEditor.test.tsx
front/src/__tests__/component-accessibility.test.tsx
```

AI 生成合规检查脚本建议放在：

```text
front/scripts/check-component-usage.mjs
front/scripts/check-hardcoded-styles.mjs
front/scripts/check-api-field-usage.mjs
front/scripts/check-page-component-map.mjs
```

若采用 Playwright 进行视觉和交互验证，可放在：

```text
front/e2e/component-gallery.spec.ts
front/e2e/critical-flows.spec.ts
```

### 8.7 构建产物与按需加载

首版组件库跟随应用构建，不单独打包。按需加载策略如下：

- 基础组件直接随主包引入；
- 写信、阅读、学习记录等较重页面通过路由懒加载；
- 图表组件如果引入第三方库，必须放在 `charts` 层并按页面懒加载；
- 不在组件库根入口一次性导出所有重组件，避免无意增加首页包体积；
- 建议每个层级提供局部 `index.ts`，页面按层级导入。

### 8.8 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 仓库指南中的 React/Vite/TypeScript 结构、第四阶段前端目录建议、当前无独立包事实、第六阶段 OpenAPI 类型生成和 AI 上下文要求 |
| 设计目标 | 形成清晰的源码、类型、文档、AI 上下文、示例、测试和构建组织方式 |
| 具体方案 | 在 `front/src/components` 下按职责分层，`src/types/api.ts` 自动生成，`src/docs/ai-context/` 存放 AI 消费摘要，组件文档放入 `docs/component-library` |
| 预期收益 | 降低查找成本，便于组件评审、AI 生成、迁移和后续维护 |
| 实施代价 | 需要创建目录、迁移或新建组件、配置 OpenAPI 类型生成、编写 AI 上下文和检查脚本 |
| 潜在风险 | 目录过细可能增加初期复杂度；可先创建 P0/P1 必要目录，P2 图表目录在需要时再启用 |

---

## 9. 组件清单、优先级与落地路径

### 9.1 P0：必须优先建设

| 组件 | 来源依据 | 典型场景 | 落地方式 | AI 生成时的约束 | 风险 |
|---|---|---|---|---|---|
| `Button` | 所有页面主操作 | 开始复习、提交答案、重试、发送 | 后端开发期间完成；替代所有按钮样式 | 所有按钮必须使用 `Button`，禁止原生 `<button>` 直接承载业务操作，除非封装在 `Button` 内部 | variant 过多导致风格失控 |
| `Card` | 今日任务、学习卡片 | 任务槽位、学习内容容器 | 后端开发期间完成；统一圆角、边框、间距 | 所有卡片容器必须使用 `Card` 或业务组件，禁止页面自绘边框卡片 | 卡片承载过多布局职责 |
| `Input`/`Textarea` | 写信、搜索/筛选（如有） | 文本输入、草稿编辑 | 后端开发期间完成；统一标签、错误、字数 | 所有输入必须使用组件库输入组件，禁止直接写原生输入并自定义样式 | 基础输入不应内置业务保存 |
| `EmptyState` | 空任务、无阅读、无记录 | 说明空原因和下一步 | 后端开发期间完成；与业务文案分离 | 空态必须使用 `EmptyState`，禁止页面只显示“暂无数据” | 空态写成泛泛鼓励文案 |
| `ErrorState` | 接口失败、加载失败 | 重试、返回今日学习 | 后端开发期间完成；后续对齐错误码 | 错误态必须使用 `ErrorState` 或 `SystemErrorPage`，禁止只输出错误码 | 吞掉具体错误上下文 |
| `Loading` | 首屏、模块加载 | 骨架/短提示 | 后端开发期间完成；超过 300ms 显示 | 加载状态必须使用 `Loading` 或组件内置 loading，禁止整页白屏 | 动画过重影响性能 |
| `ProgressIndicator` | 单词、阅读、写信流程 | 当前题/总题、阅读进度 | 后端开发期间可先开发 UI；后端交付后对齐字段 | 进度展示必须使用 `ProgressIndicator`，禁止页面自行计算并渲染样式 | 自行计算业务完成度 |
| `TaskActionCard` | 首页固定任务槽位 | 单词、阅读、写信入口 | 后端交付后基于 `TodayTaskDto` 完成 | 今日任务卡必须使用 `TaskActionCard`，禁止写静态三卡片 | 强行统一三类业务文案 |
| `PracticeQuestion` | 单词和阅读题 | 选择题展示和选择 | 后端交付后基于题目和答题结果类型完成 | 单词/阅读题必须使用 `PracticeQuestion`，禁止页面自绘选项按钮 | 内置判分逻辑 |
| `FeedbackPanel` | 答题反馈、提示 | 正确/错误/建议 | 后端开发期间完成；后端交付后对齐结果枚举 | 普通反馈必须使用 `FeedbackPanel`，安全拦截不得混用普通 info 样式 | 混淆安全拦截和普通建议 |
| `SaveStatus` | 写信草稿 | 保存中、已保存、失败、离线 | 后端开发期间完成 UI；M2 对齐错误码和状态 | 草稿保存状态必须显示 `SaveStatus`，禁止 Toast 替代持久状态 | 用 Toast 替代持久状态 |
| `SafetyNotice` | 写信安全提示 | 阻断、警告、说明 | 后端交付后基于 `SafetyCheckResultDto` 完成 | 安全提示必须使用 `SafetyNotice`，禁止 `alert()`、跳页或清空正文 | 文案责备用户或清空正文 |
| `LetterEditor` | 写信页面核心 | 草稿输入、字数、状态栏 | 后端交付后基于草稿类型完成 | 写信输入必须使用 `LetterEditor`，禁止页面自绘 textarea + 保存提示 | 内置发送、安全规则 |

### 9.2 P1：核心闭环稳定后建设

| 组件 | 场景 | 建设条件 | AI 生成时的约束 |
|---|---|---|---|
| `AppShell` | 页面主框架 | 路由和导航结构稳定后 | 所有主页面必须位于 `AppShell` 内，禁止每页重复写导航框架 |
| `PrimaryNav` | 今日学习、单词、阅读、写信、记录 | IA 稳定后 | 主导航必须使用 `PrimaryNav`，禁止页面自绘导航链接 |
| `RecoveryPrompt` | 中断回流 | 本地/服务端恢复数据结构确定后 | 存在恢复快照时必须使用 `RecoveryPrompt`，禁止普通提示替代 |
| `CompletionSummary` | 今日成果和任务完成 | 完成口径确定后 | 完成页必须使用 `CompletionSummary`，禁止静态祝贺卡片 |
| `ProgressSummary` | 今日学习首页和记录页 | 统计字段稳定后 | 今日总览必须使用 `ProgressSummary`，禁止页面自行拼装统计卡 |
| `SystemErrorPage` | 403/404/500/离线 | 路由与错误边界实现后 | 系统级错误必须使用 `SystemErrorPage`，禁止空白页或裸错误对象 |
| `SafetyCheckStatus` | 审核中、超时、失败 | 安全检查 API 契约稳定后 | 安全检查过程必须使用 `SafetyCheckStatus`，禁止按钮文案临时表达状态 |
| `SafetyHighlight` | 正文高亮 | 安全检查返回位置范围后 | 命中范围必须使用 `SafetyHighlight`，禁止只在顶部提示不定位 |
| `NotificationCenter` | 最近提醒 | MVP 若需要集中提醒时；否则保留首页单条弱提示 | 若实现通知中心，必须使用该组件；MVP 未启用时不得生成空入口 |

### 9.3 P2：后续扩展

| 组件 | 场景 | 延后原因 | AI 生成时的约束 |
|---|---|---|---|
| `DailyStudyTrend` | 学习记录趋势 | 需要真实统计数据和图表库评估 | 未启用前不得生成趋势图；用 `ProgressSummary` 替代 |
| `ModuleProgressChart` | 模块进度可视化 | MVP 可用摘要卡替代 | 禁止 AI 自行引入图表库 |
| `RelatedReadingSlot` | 单词关联阅读 | `DESIGN.md` 明确不在 MVP 展示空入口 | 禁止显示“敬请期待”入口 |
| `LocalAchievementCard` | 本地学习成果卡 | MVP 不做社交分享和炫耀入口 | 禁止生成分享、海报、社区发布入口 |
| `AdvancedFilter` | 内容筛选 | 当前核心流程不依赖复杂筛选 | 禁止为 MVP 页面生成复杂筛选面板 |

### 9.4 落地路径

第五阶段落地路径调整为：

1. **M1：基础组件与设计令牌先行**。后端仍在开发接口时，完成 `Button`、`Card`、`Input`、`Textarea`、`Tag`、`Modal`、`Loading` 和 token；
2. **M2：反馈与状态组件先行**。后端仍在开发接口时，完成 `EmptyState`、`ErrorState`、`FeedbackPanel`、`SaveStatus`、`SystemErrorPage`，并与后端错误码约定保持占位对齐；
3. **M3：后端接口交付后完成业务组件**。契约测试通过并生成 `src/types/api.ts` 后，完成 `TaskActionCard`、`PracticeQuestion`、`LetterEditor`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight` 等业务组件，props 与 `api.ts` 对齐；
4. **M4：冻结组件库并准备 AI 上下文**。冻结 P0/P1 组件 API、组件文档、页面-组件映射表、AI 系统指令；
5. **M4 末尾触发 AI 一次性页面生成**。AI Studio 基于真实接口类型和组件库上下文生成全部页面；
6. **M5：生成后自动合规检查与回溯重构**。检查组件引用、硬编码样式、接口字段拼写和类型错误，发现违规后局部重构；
7. **M6：真实环境验证与发布**。连接后端真实环境，完成异常状态、性能、可访问性和发布前检查。

### 9.5 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | `DESIGN.md` 组件清单、第三阶段页面模板、在线开发流程第五阶段通用组件列表、第六阶段后端先行与 AI 生成节点 |
| 设计目标 | 给出明确组件优先级、AI 使用约束和落地节奏，支撑实际开发排期 |
| 具体方案 | 将组件分为 P0/P1/P2；基础与状态组件在后端开发期间完成；业务组件在后端交付后基于 `api.ts` 冻结 |
| 预期收益 | 能先解决最影响一致性和学习闭环的组件问题，并保证 AI 生成页面类型安全、复用合规 |
| 实施代价 | P0/P1 组件需要在 AI 生成前完成文档、类型、示例和检查规则 |
| 潜在风险 | 写信安全组件依赖接口契约，若后端返回结构未定，应先开发 UI 壳和文档，最终冻结必须等 `api.ts` 生成后完成 |

---

## 10. 开发与质量保障体系

### 10.1 编码规范

对齐仓库指南：

- 使用 TypeScript 和 React 函数组件；
- 两空格缩进、单引号导入、保留分号；
- 组件 PascalCase，hooks 和处理函数 camelCase；
- UI 逻辑放组件，API 和服务逻辑放 `services` 或 feature 层；
- 组件 props 必须显式声明类型；
- 组件不得直接读取环境变量或调用后端 API；
- 业务组件不得重复定义后端 DTO 类型，必须引用 `src/types/api.ts`。

### 10.2 单元测试

建议引入 Vitest + React Testing Library，优先覆盖：

- 组件默认渲染；
- variant、size、disabled、loading 状态；
- 错误和空态文案；
- `onRetry`、`onSubmit`、`onRecover` 等事件触发；
- `PracticeQuestion` 的选中态和结果态展示；
- `SaveStatus` 的保存失败与重试；
- `SafetyNotice` 阻断提示不可随意关闭；
- 业务组件 props 与 `src/types/api.ts` 的类型兼容。

在测试框架引入前，最低要求仍是 `npm run lint` 和 `npm run build` 通过。

### 10.3 视觉回归

短期不强制引入大型视觉平台，可先用 Playwright 生成组件开发页截图：

- P0 组件默认态、禁用态、加载态、错误态；
- 今日学习首页关键组合；
- 写信安全拦截状态；
- 移动端和桌面端各一组截图。

当组件数量稳定后，再评估是否接入 Chromatic、Loki 或自建截图比对。视觉回归只作为差异提醒，不替代人工 UX 评审。

### 10.4 交互测试

核心交互测试至少覆盖：

- 从今日学习进入单词练习并完成一题；
- 阅读题选择答案后显示反馈；
- 写信输入内容、保存状态变化、安全检查失败后正文不丢失；
- 保存失败时可重试；
- 空态和错误态按钮能跳转或重试；
- 键盘可以完成导航、答题、弹窗关闭。

### 10.5 可访问性测试

- 自动检查：建议接入 axe 或 Playwright a11y 插件；
- 手动检查：键盘 Tab 顺序、焦点可见、屏幕阅读语义、颜色对比；
- 重点组件：`Modal`、`PracticeQuestion`、`LetterEditor`、`SafetyNotice`、`ErrorState`。

### 10.6 文档示例验证

每个组件文档中的示例代码应满足：

- 可以复制到项目中编译通过；
- props 名称与真实类型一致；
- 示例覆盖默认态和至少一个异常态；
- 不使用不存在的接口或假数据结论；
- 不把待实现能力写成已上线能力；
- 涉及业务数据的示例引用 `src/types/api.ts` 类型。

### 10.7 AI 生成合规检查

AI 生成页面后，必须新增或执行以下自动检查：

| 检查项 | 检查目标 | 处理方式 |
|---|---|---|
| 组件引用合规 | 页面是否绕过组件库自绘按钮、卡片、输入、空态、错误态 | 发现违规即回溯重构 |
| 硬编码样式 | 是否出现未授权颜色、间距、阴影、圆角 | 替换为 token 或组件 variant |
| 接口字段拼写 | 页面使用字段是否存在于 `src/types/api.ts` | TypeScript 编译和字段扫描 |
| 业务类型重复定义 | 是否在页面或组件中复制 DTO 类型 | 删除本地类型，引用 `api.ts` |
| 页面映射一致性 | 实际组件使用是否符合 `page-component-map.md` | 不一致处人工确认或重构 |
| API 调用边界 | 展示组件是否直接调用 fetch/service | 移至容器或 feature hooks |

### 10.8 CI 流程

目标 CI 阶段建议：

```text
install
  -> generate:api-types
  -> lint/typecheck
  -> unit tests
  -> build
  -> component usage check
  -> hardcoded style check
  -> api field usage check
  -> component interaction tests
  -> a11y smoke
  -> docker build / compose smoke（具备部署文件后）
```

在真实流水线未建立前，PR 或阶段验收至少记录本地执行结果：`npm run lint`、`npm run build`、组件复用检查脚本。若测试框架已加入，则补 `npm test` 或对应命令。

### 10.9 发布校验与回滚机制

组件库跟随应用发布，发布前检查：

- P0/P1 组件文档已更新；
- `src/types/api.ts` 由当前后端 OpenAPI 生成；
- 变更日志记录破坏性变化；
- AI 生成页面通过组件复用合规检查；
- 核心学习流程可用；
- 写信草稿、安全拦截、保存失败不丢数据；
- 构建产物可部署；
- 若部署失败，可以回滚到上一应用版本或镜像。

### 10.10 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 仓库构建命令、第四阶段测试/CI/CD 设计、性能测试计划、第三阶段 UX 验收要求、第六阶段 AI 生成后验证要求 |
| 设计目标 | 让组件库和 AI 生成页面变更可验证、可回归、可发布、可回滚 |
| 具体方案 | 建立编码规范、单元测试、视觉回归、交互测试、a11y、文档示例验证、AI 合规检查和 CI 发布检查 |
| 预期收益 | 减少组件修改和 AI 生成引发的页面回归，提升上线信心 |
| 实施代价 | 需要补测试框架、示例页、流水线配置、检查脚本和截图维护 |
| 潜在风险 | 测试体系一次性建设过重会拖慢 MVP；应先覆盖 P0 组件、核心流程和 AI 生成合规底线 |

---

## 11. 版本管理与发布策略

### 11.1 版本策略

首版组件库不独立发 npm 包，版本跟随应用版本。建议在文档中维护组件库内部版本：

```text
Component Library Version: 0.x
Application Version: 跟随项目发布标签
API Contract Version: 跟随后端 OpenAPI 版本
```

当组件库仍在快速变化时使用 `0.x`，表示 API 可能调整；当 P0/P1 组件稳定、文档和测试齐全、并完成一次 AI 生成页面验证后，再进入 `1.0`。

### 11.2 语义化变更规则

即使不独立发布，也按语义化版本管理组件变化：

| 变更类型 | 示例 | 处理方式 |
|---|---|---|
| Patch | 修复 `Button` loading 样式 | 记录修复，不要求迁移 |
| Minor | `EmptyState` 新增 `secondaryAction` | 向后兼容，更新文档和示例 |
| Major | `TaskActionCard` 删除 `actionText` 改为 `action` slot | 需要迁移指南、AI 上下文更新和页面重检 |
| API Contract | `TodayTaskDto.status` 枚举调整 | 重新生成 `src/types/api.ts`，更新业务组件和 AI 上下文 |

### 11.3 变更日志

建议新增：

```text
docs/component-library/CHANGELOG.md
```

记录：

- 新增组件；
- API 变化；
- 与 `src/types/api.ts` 的类型变化；
- 视觉状态变化；
- 废弃属性；
- AI 上下文更新；
- 迁移说明；
- 影响页面和验证结果。

### 11.4 废弃策略

- 废弃属性保留至少一个小版本或一个迭代周期；
- 文档中标记 Deprecated，并给替代写法；
- 禁止无说明删除被多个页面引用的 P0/P1 props；
- 业务组件 props 如果受后端契约变更影响，必须同步更新 `api-type-index.md` 和页面-组件映射表；
- 必要时提供简单迁移脚本或检索命令；
- 删除前完成受影响页面替换和测试。

### 11.5 升级指引与兼容性管理

每次组件库升级需说明：

- 哪些页面受影响；
- 是否有破坏性变化；
- 是否需要重新生成 `src/types/api.ts`；
- 是否需要重新触发 AI 局部重构；
- 如何替换旧 API；
- 本次验证了哪些页面和状态；
- 是否存在回滚注意事项。

### 11.6 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 当前单应用事实、第四阶段发布与回滚设计、仓库 PR 说明要求、第六阶段接口契约版本要求 |
| 设计目标 | 在不引入独立包复杂度的前提下管理组件、接口类型和 AI 上下文变更风险 |
| 具体方案 | 组件库版本跟随应用，内部按语义化规则记录 CHANGELOG、废弃、迁移和 API Contract 变化 |
| 预期收益 | 后续组件 API 和接口类型调整可追踪，页面升级和 AI 重构有依据 |
| 实施代价 | 每次组件变更需要同步维护变更日志、迁移说明和 AI 上下文摘要 |
| 潜在风险 | 如果团队忽略文档更新，版本策略会失效；应纳入 PR 检查清单 |

---

## 12. 文档与使用指南体系

### 12.1 文档体系

组件库文档分为五类：

| 文档类型 | 文件 | 内容 |
|---|---|---|
| 总览 | `docs/component-library/README.md` | 定位、分层、使用方式、准入原则 |
| 规范 | `design-tokens.md`、`component-api-guidelines.md` | token、主题、API、事件、状态规范 |
| 组件说明 | `components/*.md` | 每个组件的适用场景、API、示例、反模式 |
| 迁移治理 | `migration-guide.md`、`review-checklist.md`、`CHANGELOG.md` | 存量调整、评审清单、版本变更 |
| AI 生成 | `ai-generation-guide.md`、`src/docs/ai-context/*` | AI 系统指令、组件清单、类型索引、页面映射、检查规则 |

### 12.2 单组件文档要求

每个 P0/P1 组件必须说明：

- 组件定位；
- 适用场景；
- 不适用场景和反模式；
- props/API；
- 与 `src/types/api.ts` 的关系；
- 状态列表；
- 与其他组件的组合方式；
- 无障碍要求；
- AI 生成时使用规则；
- 示例代码；
- 测试要求；
- 常见问题。

### 12.3 示例代码原则

示例代码必须来自真实目标场景。例如 `SaveStatus` 示例应展示保存中、保存失败、重试，不应写成孤立装饰组件；`SafetyNotice` 示例应展示拦截说明和重新检查入口，不应使用 `alert()` 或清空正文。涉及业务数据的示例必须引用 `src/types/api.ts` 类型，不得编造本地 DTO。

### 12.4 最佳实践与反模式

| 最佳实践 | 反模式 |
|---|---|
| 用 `TaskActionCard` 统一今日任务容器 | 在每个任务卡里复制按钮、边框、错误态 |
| 用 `FeedbackPanel` 表达普通答题反馈 | 用安全拦截样式表达普通语言建议 |
| `LetterEditor` 紧邻 `SaveStatus` | 用右上角短暂 Toast 表示保存失败 |
| 基础组件只接收 UI props | 基础组件内部调用 API 或读取业务 store |
| 业务组件 props 引用 `src/types/api.ts` | 页面或组件重复定义 `Question`、`Task`、`Draft` 类型 |
| 通过 slot 扩展业务内容 | 在通用组件里堆大量业务 type 分支 |
| AI 生成前提供页面-组件映射表 | 让 AI 自行决定页面组件和样式 |

### 12.5 常见问题机制

组件使用中出现以下问题，应进入 FAQ：

- 某个页面是否应使用 `TaskActionCard`；
- 保存失败提示应该用 `ErrorState` 还是 `SaveStatus`；
- 安全检查失败是否可以关闭提示；
- 图表组件何时可以引入第三方库；
- 组件样式能否被页面覆盖；
- 后端类型变化后业务组件如何更新；
- AI 生成代码自绘了 UI 时如何回溯重构。

### 12.6 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 第三阶段文案规则、组件清单和反模式约束，第四阶段协作与 ADR 思路，第六阶段 AI 生成上下文要求 |
| 设计目标 | 让组件使用方式可学习、可评审、可追溯，并可直接作为 AI 生成上下文 |
| 具体方案 | 建立总览、规范、组件说明、迁移治理、AI 生成五类文档，并规定模板 |
| 预期收益 | 减少口头约定和重复答疑，提高跨角色协作效率和 AI 生成稳定性 |
| 实施代价 | 需要为 P0/P1 组件同步维护文档、示例和 AI 摘要 |
| 潜在风险 | 文档滞后于代码会误导 AI 和开发者；应将文档更新纳入组件 PR 必选项 |

---

## 13. 推广复用机制

### 13.1 生成前强制接入策略

由于前端页面由 AI 一次性生成，组件库推广不再依赖开发者事后主动替换，而是在生成前通过系统指令和上下文文件强制接入：

1. 组件库 P0/P1 API 冻结；
2. `component-catalog.md` 明确每个组件导入路径和使用场景；
3. `page-component-map.md` 明确每个页面必须使用的组件；
4. `ai-generation-rules.md` 明确禁止自绘按钮、卡片、输入、错误态；
5. AI Studio 生成后运行合规检查；
6. 不合规则局部回溯重构，不进入人工美化。

### 13.2 团队统一接入

建议建立以下协作规则：

- 新页面生成前先检查是否已有组件可复用；
- 新增组件必须说明为什么不能组合现有组件；
- P0/P1 组件变更需要前端和设计共同确认；
- 涉及安全、保存、错误状态的组件变更需要产品或测试参与验收；
- 组件命名、props、后端类型引用和状态应在 PR 中写明；
- AI 生成上下文更新与组件代码变更同 PR 提交。

### 13.3 评审与准入机制

新增组件准入问题：

1. 是否至少两个场景复用，或属于设计规范明确要求的关键状态？
2. 是否不包含 API 请求、算法、权限、安全规则？
3. 是否已有相近组件可以组合实现？
4. 是否定义了默认、加载、空、错、禁用等必要状态？
5. 是否具备文档、示例和测试？
6. 是否符合 a11y 和响应式要求？
7. 如果涉及业务数据，是否引用 `src/types/api.ts`？
8. 是否已更新 AI 上下文文件和页面-组件映射表？

未满足准入的问题组件先留在 feature 私有目录，不进入组件库，也不得写入 AI 可用组件清单。

### 13.4 复用数据与反馈闭环

建议每个迭代统计：

- 组件引用次数；
- AI 生成代码合规率；
- 自绘 UI 违规次数；
- 硬编码样式违规次数；
- 接口字段拼写错误次数；
- 页面内重复样式数量；
- 组件相关缺陷数；
- 文档缺失或误用次数；
- 新页面复用率；
- 组件 API 变更次数；
- 设计返工次数。

反馈来源包括：前端开发、设计走查、测试缺陷、产品验收、AI 生成检查报告和用户使用问题。高频误用组件应优先更新文档、简化 API 或增强检查脚本。

### 13.5 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 在线开发流程中的协作、分支、CI/CD 和重复任务规避原则；第四阶段协作流程；第六阶段 AI 生成强制复用策略 |
| 设计目标 | 推动组件库在 AI 生成页面时即被统一接入，而不是生成后依赖人工逐页替换 |
| 具体方案 | 通过系统指令、页面映射表、准入问题、评审清单、自动检查和复用指标建立闭环 |
| 预期收益 | 提升团队一致性，减少重复开发、组件误用和 AI 生成偏差 |
| 实施代价 | 需要评审投入、指标维护、上下文维护和定期复盘 |
| 潜在风险 | 如果指标只看引用次数，可能鼓励不合理复用；需结合缺陷、误用和页面体验共同判断 |

---

## 14. 实施计划与里程碑

### 14.1 M0：源码与设计资产盘点

| 项目 | 内容 |
|---|---|
| 目标 | 确认或恢复 `front/`，盘点已有文档、设计规范、组件线索、样式体系和第六阶段接口交付计划 |
| 输入 | `README.md`、`DESIGN.md`、阶段 1-4 文档、用户提供的第六阶段流程说明、当前仓库文件 |
| 输出 | 源码/设计资产盘点表、组件缺口清单、接口交付依赖清单、AI 上下文目录规划 |
| 参与角色 | 前端、架构、产品/设计、后端接口负责人 |
| 完成标准 | 明确哪些组件可复用、哪些需新建；明确 OpenAPI 交付时间；确认 AI Studio 生成前需要准备的上下文文件 |

### 14.2 M1：设计令牌与基础组件完成

| 项目 | 内容 |
|---|---|
| 目标 | 在后端仍开发接口期间，完成不依赖业务接口的设计令牌和基础组件 |
| 输入 | `DESIGN.md` 视觉语言、状态色、响应式和无障碍要求；组件库分层方案 |
| 输出 | `tokens.css`、`theme.ts`、`Button`、`Card`、`Input`、`Textarea`、`Tag`、`Modal`、`Loading`，组件 API 文档初版 |
| 参与角色 | 前端、产品/设计、测试 |
| 完成标准 | 基础组件可在 `ComponentGallery` 展示；文档包含 props、适用场景、反模式和 AI 使用约束；`npm run lint` / 类型检查可通过 |

### 14.3 M2：反馈与状态组件完成

| 项目 | 内容 |
|---|---|
| 目标 | 在后端仍开发接口期间，完成反馈与状态组件，并与后端错误码约定建立占位映射 |
| 输入 | 第三阶段状态表达规则、第四阶段错误处理和可恢复性设计、后端错误码草案 |
| 输出 | `EmptyState`、`ErrorState`、`FeedbackPanel`、`SaveStatus`、`SystemErrorPage`，错误码映射草案，状态组件文档 |
| 参与角色 | 前端、后端、产品/设计、测试 |
| 完成标准 | 加载、空态、错误、保存中、保存失败、系统错误状态均有组件展示；可先用 Mock 类型开发，但必须标记待 `src/types/api.ts` 对齐项 |

### 14.4 M3：后端接口交付验收与业务组件冻结

| 项目 | 内容 |
|---|---|
| 目标 | 后端接口全部完成并通过契约测试后，立即基于真实类型文件更新或生成业务组件，完成组件库冻结 |
| 输入 | 后端 OpenAPI、契约测试报告、字段字典、枚举字典、错误码字典、自动生成的 `src/types/api.ts` |
| 输出 | `TaskActionCard`、`PracticeQuestion`、`ProgressIndicator`、`ProgressSummary`、`CompletionSummary`、`LearningCard`、`RecoveryPrompt`、`LetterEditor`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight`，全部业务组件 props 与 `api.ts` 对齐 |
| 参与角色 | 后端、前端、架构、测试、产品/设计 |
| 完成标准 | `src/types/api.ts` 不被手动修改；业务组件无重复 DTO；TypeScript 编译通过；组件 API 文档更新；P0/P1 组件 API 冻结，除阻断问题外不再修改 |

### 14.5 M4：AI 上下文物料准备与一次性页面生成

| 项目 | 内容 |
|---|---|
| 目标 | 准备 AI Studio 生成所需上下文，编写系统指令，触发一次性生成全部前端页面代码 |
| 输入 | 冻结后的组件库、组件 API 文档、`src/types/api.ts`、字段/枚举/错误码字典、页面-组件映射表、设计令牌摘要 |
| 输出 | `component-catalog.md`、`design-token-summary.md`、`api-type-index.md`、`page-component-map.md`、`ai-generation-rules.md`，AI Studio 生成的全部页面代码 |
| 参与角色 | 前端、架构、产品/设计、测试，AI Studio 操作者 |
| 完成标准 | AI 系统指令明确“组件库是唯一合法 UI 来源”；生成结果覆盖今日学习、单词、阅读、写信、今日成果、错误页；不允许跳过真实接口类型使用 |

### 14.6 M5：生成后自动合规检查与回溯重构

| 项目 | 内容 |
|---|---|
| 目标 | 对 AI 生成代码进行自动检查和局部重构，确保复用组件库、类型正确、样式合规 |
| 输入 | AI 生成页面代码、检查脚本、组件文档、页面-组件映射表、`src/types/api.ts` |
| 输出 | 合规检查报告、违规片段列表、局部重构后的页面代码、回归测试结果 |
| 参与角色 | 前端、测试、架构，必要时产品/设计参与状态走查 |
| 完成标准 | 组件引用合规检查通过；无越权自绘按钮/卡片/输入/空态/错误态；无硬编码核心颜色；无接口字段拼写错误；`npm run lint`、`npm run build` 和关键测试通过 |

### 14.7 M6：真实环境对接验证、文档补全与发布

| 项目 | 内容 |
|---|---|
| 目标 | 将生成并重构后的前端与后端真实环境对接验证，完成文档、测试和发布准备 |
| 输入 | 真实后端环境、前端构建产物、测试用例、部署配置、性能测试计划 |
| 输出 | 对接验证记录、异常状态验证记录、组件库最终文档、发布清单、回滚方案 |
| 参与角色 | 前端、后端、测试、运维/部署、产品/设计 |
| 完成标准 | 今日学习、单词、阅读、写信、今日成果主流程通过；接口错误、安全拦截、保存失败、离线/恢复状态通过；发布前检查完成；可回滚 |

### 14.8 优先级排序

优先顺序为：

1. **高频基础组件**：按钮、卡片、输入、加载；
2. **关键状态组件**：空态、错误、反馈、保存；
3. **接口类型生成链路**：OpenAPI 到 `src/types/api.ts`；
4. **学习闭环组件**：任务卡、进度、答题、完成；
5. **高风险安全组件**：写信、安全检查、高亮、保存失败；
6. **AI 上下文和检查脚本**：组件清单、页面映射、系统指令、合规扫描；
7. **可视化扩展**：学习趋势、模块图表。

这样排序优于先做图表或主题系统，因为 EnglishLover 首版最关键的是完成学习闭环、安全写信和 AI 生成页面的可控性，不是展示复杂数据或个性化视觉。

### 14.9 资源投入建议

| 角色 | 投入建议 | 职责 |
|---|---|---|
| 前端开发 | 1-2 人 | 组件实现、类型接入、AI 上下文、检查脚本、生成后重构 |
| 后端开发 | 1-2 人 | OpenAPI、契约测试、字段/枚举/错误码字典、真实接口环境 |
| 产品/设计 | 0.3-0.5 人 | 状态文案、组件场景、页面-组件映射、视觉验收 |
| 测试 | 0.3-0.5 人 | 契约验收、核心流程、回归、a11y、生成合规验证 |
| 架构/技术负责人 | 按需 | 组件边界、接口类型、AI 生成规则和发布风险把关 |

### 14.10 依赖项

- 真实 `front/` 源码目录；
- 当前页面和路由结构目标；
- 样式体系和构建配置；
- 后端 OpenAPI、字段字典、枚举字典和错误码字典；
- 契约测试通过结果；
- 自动生成的 `src/types/api.ts`；
- 写信保存和安全检查 API 契约；
- 学习进度和完成统计字段；
- 测试框架、AI 合规检查脚本和 CI 环境；
- 设计与文案评审时间。

### 14.11 风险项与应对策略

| 风险 | 影响 | 应对策略 |
|---|---|---|
| 源码未恢复 | 无法直接实现组件和生成页面 | 先完成文档、目录和 AI 上下文设计，源码恢复后执行 M0 |
| 后端契约延期 | 业务组件无法冻结，AI 生成节点推迟 | M1-M2 先完成基础和状态组件；M3 以契约测试通过作为硬门禁 |
| 接口字段频繁变更 | `api.ts`、业务组件和页面生成反复变动 | 引入 API Contract Version，M3 后冻结，变更需走破坏性变更流程 |
| 抽象过度 | 组件难用、AI 误用、开发变慢 | 只抽取重复场景和关键状态，保留 feature 容器处理业务逻辑 |
| AI 自绘 UI | 页面风格碎片化，复用失败 | 系统指令 + 合规脚本 + 回溯式重构，不通过不进入发布 |
| 写信安全接口未定 | 安全组件无法完整联调 | M2 先开发状态壳，M3 以真实 `SafetyCheckResultDto` 冻结 |
| 测试工具链不足 | 组件和生成页面回归难发现 | 先 lint/build/合规检查，再逐步引入单测和 Playwright |
| 文档与代码不一致 | AI 和开发者误用组件 | 组件 PR 必须同步文档、AI 上下文和 CHANGELOG |
| 图表库增加包体积 | 首页性能下降 | 图表 P2，懒加载，必要时先用摘要卡替代 |
| 设计 token 失控 | 样式碎片化 | token 评审，禁止页面随意新增颜色和间距，脚本扫描硬编码 |

### 14.12 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 在线开发流程中的阶段规划、第四阶段后续演进和 CI/CD、性能测试计划、第六阶段后端先行和 AI 一次性生成流程 |
| 设计目标 | 给出可执行里程碑、输入、输出、角色、完成标准、优先级、依赖和风险应对 |
| 具体方案 | 按 M0-M6 推进：盘点、基础组件、状态组件、后端交付后业务组件冻结、AI 生成、合规重构、真实环境验证发布 |
| 预期收益 | 团队可以直接拆任务、排期、验收、触发 AI 生成和发布 |
| 实施代价 | 需要跨前端、后端、产品/设计、测试和架构协作，并预留契约冻结和生成后检查时间 |
| 潜在风险 | 若业务功能或接口尚未稳定，组件冻结会反复修改；必须以后端契约测试通过作为 M3 硬门禁 |

---

## 15. 与 AI 生成前端的衔接规范

### 15.1 AI 系统指令简版模板

以下为 AI Studio 生成前端页面时的简版系统指令模板，详细版应存放在 `src/docs/ai-context/ai-generation-rules.md`：

```text
你正在为 EnglishLover 在线英语学习平台 Web 端生成前端页面代码。

必须遵守：
1. 只能使用项目组件库中的组件作为 UI 来源，组件清单见 component-catalog.md。
2. 所有按钮必须使用 Button；所有卡片必须使用 Card 或业务组件；所有输入必须使用 Input、Textarea 或 LetterEditor；所有空态、错误态、保存状态、安全提示必须使用对应组件。
3. 禁止在页面中自绘按钮、卡片、输入框、空态、错误态、安全提示；禁止硬编码核心颜色、间距、圆角和状态色。
4. 页面数据类型必须来自 src/types/api.ts，禁止重复定义后端 DTO、枚举或字段类型。
5. 每个页面必须遵守 page-component-map.md 中的组件组合规则。
6. 展示组件只接收 props 和触发回调；真实 API 调用只能放在页面容器、feature hooks 或 services 层。
7. 写信草稿保存失败、安全检查失败时不得清空正文，不得使用 alert()，必须展示 SaveStatus、SafetyNotice、SafetyCheckStatus、SafetyHighlight。
8. 生成代码必须通过 TypeScript 编译、组件复用检查、硬编码样式检查和接口字段检查。

请一次性生成今日学习、单词记忆、阅读练习、受控笔友写信、今日成果/学习记录和系统错误页面相关代码。
```

### 15.2 生成前必须提供的上下文文件清单

| 文件 | 必须性 | 内容 |
|---|---|---|
| `src/types/api.ts` | 必须 | 后端 OpenAPI 自动生成类型，页面和业务组件唯一接口类型来源 |
| `src/docs/ai-context/component-catalog.md` | 必须 | 组件名称、导入路径、props 摘要、适用场景、禁止事项 |
| `src/docs/ai-context/design-token-summary.md` | 必须 | token、主题、响应式、状态色、硬编码样式禁令 |
| `src/docs/ai-context/api-type-index.md` | 必须 | 核心接口响应、请求、枚举、错误码和字段说明索引 |
| `src/docs/ai-context/page-component-map.md` | 必须 | 每个页面必须使用的组件、数据来源、事件回调和禁止事项 |
| `src/docs/ai-context/ai-generation-rules.md` | 必须 | 系统指令、生成范围、输出约束、检查要求 |
| `docs/component-library/components/*.md` | 必须 | 单组件详细 API 和示例 |
| `DESIGN.md` | 必须 | 产品目标、视觉语言、交互状态、无障碍和内容语气 |
| 第六阶段开发实施流程文档 | 必须 | 后端先行、无传统联调、AI 一次性生成和回溯重构流程 |

生成前检查：若上述任一“必须”文件缺失，或 `src/types/api.ts` 不是由当前 OpenAPI 自动生成，则不得触发 AI 一次性页面生成。

### 15.3 生成后的验证检查脚本要求

建议在 `package.json` 中配置以下命令：

```json
{
  "scripts": {
    "generate:api-types": "openapi-typescript ./openapi.json -o src/types/api.ts",
    "check:component-usage": "node scripts/check-component-usage.mjs",
    "check:hardcoded-styles": "node scripts/check-hardcoded-styles.mjs",
    "check:api-fields": "node scripts/check-api-field-usage.mjs",
    "check:page-map": "node scripts/check-page-component-map.mjs",
    "verify:ai-output": "npm run lint && npm run build && npm run check:component-usage && npm run check:hardcoded-styles && npm run check:api-fields && npm run check:page-map"
  }
}
```

必须检查项：

- 页面是否直接使用原生 `<button>` 承载业务操作；
- 页面是否直接写卡片边框、阴影、圆角而未使用 `Card` 或业务组件；
- 页面是否直接写输入框而未使用 `Input`、`Textarea` 或 `LetterEditor`；
- 页面是否出现硬编码颜色值、散落间距和未授权状态色；
- 页面是否重复定义后端 DTO、枚举或接口字段；
- 页面使用的字段是否存在于 `src/types/api.ts`；
- 今日学习、单词、阅读、写信、记录页是否符合 `page-component-map.md`；
- 展示组件是否直接调用 API；
- 写信安全失败是否使用 `SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight` 且不清空正文。

### 15.4 回溯式重构流程

AI 生成后发现违规时，不应由人工直接随意改写页面，而应按以下流程进行回溯式重构：

```text
发现违规
  -> 记录违规文件、代码片段、违反规则和期望组件
  -> 将违规片段 + 对应组件文档 + 页面-组件映射规则重新提交 AI
  -> 要求 AI 只做局部重构，不改变接口调用和业务流程
  -> 重新运行 verify:ai-output
  -> 若仍违规，重复局部重构或人工修正组件文档/规则
  -> 全部通过后进入真实环境验证
```

回溯式重构输入模板：

```text
以下代码违反 EnglishLover 组件库规则：
- 文件：<path>
- 违规类型：自绘按钮 / 硬编码颜色 / 重复 DTO / 未使用 SafetyNotice / 其他
- 违规片段：<code>
- 必须遵守的组件文档：<component-doc>
- 页面-组件映射规则：<page-map-rule>

请只重构该片段，保持业务逻辑、API 调用和类型不变，改为使用组件库组件，并确保通过 TypeScript 编译。
```

### 15.5 本节六要素

| 要素 | 内容 |
|---|---|
| 设计依据 | 第六阶段 AI Studio 一次性生成前端、组件库强制复用、生成后自动化验证和回溯式重构流程 |
| 设计目标 | 把组件库、接口类型和页面映射转化为 AI 可执行约束，保证生成结果可控 |
| 具体方案 | 提供系统指令模板、上下文文件清单、验证脚本要求和回溯式重构流程 |
| 预期收益 | 减少 AI 自由发挥导致的 UI 失控、类型错配和重复代码 |
| 实施代价 | 需要维护 AI 上下文、检查脚本和违规重构记录 |
| 潜在风险 | 如果 AI 上下文过长或冲突，生成质量会下降；应使用摘要文件并保持规则单一明确 |

---

## 16. 最终验收清单

第五阶段完成时，应至少满足以下检查项：

- [ ] 已完成真实源码和设计资产盘点；
- [ ] 已确认第六阶段后端接口交付计划、OpenAPI 生成方式和契约测试门禁；
- [ ] P0 基础组件和状态组件已实现或明确延期原因；
- [ ] 业务组件已在后端接口交付后基于 `src/types/api.ts` 更新并冻结；
- [ ] 业务组件 Props 与 `src/types/api.ts` 无冲突，不存在重复 DTO 类型；
- [ ] 今日学习、单词、阅读、写信、今日成果核心页面有明确页面-组件映射；
- [ ] 《页面-组件映射表》已写入 AI 上下文，并与实际生成代码一致；
- [ ] `SaveStatus`、`SafetyNotice`、`SafetyCheckStatus`、`SafetyHighlight` 覆盖写信安全和草稿场景；
- [ ] 组件不直接包含 API 请求、算法、权限和安全规则；
- [ ] 设计 token 和状态色统一，设计令牌在全局生效；
- [ ] 页面无越权样式，无硬编码核心颜色、间距、圆角和状态色；
- [ ] 组件文档包含适用场景、反模式、API、与 `api.ts` 的关系、示例和测试要求；
- [ ] AI 生成前上下文文件齐全：组件清单、设计令牌摘要、接口类型索引、页面-组件映射表、生成规则；
- [ ] AI 生成页面通过组件复用自动检查；
- [ ] AI 生成页面无自绘按钮、卡片、输入、空态、错误态、安全提示等违规实现；
- [ ] lint/typecheck/build 通过；
- [ ] P0/P1 组件具备基础单元测试或明确补测计划；
- [ ] 核心交互和异常状态经过测试或人工走查；
- [ ] 变更日志和迁移指南已更新；
- [ ] 真实后端环境对接验证通过；
- [ ] 未把未实现能力写成已完成事实。

---

## 17. 阶段结论

第五阶段的核心价值不是追求完整设计系统，而是把 EnglishLover 前四阶段已经确认的学习闭环、状态反馈、安全写信和页面模板，转化为稳定、可复用、可测试、可被 AI Studio 正确使用的仓内组件库。在第六阶段“后端先行、接口契约驱动、前端一次性生成”的流程下，组件库还承担了新的职责：它必须成为 AI 生成页面时的唯一合法 UI 来源，并通过 `src/types/api.ts` 与后端真实接口类型保持一致。

本最终执行稿明确了新的建设节奏：后端开发期间完成基础组件与状态组件；后端接口通过契约测试并生成 `src/types/api.ts` 后，完成业务组件并冻结组件库；随后准备组件清单、接口类型索引、设计令牌摘要和页面-组件映射表，触发 AI Studio 一次性生成全部页面；生成后通过组件复用检查、硬编码样式检查、接口字段检查和回溯式局部重构，确保页面代码既符合设计规范，也对齐真实接口。

在当前仓库仍以文档为主、未核验到完整 `front/` 源码的事实边界下，本文给出的目录结构、API、测试、AI 生成和发布策略属于落地执行方案，不等同于已实现。后续实施时，应先完成源码盘点和后端契约交付，再按 M0-M6 的里程碑推进；每个组件都必须有清晰职责、适用场景、反模式、类型来源、文档和验证记录。这样既能减少重复开发，又能降低 AI 一次性生成前端页面的失控风险，为后续功能迭代、测试回归和项目评审提供可靠依据。
