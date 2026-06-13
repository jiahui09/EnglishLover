# Agent 合规推理提示词

<!-- FEAT:FEAT-CONSTRAINT-SYSTEM -->

在生成或修改代码前，Agent 必须输出以下内容：

1. 本次任务引用的需求 ID。
2. 本次任务引用的接口 ID 和 OpenAPI operationId。
3. 本次任务引用的 Gherkin 测试 ID。
4. 本次任务涉及的非功能约束 ID。
5. 如果文档存在冲突，先调用差异报告流程，不得直接猜测实现。

模板：

```text
合规推理链：
- 需求约束：REQ-...（来源：docs/rtm.json / 源文档标签）
- 接口约束：API-...（来源：backend/openapi/openapi.yaml#operationId）
- 验收约束：TEST-...（来源：tests/specs/*.feature）
- 非功能约束：NFR-...（来源：tests/baselines/nonfunctional.json）
- 冲突/缺口：无 / 已记录 report_discrepancy(...)
```
