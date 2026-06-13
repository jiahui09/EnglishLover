# 活文档守护进程设计

<!-- FEAT:FEAT-CONSTRAINT-SYSTEM -->

## 触发

- PR 中修改 `docs/**`、`backend/openapi/**`、`tests/specs/**` 或 `tests/baselines/**`。
- 本地 pre-commit 检测到文档变更。

## 行为

1. 运行可执行规约校验。
2. 根据 `docs/index/knowledge-graph.json` 找出受影响需求、接口、测试和 NFR。
3. 输出影响分析报告。
4. 若自动修正失败超过 2 次，转人工。
