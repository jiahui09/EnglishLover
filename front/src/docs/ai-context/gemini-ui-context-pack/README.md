# Gemini UI Context Pack

> 用途：配合 `../GEMINI_UI_GENERATION_PROMPT.md` 上传给 Gemini。该目录中的文件是生成前上下文资料，不是页面运行时数据源。

## 使用顺序

1. 上传主提示词：`GEMINI_UI_GENERATION_PROMPT.md`。
2. 上传本目录全部附件。
3. 同时上传必要项目事实文件：
   - `DESIGN.md`
   - `front/package.json`
   - `front/src/App.tsx`
   - `front/src/lib/routes.ts`
   - `front/src/pages/HomePage.tsx`
   - `front/src/pages/ShellPlaceholderPage.tsx`
   - `front/src/components/`
   - `front/src/styles/`
   - `front/src/types/api.ts`
   - `front/src/docs/ai-context/COMPONENT_CATALOG.md`
   - `front/src/docs/ai-context/API_TYPES_REFERENCE.md`
   - `front/src/docs/ai-context/API_FIELD_EXAMPLES.md`
   - `front/src/docs/ai-context/DESIGN_TOKENS_QUICKREF.md`
   - `front/src/docs/ai-context/PAGE_COMPONENT_MAP.md`
4. 第一轮只要求 Gemini 输出审计和 UI 方案，不要写代码。
5. 确认方向后，再要求 Gemini 生成代码。

## 权限层级

1. 最高优先级：工程边界、数据边界、禁止穿帮。
2. 第二优先级：产品路线、用户体验目标。
3. 第三优先级：UI 自由发挥策略。
4. 第四优先级：组件审计和按需复用建议。

如与旧的“固定组件清单”表述冲突，以本目录中的“按需复用功能，允许重新设计风格”为准；但数据、契约、安全和验证边界不得放松。
