# Engineering Boundaries

可以修改：

- `front/src/pages/*`
- `front/src/App.tsx`
- `front/src/components/layout/*`
- `front/src/styles/*`
- 必要的页面级辅助组件
- 必要的页面级 hooks 或 API client

谨慎修改：

- `front/src/components/*`

只有在不破坏 props、功能语义、可访问性和现有调用方时，才允许做样式层改造。

禁止修改：

- `front/src/types/api.ts`
- `backend/*`
- `backend/openapi/*`
- `package.json`
- mock、fixture、data 文件

禁止行为：

- 创建假业务数据。
- 猜测 API 字段。
- 改后端契约。
- 新增依赖。
- 用工程说明替代用户界面。
