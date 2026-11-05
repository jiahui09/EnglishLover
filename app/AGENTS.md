# APP KNOWLEDGE BASE

## OVERVIEW

`app/` is the Flutter client. Treat generated platform folders as scaffold unless a task explicitly targets Android, iOS, macOS, Linux, Windows, or web behavior.

## STRUCTURE

```text
app/
|-- pubspec.yaml              # Flutter SDK ^3.12.2, shadcn_ui, cupertino_icons, flutter_lints
|-- analysis_options.yaml     # flutter_lints baseline
|-- lib/main.dart             # entry point
|-- lib/src/                  # product implementation; see nested AGENTS.md
|-- test/widget_test.dart     # current widget coverage for home/focus navigation
`-- android|ios|macos|linux|windows|web/  # generated platform shells
```

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| App bootstrap | `lib/main.dart`, `lib/src/app.dart` | `ShadApp`, `ELTheme`, `ELAppShell`. |
| Product code | `lib/src/` | Feature/component/token guidance is nested there. |
| Current tests | `test/widget_test.dart` | Checks home render and focus-mode nav hiding. |
| Flutter dependencies | `pubspec.yaml` | No custom font, graph, or complex animation dependency yet. |
| Analyzer rules | `analysis_options.yaml` | Uses `package:flutter_lints/flutter.yaml`. |

## CONVENTIONS

- Run Flutter commands from this directory, not repo root.
- Prefer editing `lib/src/` for product work; platform folders are usually generated output.
- Keep `flutter_lints` clean for touched Dart files.
- UI/product changes must stay aligned with `../DESIGN.md` and `../docs/` before implementation claims.
- The current tests use a 390 x 844 mobile viewport and assert focus mode hides `NavigationBar`.

## ANTI-PATTERNS

- Do not add platform-specific changes to fix ordinary product UI unless the bug is platform-only.
- Do not add package dependencies for fonts, charts, or complex animation without updating design docs first.
- Do not treat prototype data as storage, sync, auth, or backend behavior.
- Do not claim a UI change is complete without `flutter analyze`, relevant widget tests, and visual/manual evidence when the surface changes.

## COMMANDS

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```
