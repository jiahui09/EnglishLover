# 第六阶段 M3 页面生成前准备审核记录

> 日期：2026-06-13  
> 范围：P0 事实边界同步、P1/G2 业务组件冻结审核、P2/G3 AI 输入包审核  
> 结论：P0-P2 已完成页面生成前准备；可以进入 M3C「AI Studio 一次性生成真实业务页面」。本记录不代表真实业务页面已经生成，也不代表 M4 真实接口联调已经完成。

## 1. 阶段定位

当前仓库处于第六阶段 M3 页面生成前准备收口状态：

| 里程碑 | 状态 | 证据 |
|---|---|---|
| M1 基础工程可运行 | 已完成 | `front/` 工程、壳路由、组件基础和前端 verify |
| M2 接口交付与状态组件齐备 | 已完成 | `backend/openapi/openapi.yaml` 冻结、14/14 operation 契约测试、`front/src/types/api.ts` 自动生成 |
| M3A 业务组件冻结 | 本次审核通过 | `front/src/components/business/` 组件已引用生成 API 类型或派生别名 |
| M3B AI 输入包准备 | 本次审核通过 | `front/src/docs/ai-context/` 大写六件套已齐备 |
| M3C AI Studio 一次性生成页面 | 未开始 | `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 仍为壳路由 |
| M4 真实接口联调 | 未开始 | 尚未建立页面级 API client 和浏览器流程联调报告 |

## 2. P0：事实边界同步结果

已同步当前事实边界，避免页面生成前材料继续引用“源码未恢复 / 接口未冻结”的旧前提。

| 文件 | 本次处理 | 当前结论 |
|---|---|---|
| `README.md` | 更新当前状态和下一步建议 | 明确 `front/`、`backend/`、冻结 API 类型和 AI 输入包已存在，业务页面未生成 |
| `docs/README.md` | 更新文档中心事实边界和文档清单 | 明确当前不是纯文档阶段，M3 仍需页面生成审核 |
| `docs/asset-baseline-investigation-report.md` | 重写资产基线 | 明确前后端、契约、组件、AI 上下文已具备，真实业务页/M4/M5/M6 未完成 |
| `DESIGN.md` | 更新证据边界、架构事实、组件事实和实现约束 | 明确已核验 React/Vite/TypeScript 前端、Go/Chi 后端和组件库 |
| `front/README.md` | 更新前端工程状态 | 明确当前为 M3 页面生成前准备，不再写 `api.ts` 占位 |
| `front/src/lib/routes.ts` | 更新壳路由状态文案 | 统一为等待 M3C 页面生成 |
| `front/src/pages/HomePage.tsx` | 更新首页总览文案 | 说明组件、冻结类型和 AI 输入包已具备 |
| `front/src/pages/ShellPlaceholderPage.tsx` | 更新壳页准入说明 | 明确需通过 G2/G3 后再生成 |
| `front/src/features/README.md` | 更新 feature 目录边界 | 明确 M4 才接真实接口，禁止 Mock/DTO/fixture |
| `front/src/docs/ai-context/API_TYPES_REFERENCE.md`、`api-type-index.md` | 更新阶段说明 | 明确处于 M3 页面生成前准备阶段 |

## 3. P1 / G2：业务组件冻结审核

### 3.1 审核对象

审核对象为 `front/src/components/business/` 下的业务组件和类型派生层：

- `TaskActionCard`
- `TodayTaskList`
- `PracticeQuestion`
- `VocabularyReviewPanel`
- `ReviewResultFeedback`
- `WordStatusBadge`
- `LearningProgressSummary`
- `DailyGoalProgress`
- `ModuleSummaryGrid`
- `ReadingProgressHeader`
- `ReadingArticlePanel`
- `ReadingQuestionPanel`
- `ReadingWordAction`
- `PenpalThreadList`
- `LetterEditor`
- `SafetyNotice`
- `SafetyCheckStatus`
- `SafetyHighlight`
- `LetterTimeline`
- `ResultSummary`
- `RecentActivityList`
- `front/src/components/business/api-types.ts`

### 3.2 类型来源审核

| 检查项 | 结果 | 证据 |
|---|---|---|
| 业务组件引用自动生成类型或派生别名 | 通过 | 多数组件从 `./api-types` 引入 `DailySummary`、`WordSummary`、`ReviewSubmitResult`、`ReadingArticleDetail`、`PenpalThreadSummary` 等 |
| API 派生层来源单一 | 通过 | `front/src/components/business/api-types.ts` 从 `@/types/api` 的 `components['schemas']` 派生别名 |
| `front/src/types/api.ts` 自动生成标记 | 通过 | 文件头包含 `AUTO-GENERATED FROM backend/openapi/openapi.yaml` 和 `Contract version: 1.0.0` |
| OpenAPI 契约冻结 | 通过 | `backend/openapi/openapi.yaml` 中 `info.version: 1.0.0`，`info.x-contract-frozen: true` |
| 重复 DTO / 手写业务枚举 | 未发现阻断项 | 当前业务组件状态型局部类型只用于 UI 状态或页面交互选项，不替代后端 DTO、错误码、分页或业务枚举 |

### 3.3 组件目录和反模式审核

| 检查项 | 结果 | 证据 |
|---|---|---|
| 业务组件已纳入 AI 可消费 catalog | 通过 | `front/src/docs/ai-context/COMPONENT_CATALOG.md` 覆盖基础、反馈、数据展示和业务组件 |
| 组件状态覆盖已记录 | 通过 | `front/src/docs/ai-context/component-state-coverage.md` 覆盖业务组件主要状态 |
| 页面/feature 层禁止自绘基础组件 | 通过 | `front/scripts/check-component-compliance.mjs` 扫描 `src/pages`、`src/features` 中的 button/input/textarea/select/dialog 反模式 |
| 组件不请求接口 | 通过 | `front/src/components/business/` 未发现 `fetch` 或 `axios` |
| 组件不生成业务数据源 | 通过 | 业务数据边界脚本禁止 `src/data`、`src/mocks`、`src/fixtures` 和 Mock/fixture 关键词 |

### 3.4 G2 结论

G2 业务组件冻结门通过。当前业务组件可作为 M3C 页面生成的组件货架使用。页面生成时必须：

1. 优先复用 `COMPONENT_CATALOG.md` 中列出的组件；
2. 从 `front/src/types/api.ts` 或 `front/src/components/business/api-types.ts` 派生类型；
3. 不在页面层补写 DTO、枚举、错误码、分页结构或接口字段；
4. 不让业务组件发起接口请求或创建运行时数据源。

## 4. P2 / G3：AI 输入包审核

### 4.1 指定输入包

M3C 页面生成只使用以下大写六件套作为正式输入包：

| 文件 | 行数 | SHA-256 | 用途 |
|---|---:|---|---|
| `front/src/docs/ai-context/SYSTEM_INSTRUCTION.md` | 14 | `70ba76c8d25e566bc715a8b7e1091996f7944484bbf86943b4a733b056d0db9b` | 全局边界和禁止事项 |
| `front/src/docs/ai-context/COMPONENT_CATALOG.md` | 53 | `1060502a5b461e0e95e5ac9dcf258b6399fd80dc3797623fb682f8c0285dad52` | 唯一组件消费清单 |
| `front/src/docs/ai-context/API_TYPES_REFERENCE.md` | 41 | `78d92e016858ee38bb511949fc721bdae591f44f66e50e537f3514e75918a61f` | 冻结接口类型索引 |
| `front/src/docs/ai-context/PAGE_COMPONENT_MAP.md` | 18 | `2fc83ec0a450299b6e0759d78b9028fc84c3d69059d22434cd77ecd799360d7b` | 页面与组件装配关系 |
| `front/src/docs/ai-context/DESIGN_TOKENS_QUICKREF.md` | 28 | `8b3f29ad0ba385d88321d628a04fb15db45735d35531c47494a58b9a6661f26a` | 设计令牌和样式边界 |
| `front/src/docs/ai-context/API_FIELD_EXAMPLES.md` | 39 | `ad6e40c2a7ac293e986bcf59600274d845bb98d9aa88b21c269c5da037679e9a` | 字段形态参考，不是运行时数据源 |

说明：同目录下的小写摘要文件属于历史/兼容说明或转跳摘要，M3C 正式输入应以上表大写六件套为准，避免上下文重复或版本混淆。

### 4.2 输入包内容审核

| 检查项 | 结果 | 证据 |
|---|---|---|
| System Instruction 覆盖禁止 Mock、禁止猜字段、禁止重复实现组件 | 通过 | `SYSTEM_INSTRUCTION.md` 第 5-12 行列出核心生成规则 |
| 页面范围明确 | 通过 | `PAGE_COMPONENT_MAP.md` 覆盖 `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 和 `/components` |
| 页面组件映射明确 | 通过 | 每个目标路由均列出必用/优先组件和类型来源 |
| API 类型来源明确 | 通过 | `API_TYPES_REFERENCE.md` 指向 `front/src/types/api.ts` 和契约版本 `1.0.0` |
| 字段样例不是 Mock 数据源 | 通过 | `API_FIELD_EXAMPLES.md` 明确“不是页面数据源，也不得被复制成运行时数据” |
| 样式边界明确 | 通过 | `DESIGN_TOKENS_QUICKREF.md` 禁止硬编码颜色、任意尺寸和内联 style |
| 敏感信息 | 未发现 | 输入包只包含组件/API/字段/样式说明，不包含密钥、真实用户数据或生产地址凭据 |

### 4.3 G3 结论

G3 AI 输入包门通过。可以把大写六件套作为 AI Studio M3C 的输入材料。生成时必须遵守：

1. 一次性生成 `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 页面；
2. 不创建 `src/data`、`src/mocks`、`src/fixtures`；
3. 不复制 `API_FIELD_EXAMPLES.md` 中的字段形态为运行时数据；
4. 不引入未冻结字段、枚举、错误码、分页结构或认证结构；
5. 不绕过现有组件库重写基础/反馈/数据展示/业务组件；
6. 生成后立即执行 `cd front && npm run verify`。

## 5. 页面生成前准入清单

| 准入项 | 状态 |
|---|---|
| P0 事实边界文档同步 | 通过 |
| G2 业务组件冻结审核 | 通过 |
| G3 AI 输入包审核 | 通过 |
| `front/src/types/api.ts` 自动生成且版本匹配 OpenAPI | 通过 |
| 业务组件未发现接口调用 | 通过 |
| `front/src/data`、`front/src/mocks`、`front/src/fixtures` 不存在 | 通过 |
| 目标业务页面仍未提前生成 | 通过 |
| 生成后验证命令已明确 | 通过：`cd front && npm run verify` |

## 6. 仍需注意的非阻断事项

- `front/src/pages/ComponentsPage.tsx` 中存在字段形态演示对象，用于组件示例页和 TypeScript 形态校验；它们不应被复制到业务页面，也不得作为运行时 Mock 数据。
- `SafetyCheckStatus`、`SafetyNotice`、`ReadingQuestionPanel` 等组件包含 UI 状态或交互选项类型，这些不是后端 DTO；若后续需要后端安全审核状态、阅读题结构或题目答案结构，必须走契约变更。
- M3C 结束前不得声明真实业务页面可用；M4 结束前不得声明真实接口联调完成；M5/M6 结束前不得声明 E2E/a11y/部署/性能已达标。

## 7. 下一步

进入 M3C：使用本记录第 4.1 节的大写六件套输入包，按 `PAGE_COMPONENT_MAP.md` 一次性生成真实业务页面。生成完成后先运行：

```bash
cd front && npm run verify
```

若验证失败，应按错误类型回到组件库、页面生成提示或契约变更评审，不得用 Mock 数据或手写 DTO 绕过失败。
