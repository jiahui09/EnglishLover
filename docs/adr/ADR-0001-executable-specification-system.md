# ADR-0001: 使用可执行规约系统约束文档、接口、测试和 Agent

<!-- ADR:ADR-0001 -->
<!-- REQ:REQ-GOV-01 -->

## 状态

Accepted

## 背景

EnglishLover 已有较多需求、设计和接口文档。如果这些文档只作为开发前置说明，代码实现、接口字段、测试场景和非功能约束容易逐步偏离。项目需要把文档升级为可由脚本和 Agent 高置信度解析的约束系统。

## 决策

1. 使用 `docs/rtm.json` 作为需求、功能、接口、测试和非功能约束的追溯矩阵。
2. 使用 `backend/openapi/openapi.yaml` 作为接口唯一事实源，并通过 `x-api-id` 与 RTM 关联。
3. 使用 `tests/specs/*.feature` 存放 Gherkin 验收标准。
4. 使用 `tests/baselines/nonfunctional.json` 存放非功能自动化基准。
5. 使用 Markdown 隐形标签和 Agent 工作流提示，要求生成代码前先输出硬约束引用。

## 后果

- 优点：需求、接口、测试和非功能要求可被 CI 和 Agent 自动追溯。
- 代价：每次变更必须维护 ID、RTM 和关联标签。
- 约束：不得绕过 OpenAPI 手写前端业务 API 类型；不得把未实现功能写成已完成事实。

## 验证

- `npm run verify`（仓库根目录）
- `cd backend && npm run verify`
- `cd backend && npm run check:doc-knowledge`
