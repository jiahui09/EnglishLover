# 第六阶段第一轮：Web 端基础骨架交付说明

> 日期：2026-06-13  
> 范围：EnglishLover Web 端第一轮建设  
> 原则：仅搭框架、不做业务页、不接真实接口、不引入临时数据

## 1. 本轮已交付边界

- 新增 `front/` React + Vite + TypeScript 项目骨架；
- 建立 `src/pages/`、`src/features/`、`src/components/`、`src/types/`、`src/lib/`、`src/styles/` 分层；
- 配置 Tailwind CSS、全局样式入口、CSS 设计令牌和 Tailwind 映射；
- 实现 P0 基础组件：Button、Card、Input、Textarea、Select、Modal、Loading、Badge、Tabs、Toast；
- 建立全局布局、桌面侧边导航、移动端导航占位和主内容区域；
- 建立 `/today`、`/vocabulary`、`/reading`、`/penpal`、`/results` 空壳路由；
- 建立 `/components` 组件示例页，仅用于组件演示；
- 建立 `src/types/api.ts` 占位说明，未写入任何真实接口类型；
- 增加样式边界和无临时业务数据检查脚本。

## 2. 明确未做内容

- 未开发今日学习、单词、阅读、写信或成果记录业务页面；
- 未接入任何真实接口；
- 未猜测请求参数、响应结构、错误码、分页格式或业务枚举；
- 未引入临时数据目录、fixture 或伪造业务流；
- 未使用 Google AI Studio 生成业务页面。

## 3. 后端冻结前评审准备

后端侧应并行推进：

1. 统一接口命名和资源路径；
2. 统一响应包裹格式、分页结构和认证方式；
3. 统一错误码、错误语义和枚举字典；
4. 完成接口编码与契约测试用例编写；
5. 在冻结前评审后输出 OpenAPI / 契约文件；
6. 由生成工具产出并冻结 `front/src/types/api.ts`。

前端在该节点前不得以猜测式类型或临时接口替代后端正式定义。

## 4. 后续 AI Studio 生成约束

AI Studio 一次性生成页面前，必须读取组件清单、设计令牌摘要、页面-组件映射表和冻结后的 API 类型索引。生成页面不得重复实现基础组件，不得硬编码样式，不得创造接口字段，不得引入临时数据。
