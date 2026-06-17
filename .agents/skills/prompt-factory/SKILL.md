---
name: prompt-factory
description: Build evidence-backed prompt/context bundles for one EnglishLover agent slice. Use when Codex needs to prepare prompts, AI Studio input packs, task handoffs, or generation instructions that must cite repository facts, preserve product constraints, and avoid broad vibe-coding context dumps.
---

# Prompt Factory

Create small prompt bundles for a single slice. Do not generate broad all-project prompts unless the user explicitly asks for a distribution package.

## Inputs to collect

- Slice objective and stop condition.
- Source facts from `DESIGN.md` and relevant `docs/` files.
- Existing implementation facts from inspected files.
- Non-goals and prohibited shortcuts.
- Verification or review criteria.

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
