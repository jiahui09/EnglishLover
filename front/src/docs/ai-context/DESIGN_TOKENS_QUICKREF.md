# 设计令牌摘要

令牌来源：`src/styles/tokens.css`。Tailwind 映射来源：`src/styles/global.css`，TypeScript 摘要来源：`src/styles/theme.ts`。

## CSS 变量命名

- 颜色：`--color-primary`、`--color-primary-hover`、`--color-primary-soft`、`--color-bg-page`、`--color-bg-surface`、`--color-bg-muted`、`--color-border`、`--color-border-strong`、`--color-text-main`、`--color-text-muted`、`--color-text-subtle`、`--color-success`、`--color-warning`、`--color-error`、`--color-info`；
- 间距：`--space-1`、`--space-2`、`--space-3`、`--space-4`、`--space-5`、`--space-6`、`--space-7`、`--space-8`、`--space-10`、`--space-12`；
- 字号：`--font-size-xs`、`--font-size-sm`、`--font-size-md`、`--font-size-lg`、`--font-size-xl`、`--font-size-2xl`；
- 行高：`--line-height-body`、`--line-height-reading`、`--line-height-heading`；
- 圆角：`--radius-sm`、`--radius-md`、`--radius-lg`、`--radius-xl`、`--radius-full`；
- 阴影：`--shadow-card`、`--shadow-popover`；
- 断点：`--breakpoint-sm`、`--breakpoint-md`、`--breakpoint-lg`、`--breakpoint-xl`。

## Tailwind 语义类

- 背景：`bg-el-page`、`bg-el-surface`、`bg-el-muted`；
- 文本：`text-el-main`、`text-el-subtle`、`text-el-primary`、`text-el-success`、`text-el-warning`、`text-el-error`、`text-el-info`；
- 边框：`border-el-border`；
- 阴影：`shadow-el-card`、`shadow-el-popover`；
- 圆角：`rounded-el-sm`、`rounded-el-md`、`rounded-el-lg`、`rounded-el-xl`；
- 响应式：优先使用标准 `sm`/`md`/`lg`/`xl` 或 `el-sm`/`el-md`/`el-lg`/`el-xl` 映射。

## 页面生成规则

- 优先使用组件 API 控制视觉状态，不在页面层重写颜色、边框、阴影和焦点状态。
- 禁止十六进制颜色、`rgb()`、`hsl()`、Tailwind 任意颜色值和内联 style。
- 禁止任意间距/尺寸类；需要新尺寸时先扩展设计令牌或组件 API。
