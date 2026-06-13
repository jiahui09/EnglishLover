# features 目录边界

当前处于 M3 页面生成前准备阶段，`features/` 仍不实现业务 feature。

- `today/`、`vocabulary/`、`reading/`、`penpal/`、`results/` 等 feature 目录只能在 M3C 页面生成并通过合规检查后按需要建立。
- feature 层负责真实接口调用、页面状态编排和业务数据转换；真实接口联调属于 M4。
- 禁止在此目录放置临时数据、Mock、fixture、示例业务流、接口猜测或过渡性业务类型。
- API 类型必须来自 `src/types/api.ts` 或 `src/components/business/api-types.ts` 派生别名，不得手写 DTO、枚举或错误码。
