# EnglishLover

EnglishLover 是一个面向 Web 端的免费在线英语学习平台项目文档仓库，当前文档围绕“今日学习、单词记忆、阅读练习、受控笔友写信、今日成果记录”展开需求、产品体验、技术架构和后续实施规划。

## 当前状态

截至 2026-06-13，本仓库当前可核查内容以文档为主，尚未核验到完整的 `front/`、`backend/` 源码目录、包配置、数据库迁移、Docker 配置或自动化测试。因此：

- 文档中提到的 React/Vite/TypeScript/Express、`front/server.ts`、`front/package.json` 等内容，只能作为历史线索或目标方案处理；
- 阶段文档中的功能、接口、部署和性能描述，不等同于当前已经实现、测试或上线；
- 如需用于论文、验收或开发排期，应先补充真实源码与测试证据，再同步更新文档。

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

## 当前不能直接运行

当前仓库快照没有可运行应用源码，因此暂不能执行 `npm run dev`、`npm run build`、`npm run start` 等应用命令。后续如果恢复或创建 `front/` 源码目录，应先更新资产基线报告，再按真实 `package.json`、环境变量和部署文件补充运行说明。

## 后续建议

1. 恢复或创建真实前端/后端源码目录。
2. 补充 `package.json`、环境变量示例、构建脚本和启动脚本。
3. 根据真实代码更新 [现有资产基线调查报告](docs/asset-baseline-investigation-report.md)。
4. 将阶段文档中的目标方案逐项标注为“已实现 / 部分实现 / 未实现”。
5. 补充测试记录、部署记录和性能报告，避免把规划内容写成已完成事实。
