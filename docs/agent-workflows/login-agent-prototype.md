# 检索-生成-验证闭环原型：用户登录

<!-- REQ:REQ-AUTH-01 -->
<!-- API:API-AUTH-LOGIN -->

## 目标

以登录模块验证 Agent 能否从规约中检索约束、生成实现计划、运行验证并根据失败结果修正。

## 必须检索

- `docs/rtm.json`：REQ-AUTH-01、FEAT-AUTH-SESSION、API-AUTH-LOGIN、TEST-AUTH-LOGIN-01
- `backend/openapi/openapi.yaml`：operationId `login`
- `tests/specs/auth-session.feature`
- `tests/baselines/nonfunctional.json`：NFR-SEC-04

## 验证命令

- `cd backend && npm run verify`
- `cd backend && GOCACHE=/tmp/go-build GOMODCACHE=/tmp/go-mod go test ./...`
