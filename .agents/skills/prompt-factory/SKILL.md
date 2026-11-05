---
name: prompt-factory
description: Build evidence-backed prompt/context bundles for one EnglishLover agent slice. Use when Codex needs to prepare prompts, AI Studio input packs, task handoffs, or generation instructions that must cite repository facts, preserve product constraints, and avoid broad vibe-coding context dumps.
---

# Prompt Factory

Create small prompt bundles for a single slice. Do not generate broad all-project prompts unless the user explicitly asks for a distribution package.

## Inputs to collect

- Slice objective and stop condition.
- Source facts from `DESIGN.md`, `docs/README.md`, and relevant `docs/` files.
- Existing implementation facts from inspected files under `app/lib/src/`.
- Non-goals and prohibited shortcuts.
- Verification or review criteria.

## Product constraints to preserve

- Core loop: `单词背诵 -> 阅读理解 -> 练习解析 -> 教练建议`.
- Word and reading flows enter focus mode and keep one primary action; reading focus mode starts at reading generation and continues through preset reading, text, answering, and analysis.
- Learning profile stays as a summary inside the coach-advice page, not a primary navigation item.
- AI failure must keep retry or preset-reading fallback transparent.
- Coach voice is calm, specific, and non-punitive.
- Reuse `ELTokens`, `ELTheme`, and existing `EL*` components before new patterns.

## Bundle format

```markdown
# Prompt Bundle: <slice>

## Objective
<one concrete outcome>

## Source facts
- `<path>` — <fact>

## Constraints
- <must obey>
- <must not do>

## Generation task
<single slice task for the generator>

## Quality rubric
- <criteria>

## Verification handoff
- <command/check/manual inspection>

## Stop condition
Promote / revise / block when <condition>.
```

## Rules

- Keep bundles short enough for the target generator to follow without losing priorities.
- Prefer references to full source dumps.
- Include only facts relevant to the current slice.
- State AI boundaries and fallback behavior when content generation is involved.
- Never ask a downstream generator to invent APIs, use fake real data, or skip verification.
- If docs disagree, point to the conflict instead of hiding it in the prompt.
