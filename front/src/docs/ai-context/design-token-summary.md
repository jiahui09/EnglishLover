# 设计令牌摘要

令牌来源：`src/styles/tokens.css`。Tailwind 映射来源：`src/styles/global.css` 与 `tailwind.config.ts`。

核心命名：

- 颜色：`--color-primary`、`--color-bg-page`、`--color-bg-surface`、`--color-text-main`、`--color-success`、`--color-warning`、`--color-error`、`--color-info`；
- 间距：`--space-1` 至 `--space-12`；
- 字号：`--font-size-xs` 至 `--font-size-2xl`；
- 圆角：`--radius-sm`、`--radius-md`、`--radius-lg`、`--radius-xl`；
- 阴影：`--shadow-card`、`--shadow-popover`；
- 断点：`sm 640px`、`md 768px`、`lg 1024px`、`xl 1280px`。

生成页面时优先使用组件 API 和 Tailwind 语义工具类；禁止在页面中写十六进制颜色、内联样式或 Tailwind 任意颜色值。
