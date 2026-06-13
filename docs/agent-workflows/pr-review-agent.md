# PR 评审 Agent 工作流

<!-- FEAT:FEAT-CONSTRAINT-SYSTEM -->

## 唯一职责

检查代码、OpenAPI、Gherkin、RTM、非功能基准和文档标签是否一致，输出差异报告；默认不直接修改业务代码。

## 输入

- PR diff
- `docs/rtm.json`
- `backend/openapi/openapi.yaml`
- `tests/specs/*.feature`
- `tests/baselines/nonfunctional.json`
- CI 输出

## 输出

- 阻断项：必须修复，否则不得合并。
- 建议项：不阻断，但应进入后续任务。
- 影响范围：受影响需求、接口、测试、非功能约束和源码路径。

## 自动修正限制

主 Agent 最多自动修正 2 次。仍失败时转人工，并附带失败命令、文档片段和相关 ID。
