# AI Studio 生成规则

当前状态：第二轮已完成前端反馈/状态/数据展示组件，并按“第三轮一次完整生成 UI”目标补齐业务功能资产；后端契约已冻结并自动生成 `src/types/api.ts`。业务页面仍未开始，真实页面只能在第三轮由 AI Studio/Gemini 基于冻结契约、组件能力、页面目标和设计边界一次性生成。

## 生成前必须读取

1. `SYSTEM_INSTRUCTION.md`：全局边界和禁止事项；
2. `COMPONENT_CATALOG.md`：现有组件能力索引，用于按需审计和复用功能；
3. `API_TYPES_REFERENCE.md`：冻结接口类型索引；
4. `PAGE_COMPONENT_MAP.md`：目标页面与组件装配关系；
5. `DESIGN_TOKENS_QUICKREF.md`：设计令牌和样式规则；
6. `API_FIELD_EXAMPLES.md`：字段形态参考，不作为页面数据源。

若本轮目标是让 Gemini 充分发挥 UI 设计能力，应同时读取：

7. `GEMINI_UI_GENERATION_PROMPT.md`：Gemini UI 页面生成主提示词；
8. `gemini-ui-context-pack/`：按需复用功能、允许重新设计风格的上下文附件包。

## 生成时必须遵守

1. 使用 `src/types/api.ts` 作为唯一 API 类型来源；
2. 先审计 `COMPONENT_CATALOG.md` 和 `front/src/components/`，再按需复用承载功能、交互语义、状态语义、可访问性或业务边界的组件；
3. 允许通过页面结构、`className`、样式文件和 token 调整重新设计组件外观，但不得破坏组件 props、业务含义、数据结构和交互语义；
4. 不创建 `src/data`、`src/mocks`、`src/fixtures` 或任何临时数据文件；
5. 不猜测字段、枚举、错误码、分页结构、认证方式或响应包裹格式；
6. 不在组件或页面中硬编码颜色、阴影、圆角、任意尺寸或内联 style；如需新视觉语言，应集中调整设计 token 或样式文件；
7. 生成结果必须通过 `npm run typecheck`、`npm run lint` 和 `npm run build`。

## 禁止事项

- 禁止在第三轮生成前提前实现业务页面；
- 禁止用静态列表、假用户、假课程、假学习记录或假通信记录驱动页面；
- 禁止手写接口 DTO、请求参数、响应结构、错误码或业务枚举；
- 禁止为了视觉效果绕过业务语义、状态语义、可访问性或冻结契约；
- 禁止把 `/components` 示例页扩展成业务流程页。

## 变更流程

如 AI Studio 发现缺少字段、组件或接口，不得就地补造；必须回到契约变更评审或组件库变更评审，更新冻结契约/组件 catalog 后再重新生成页面。
