# AI Studio 生成规则

当前状态：第二轮已完成前端反馈/状态/数据展示组件，并按“第三轮一次完整生成 UI”目标补齐业务组件货架；后端契约已冻结并自动生成 `src/types/api.ts`。业务页面仍未开始，真实页面只能在第三轮由 AI Studio 基于冻结契约、组件 catalog 和页面组件映射一次性生成。

## 生成前必须读取

1. `SYSTEM_INSTRUCTION.md`：全局边界和禁止事项；
2. `COMPONENT_CATALOG.md`：唯一组件消费清单；
3. `API_TYPES_REFERENCE.md`：冻结接口类型索引；
4. `PAGE_COMPONENT_MAP.md`：目标页面与组件装配关系；
5. `DESIGN_TOKENS_QUICKREF.md`：设计令牌和样式规则；
6. `API_FIELD_EXAMPLES.md`：字段形态参考，不作为页面数据源。

## 生成时必须遵守

1. 使用 `src/types/api.ts` 作为唯一 API 类型来源；
2. 页面层优先组合 `COMPONENT_CATALOG.md` 中的基础、反馈、数据展示和业务组件；
3. 不重复实现 Button、Card、Modal、Toast、EmptyState、DataList、Timeline、TaskActionCard、PracticeQuestion、LetterEditor 等已存在组件；
4. 不创建 `src/data`、`src/mocks`、`src/fixtures` 或任何临时数据文件；
5. 不猜测字段、枚举、错误码、分页结构、认证方式或响应包裹格式；
6. 不在组件或页面中硬编码颜色、阴影、圆角、任意尺寸或内联 style；
7. 生成结果必须通过 `npm run typecheck`、`npm run lint` 和 `npm run build`。

## 禁止事项

- 禁止在第三轮生成前提前实现业务页面；
- 禁止用静态列表、假用户、假课程、假学习记录或假通信记录驱动页面；
- 禁止手写接口 DTO、请求参数、响应结构、错误码或业务枚举；
- 禁止绕过业务组件货架直接在页面层拼复杂 UI；
- 禁止把 `/components` 示例页扩展成业务流程页。

## 变更流程

如 AI Studio 发现缺少字段、组件或接口，不得就地补造；必须回到契约变更评审或组件库变更评审，更新冻结契约/组件 catalog 后再重新生成页面。
