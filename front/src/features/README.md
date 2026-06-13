# features 目录边界

第一轮只保留目录边界，不实现业务 feature。

- 后续 `today/`、`vocabulary/`、`reading/`、`penpal/`、`results/` 等 feature 必须在后端契约冻结、`src/types/api.ts` 自动生成后再进入实现。
- feature 层负责真实接口调用、页面状态编排和业务数据转换。
- 第一轮禁止在此目录放置临时数据、示例业务流、接口猜测或过渡性业务类型。
