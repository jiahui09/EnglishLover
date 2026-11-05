# EnglishLover

EnglishLover is an AI English learning coach for exam prep learners.
Its core loop is:

```text
单词背诵 -> 阅读理解 -> 练习解析 -> 教练建议
```

## Repository map

- `app/` — Flutter client.
- `docs/` — product, UX, and workflow documentation.
- `.agents/skills/` — project-local skill docs.
- `plugins/workflow-core/` — packaged workflow skill copies.

## Source of truth

1. `DESIGN.md`
2. `docs/README.md`
3. `docs/ai-coach-prd.md`
4. `docs/ai-coach-information-architecture.md`
5. `docs/ai-coach-core-page-copy-and-interactions.md`
6. `docs/ai-coach-ui-design-guidelines.md`
7. `docs/ai-coach-architecture-design.md`
8. `docs/agent-workflow-architecture.md`

## Current product surfaces

- 今日学习
- 单词训练
- 阅读训练
- 教练建议
- 单词背诵和阅读理解进入专注模式
- 学习画像摘要并入教练建议页
- AI 失败时使用透明的预置阅读降级路径

## App quick start

```bash
cd app
flutter pub get
flutter run
```

## Current implementation notes

- Entry point: `EnglishLoverApp`
- Theme system: `ShadApp`, `ELTheme`, `ELTokens`
- Shell: `ELAppShell`
- Shared components: `ELButton`, `ELCard`, `ELBadge`, `ELStatChip`, `ELLearningPath`, `ELEmptyState`, `ELSectionHeader`
- No project custom fonts, graph libraries, or complex animation libraries yet

## Documentation rules

- Update `DESIGN.md` before changing UI direction.
- Keep PRD, IA, copy, and UI guidelines aligned.
- Preserve transparent AI fallback behavior.
