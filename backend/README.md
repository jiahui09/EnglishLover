# EnglishLover Backend

后端按设计文档既定路线建设：`Go + Chi + PostgreSQL + Redis`，采用模块化单体结构。当前接口契约已冻结为 `1.0.0`，`backend/openapi/openapi.yaml` 是前端 API 类型生成的唯一来源。

## 阶段边界

- 已完成：真实业务接口、统一响应规范、错误码、枚举、分页、认证、幂等、契约测试、前端类型生成链路。
- 测试环境：本地 Compose 固定地址 `http://127.0.0.1:18080/api/v1`。
- 前端边界：前端仍不得开发依赖接口的业务页面；只能消费自动生成并冻结的 `front/src/types/api.ts`。

## 常用命令

```bash
cd backend
go test ./...
npm run contract
API_CONTRACT_FROZEN=true npm run generate:api-types
npm run verify
```

本地固定测试环境：

```bash
# 优先：Compose 环境
docker compose -f docker-compose.backend-test.yml up --build

# 备用：当前机器无 Docker Compose 插件或 daemon 时，使用本机临时 PostgreSQL + Go API
npm run test-env:start
```

> `npm run contract:test` 会使用同一固定 API 地址 `http://127.0.0.1:18080/api/v1` 执行契约测试，并在结束后自动清理本机临时进程。

## 冻结后变更规则

1. 字段、枚举、错误码、响应结构不得直接修改实现。
2. 任何变更必须先更新 `backend/openapi/openapi.yaml`，再更新契约测试。
3. 重新执行 `API_CONTRACT_FROZEN=true npm run generate:api-types`。
4. 更新《接口交付测试报告》并完成评审后再提交。
