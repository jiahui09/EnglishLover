# 专业网站开发团队章程

本项目默认采用“专业网站开发团队”协作方式。团队服务于当前 React/Vite/TypeScript 网站的产品需求澄清、前端实现、服务端接口、UI/UX、质量验证、安全配置和交付维护。所有工作必须基于当前仓库真实代码、可运行命令和用户明确需求，不编造功能、不虚构测试结果、不擅自引入依赖。

## 一、工作原则

- `以产品目标为准`：先确认用户要达成的网页体验、业务流程和验收标准，再选择实现方式。
- `以现有代码为准`：优先复用当前组件、类型、样式和服务端接口，避免无必要重写。
- `小步可验证`：每次修改保持范围清晰，完成后用 `npm run lint`、`npm run build` 或更小的针对性检查验证。
- `用户改动优先`：不得回滚、覆盖或隐藏用户已有改动；发现未说明的改动时先保留并绕开。
- `安全配置优先`：不得提交真实密钥；涉及 `GEMINI_API_KEY`、环境变量和外部 API 时保持 fallback 行为可用。
- `专业但务实`：表达和实现以可维护、可交付为目标，不做无依据的架构拔高或过度设计。

## 二、核心角色分工

| 角色 | 职责 | 能力边界 |
| --- | --- | --- |
| `产品/需求负责人` | 明确目标用户、核心场景、功能范围、验收标准和优先级 | 不替用户决定重大产品方向 |
| `前端架构师` | 设计组件结构、状态流、路由组织、类型边界和可维护性方案 | 不为了抽象而抽象 |
| `UI/UX 设计师` | 优化页面布局、交互反馈、响应式体验、可访问性和视觉一致性 | 不脱离现有产品风格随意改版 |
| `前端工程师` | 实现 React 组件、样式、交互逻辑、数据展示和客户端状态 | 不补写用户未要求且无法验证的功能 |
| `后端/API 工程师` | 维护 `front/server.ts` 中 Express/Vite 服务、Gemini API、错误处理和 fallback | 不提交真实凭据或破坏无密钥运行 |
| `测试与质量工程师` | 设计并运行 lint、build、回归场景和关键用户流程检查 | 不声称未运行的测试已通过 |
| `安全与配置审查员` | 检查环境变量、依赖风险、输入输出边界和密钥泄露风险 | 不绕过安全限制或隐藏风险 |

## 三、执行流程

1. `理解需求`：确认目标结果、受影响页面/接口、约束和验收方式。
2. `检查现状`：阅读相关文件，识别已有组件、类型、数据和服务端逻辑。
3. `制定方案`：选择最小可行改动，说明关键取舍和验证路径。
4. `实施修改`：保持 diff 小而清晰，遵循项目 TypeScript、React 和样式约定。
5. `验证收口`：运行合适检查，报告变更文件、验证结果和剩余风险。

## 四、项目执行底线

- 所有功能描述必须来自用户需求、当前代码或可验证资料。
- 不编造接口、数据、测试结果、外部服务能力或线上状态。
- 不新增依赖，除非用户明确要求或已有方案无法合理完成。
- 不执行破坏性操作，除非用户明确授权。
- 未验证不得宣称完成；无法验证时必须说明原因和替代检查。

# Repository Guidelines

## Project Structure & Module Organization
This repository contains a single React/Vite TypeScript app in `front/`. UI source lives under `front/src/`, with route-level app state in `src/App.tsx`, reusable UI pieces in `src/components/`, vocabulary seed data in `src/data/words.ts`, shared types in `src/types.ts`, and global Tailwind/CSS in `src/index.css`. The Express/Vite development server and Gemini API endpoints are implemented in `front/server.ts`. Static entry files and metadata are at `front/index.html` and `front/metadata.json`.

## Build, Test, and Development Commands
Run commands from `front/`:

- `npm install` — install dependencies from `package-lock.json`.
- `npm run dev` — start the Express server with Vite middleware on port 3000.
- `npm run build` — build the Vite client and bundle `server.ts` to `dist/server.cjs`.
- `npm run start` — run the production bundle after a build.
- `npm run preview` — preview the Vite build.
- `npm run lint` — run TypeScript checks with `tsc --noEmit`.
- `npm run clean` — remove generated build output.

## Coding Style & Naming Conventions
Use TypeScript with React function components. Follow the existing two-space indentation, single-quoted imports, and semicolon style. Name React components in PascalCase (`WordTrainer.tsx`), hooks/state handlers in camelCase (`handleUpdateProfile`), and shared types in PascalCase. Prefer path aliases only where configured (`@/*` maps to `front/*`). Keep UI logic in components and API/server logic in `server.ts`.

## Testing Guidelines
No dedicated test framework is configured yet. For now, treat `npm run lint` and `npm run build` as required checks before submitting changes. If tests are added, place component tests beside the component or in `front/src/__tests__/`, and use names such as `WordTrainer.test.tsx`.

## Commit & Pull Request Guidelines
The repository currently has no committed history to infer a project-specific convention. Use short, imperative commit subjects such as `Add review progress chart` or `Fix Gemini fallback response`. Pull requests should include a concise summary, verification steps, linked issues when applicable, and screenshots or screen recordings for UI changes. Note any environment or API-key assumptions.

## Security & Configuration Tips
Do not commit real secrets. Copy `front/.env.example` to a local env file and set `GEMINI_API_KEY` for AI features. Keep fallback behavior working when the key is absent or invalid.
