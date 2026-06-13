# EnglishLover 项目文档中心

本目录用于整理 EnglishLover 在线英语学习平台 Web 端的需求、产品体验、技术架构、组件复用、部署、数据治理和性能测试材料。

## 当前事实边界

截至 2026-06-13，本仓库当前可核查内容以文档为主，未核验到完整 `front/`、`backend/` 源码目录、数据库迁移、Docker 配置或自动化测试。文档中涉及 React/Vite/TypeScript/Express、`front/`、接口、数据库、部署命令或性能指标的内容，应按“目标设计 / 历史线索 / 待实现方案”处理，不能直接作为当前已实现事实。

## 推荐阅读路径


### 0. 可执行规约与一致性门禁

1. [可执行规约系统](executable-specification-system.md)
2. [追溯矩阵](rtm.json)
3. [术语表](GLOSSARY.md)
4. [ADR-0001：可执行规约系统](adr/ADR-0001-executable-specification-system.md)
5. [规约追溯图源码](diagrams/spec-traceability.mmd)
6. [Agent 合规推理提示词](agent-workflows/compliance-reasoning-prompt.md)

### 1. 快速了解项目

1. [README](../README.md)
2. [Design](../DESIGN.md)
3. [在线英语学习平台 Web 端完整开发流程规划](online-english-learning-platform-development-process.md)

### 2. 产品和需求评审

1. [第一阶段：立项与需求分析](phase-1-project-initiation-and-requirements-analysis.md)
2. [第二阶段：需求规格与范围控制](phase-2-requirements-specification-and-scope-control.md)
3. [第三阶段：产品与用户体验设计](phase-3-product-and-user-experience-design.md)

### 3. 技术方案和实施规划

1. [现有资产基线调查报告](asset-baseline-investigation-report.md)
2. [第四阶段：技术架构设计](phase-4-technical-architecture-design.md)
3. [功能分析与系统架构设计方案](function-analysis-and-system-architecture.md)
4. [第五阶段：组件库建设与复用详细设计方案](phase-5-component-library-and-reuse-design.md)

### 4. 交付、运维和治理

1. [Docker + Compose 由浅入深部署与原理指南](docker-compose-guide.md)
2. [数据留存与删除策略](data-retention-and-deletion-policy.md)
3. [性能测试计划](performance-test-plan.md)

## 文档清单

| 文档 | 定位 | 状态边界 |
|---|---|---|
| `executable-specification-system.md` | 可执行规约系统入口 | 机器可解析约束，不替代真实实现验收 |
| `rtm.json` | 需求追溯矩阵 | 需求、功能、接口、测试、非功能约束的机器映射 |
| `GLOSSARY.md` | 术语表 | AI/Agent 优先词义来源 |
| `../README.md` | 项目入口和当前状态说明 | 记录当前仓库不能直接运行的事实 |
| `../DESIGN.md` | 产品体验和设计 source of truth | 基于现有文档，不声明已有 UI 实现 |
| `online-english-learning-platform-development-process.md` | 全生命周期开发流程规划 | 流程建议，不等同于已完成 |
| `phase-1-project-initiation-and-requirements-analysis.md` | 立项、用户、需求和 MVP 边界 | 需求分析稿，不声明功能已实现 |
| `phase-2-requirements-specification-and-scope-control.md` | 需求规格、优先级和验收标准 | 研发与测试基线，需随真实代码修订 |
| `phase-3-product-and-user-experience-design.md` | 信息架构、页面路径和交互状态 | 产品/UX 设计，不替代高保真稿和实现截图 |
| `asset-baseline-investigation-report.md` | 当前源码资产事实调查 | 当前结论为未核验到 `front/` / `backend/` 源码 |
| `phase-4-technical-architecture-design.md` | 目标技术架构、模块、接口、安全和部署 | 目标架构设计；技术选型需通过源码资产门禁 |
| `function-analysis-and-system-architecture.md` | 功能和系统架构分析 | 历史/目标分析文档；其中源码路径需恢复后复核 |
| `phase-5-component-library-and-reuse-design.md` | 组件库、接口契约和 AI 生成前端衔接 | 执行方案，不代表组件已经存在 |
| `docker-compose-guide.md` | Docker/Compose 学习与后续部署指南 | 需在源码恢复后按真实目录修订命令 |
| `data-retention-and-deletion-policy.md` | 注销、删除、匿名化、导出和审计策略 | 目标数据治理策略，需随真实数据库和隐私政策修订 |
| `performance-test-plan.md` | 性能测试场景、指标和报告模板 | 目标测试计划，执行后需补真实性能报告 |

## 维护规则

- 新增或修改文档时，必须区分“已实现事实”“目标方案”“历史线索”“待确认事项”。
- 涉及源码、接口、数据库、部署、测试和性能指标时，应给出证据路径或标注待补充。
- 不把未测试、未部署、未验收的内容写成已完成结论。
- 恢复或创建源码后，应优先更新 `asset-baseline-investigation-report.md`，再更新架构、部署、性能和 README。
- 用于毕业设计论文或项目验收时，应以真实系统、真实测试记录、真实截图和学校模板为准。

## 下一步文档整理建议

1. 补充真实源码后更新资产基线。
2. 增加“已实现 / 部分实现 / 未实现”功能矩阵。
3. 增加真实运行命令、环境变量、部署拓扑和测试记录。
4. 将性能测试计划执行结果沉淀为独立性能报告。
