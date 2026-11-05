# EnglishLover Flutter App

This folder contains the Flutter client for EnglishLover AI Coach.

## What lives here

- `lib/src/app.dart` — app entry and theme bootstrap.
- `lib/src/shell/` — shared navigation shell.
- `lib/src/design/` — design tokens and theme mapping.
- `lib/src/components/` — reusable `EL*` components.
- `lib/src/features/` — 今日、单词、阅读、教练 four-screen prototype.

## Run locally

```bash
flutter pub get
flutter run
```

## Design source of truth

- `../DESIGN.md`
- `../docs/README.md`
- `../docs/ai-coach-prd.md`
- `../docs/ai-coach-information-architecture.md`
- `../docs/ai-coach-core-page-copy-and-interactions.md`
- `../docs/ai-coach-ui-design-guidelines.md`
- `../docs/ai-coach-architecture-design.md`

## Implementation notes

- Reuse `ELTokens` and `ELTheme` before adding new hard-coded styles.
- Keep single-action focus mode rules from the docs.
- Preserve transparent AI fallback behavior.
- No project custom fonts, graph libraries, or complex animation libraries yet.
