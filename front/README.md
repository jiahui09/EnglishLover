# EnglishLover Web Frontend

本目录是 EnglishLover Web 端 React/Vite/TypeScript 前端工程。当前阶段为第六阶段 M3 页面生成前准备：组件库、业务组件、冻结 API 类型和 AI Studio 输入包已具备；真实业务页面仍未生成，业务路由继续保持壳页面。

## 可运行命令

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run verify
```

## 目录职责

| 目录 | 职责 | 当前边界 |
|---|---|---|
| `src/pages/` | 路由壳、占位页、组件示例页 | M3C 前不写真实业务页面；生成后必须通过合规检查 |
| `src/features/` | 后续业务状态编排和真实接口调用 | 当前仅保留边界说明；M4 再接真实接口 |
| `src/components/ui/` | 基础组件 | 页面不得重复自绘按钮、表单、弹窗等基础 UI |
| `src/components/feedback/` | 反馈与状态组件 | 统一空态、错误、保存、进度、重试、确认等状态 |
| `src/components/data-display/` | 数据展示组件 | 统一列表、时间线、统计卡和摘要容器 |
| `src/components/business/` | 业务展示组件 | Props 必须来自自动生成 API 类型或其派生别名；组件不请求接口、不生成业务数据 |
| `src/types/` | 类型入口 | `api.ts` 已由冻结 OpenAPI 契约自动生成，不能手写 DTO |
| `src/lib/` | 路由、工具函数等基础能力 | M3C 页面生成前不放业务规则 |
| `src/styles/` | 设计令牌、Tailwind 映射、全局样式 | 页面不得硬编码颜色、任意尺寸或内联 style |
| `src/docs/ai-context/` | AI Studio 页面生成上下文 | 大写六件套是 M3C 输入包；说明文档不是运行时数据源 |

## 已建立路由

- `/`：框架总览；
- `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results`：空壳路由，等待 M3C 一次性页面生成；
- `/components`：组件示例页，仅展示组件状态和组合方式。

所有业务范围内路由在 M3C 前只展示“壳已建好、业务未开始”的状态，不展示列表、表格、学习记录、用户信息、课程内容或任何临时数据。

## 后端协作约束

后端契约已冻结为 `1.0.0`，`src/types/api.ts` 已由 `backend/openapi/openapi.yaml` 自动生成。前端页面生成必须以该文件、组件 catalog、页面组件映射和设计令牌为准；如缺少字段、枚举、错误码或组件，必须回到契约变更评审或组件库变更评审，不得在页面层临时补造。
