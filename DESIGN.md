# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-18
- Primary product surfaces: 今日学习、单词训练、阅读训练、教练建议；单词背诵与阅读理解开始后进入专注模式；学习画像摘要首版并入教练建议页。
- Evidence reviewed:
  - `docs/ai-coach-prd.md`: 产品定位、P0/P1/P2 范围、学习闭环与验收标准。
  - `docs/ai-coach-information-architecture.md`: 页面结构、主路径、状态和移动端导航。
  - `docs/ai-coach-core-page-copy-and-interactions.md`: 核心页面文案、交互状态和边界提示。
  - `docs/ai-coach-ui-design-guidelines.md`: UI 视觉方向、组件规则、专注模式和验收清单。
  - `docs/ai-coach-architecture-design.md`: 整体系统架构、领域边界、AI 降级、数据证据、多平台兼容、性能和质量属性基线。
  - `app/lib/main.dart`、`app/lib/src/app.dart`: 当前 Flutter 应用启动 `EnglishLoverApp`，使用 `ShadApp`、`ELTheme` 与 `ELAppShell`。
  - `app/lib/src/design/el_tokens.dart`、`app/lib/src/design/el_theme.dart`: 已有 EnglishLover 颜色、间距、圆角、阴影和 shadcn_ui 主题 token，当前代码基线已采用 `Oxford Blue` / `Word Ochre` 体系。
  - `app/lib/src/components/`: 已有 `ELButton`、`ELCard`、`ELBadge`、`ELStatChip`、`ELLearningPath`、`ELEmptyState`、`ELSectionHeader` 等基础组件。
  - `app/lib/src/features/`: 已有今日、单词、阅读、教练四个 UI 页面和 mock 学习数据；专注模式隐藏导航仍是后续实现约束。
  - `app/pubspec.yaml`: 当前依赖 Flutter、Cupertino Icons、`shadcn_ui`；未配置项目自定义字体资产、图表库或复杂动画库。

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
  - 用户点击“开始单词训练”或开始阅读生成/进入阅读正文/答题后，界面切换到专注模式。
  - 用户在专注模式中不被底部导航、学习画像摘要、历史统计或无关推荐打断。
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
- Primary navigation: 移动端使用“今日 / 单词 / 阅读 / 教练”四项底部导航；学习画像摘要合并进教练建议页二级内容。
- Core routes/screens:
  - 今日学习：首页和任务枢纽，回答“今天先做什么”。
  - 单词训练：开始后进入单词专注模式，低干扰卡片学习，记录认识 / 模糊 / 不认识。
  - 阅读训练：生成前可说明目标词；生成前、生成中、阅读正文、答题和解析都进入阅读专注模式。
  - 教练建议：表现判断、原因解释、下一步任务。
- Content hierarchy:
  - 首屏优先“今日目标 + 下一步行动”。
  - 学习过程优先当前材料和进度。
  - 专注模式隐藏底部导航和非当前任务入口，只保留返回、进度和当前主行动。
  - 学习画像摘要化，用户主动查看再展开。

## Design principles
- Principle 1: 以用户为中心的信息高效。只展示能帮助用户立刻行动的信息，删除重复解释和泛泛鼓励。
- Principle 2: 格式塔分组。用邻近性、相似性、连续性和封闭性组织任务、正文、题目和反馈。
- Principle 3: 极简主义与扁平化设计取舍。用留白、纯排版和清晰色块降低认知负荷，但保留必要层级与可点击意符。
- Principle 4: 提高专注力。单词背诵和阅读理解开始后进入专注模式，弱化导航、隐藏次级入口、避免弹窗和竞争按钮。
- Principle 5: 包容性设计优先。强光、单手、低视力、低注意力和网络慢场景必须默认可用。
- Principle 6: 情感化设计克制。界面应安静、顺滑、有记忆点，但不使用夸张庆祝、焦虑刺激或排行榜。
- Principle 7: 原子设计一致。token -> atom -> molecule -> organism -> template -> page 逐层构建，不在页面中重造样式。
- Tradeoffs:
  - 最终风格是“极简考研学习界面”：以极简主义为主体验策略，以 shadcn_ui 建立组件质感，以 Flutter Material 提供导航与主题基础设施，以Oxford Blue + Study Paper + Word Ochre建立考研学习的专注感。
  - 明确不走纯扁平化设计、新拟物化软 UI、数据看板或营销页路线；新拟物化只可作为温和触觉提示，不能承载核心功能。
  - 宁可少展示数据，也不要让用户在学习前先读报表。
  - 宁可复用现有 shadcn_ui / Material 基础组件、Geist / system fallback 和 `ELTokens`，也不为首版引入项目字体资产、图表、复杂动画依赖或新的绿色品牌体系。

## Visual language
- Color:
  - 最终色彩策略：以沉稳靛蓝为全局主色，以暖纸张/深石板承载长时间阅读，以暖橙标记词汇重点，以绿色/柔红分别表达掌握与错误；禁止绿色作为品牌主色。
  - 浅色模式 token：

    | Token | Hex | 用途 |
    |---|---:|---|
    | Background / Study Paper | `#F6F1E8` | 全局暖纸张背景，降低纯白刺眼感 |
    | Surface / Warm Card | `#FFFCF6` | 卡片、阅读正文、输入区域 |
    | Primary / Oxford Blue | `#334E7E` | 主按钮、当前进度、选中导航、品牌标识 |
    | Primary Soft | `#E8EEF8` | 当前任务提示、选中浅底、教练建议浅表面 |
    | Success | `#20C997` | 正确、已掌握、完成反馈 |
    | Word / Warning | `#94551F` | 目标词、薄弱词、待复习提醒 |
    | Error | `#A34A3F` | 错误、AI 降级、不可恢复风险 |
    | Text | `#24252B` | 标题、正文和关键文本 |
    | Muted Text | `#6B6870` | 辅助说明、时间、次级标签 |
    | Border / Desk Line | `#E5D8C6` | 分割线、卡片边界和禁用边框 |

  - 深色模式 token：

    | Token | Hex | 用途 |
    |---|---:|---|
    | Background | `#0F172A` | 夜间备考背景，避免纯黑造成强烈瞳孔刺激 |
    | Surface | `#111827` | 普通卡片和阅读容器 |
    | Elevated Surface | `#1E293B` | 二级信息块、题目卡和弱背景差 |
    | Primary | `#8BA4F9` | 深色模式主按钮、导航选中、进度 |
    | Primary Soft | `#1E2A44` | 深色模式选中浅底和提示块 |
    | Success | `#34D399` | 正确、已掌握、完成反馈 |
    | Word / Warning | `#E0A34B` | 目标词、薄弱词、待复习提醒 |
    | Error | `#F87171` | 错误、AI 降级、不可恢复风险 |
    | Text | `#E2E8F0` | 标题、正文和关键文本 |
    | Muted Text | `#94A3B8` | 辅助说明、时间、次级标签 |
    | Border | `#334155` | 分割线、卡片边界和禁用边框 |

  - 色彩比例：普通学习流约 70% 中性背景/表面、20% 文本与边界、8% Oxford Blue、2% Word Ochre / Success / Error；专注模式进一步降低强调色面积。
  - 配色判断：考研学习需要稳定、可信、耐看；主色采用 Oxford Blue 替代绿色，避免医疗感、办公感和大面积深色块的压迫感；深色模式跟随系统主题，服务夜间备考。
- Typography:
  - 标题使用 shadcn_ui Geist / system sans fallback，22–28sp，中高字重，句子短。
  - 正文使用 Geist / system sans fallback，16–18sp，阅读正文行高 1.55–1.7。
  - 数据、标签和进度使用 12–14sp，避免喧宾夺主。
- Spacing/layout rhythm:
  - 移动端页面左右 20px 安全边距，卡片内边距 16–20px。
  - 以 8px 栅格控制间距；学习主内容和主按钮之间保持稳定距离。
  - 阅读正文使用较宽行距和段间距，避免密集压迫。
- Shape/radius/elevation:
  - 卡片圆角 18–24px；按钮圆角 14–16px。
  - 只允许 Level 1 / Level 2 两档轻量 elevation，优先用背景差和边界线分层。
  - 不使用大面积新拟物内外阴影或低对比软 UI 承载核心功能。
- Motion:
  - 只保留状态切换、按钮反馈、生成中进度的轻量动效。
  - 支持减少动态效果；不使用循环氛围动画。
- Imagery/iconography:
  - 不依赖插画；图标只用于状态识别。
  - 签名元素为“学习闭环轨迹”：在首页和结果页用简洁线性路径表达单词、阅读、解析、建议的连接。

## Components
- Existing components to reuse: `shadcn_ui` 基础组件、`ELButton`、`ELCard`、`ELBadge`、`ELStatChip`、`ELLearningPath`、`ELEmptyState`、`ELSectionHeader`、`ELAppShell`、`ELTokens`、`ELTheme`。
- Component layering: `shadcn_ui` 负责按钮、卡片、徽标、进度、导航等基础质量；`EL*` 组件负责 EnglishLover 的业务语义、token 固化、可访问标签和页面一致性。页面不得直接绕过 `EL*` 重造同类样式，除非先确认现有组件无法表达。
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
- Token/component ownership: 颜色、间距、圆角、文字层级应优先沉淀到 `ELTokens` / `ELTheme`，再通过 atom / molecule / organism / template / page 管理；不要在页面内散落硬编码。

## Accessibility
- Target standard: 首版按 WCAG 2.1 AA 方向设计；移动端触控和可读性优先。
- Keyboard/focus behavior: 所有按钮、卡片行动和选项应有可见焦点；阅读与答题状态按自然顺序聚焦。
- Contrast/readability: 正文、主按钮、导航选中态和提醒色均按 AA 对比设计；提醒色不单独承担语义，必须配合文字标签。
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
- Framework/styling system: Flutter + `shadcn_ui` 应用；当前入口为 `EnglishLoverApp`，主题由 `ELTheme` / `ELTokens` 管理，页面通过 `ELAppShell` 组织。
- Design-token constraints: 优先复用现有 EnglishLover token、shadcn_ui 基础组件和 Material 导航能力；设计主色统一为 `Oxford Blue`，词汇重点统一为 `Word Ochre`；当前代码已采用浅/深双模式 token 基线，后续仅在本设计约束内扩展，不新增项目字体资产、图表库、复杂动画依赖或页面级散落颜色。
- Performance constraints: 首页首屏应轻量；AI 生成和分析状态异步呈现，不能阻塞已有学习内容。
- Compatibility constraints: 移动端优先，桌面端可读性不能退化；AI 不可用时必须降级。
- Test/screenshot expectations:
  - 文档层验证：PRD、IA、文案稿、UI 指南命名一致。
  - UI 实现后验证：首页 10 秒任务清晰度、专注模式隐藏无关导航、单页唯一主 CTA、AI 失败降级、移动端阅读可读性。
  - 哲学映射验证：格式塔分组、极简主行动、轻量 Material 层级、考研专注配色、包容性场景和原子组件层级均可在界面中找到对应实现。

## Open questions
- [ ] 是否已有品牌 logo 或命名视觉资产 / owner: product / impact: 可能影响色彩与启动页。
- [ ] 阅读文章长度和题目数量的首版固定值 / owner: product / impact: 影响阅读页密度和进度设计。
