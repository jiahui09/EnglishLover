# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-13
- Primary product surfaces: EnglishLover 在线英语学习平台 Web 端；今日学习首页、单词记忆、阅读练习、受控笔友写信、今日成果记录。
- Evidence reviewed: `README.md`, `AGENTS.md`, `docs/asset-baseline-investigation-report.md`, `docs/phase-6-round-1-web-foundation-delivery.md`, `docs/phase-6-round-2-ui-and-api-readiness.md`, `docs/backend-interface-delivery-test-report.md`, `front/src/`, `backend/`, `tests/specs/`, `docs/online-english-learning-platform-development-process.md`, `docs/phase-1-project-initiation-and-requirements-analysis.md`, `docs/phase-2-requirements-specification-and-scope-control.md`, `docs/phase-3-product-and-user-experience-design.md`, `docs/phase-4-technical-architecture-design.md`.
- Evidence boundary: Current repository evidence now includes front/back source, frozen API contract, generated API types, component library, business components and AI Studio input package. Real business pages are still shell routes; this file does not claim `/today`, `/vocabulary`, `/reading`, `/penpal` or `/results` are implemented user flows.

## Architecture source
- Primary technical architecture document: `docs/phase-4-technical-architecture-design.md`.
- Current implemented architecture baseline: React/Vite/TypeScript frontend, Go + Chi modular monolith backend, PostgreSQL migration, Redis connection layer, OpenAPI 3.1 frozen contract, and generated `front/src/types/api.ts`.
- Architecture boundary: API contract and backend interface delivery are frozen for M3 page generation. Full frontend user flows, real browser-to-API integration, final Docker/Compose deployment and performance verification remain future M4-M6 work.
- Critical architecture review fixes: CRIT-02 still requires complete social-abuse workflow coverage if expanded beyond the frozen MVP endpoints; DES-01 to DES-06 remain product/implementation guardrails for frontend recovery mechanics, capacity-bound performance targets, explicit data dictionary, split learning-session responsibilities, Admin permission-code checks with audit logs, and AI user-control settings/consent APIs.

## Brand
- Personality: 清晰、克制、支持型的英语自学工作台。
- Trust signals: 具体用户场景、真实学习记录、明确完成口径、过程进度可见、明确保存状态、友好中断回流、可解释安全拦截、隐私与通信安全提示。
- Avoid: 抽象用户画像、过度游戏化、开放社区化、营销化文案、大量弹窗、复杂动效、灰色“敬请期待”入口、用虚构数据营造活跃感。

## Product goals
- Goals:
  - 面向本期主用户：国内大学生或同等水平英语自学者，准备四六级、课程考试或基础英语能力提升。
  - 帮助用户在 10—25 分钟内完成明确的今日英语学习任务。
  - 支撑单词“主动回忆 -> 即时反馈 -> 完成反馈 -> 复习排程”闭环。
  - 支撑阅读“选材 -> 阅读 -> 答题 -> 解析依据 -> 记录保存”闭环。
  - 支撑受控笔友“安全档案 -> 写信 -> 草稿保存 -> 安全检查 -> 发送/历史”闭环。
  - 用今日成果记录反馈今日任务完成度、今日学习时长和各模块今日完成情况；首页只展示核心完成度入口，连续学习天数仅在首页问候区弱展示。
- Non-goals:
  - 不按儿童启蒙、退休旅行、高阶商务写作或专业翻译训练定制首版体验。
  - 不建设付费、电商、会员体系。
  - 不建设开放广场、群聊、动态流、实时聊天。
  - 不以排行榜、强竞争和复杂成就系统作为首版核心体验。
  - 不建设公开分享型学习卡片、社交炫耀式成就页或强竞争展示。
  - 不提供自动代写整封信或虚构学习/通信数据的体验。
- Success signals:
  - 用户从首页能看到固定结构的今日任务清单，而不是推荐信息流；任务清单是“系统建议 + 用户选择”，不是强制课表。
  - 单词、阅读、写信的“完成”口径明确，过程中有进度/保存/检查状态，完成后有结果和下一步。
  - 从首页进入单词练习、阅读文章和写信流程不超过 3 层。
  - 保存、提交、审核、发送失败均有明确提示和下一步；多日未学习时提供继续上次/开始新任务。
  - 笔友模块审核失败不丢草稿、不自动改写正文，同时高亮可定位问题并给出解释条；解除关系后不能继续发信。

## Personas and jobs
- Primary personas:
  - P1 大二学生“小林”：准备四级或课程考试，晚上用 15 分钟完成今日任务，最怕入口杂乱、不知道是否完成，以及中断几天后看到积压任务。
  - P2 自学提升者“Alex”：有一定基础但缺少输出场景，希望把阅读词汇迁移到英文写信，最怕草稿丢失或发送失败无解释。
  - P3 内容维护/测试人员：验证文章、题目、解析、安全规则和举报流程，最怕状态不可追踪。
- User jobs:
  - 今天完成一轮单词复习，并在过程中看到 15/30 等进度，完成后看到完成数、正确数、困难词和下次复习提示。
  - 完成一篇适合自己的阅读，并看到正确率、解析依据、生词处理入口和记录保存状态。
  - 写并发送一封英文信，过程中持续看到自动保存状态，安全检查可解释，发送成功进入通信历史。
  - 查看今日任务完成度、今日学习时长和各模块今日完成情况，且数据来自真实行为；连续学习天数只作为首页轻量激励。
- Key contexts of use:
  - 桌面、平板和移动浏览器中的碎片化自学场景。
  - 常见时间段是晚间、午休或通勤后的短学习时段。
  - 用户心态是“尽快完成今天该做的事”，不是浏览内容流。
  - 外部 AI 或审核能力可能不可用，因此关键流程必须可降级。

## Information architecture
- Primary navigation: 今日学习、单词、阅读、写信、记录。
- Core routes/screens:
  - 今日学习首页：固定任务清单、今日任务完成度入口、最近进度或提醒，以及首页弱展示的连续学习天数。
  - 单词：今日复习会话、单词库、单词详情、单词练习、单词结果。
  - 阅读列表、阅读详情、阅读答题与结果。
  - 笔友安全档案、收件箱/通信历史、写信编辑页内安全检查状态。
  - 今日成果：今日任务完成度、今日学习时长、各模块今日完成情况。
- Content hierarchy:
  - 当前任务和完成口径。
  - 首页顶部问候与弱激励：日期、问候语、连续学习天数。
  - 三个固定任务槽位：单词任务、阅读任务、写信任务。
  - 主学习内容或主操作。
  - 进度、保存状态、审核状态和反馈。
  - 次级辅助信息。
  - 弱提示和通知中心。

## Design principles
- Principle 1: 首页是“固定任务槽位 + 数据驱动状态”的今日任务清单，不是动态推荐流或内容信息流；任务清单是系统建议加用户选择，不是强制课表。
- Principle 2: 核心学习流程页面层级控制在 3 层以内。
- Principle 3: 每条核心路径必须定义完成终点、过程进度、完成反馈和下一步入口；首页“开始复习”必须直达今日复习会话。
- Principle 4: 学习中减少干扰，非紧急提示优先收纳到通知中心或页面内弱提示。
- Principle 5: 所有关键操作都要有明确状态反馈，避免静默失败。
- Principle 6: 写信体验必须优先保证安全、权限、草稿保护、页内安全检查、正文高亮拦截、解释条和可解释审核，不把发送前检查做成独立跳转页。
- Principle 7: 可扩展只允许体现在数据字段、接口和组件结构上，首版界面不展示不可用的预留入口。
- Principle 8: 未来体验增强必须先证明不破坏任务导向；今日成果仪式感、学习卡片、关联阅读等只能作为后续可选扩展，不进入 MVP 主路径。
- Principle 9: 首页“今日概览”只做轻量入口，不平铺今日学习时长和各模块完成列表；今日成果页才承载详细完成结果，未发送草稿不作为成果勾选项。
- Principle 10: 阅读重点词辅助 MVP 默认采用内联轻提示；侧栏和折叠面板只作为后续增强或 A/B 测试方案。
- Tradeoffs:
  - 优先交付稳定学习闭环，而不是复杂社区、复杂推荐或重型数据看板。
  - 优先清晰直接的文案，而不是营销化、拟人化或过度包装。
  - AI 能力作为增强，不作为核心流程的唯一依赖。

## Visual language
- Color: 使用温和中性色作为基础；主色只用于主按钮、当前导航和关键行动；成功/警告/错误/信息色必须配合文字或图标说明，不能只靠颜色表达。
- Typography: 单一清晰字体体系；正文行高适中；长文本左对齐；英文阅读正文保持舒适行宽。
- Spacing/layout rhythm: 使用稳定间距节奏；同类卡片间距一致；学习页降低信息密度。
- Shape/radius/elevation: 卡片和输入框可用轻微圆角与细边框；阴影克制，不制造装饰噪声。
- Motion: 只使用轻量状态过渡；阅读、测验和写信中避免复杂动画；不得引入阻塞 FCP/LCP 的大体积动画库；使用 `prefers-reduced-motion: reduce` 支持减少动态效果偏好。
- Imagery/iconography: 图标辅助文字，不替代文字；首版不依赖大面积装饰图片。
- Visual state mapping:
  - 加载中：保留页面结构的静态骨架屏或短文案，避免整页白屏和复杂循环动画。
  - 空状态：说明为空原因并提供下一步，例如开始复习、清空筛选、查看默认短文或写一封信。
  - 保存失败：在编辑器附近使用持久错误条或状态栏，提供重试和本地暂存说明，不用短暂 Toast 替代。
  - 未保存退出：使用确认对话框，主按钮优先“留在页面/重试保存”，危险按钮为“仍然离开”。
  - 安全检查失败：写信编辑页内阻断提示条 + 正文高亮 + 重新检查 + 安全指南入口，不得用 `alert()`、跳页或清空正文。
  - 语言建议：低强度信息条或编辑器底部提示，不阻断发送，不使用安全拦截视觉样式。
  - 系统错误：404、403、500、离线等必须有系统错误页，提供重试、返回今日学习或返回上一页。

## Components
- Existing components to reuse: 当前已核验到 `front/src/components/` 组件库，包括 `components/ui` 基础组件、`components/feedback` 反馈状态组件、`components/data-display` 数据展示组件和 `components/business` 业务组件；M3 页面生成必须优先复用这些组件和 `front/src/docs/ai-context/COMPONENT_CATALOG.md` 中的组件 API。
- New/changed components:
  - `AppShell` 应用框架。
  - `PrimaryNav` 主导航。
  - `TaskActionCard` 首页固定任务槽位。
  - `TodayReviewSession` 今日复习会话。
  - `RecoveryPrompt` 中断回流提示。
  - `ProgressIndicator` 过程进度指示。
  - `ProgressSummary` 进度概览。
  - `LearningCard` 学习卡片。
  - `PracticeQuestion` 练习题。
  - `CompletionSummary` 完成反馈。
  - `FeedbackPanel` 反馈面板。
  - `EmptyState` 空状态。
  - `ErrorState` 错误状态。
  - `SystemErrorPage` 系统错误页。
  - `SaveStatus` 保存状态。
  - `SafetyNotice` 安全提示。
  - `SafetyCheckStatus` 写信编辑页内安全检查状态。
  - `SafetyHighlight` 安全拦截正文高亮。
  - `SafetyGuideLink` 安全与隐私指南入口。
  - `LetterEditor` 信件编辑器。
  - `NotificationCenter` 通知中心。
- Variants and states:
  - 默认、加载、空、错误、成功、禁用、选中、处理中、保存中、未保存、进度中、回流提示、审核中、审核拦截、审核超时、已发送。
- Token/component ownership:
  - 全局设计 token 应管理颜色、字号、间距、圆角、焦点、状态色。
  - 组件状态应统一，不在各模块重复散落实现。
- Component composition rules:
  - `TaskActionCard` 是“统一容器 + 模块内容插槽”组件：容器层只负责默认、加载、空、错误等通用状态；单词、阅读、写信内容插槽分别呈现待复习词数/文章标题与进度/未读来信或草稿状态，不能把不同任务强行压成同一种完成文案。
  - `SafetyNotice` 必须定义触发与消失逻辑：普通提示可手动关闭且不阻断；阻断提示由“检查并发送”触发，必须联动正文高亮或问题类型说明，不可直接关闭，直到用户修改并重新检查通过后自动消失。
  - `LetterEditor` 必须包含或紧邻 `SaveStatus`；保存中、已保存、保存失败应作为编辑器内固定状态栏或标题区状态展示，不能与正文输入区视觉脱节。
  - 页面模板必须明确组件组合：今日任务模板使用轻量 `ProgressSummary` + `TaskActionCard` + `RecoveryPrompt`；专注学习模板使用 `ProgressIndicator` + `PracticeQuestion` 或 `LetterEditor` + `FeedbackPanel`；页内安全检查模板使用 `LetterEditor` + `SafetyCheckStatus` + `SafetyNotice` + `SafetyHighlight`。
  - `NotificationCenter` 是 P1 / 可选组件；若 MVP 暂不实现，首页“最近进度或提醒”必须保留最近一条关键弱提示，并能跳转到对应模块或问题位置，覆盖草稿保存失败、关系状态变化、网络离线/恢复和回流提醒等最低出口。
- Future-only extension points:
  - `RelatedReadingSlot`：单词详情页可在组件和数据结构中预留“关联阅读”接入点，但 MVP 不展示空入口、灰色入口或“敬请期待”。
  - `LocalAchievementCard`：今日成果页未来可探索本地保存型学习卡片，但 MVP 不提供公开分享、社区发布或社交炫耀入口。

## Accessibility
- Target standard: 以 WCAG 2.1 AA 意图作为首版设计目标。
- Keyboard/focus behavior: 主要按钮、导航、表单、答题选项和写信编辑流程可键盘访问；焦点状态清晰可见。
- Contrast/readability: 正文、按钮、错误提示和学习反馈保持足够对比度；避免浅灰承载关键信息。
- Screen-reader semantics: 使用语义化标题、列表、按钮、表单标签和状态提示；错误提示靠近对应字段。
- Reduced motion and sensory considerations: 支持减少动态效果；不使用闪烁或持续吸引注意力的动画。

## Responsive behavior
- Supported breakpoints/devices: 桌面、平板和主流移动浏览器；不建设独立移动 App。
- Layout adaptations:
  - 桌面端：首页可多列任务卡；阅读页默认仍采用正文内联轻提示，辅助侧栏仅作为后续增强。
  - 平板端：两列或单列自适应。
  - 移动端：单列布局，底部操作不遮挡正文、答题选项或写信输入框。
- Touch/hover differences: 不能依赖 hover 才显示关键操作；触控按钮需要足够点击区域。

## Interaction states
- Loading: 保留页面结构，可用骨架屏或简洁文案，避免整页白屏。
- Empty: 说明为空原因，并提供下一步行动，如“开始复习”“选择文章”“创建安全档案”。
- Error: 说明发生了什么、可能原因和下一步，如重试、检查网络或返回入口。
- Success: 说明完成结果，并提供下一步入口。
- Disabled: 说明不可用原因，例如未建立关系不能发信。
- Offline/slow network: 保留用户输入和已提交结果；在线变离线时显示非阻断提示并切换本地暂存/稍后同步；离线恢复在线时提示可重试同步或显示自动重试结果；外部接口必须按场景超时降级，不能无限等待。
- System errors:
  - 404：说明页面不存在或已移动，提供返回今日学习/返回上一页。
  - 403：说明当前无法访问，提供返回首页/查看关系状态，不暴露他人数据。
  - 500：说明服务暂时不可用，提供重试/返回今日学习。
  - 离线：说明网络不可用且已尽量保留当前内容，提供重试/查看已保存内容。
- Completion:
  - 单词完成：从首页直达今日复习会话，本轮目标题目全部提交；过程中显示 15/30 等进度，完成后显示完成数、正确数、困难词、下次复习提示。
  - 阅读完成：文章阅读并提交配置题目；显示正确率、解析依据和保存状态。
  - 写信完成：安全检查通过并写入发送记录/通信历史；写作中显示“已自动保存/正在保存/保存失败”；已读和回信不作为写信完成条件。
  - 今日成果完成项：只展示真实完成的单词、阅读和已发送信件；已保存但未发送的草稿只能在首页写信任务卡或写信模块入口提示，不作为成果勾选项。
- Recovery:
  - 今日任务：错过任务后提供“继续上次”和“开始新任务”，不机械累加历史任务。
  - 单词测验：区分“继续上次练习”和“重新开始本轮”；主动放弃不计完成。
  - 阅读：默认继续上次位置，可从头阅读；只打开文章不计完成。
  - 写信：草稿自动保存，刷新后默认恢复到最后保存或本地暂存内容；安全失败、网络失败、语言检查失败都不能丢稿。
- Safety check:
  - 编辑中 -> 草稿已保存 -> 安全检查中 -> 通过发送 / 拦截修改 / 超时降级。
  - 发送前检查是写信编辑页内状态/模态，不跳离编辑上下文；拦截必须同时提供正文高亮和解释条；可定位内容必须高亮，不可定位内容必须说明类型。
  - 语言建议与安全检查必须视觉区分：语言建议用低强度信息条或编辑器底部提示，不阻断发送；安全拦截用阻断提示并要求重新检查通过。
  - 写信页必须提供“安全与隐私指南”入口，说明哪些内容可能被拦截。
  - MVP 不默认进入人工审核；如后续引入，必须显示预计时延和可撤回/继续编辑入口。

## Content voice
- Tone: 清楚、鼓励、直接、低压力。
- Terminology:
  - 推荐使用“今日学习”“开始复习”“继续阅读”“写一封信”“查看回信”“草稿已保存”“检查并发送”。
  - 避免“学习宇宙”“能量挑战”“灵感岛”等营销化或抽象表达。
- Microcopy rules:
  - 按钮优先使用动词。
  - 错误提示采用“发生了什么 -> 可能原因 -> 下一步操作”。
  - 安全提示不责备用户，重点说明为什么被拦截、哪里需要改、如何修改。
  - 回流提示使用“欢迎回来”等低压力文案，不用“落后”“失败”等责备词。
  - 隐私提示要具体说明哪些信息可见或不会被要求。
  - 不使用“敬请期待”占位按钮或灰色不可用入口干扰用户。

## Implementation constraints
- Framework/styling system: 当前已核验前端为 React/Vite/TypeScript + Tailwind CSS 4 + CSS 设计令牌；后端为 Go + Chi + PostgreSQL，OpenAPI 3.1 契约生成 `front/src/types/api.ts`。M3 页面生成不得引入 Express 假设、临时 DTO、Mock 数据或未冻结接口字段。
- Design-token constraints: 不新增复杂设计系统依赖；优先使用项目现有样式体系或轻量 token。
- Performance constraints:
  - 核心页面 FCP 目标 1.5 秒内，LCP 目标 2.5 秒内。
  - 点击和输入视觉反馈应低于 100ms。
  - 异步操作超过 300ms 必须显示处理中状态；请求超过 1 秒应提供更明确的等待说明或骨架屏。
  - 非首屏图片、复杂动效、AI 辅助和第三方脚本不得阻塞核心学习路径。
  - 动效必须使用低成本属性和短时过渡；按钮按下态、输入响应和选中态等操作反馈应在 100ms 内出现；普通 UI 状态过渡建议约 150ms；核心学习路径不得依赖超过 300ms 的复杂转场或持续循环动画。
- Compatibility constraints:
  - 支持主流浏览器和响应式浏览。
  - AI/外部审核能力不可用时必须按场景降级：安全检查超时使用本地基础规则或保留草稿暂不发送；语言检查超时不阻断发送；内容推荐超时展示默认内容或手动入口；学习记录统计超时不阻断核心学习入口。
- Test/screenshot expectations:
  - 设计评审应覆盖首页、今日复习会话、单词练习、阅读详情、阅读结果、写信编辑、页内安全检查、今日成果。
  - 后续实现需至少验证单词练习、阅读答题、信件发送三条 E2E 核心闭环。

## Open questions
- [ ] 本期主用户是否确认为“国内大学生/同等水平英语自学者”？/ owner: 产品负责人 / impact: 内容难度、写作主题和任务节奏。
- [ ] 首版账号策略：匿名、本地、测试账号还是真实登录？/ owner: 产品负责人 / impact: 今日成果记录、笔友权限和隐私隔离。
- [ ] 是否有指定 Logo、主色、字体或学校模板？/ owner: 设计负责人 / impact: 高保真视觉稿。
- [ ] 首版单词主动回忆题型最终采用选择题、卡片翻转、拼写题还是听写？/ owner: 产品负责人 / impact: 单词练习交互。
- [ ] 阅读材料来源、难度分级和题目解析依据如何确认？/ owner: 内容负责人 / impact: 阅读列表和详情页。
- [ ] 笔友关系采用测试账号、邀请关系还是真实小范围用户？/ owner: 产品负责人 / impact: 收件箱、关系状态和发信权限。
- [ ] 内容安全审核采用本地规则、服务端规则还是外部服务？是否存在人工审核？可定位高亮范围是什么？/ owner: 技术负责人 / impact: 写信编辑页内安全检查、等待状态和错误降级。
- [ ] 今日任务默认数量、用户可调范围和错过任务后的重新生成规则是什么？/ owner: 产品负责人 / impact: 首页任务清单、回流体验和排程。
- [ ] “安全与隐私指南”由谁维护，首版包含哪些拦截示例？/ owner: 产品负责人 / impact: 写信安全教育和规则透明。
- [ ] 是否接入 AI 语言检查？/ owner: 产品负责人 / impact: 写作支架、隐私告知和外部接口降级。
- [ ] 今日成果后续是否需要本地学习卡片或轻量仪式感？/ owner: 产品负责人 / impact: 今日成果增强与隐私边界。
- [ ] 是否具备词汇与阅读文章的可靠关联索引？/ owner: 技术负责人 / impact: 单词详情的关联阅读扩展。
