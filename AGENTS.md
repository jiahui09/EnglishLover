# EnglishLover Agent Workflow Contract

This repository uses the user-level OMX engineering charter plus this project-level contract for AI-agent-assisted work.

## Source of truth order

1. Product and UX truth: `DESIGN.md`, `docs/ai-coach-prd.md`, `docs/ai-coach-information-architecture.md`, `docs/ai-coach-core-page-copy-and-interactions.md`, `docs/ai-coach-ui-design-guidelines.md`.
2. Agent workflow truth: `docs/agent-workflow-architecture.md` and project-local skills under `.agents/skills/`.
3. Runtime plans and evidence: `.omx/plans/`, `.omx/logs/`, `.omx/state/`.

## Default delivery workflow

Use a quality-first sliced workflow instead of broad one-shot generation:

```text
fact pack -> slice plan -> draft -> independent critique -> verification gate -> promote
```

Rules:

- Gather repository facts before generating UI, content, code, prompts, or plans.
- Work in one vertical slice at a time unless the plan explicitly approves parallel lanes.
- Do not let the same agent both generate and approve a critical artifact.
- Preserve the current product constraints: no invented APIs, no fake Mock-as-real data, no unverified completion claims, and transparent AI fallback behavior.
- Prefer `$ultragoal` for durable execution; combine `$team` with `$ultragoal` only when independent lanes need coordinated parallel work. Use `$ralph` only for explicit single-owner persistence/fix loops.

## Required gates for agent-generated work

Before implementation:

- Fact pack cites current repository sources.
- Slice objective and stop condition are explicit.
- Quality rubric is selected from `docs/agent-workflow-architecture.md`.

Before claiming completion:

- Critique has checked factuality, UX/content drift, scope creep, and verification gaps.
- Verification has fresh evidence from tests, build, static checks, or explicit manual inspection notes.
- Remaining risks and unverified areas are reported.

## Project-local skills

- `prompt-factory`: create small, evidence-backed prompt/context bundles for a single slice.
- `content-critic`: independently review generated content, prompts, UI copy, and plans against EnglishLover product truth.
- `frontend-design`: preserve the existing distinctive UI/design guidance.
