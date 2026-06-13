# 可执行规约系统

<!-- REQ:REQ-GOV-01 -->

本文定义 EnglishLover 文档约束系统的机器可读入口。它不是普通前置说明，而是 CI、Agent 和人工评审共同引用的约束源。

## 机器入口

| 规约类型 | 文件 | 说明 |
|---|---|---|
| 追溯矩阵 | `docs/rtm.json` | 需求、功能、接口、测试、非功能约束的唯一映射 |
| 接口契约 | `backend/openapi/openapi.yaml` | OpenAPI 3.1 接口唯一事实源 |
| 验收标准 | `tests/specs/*.feature` | Gherkin 场景，必须带 `@REQ-*`、`@TEST-*` 等标签 |
| 非功能基准 | `tests/baselines/nonfunctional.json` | 性能、安全、稳定性、维护性阈值 |
| 术语表 | `docs/GLOSSARY.md` | AI 优先解析词义来源 |
| ADR | `docs/adr/` | 架构决策记录 |
| 图源码 | `docs/diagrams/` | Mermaid/PlantUML 源码，不使用纯图片作为唯一设计依据 |

## 文档标签注册表

以下隐藏标签用于自动解析。新增 ID 时必须同步更新 RTM、源文档和校验结果。

<!-- REQ:REQ-AUTH-01 -->
<!-- REQ:REQ-AUTH-02 -->
<!-- REQ:REQ-AUTH-03 -->
<!-- REQ:REQ-AUTH-04 -->
<!-- REQ:REQ-NAV-01 -->
<!-- REQ:REQ-NAV-02 -->
<!-- REQ:REQ-NAV-03 -->
<!-- REQ:REQ-NAV-04 -->
<!-- REQ:REQ-VOC-01 -->
<!-- REQ:REQ-VOC-02 -->
<!-- REQ:REQ-VOC-03 -->
<!-- REQ:REQ-VOC-04 -->
<!-- REQ:REQ-VOC-05 -->
<!-- REQ:REQ-VOC-06 -->
<!-- REQ:REQ-VOC-07 -->
<!-- REQ:REQ-VOC-08 -->
<!-- REQ:REQ-VOC-09 -->
<!-- REQ:REQ-VOC-10 -->
<!-- REQ:REQ-VOC-11 -->
<!-- REQ:REQ-VOC-12 -->
<!-- REQ:REQ-RD-01 -->
<!-- REQ:REQ-RD-02 -->
<!-- REQ:REQ-RD-03 -->
<!-- REQ:REQ-RD-04 -->
<!-- REQ:REQ-RD-05 -->
<!-- REQ:REQ-RD-06 -->
<!-- REQ:REQ-RD-07 -->
<!-- REQ:REQ-RD-08 -->
<!-- REQ:REQ-RD-09 -->
<!-- REQ:REQ-RD-10 -->
<!-- REQ:REQ-RD-11 -->
<!-- REQ:REQ-RD-12 -->
<!-- REQ:REQ-PAL-01 -->
<!-- REQ:REQ-PAL-02 -->
<!-- REQ:REQ-PAL-03 -->
<!-- REQ:REQ-PAL-04 -->
<!-- REQ:REQ-PAL-05 -->
<!-- REQ:REQ-PAL-06 -->
<!-- REQ:REQ-PAL-07 -->
<!-- REQ:REQ-PAL-08 -->
<!-- REQ:REQ-PAL-09 -->
<!-- REQ:REQ-PAL-10 -->
<!-- REQ:REQ-PAL-11 -->
<!-- REQ:REQ-PAL-12 -->
<!-- REQ:REQ-PAL-13 -->
<!-- REQ:REQ-REC-01 -->
<!-- REQ:REQ-REC-02 -->
<!-- REQ:REQ-REC-03 -->
<!-- REQ:REQ-REC-04 -->
<!-- REQ:REQ-REC-05 -->
<!-- REQ:REQ-REC-06 -->
<!-- REQ:REQ-REC-07 -->
<!-- REQ:REQ-GOV-01 -->
<!-- NFR:NFR-UX-01 -->
<!-- NFR:NFR-UX-02 -->
<!-- NFR:NFR-UX-03 -->
<!-- NFR:NFR-UX-04 -->
<!-- NFR:NFR-PERF-01 -->
<!-- NFR:NFR-PERF-02 -->
<!-- NFR:NFR-PERF-03 -->
<!-- NFR:NFR-PERF-04 -->
<!-- NFR:NFR-PERF-05 -->
<!-- NFR:NFR-STAB-01 -->
<!-- NFR:NFR-STAB-02 -->
<!-- NFR:NFR-STAB-03 -->
<!-- NFR:NFR-STAB-04 -->
<!-- NFR:NFR-SEC-01 -->
<!-- NFR:NFR-SEC-02 -->
<!-- NFR:NFR-SEC-03 -->
<!-- NFR:NFR-SEC-04 -->
<!-- NFR:NFR-SEC-05 -->
<!-- NFR:NFR-MAINT-01 -->
<!-- NFR:NFR-MAINT-02 -->
<!-- NFR:NFR-MAINT-03 -->
<!-- NFR:NFR-MAINT-04 -->
<!-- NFR:NFR-ROBUST-01 -->
<!-- FEAT:FEAT-AUTH-SESSION -->
<!-- FEAT:FEAT-NAV-CORE -->
<!-- FEAT:FEAT-WORD-LIST -->
<!-- FEAT:FEAT-WORD-REVIEW -->
<!-- FEAT:FEAT-READING-PRACTICE -->
<!-- FEAT:FEAT-READING-WORD-QUEUE -->
<!-- FEAT:FEAT-PENPAL-LETTER -->
<!-- FEAT:FEAT-ANALYTICS-DAILY -->
<!-- FEAT:FEAT-CONSTRAINT-SYSTEM -->
<!-- API:API-HEALTH-GET -->
<!-- API:API-AUTH-LOGIN -->
<!-- API:API-AUTH-REFRESH -->
<!-- API:API-AUTH-LOGOUT -->
<!-- API:API-AUTH-ME -->
<!-- API:API-WORD-LIST -->
<!-- API:API-REVIEW-SUBMIT -->
<!-- API:API-REVIEW-EVENTS -->
<!-- API:API-READING-LIST -->
<!-- API:API-READING-DETAIL -->
<!-- API:API-READING-WORD-QUEUE -->
<!-- API:API-PENPAL-THREADS -->
<!-- API:API-PENPAL-LETTER-SEND -->
<!-- API:API-ANALYTICS-DAILY-SUMMARY -->
<!-- RULE:RULE-GSL-01 -->
<!-- RULE:RULE-GSL-02 -->
<!-- RULE:RULE-GSL-03 -->
<!-- RULE:RULE-GSL-04 -->
<!-- RULE:RULE-VOC-01 -->
<!-- RULE:RULE-VOC-02 -->
<!-- RULE:RULE-VOC-03 -->
<!-- RULE:RULE-VOC-04 -->
<!-- RULE:RULE-VOC-05 -->
<!-- RULE:RULE-VOC-06 -->
<!-- RULE:RULE-VOC-07 -->
<!-- RULE:RULE-RD-01 -->
<!-- RULE:RULE-RD-02 -->
<!-- RULE:RULE-RD-03 -->
<!-- RULE:RULE-RD-04 -->
<!-- RULE:RULE-RD-05 -->
<!-- RULE:RULE-RD-06 -->
<!-- RULE:RULE-PAL-01 -->
<!-- RULE:RULE-PAL-02 -->
<!-- RULE:RULE-PAL-03 -->
<!-- RULE:RULE-PAL-04 -->
<!-- RULE:RULE-PAL-05 -->
<!-- RULE:RULE-PAL-06 -->
<!-- RULE:RULE-PAL-07 -->
<!-- RULE:RULE-PAL-08 -->
<!-- RULE:RULE-REC-01 -->
<!-- RULE:RULE-REC-02 -->
<!-- RULE:RULE-REC-03 -->
<!-- RULE:RULE-REC-04 -->
<!-- RULE:RULE-REC-05 -->
<!-- RULE:RULE-REC-06 -->

## 变更规则

1. 修改需求、接口、测试或非功能约束时，必须同步更新 `docs/rtm.json`。
2. 修改接口字段、状态码或错误码时，必须同步更新 OpenAPI，并通过契约配置比对。
3. 修改验收标准时，必须同步更新对应 `.feature` 标签和场景。
4. 修改文档但没有说明影响范围时，PR/提交应被预提交或 CI Gate 拦截。
5. Agent 生成代码前必须列出引用的需求 ID、接口 ID、测试 ID 和非功能约束 ID。
