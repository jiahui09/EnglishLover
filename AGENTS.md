# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-02 Asia/Shanghai
**Commit:** 418866f
**Branch:** main

## OVERVIEW

EnglishLover is a Flutter AI English learning coach for exam-prep learners. The product loop is `单词背诵 -> 阅读理解 -> 练习解析 -> 教练建议`, with focus mode for word/reading work and transparent preset-reading fallback when AI is unavailable.

## STRUCTURE

```text
EnglishLover/
|-- DESIGN.md                     # active product/design source of truth
|-- docs/                         # PRD, IA, copy, UI, architecture, workflow truth
|-- app/                          # Flutter client and generated platform shells
|   |-- lib/main.dart              # runApp -> EnglishLoverApp
|   |-- lib/src/app.dart           # ShadApp + ELTheme + ELAppShell
|   `-- lib/src/                  # feature, component, token, shell, mock data code
|-- scripts/check-agent-workflow.py
`-- plugins/workflow-core/        # distributable copies of workflow skills
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Product or UX truth | `DESIGN.md`, then `docs/README.md` | Keep source order stable. |
| Scope and acceptance | `docs/ai-coach-prd.md` | P0/P1/P2 and learning loop. |
| Navigation and focus mode | `docs/ai-coach-information-architecture.md` | Focus mode hides unrelated navigation. |
| Page copy and states | `docs/ai-coach-core-page-copy-and-interactions.md` | Coach voice and state text. |
| Visual/component rules | `docs/ai-coach-ui-design-guidelines.md` | Tokens, atomic layers, one primary action. |
| System architecture | `docs/ai-coach-architecture-design.md` | AI/fact/mock boundaries and future backend. |
| Flutter app code | `app/lib/src/` | See nested `app/AGENTS.md` and `app/lib/src/AGENTS.md`. |
| Agent workflow | `docs/agent-workflow-architecture.md` | Fact pack -> slice -> draft -> critique -> verify. |

## CODE MAP

| Symbol/File | Type | Location | Refs | Role |
|---|---|---:|---:|---|
| `main()` | entry | `app/lib/main.dart` | unmeasured | Starts `EnglishLoverApp`. |
| `EnglishLoverApp` | widget | `app/lib/src/app.dart` | unmeasured | Configures `ShadApp`, light/dark themes, shell. |
| `ELAppShell` | stateful shell | `app/lib/src/shell/el_app_shell.dart` | unmeasured | Owns page navigation, focus-mode nav hiding, session controller. |
| `LearningSessionController` | state model | `app/lib/src/shared/learning_session.dart` | unmeasured | Tracks word, reading, quiz, coach-progress state. |
| `mock_learning_data.dart` | prototype data | `app/lib/src/shared/mock_learning_data.dart` | unmeasured | Current words, reading, questions, coach insights; not real history. |
| `ELTokens` | design tokens | `app/lib/src/design/el_tokens.dart` | unmeasured | Colors, spacing, radius, shadows, breakpoints. |
| `ELTheme` | theme adapter | `app/lib/src/design/el_theme.dart` | unmeasured | Maps tokens into `shadcn_ui` and Material themes. |
| `EL*` components | component layer | `app/lib/src/components/` | unmeasured | Business-semantic wrappers around shadcn/Flutter primitives. |
| `HomePage`/`WordsPage`/`ReadingPage`/`CoachPage` | screens | `app/lib/src/features/` | unmeasured | Four current product surfaces. |

Reference counts are unmeasured; use Dart LSP, `flutter analyze`, and direct file inspection for fresh centrality evidence.

## CONVENTIONS

- Product/content/UI work starts from a fact pack, then a narrow slice, then independent critique before promotion.
- The delivery workflow remains `fact pack -> slice plan -> draft -> independent critique -> verification gate -> promote`.
- Use `prompt-factory` for evidence-backed prompt/context bundles and `content-critic` for independent product/copy/prompt/doc critique.
- Source-of-truth order: `DESIGN.md` -> `docs/README.md` -> PRD -> IA -> copy/interactions -> UI guidelines -> architecture -> current app code -> workflow docs/skills.
- UI changes must reuse `ELTokens`, `ELTheme`, and existing `EL*` components before adding page-local styling.
- Keep learning-profile summary inside coach advice; do not add it as a competing primary tab.
- The app currently uses Flutter SDK `^3.12.2`, `shadcn_ui`, `cupertino_icons`, and `flutter_lints`.

## ANTI-PATTERNS (THIS PROJECT)

- Do not invent backend APIs, real history, or AI behavior beyond current docs/code.
- Do not present `mock_learning_data.dart` as persisted user data or backend capability.
- Do not hide AI failure; preset reading fallback must be transparent.
- Do not bypass `EL*` wrappers or scatter raw colors/radii in pages without first checking tokens/components.
- Do not use green as the brand primary; Oxford Blue and Word Ochre define the current identity.
- Do not add dashboards, rankings, heavy charts, community, store, course center, or AI chat lobby to the first-release scope.

## UNIQUE STYLES

- Voice: calm private coach, specific next action, non-punitive error copy.
- Primary UI surfaces use Chinese product terms: 今日学习, 单词训练, 阅读训练, 教练建议, 专注模式, 预置阅读, 学习画像摘要.
- Visual direction: warm paper background, Oxford Blue primary, Word Ochre vocabulary emphasis, restrained elevation, mobile-first focus.
- Learning pages should make the next action clear within 10 seconds and keep only one dominant CTA per screen.

## COMMANDS

```bash
python scripts/check-agent-workflow.py
cd app
flutter pub get
flutter analyze
flutter test
flutter run
```

## NOTES

- Existing generated platform folders under `app/android`, `app/ios`, `app/macos`, `app/linux`, `app/windows`, and `app/web` are scaffold/platform surfaces; prefer app-level guidance unless a platform task is explicit.
- `.github/workflows/consistency-gate.yml` and `.githooks/pre-commit` currently reference Node/Go or `backend`/`front` paths that are not present in this checkout; treat them as stale until refreshed.
- `plugins/workflow-core/skills/` mirrors workflow skill copies. Keep it aligned with project-local skill sources when shared instructions change.
- Before claiming completion, record fresh verification evidence: tests, build/static checks, screenshot/manual notes, or explicit gaps.
