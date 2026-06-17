# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-18
- Primary product surfaces: 今日学习、单词训练、阅读训练、教练建议；单词背诵与阅读理解开始后进入专注模式；学习画像首版并入教练页摘要。
- Evidence reviewed:
  - `docs/ai-coach-prd.md`: 产品定位、P0/P1/P2 范围、学习闭环与验收标准。
  - `docs/ai-coach-information-architecture.md`: 页面结构、主路径、状态和移动端导航。
  - `docs/ai-coach-core-page-copy-and-interactions.md`: 核心页面文案、交互状态和边界提示。
  - `app/lib/main.dart`: 当前 Flutter 应用仍为默认计数器模板，尚无既有业务 UI 可复用。
  - `app/pubspec.yaml`: 当前仅依赖 Flutter Material 与 Cupertino Icons，无额外字体、图表或动画依赖。

## Brand
- Personality: 安静、清晰、克制、像私人学习教练；帮助用户进入学习，不制造焦虑。
- Trust signals: 今日任务明确、反馈具体、AI 边界透明、建议可执行、不夸大学习效果。
- Avoid: 排行榜刺激、复杂成就系统、重型数据大屏、炫彩渐变、营销式承诺、过多弹窗。

## Product goals
- Goals:
  - 用户进入首页 10 秒内知道今天先做什么。
  - 用户能完成“背词 -> 阅读 -> 做题 -> 解析 -> 建议”的每日闭环。
  - 单词、阅读、错因和教练建议在界面上形成可感知关联。
- Non-goals:
  - 首版不做社区、商城、课程中心、排行榜、AI 聊天大厅或重型后台。
  - 首版不做复杂图表看板；数据只服务下一步行动。
- Success signals:
  - 每个学习页面只有一个清晰主行动。
  - 用户点击“开始单词训练”或进入阅读正文/答题后，界面切换到专注模式。
  - 用户在专注模式中不被底部导航、学习画像、历史统计或无关推荐打断。
  - AI 失败时仍能通过预置阅读继续完成今日任务。

## Personas and jobs
- Primary personas:
  - 考研英语备考者：每天背词但阅读正确率不稳定。
  - 时间有限自学者：每天 15–30 分钟，希望打开后直接开始。
- User jobs:
  - 今天该背哪些词、做哪篇阅读。
  - 知道错在哪里，并得到下一步动作。
  - 把近期单词放进阅读语境中复现。
- Key contexts of use:
  - 移动端碎片时间学习。
  - 桌面端较长阅读与复盘。
  - AI 内容生成可能变慢或失败，需要不中断学习。

## Information architecture
- Primary navigation: 移动端使用“今日 / 单词 / 阅读 / 教练”四项底部导航；学习画像合并进教练页二级内容。
- Core routes/screens:
  - 今日学习：首页和任务枢纽，回答“今天先做什么”。
  - 单词训练：开始后进入单词专注模式，低干扰卡片学习，记录认识 / 模糊 / 不认识。
  - 阅读训练：生成前可说明目标词；阅读正文、答题、解析进入阅读专注模式。
  - 教练建议：表现判断、原因解释、下一步任务。
- Content hierarchy:
  - 首屏优先“今日目标 + 下一步行动”。
  - 学习过程优先当前材料和进度。
  - 专注模式隐藏底部导航和非当前任务入口，只保留返回、进度和当前主行动。
  - 统计信息摘要化，用户主动查看再展开。

## Design principles
- Principle 1: 信息高效。只展示能帮助用户立刻行动的信息，删除重复解释和泛泛鼓励。
- Principle 2: 画面直观简洁。用明确层级、留白和卡片分组表达结构，不用装饰性复杂图形。
- Principle 3: 提高专注力。单词背诵和阅读理解开始后进入专注模式，弱化导航、隐藏次级入口、避免弹窗和竞争按钮。
- Tradeoffs:
  - 宁可少展示数据，也不要让用户在学习前先读报表。
  - 宁可使用系统字体和 Material 基础组件，也不为首版引入字体、图表或动画依赖。

## Visual language
- Color:
  - `Ink` #17211B：正文与主要标题。
  - `Paper` #F7F5EF：全局低饱和学习背景。
  - `Card` #FFFFFF：任务卡和阅读卡背景。
  - `Coach Green` #2F6B4F：唯一主强调色，用于主行动和当前进度。
  - `Word Amber` #C7832B：仅用于薄弱词、提醒和待复习状态。
  - `Line` #E6E0D3：分割线、卡片边界和禁用边框。
- Typography:
  - 标题使用系统 sans 字体 22–28sp，中高字重，句子短。
  - 正文使用系统 sans 字体 16–18sp，阅读正文行高 1.55–1.7。
  - 数据、标签和进度使用 12–14sp，避免喧宾夺主。
- Spacing/layout rhythm:
  - 移动端页面左右 20px 安全边距，卡片内边距 16–20px。
  - 以 8px 栅格控制间距；学习主内容和主按钮之间保持稳定距离。
  - 阅读正文使用较宽行距和段间距，避免密集压迫。
- Shape/radius/elevation:
  - 卡片圆角 18–24px；按钮圆角 14–16px。
  - 阴影极轻或不用阴影，优先用背景差和边界线分层。
- Motion:
  - 只保留状态切换、按钮反馈、生成中进度的轻量动效。
  - 支持减少动态效果；不使用循环氛围动画。
- Imagery/iconography:
  - 不依赖插画；图标只用于状态识别。
  - 签名元素为“学习闭环轨迹”：在首页和结果页用简洁线性路径表达单词、阅读、解析、建议的连接。

## Components
- Existing components to reuse: 当前 Flutter 业务组件不存在；首版以 Material 基础组件组合实现。
- New/changed components:
  - 今日任务卡：显示任务名称、状态、一句收益和一个主行动。
  - 专注模式外壳：隐藏底部导航，保留顶部返回、轻量进度和当前任务标题。
  - 学习卡片：承载单词、释义、例句、掌握反馈。
  - 阅读文本区：提供舒适行高、目标词标记和专注阅读模式。
  - 教练建议卡：固定“判断 / 原因 / 下一步”结构。
  - 状态反馈：空、加载、错误、成功、禁用均给出下一步。
- Variants and states:
  - 任务卡：未开始、可继续、已完成、待解锁、降级可用。
  - 专注模式：单词背诵中、阅读中、答题中、解析中、退出确认。
  - 按钮：主行动、次行动、文本行动、禁用、加载。
  - 反馈：信息、提醒、错误、成功。
- Token/component ownership: 颜色、间距、圆角、文字层级应沉淀为 Flutter theme 或常量；不要在页面内散落硬编码。

## Accessibility
- Target standard: 首版按 WCAG 2.1 AA 方向设计；移动端触控和可读性优先。
- Keyboard/focus behavior: 所有按钮、卡片行动和选项应有可见焦点；阅读与答题状态按自然顺序聚焦。
- Contrast/readability: 正文与背景保持 AA 对比；提醒色不单独承担语义，必须配合文字标签。
- Screen-reader semantics: 学习进度、题目选项、反馈结果和 AI 降级说明需要可读标签。
- Reduced motion and sensory considerations: 生成中和状态切换动效可关闭；不使用闪烁、抖动或强刺激动效。

## Responsive behavior
- Supported breakpoints/devices:
  - Mobile: 360–480px 为首版主体验。
  - Tablet/Desktop: 以居中内容列和侧栏摘要延展，不新增复杂导航。
- Layout adaptations:
  - 移动端单列；普通页面显示底部导航，专注模式隐藏底部导航并可使用底部固定主行动。
  - 桌面端阅读页可采用“正文 + 题目/词汇侧栏”的双栏，但专注模式仍保持主行动唯一，侧栏只显示当前任务必要信息。
- Touch/hover differences:
  - 移动端触控目标不小于 44px。
  - 桌面 hover 仅作轻微边界或背景反馈，不触发关键信息显示。

## Interaction states
- Loading: 明确说明正在生成或分析什么，并保留用户上下文，例如“正在把近期单词组织成阅读材料”。
- Empty: 不说“暂无数据”了事，必须给出第一步行动。
- Error: 说明发生了什么、保留用户输入、提供重试和降级路径。
- Success: 用简短结果 + 下一步行动收口，例如“单词已完成，接下来生成阅读”；完成后退出专注模式或切换到下一段专注任务。
- Disabled: 说明解锁条件，例如“完成一组单词后阅读会更贴合”。
- Offline/slow network, if applicable: 提供预置阅读和稍后同步提示，不阻断本地练习。

## Content voice
- Tone: 私人教练式、具体、克制、有方向。
- Terminology:
  - 使用“今日学习”“单词训练”“阅读训练”“教练建议”。
  - 使用“薄弱词”“近期词”“目标词”“推断题”等学习者能理解的词。
- Microcopy rules:
  - 按钮使用动作动词：开始单词训练、生成今日阅读、查看解析。
  - 错误反馈指出下一步，不评价用户本人。
  - 个性化建议必须基于已完成记录；数据不足时透明说明。

## Implementation constraints
- Framework/styling system: Flutter Material 应用；当前 `app/lib/main.dart` 是默认模板，需要后续 UI 实现替换。
- Design-token constraints: 首版使用系统字体和 Material 基础能力，不新增字体、图表或动画依赖。
- Performance constraints: 首页首屏应轻量；AI 生成和分析状态异步呈现，不能阻塞已有学习内容。
- Compatibility constraints: 移动端优先，桌面端可读性不能退化；AI 不可用时必须降级。
- Test/screenshot expectations:
  - 文档层验证：PRD、IA、文案稿、UI 指南命名一致。
  - UI 实现后验证：首页 10 秒任务清晰度、专注模式隐藏无关导航、单页唯一主 CTA、AI 失败降级、移动端阅读可读性。

## Open questions
- [ ] 是否已有品牌 logo 或命名视觉资产 / owner: product / impact: 可能影响色彩与启动页。
- [ ] 是否要求支持深色模式 / owner: product+engineering / impact: 影响 token 和截图验收。
- [ ] 阅读文章长度和题目数量的首版固定值 / owner: product / impact: 影响阅读页密度和进度设计。
