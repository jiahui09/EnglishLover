# EnglishLover

EnglishLover 是一个面向 Web 端的免费在线英语学习平台项目仓库，当前同时包含产品/技术文档、前端骨架、后端骨架和可执行规约系统。文档围绕“今日学习、单词记忆、阅读练习、受控笔友写信、今日成果记录”展开，并通过 RTM、OpenAPI、Gherkin、非功能基准和 CI Gate 约束后续开发。

## 当前状态

截至 2026-06-13，本仓库可核查内容包括：

- `front/`：React/Vite/TypeScript 前端骨架、组件合规检查、类型检查和构建脚本；
- `backend/`：Go/Chi 后端骨架、OpenAPI 3.1 契约草案、契约检查和 Go 测试；
- `docs/` 与 `tests/specs/`：可执行规约系统，包括 RTM、Gherkin、ADR、术语表、非功能基准和 Agent 工作流。

阶段文档中的业务功能、部署和性能描述仍需以真实代码、真实测试结果和实际部署情况为准，不能把规划内容写成已完成事实。

## 快速入口

| 你想了解 | 建议先读 |
|---|---|
| 项目整体情况 | [项目文档中心](docs/README.md)、[Design](DESIGN.md) |
| 需求和 MVP 范围 | [第一阶段：立项与需求分析](docs/phase-1-project-initiation-and-requirements-analysis.md)、[第二阶段：需求规格与范围控制](docs/phase-2-requirements-specification-and-scope-control.md) |
| 页面和用户体验 | [第三阶段：产品与用户体验设计](docs/phase-3-product-and-user-experience-design.md)、[Design](DESIGN.md) |
| 技术架构和接口方向 | [第四阶段：技术架构设计](docs/phase-4-technical-architecture-design.md)、[功能分析与系统架构设计方案](docs/function-analysis-and-system-architecture.md) |
| 组件库和 AI 生成前端衔接 | [第五阶段：组件库建设与复用详细设计方案](docs/phase-5-component-library-and-reuse-design.md) |
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

1. 恢复或创建真实前端/后端源码目录。
2. 补充 `package.json`、环境变量示例、构建脚本和启动脚本。
3. 根据真实代码更新 [现有资产基线调查报告](docs/asset-baseline-investigation-report.md)。
4. 将阶段文档中的目标方案逐项标注为“已实现 / 部分实现 / 未实现”。
5. 补充测试记录、部署记录和性能报告，避免把规划内容写成已完成事实。
