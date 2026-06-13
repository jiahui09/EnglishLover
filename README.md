# EnglishLover

EnglishLover 是一个面向 Web 端的免费在线英语学习平台项目仓库，当前同时包含产品/技术文档、前端骨架、后端骨架和可执行规约系统。文档围绕“今日学习、单词记忆、阅读练习、受控笔友写信、今日成果记录”展开，并通过 RTM、OpenAPI、Gherkin、非功能基准和 CI Gate 约束后续开发。

## 当前状态

截至 2026-06-13，本仓库可核查内容包括：

- `front/`：React/Vite/TypeScript 前端工程，包含基础组件、反馈/状态组件、数据展示组件、业务组件、组件合规检查、类型检查和构建脚本；
- `backend/`：Go/Chi 后端工程，包含模块化单体接口实现、PostgreSQL 迁移、OpenAPI 3.1 冻结契约、契约检查和 Go 测试；
- `front/src/types/api.ts`：已由 `backend/openapi/openapi.yaml` 自动生成，契约版本为 `1.0.0`；
- `front/src/docs/ai-context/`：第三轮 AI Studio 页面生成前的上下文包，包含系统指令、组件 catalog、API 类型索引、字段形态参考、页面-组件映射和设计令牌摘要；
- `docs/` 与 `tests/specs/`：可执行规约系统，包括 RTM、Gherkin、ADR、术语表、非功能基准和 Agent 工作流。

当前阶段是第六阶段 M3 页面生成前准备：M1、M2 已完成并可验证；真实业务页面尚未生成，`/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 仍是壳路由。阶段文档中的部署和性能描述仍需以真实运行、真实测试结果和实际部署情况为准，不能把规划内容写成已完成事实。

## 快速入口

| 你想了解 | 建议先读 |
|---|---|
| 项目整体情况 | [项目文档中心](docs/README.md)、[Design](DESIGN.md) |
| 需求和 MVP 范围 | [第一阶段：立项与需求分析](docs/phase-1-project-initiation-and-requirements-analysis.md)、[第二阶段：需求规格与范围控制](docs/phase-2-requirements-specification-and-scope-control.md) |
| 页面和用户体验 | [第三阶段：产品与用户体验设计](docs/phase-3-product-and-user-experience-design.md)、[Design](DESIGN.md) |
| 技术架构和接口方向 | [第四阶段：技术架构设计](docs/phase-4-technical-architecture-design.md)、[功能分析与系统架构设计方案](docs/function-analysis-and-system-architecture.md) |
| 组件库和 AI 生成前端衔接 | [第五阶段：组件库建设与复用详细设计方案](docs/phase-5-component-library-and-reuse-design.md)、[M3 页面生成前准备审核记录](docs/phase-6-m3-page-generation-readiness-audit.md) |
| 部署、数据治理、性能测试 | [Docker + Compose 指南](docs/docker-compose-guide.md)、[数据留存与删除策略](docs/data-retention-and-deletion-policy.md)、[性能测试计划](docs/performance-test-plan.md) |
| 当前仓库事实边界 | [现有资产基线调查报告](docs/asset-baseline-investigation-report.md) |
| 可执行规约和一致性门禁 | [可执行规约系统](docs/executable-specification-system.md)、[RTM](docs/rtm.json)、[Gherkin 验收标准](tests/specs/) |

## 常用验证命令

```bash
# 根目录：执行后端规约校验和前端验证
npm run verify

# 后端：OpenAPI、RTM、Gherkin、知识图谱和 API 类型边界
cd backend && npm run verify

# 后端 Go 测试；如默认缓存目录不可写，可指定 /tmp
cd backend && GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod go test ./...

# 前端：typecheck、lint、build
cd front && npm run verify
```

如需启用本地 Git hooks：

```bash
npm run prepare:githooks
```

## 后续建议

1. 按 [M3 页面生成前准备审核记录](docs/phase-6-m3-page-generation-readiness-audit.md) 使用大写六件套 AI 输入包启动一次性页面生成。
2. 页面生成后立即执行 `cd front && npm run verify`，检查类型、组件复用、样式边界、组件 catalog、无业务 Mock 数据和生产构建。
3. 若 AI Studio 发现缺少字段、枚举、错误码或组件，不得临时补造；先走契约变更评审或组件库变更评审。
4. M3 合规通过后再进入 M4 真实接口联调，补充 API client、错误包裹、分页、认证和幂等边界验证。
5. 继续补充测试记录、部署记录和性能报告，避免把规划内容写成已完成事实。
