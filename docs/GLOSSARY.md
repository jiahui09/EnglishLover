# EnglishLover 术语表

> 本文件是 AI/Agent 解析需求、接口、测试和设计时的优先词义来源。新增含糊词或同义词时，先更新本文件，再修改需求或代码。

| 术语 | 标准含义 | 禁止/易混用法 | 关联 ID |
|---|---|---|---|
| 可执行规约 | 可被脚本、CI 或 Agent 解析并验证的需求、接口、验收标准和非功能基准集合 | 不能只表示普通说明文档 | REQ-GOV-01 |
| RTM | Requirements Traceability Matrix，需求到功能、接口、测试和非功能约束的追溯矩阵 | 不等同于人工排期表 | REQ-GOV-01 |
| 需求 ID | 以 `REQ-` 开头的全局唯一需求标识 | 不再直接把旧编号当作唯一机器 ID | REQ-GOV-01 |
| 功能 ID | 以 `FEAT-` 开头的功能能力标识，可聚合多条需求 | 不等同于页面名称 | FEAT-CONSTRAINT-SYSTEM |
| 接口 ID | 以 `API-` 开头的接口标识，必须出现在 OpenAPI `x-api-id` 中 | 不等同于 operationId，但必须一一映射 | TEST-OPENAPI-CONTRACT-01 |
| 测试 ID | 以 `TEST-` 开头的验收或静态校验标识 | 不等同于测试文件名 | TEST-SPEC-TRACEABILITY-01 |
| 非功能约束 | 以 `NFR-` 开头的性能、安全、稳定性、可维护性等要求 | 不能写成“尽量快”“比较安全”等不可验证描述 | NFR-MAINT-03 |
| Gherkin | 使用 Given/When/Then 表达的验收标准文本 | 不替代真实自动化测试实现 | TEST-SPEC-TRACEABILITY-01 |
| 契约冻结 | OpenAPI 已通过评审并允许生成前端 API 类型的状态 | 不等于后端业务已全部实现 | API-HEALTH-GET |
| 活文档守护 | 监听文档变更并输出影响分析的自动化流程 | 不应自动越权修改生产代码 | FEAT-CONSTRAINT-SYSTEM |
| 审计智能体 | 只做一致性检查和差异报告的 Agent | 不直接改业务代码 | FEAT-CONSTRAINT-SYSTEM |
