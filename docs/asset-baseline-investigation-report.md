# EnglishLover 现有资产基线调查报告

> 文档用途：支撑阶段推进、技术选型复核和页面生成前准入判断，避免把规划内容误写成已实现事实。  
> 调查日期：2026-06-13  
> 调查范围：仓库根目录、`front/`、`backend/`、`docs/`、`tests/specs/`、`README.md`、`DESIGN.md`、阶段文档和验证脚本。  
> 事实边界：本报告基于当前仓库快照和本地验证命令。当前已核验到前端工程、后端工程、冻结 OpenAPI 契约、自动生成 API 类型、组件库、业务组件、AI Studio 页面生成前上下文包和可执行规约门禁；真实业务页面、端到端联调、正式部署和性能报告尚未完成。

---

## 1. 结论概述

当前仓库已经从“仅文档阶段”推进到第六阶段 M3 页面生成前准备状态：

```text
M1 基础工程可运行：已完成
M2 接口交付与状态组件齐备：已完成
M3 页面生成前准备：P0/P1/P2 审核中，真实业务页面尚未生成
M4 真实接口联调：未开始
M5 体验与测试达标：未开始
M6 部署与文档闭环：未开始
```

关键事实：

- `front/` 已存在 React/Vite/TypeScript 前端工程；
- `backend/` 已存在 Go + Chi 模块化单体后端工程；
- `backend/openapi/openapi.yaml` 已冻结为契约版本 `1.0.0`，并作为 `front/src/types/api.ts` 的唯一生成来源；
- 前端已具备基础组件、反馈/状态组件、数据展示组件和业务组件；
- `front/src/docs/ai-context/` 已具备第三轮页面生成前上下文包；
- `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 仍是壳路由，不展示真实业务数据，不接真实接口，不使用 Mock 数据；
- 真实部署、性能测试、E2E/a11y 测试和最终验收尚未完成。

---

## 2. 当前仓库资产清单

### 2.1 已核查到的主要资产

| 路径 | 类型 | 当前状态 |
|---|---|---|
| `README.md` | 项目入口文档 | 已记录当前阶段、验证命令和下一步 |
| `DESIGN.md` | 产品与架构 source of truth | 已记录产品体验、组件/API 事实和未完成项 |
| `AGENTS.md` | 协作与工程规范 | 约束项目执行、验证和事实边界 |
| `docs/README.md` | 文档地图 | 已更新为 front/backend 存在后的事实边界 |
| `docs/phase-6-round-1-web-foundation-delivery.md` | M1 交付记录 | 前端基础骨架、壳路由和 P0 组件边界 |
| `docs/phase-6-round-2-ui-and-api-readiness.md` | M2 交付记录 | 组件库、冻结契约和后端接口就绪说明 |
| `docs/backend-interface-delivery-test-report.md` | 后端接口交付报告 | 14 个 operation 契约测试 100% 通过记录 |
| `docs/phase-6-m3-page-generation-readiness-audit.md` | M3 生成前审核记录 | G2/G3 准入结论和输入包清单 |
| `backend/openapi/openapi.yaml` | OpenAPI 3.1 契约 | `info.x-contract-frozen: true`，版本 `1.0.0` |
| `front/src/types/api.ts` | 前端 API 类型 | 由 OpenAPI 自动生成，包含生成标记 |
| `tests/specs/` | Gherkin 可执行规约 | 6 个 feature 文件，参与规约检查 |

### 2.2 前端资产

| 项目 | 调查结果 | 证据路径 | 备注 |
|---|---|---|---|
| 前端框架 | React | `front/package.json` | 依赖包含 `react`、`react-dom` |
| 构建工具 | Vite | `front/package.json`、`front/vite.config.ts` | `npm run build` 执行 `tsc -b && vite build` |
| TypeScript 使用情况 | 已启用 | `front/tsconfig*.json`、`front/src/` | `npm run typecheck` 已纳入 verify |
| 样式方案 | Tailwind CSS 4 + CSS 设计令牌 | `front/src/styles/tokens.css`、`front/src/styles/global.css` | 样式边界脚本限制硬编码颜色和任意值 |
| 页面路由 | 壳路由已建立 | `front/src/App.tsx`、`front/src/lib/routes.ts` | 业务路由仍展示占位页 |
| 基础组件 | 已建立 | `front/src/components/ui/` | Button、Card、Input、Modal、Toast 等 |
| 反馈/状态组件 | 已建立 | `front/src/components/feedback/` | EmptyState、ErrorState、SaveStatus 等 |
| 数据展示组件 | 已建立 | `front/src/components/data-display/` | StatCard、DataList、Timeline 等 |
| 业务组件 | 已建立 | `front/src/components/business/` | 组件 Props 引用自动生成 API 类型或派生别名 |
| API 类型 | 已生成 | `front/src/types/api.ts` | 来源为冻结 OpenAPI 契约 |
| AI 上下文包 | 已建立 | `front/src/docs/ai-context/` | 页面生成前输入材料，不是运行时数据源 |
| 真实业务页面 | 未生成 | `front/src/pages/`、`front/src/features/README.md` | `/today` 等仍为壳路由 |
| 前端自动化检查 | 已建立 | `front/scripts/`、`front/package.json` | typecheck、ESLint、样式边界、组件复用、catalog、无业务数据、build |

### 2.3 后端资产

| 项目 | 调查结果 | 证据路径 | 备注 |
|---|---|---|---|
| 后端框架 | Go + Chi | `backend/go.mod`、`backend/internal/app/router.go` | 模块化单体接口服务 |
| API 契约 | OpenAPI 3.1 | `backend/openapi/openapi.yaml` | 契约版本 `1.0.0`，已冻结 |
| API 路由 | 已实现 14 个 operation | `backend/internal/modules/`、`docs/backend-interface-delivery-test-report.md` | Health、Auth、Word、Review、Reading、Penpal、Analytics |
| 鉴权方案 | Access/Refresh Token Cookie 方案 | `backend/openapi/openapi.yaml`、`backend/internal/modules/auth/` | 契约和测试覆盖登录/刷新/退出/当前用户 |
| 数据库 | PostgreSQL 迁移存在 | `backend/migrations/001_init.sql`、`backend/internal/store/postgres.go` | 当前稳定环境为本地测试环境 |
| 缓存 | Redis 连接预留 | `backend/internal/platform/redis/redis.go` | 核心幂等记录当前以后端报告为准 |
| 契约测试 | 已建立并通过 | `backend/scripts/contract-test.mjs`、`backend/reports/contract-test-result.json` | operation 覆盖率 100% |
| 规约检查 | 已建立并通过 | `backend/scripts/check-executable-specs.mjs` | RTM/Gherkin/OpenAPI 一致性门禁 |
| 类型生成 | 已建立 | `backend/scripts/generate-api-types.mjs` | 生成 `front/src/types/api.ts` |

### 2.4 当前未完成或待验证资产

| 项目 | 当前状态 | 影响 |
|---|---|---|
| 真实业务页面 | 未生成 | 无法声称今日学习、单词、阅读、写信、成果页已可用 |
| 前端 API client | 未进入 M4 | 页面尚未消费真实接口 |
| 端到端联调报告 | 未形成 | 核心闭环尚未以浏览器流程验证 |
| Vitest/RTL/Playwright/a11y smoke | 未纳入当前门禁 | M5 前需补齐 |
| 正式 Docker/Compose 全栈部署验收 | 未完成 | M6 前不能声明可部署交付 |
| 性能测试报告 | 未执行 | 不能声明已达到 FCP/LCP 等目标 |

---

## 3. 代码规模快照

> 统计口径：排除 `node_modules` 和构建产物；用于阶段判断，不代表最终交付规模。

| 指标 | 当前结果 |
|---|---:|
| `front/src` 文件数 | 88 |
| `front/src` TypeScript/TSX 文件数 | 73 |
| `front/src/docs/ai-context` 文件数 | 12 |
| `front/src` 相关源码/文档行数 | 5165 |
| 后端 Go 文件数 | 23 |
| 后端迁移文件数 | 1 |
| 后端 OpenAPI 文件数 | 1 |
| 后端脚本文件数 | 8 |
| 后端 Go/SQL/YAML/MJS/MD 行数 | 4272 |
| `tests/specs` feature 文件数 | 6 |

---

## 4. 技术选型判断

当前不再处于“源码缺失、技术栈未确认”状态。现阶段技术路线已形成阶段性事实：

- 前端：React + Vite + TypeScript + Tailwind CSS 4 + 设计令牌；
- 后端：Go + Chi + PostgreSQL，Redis 连接能力预留；
- 契约：OpenAPI 3.1 冻结契约驱动前端类型生成；
- 质量门禁：后端契约/规约/类型边界检查 + 前端 typecheck/lint/build/边界脚本。

后续不应再讨论“是否恢复 front/backend 源码”作为前置问题。真正的下一步门禁是：

```text
G2 业务组件冻结门
  -> G3 AI 输入包门
  -> M3C AI Studio 一次性生成真实业务页面
  -> 生成后自动合规/类型/构建检查
```

---

## 5. 阶段准入建议

| 优先级 | 行动项 | 完成标准 |
|---|---|---|
| P0 | 同步事实边界文档 | README、docs README、资产基线、DESIGN、front README 不再残留“源码未恢复/接口未冻结”的旧结论 |
| P1 | 完成 G2 业务组件冻结审核 | 业务组件 Props 来源清楚、catalog 覆盖完整、无重复 DTO/枚举、`npm run verify` 通过 |
| P2 | 完成 G3 AI 输入包审核 | 大写六件套输入包明确、无 Mock/敏感数据/运行时数据源、页面范围和禁止事项清楚 |
| P3 | 启动 M3C 页面生成 | 一次性生成 `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results`，并通过 `cd front && npm run verify` |
| P4 | 进入 M4 联调 | 建立 API client，接入真实接口，补错误/空态/认证/分页/幂等验证记录 |

---

## 6. 报告结论

当前仓库已有可核验前后端工程、冻结接口契约、自动生成类型、组件库、业务组件和 AI 页面生成前上下文材料。系统所处阶段不是“源码恢复前”，而是 **第六阶段 M3 页面生成前准备收口**。在 G2/G3 审核通过后，可以启动 M3C 的 AI Studio 一次性页面生成；在页面生成和前端自动化检查通过前，不能声明核心业务页面已实现。
