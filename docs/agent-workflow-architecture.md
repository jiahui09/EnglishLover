# AI Agent Workflow Architecture

> Status: Active  
> Last refreshed: 2026-06-18  
> Purpose: replace broad vibe coding with a traceable, sliced, independently reviewed agent workflow for EnglishLover.

## 1. Operating model

EnglishLover should use a quality-first AI workflow:

```text
Fact Pack -> Slice Plan -> Draft Pass -> Critic Pass -> Verifier Gate -> Promote
```

This workflow is designed for product, UI, copy, prompt, and code tasks. It avoids one-shot generation unless the change is trivial and locally verifiable.

Core invariants:

- Evidence before generation.
- One vertical slice before broad expansion.
- Independent critique before promotion.
- Fresh verification before completion claims.
- Transparent AI fallback and no fake certainty.

## 2. Role map

| Layer | Roles / skills | Responsibility | Output |
|---|---|---|---|
| Discovery | `explore`, `researcher`, `dependency-expert` | Find repo facts, official docs, dependency evidence | Fact pack with citations |
| Definition | `$deep-interview`, `$plan`, `analyst` | Clarify goal, scope, success criteria, risks | Slice plan / PRD / test shape |
| Design | `architect`, `designer`, `frontend-design` | Decide boundaries, UI structure, product fit | Design decision and constraints |
| Production | `executor`, `$ultragoal`, `$team` | Implement or draft the approved slice | Code/content artifact + evidence |
| Quality | `critic`, `code-reviewer`, `verifier`, `$ultraqa`, `content-critic` | Challenge facts, quality, tests, edge cases | Verdict with blockers or approval |
| Cleanup | `writer`, `code-simplifier`, `ai-slop-cleaner` | Remove slop, improve clarity, document evidence | Cleaned artifact + regression evidence |

Default execution route:

```text
$deep-interview when ambiguous
-> $plan / $ralplan when tradeoffs or tests need review
-> $ultragoal for durable execution
-> optional $team inside an Ultragoal story for parallel lanes
-> $code-review
-> $ultraqa when behavior or integration risk warrants adversarial QA
```

## 3. Tool and plugin strategy

### Fact tools

- Repository search and file inspection.
- `omx question` only for user preferences that cannot be discovered.
- `researcher` for external official docs.
- `dependency-expert` for package or SDK choices.

### Production tools

- Direct executor work for small, well-scoped edits.
- `$ultragoal` for multi-step durable delivery and ledger evidence.
- `$team` for coordinated parallel workers when slices are independent or require multiple specialist lanes.

### Quality tools

- `content-critic` for generated copy, prompt bundles, UX text, and plan quality.
- `$code-review` for code diffs and architectural risk.
- `$ultraqa` for behavior, degraded paths, stale state, hostile inputs, and misleading success output.
- `ai-slop-cleaner` for changed files after behavior is locked.

### Plugin packaging

The repository keeps project-local skills under `.agents/skills/`. The optional local plugin manifest under `plugins/workflow-core/` documents how this workflow can later be packaged for Codex plugin installation. Do not move workflow authority into the plugin until there is a concrete need to distribute or install it across repositories.

## 4. Slice protocol

Every non-trivial agent task should start with a single slice.

Recommended first product slice for UI work:

```text
今日学习首页 -> 单词专注模式 -> 本轮结果 -> 阅读入口
```

A slice must define:

- Goal: what user-visible or developer-visible result changes.
- Source facts: exact docs, files, types, or test outputs used.
- Non-goals: what the slice will not attempt.
- Quality rubric: criteria from section 5.
- Verification: command, static check, screenshot/manual inspection, or test matrix.
- Stop condition: promote, revise, block, or split.

## 5. Quality rubrics

### Content / copy / prompt quality

| Criterion | Pass condition |
|---|---|
| Factuality | Claims trace to current repo docs or explicit user input |
| Relevance | Output directly supports the current slice and product goal |
| Actionability | User or next agent can act without guessing |
| Voice | Private-coach tone: specific, calm, non-punitive |
| Brevity | No generic motivational filler or repeated summaries |
| AI boundary | AI uncertainty, failure, fallback, and non-standard-answer limits remain transparent |

### UI/product quality

| Criterion | Pass condition |
|---|---|
| Task clarity | User can identify the next action within 10 seconds |
| Focus | Learning flows keep one primary action and hide unrelated navigation |
| Continuity | Word -> reading -> analysis -> advice remains visible |
| Fallback | AI failure does not interrupt daily learning |
| Accessibility | Text, focus, labels, and touch targets remain checkable |

### Code quality

| Criterion | Pass condition |
|---|---|
| Scope | Diff matches the approved slice |
| Source of truth | No duplicated DTOs, invented APIs, or fake real data |
| Maintainability | Reuses existing patterns before new abstractions |
| Verification | Tests/build/static checks or explicit gaps are recorded |
| Reversibility | Changes are small enough to review and revert |

## 6. Required artifacts

For each substantial task, create or update these artifacts as appropriate:

- Fact pack: sources and constraints.
- Slice plan: objective, non-goals, verification, stop condition.
- Draft output: code/content/prompt produced by the generation lane.
- Critic report: factuality, UX/content drift, scope creep, verification gaps.
- Verifier evidence: commands, checks, screenshots, or manual inspection notes.
- Promotion notes: what was accepted, rejected, deferred, and why.

Use `.omx/plans/` for durable plans and `.omx/logs/` / `.omx/state/` for runtime evidence. Do not manually edit transient session state except through supported OMX workflow commands.

## 7. Recommended staffing patterns

| Work shape | Recommended route |
|---|---|
| Small copy/prompt update | `prompt-factory` -> `content-critic` -> manual/static verification |
| UI slice implementation | `frontend-design` -> `executor` -> `content-critic` -> verifier |
| Multi-page feature | `$plan` -> `$ultragoal` -> optional `$team` lanes -> `$code-review` -> `$ultraqa` |
| Refactor/cleanup | cleanup plan -> regression lock -> `ai-slop-cleaner` on changed files -> re-verify |
| External SDK/API decision | `dependency-expert` + `researcher` -> `$plan` -> executor |

## 8. Done definition

A task is done only when:

- All prompt requirements are mapped to an artifact or explicit non-goal.
- The critic verdict is clean or all findings are resolved/deferred with rationale.
- Verification evidence is fresh and read by the leader.
- Known residual risks are reported.
- No unrelated user changes were overwritten or hidden.
