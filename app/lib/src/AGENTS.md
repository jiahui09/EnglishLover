# APP SRC KNOWLEDGE BASE

## OVERVIEW

`app/lib/src/` contains the current EnglishLover product implementation: app shell, design tokens, shared prototype state/data, reusable `EL*` components, and four feature screens.

## STRUCTURE

```text
src/
|-- app.dart                 # ShadApp wrapper and theme bootstrap
|-- shell/                   # navigation shell and focus-mode nav suppression
|-- design/                  # ELTokens and ELTheme
|-- components/              # ELButton, ELCard, ELPageShell, ELFocusShell, ELLearningPath
|-- shared/                  # LearningSessionController and mock_learning_data
`-- features/                # home, words, reading, coach screens
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Theme colors/spacing/radius | `design/el_tokens.dart` | Add raw constants here first. |
| shadcn/Material mapping | `design/el_theme.dart` | Light/dark theme and navigation themes. |
| Navigation and focus mode | `shell/el_app_shell.dart` | Owns `LearningSessionController`, bottom nav/rail hiding. |
| Learning state | `shared/learning_session.dart` | Word feedback, reading stage, coach progress. |
| Prototype data | `shared/mock_learning_data.dart` | Words, reading, questions, coach insights; mock only. |
| Reusable UI | `components/` | Extend `EL*` wrappers before page-local styles. |
| Product screens | `features/home|words|reading|coach/` | Four current surfaces. |

## CONVENTIONS

- Use `ELTokens` for spacing, color, radius, elevation, breakpoints, and page padding.
- Use `ELTheme.colorsOf(context)` for semantic colors; do not reach directly for raw color literals in pages.
- Use `ELButton`, `ELCard`, `ELBadge`, `ELStatChip`, `ELLearningPath`, `ELEmptyState`, `ELSectionHeader`, `ELPageShell`, and `ELFocusShell` before creating new component shapes.
- Focus-mode word/reading screens hide ordinary navigation and preserve one primary action.
- Coach advice uses the pattern `判断 / 原因 / 下一步`; data-poor states must say so plainly.
- Keep page text in the calm private-coach voice from the docs.

## ANTI-PATTERNS

- Do not scatter hard-coded colors, radii, shadows, or page-specific button styles.
- Do not bypass `EL*` wrappers just to reach raw shadcn/Material controls.
- Do not add a second primary CTA to a learning screen.
- Do not make the learning-profile summary a primary navigation tab.
- Do not make mock data look like authenticated history, synced state, or AI output.
- Do not add complex dashboards, rankings, or decorative statistics that do not lead to the next action.

## VERIFICATION

```bash
cd app
flutter analyze
flutter test
```

For UI changes, also inspect mobile behavior around home clarity, word focus, reading focus, AI fallback/preset reading, and coach advice.
