# EnglishLover Docs

This folder is the product and workflow reference for EnglishLover.

## Recommended reading order

1. `DESIGN.md`
2. `docs/ai-coach-prd.md`
3. `docs/ai-coach-information-architecture.md`
4. `docs/ai-coach-core-page-copy-and-interactions.md`
5. `docs/ai-coach-ui-design-guidelines.md`
6. `docs/ai-coach-architecture-design.md`
7. `docs/agent-workflow-architecture.md`

## What each doc answers

| Doc | Answers | Update when |
|---|---|---|
| `DESIGN.md` | What the product should feel like and what the UI must obey | Product direction, visual language, component contract, or constraints change |
| `ai-coach-prd.md` | What the product is, who it serves, and what the first release must do | Scope, priorities, or success criteria change |
| `ai-coach-information-architecture.md` | How screens and navigation fit together | Routes, hierarchy, or focus-mode structure changes |
| `ai-coach-core-page-copy-and-interactions.md` | What each page says and how it responds | Page text, state copy, or interaction details change |
| `ai-coach-ui-design-guidelines.md` | How the product should look and behave visually | Layout, tokens, component rules, or responsive behavior change |
| `ai-coach-architecture-design.md` | How the whole learning system, target technical architecture, backend stack, front/back responsibilities, domain boundaries, AI fallback, data evidence, performance, compatibility, and quality attributes fit together | System architecture decisions, backend technical choices, domain boundaries, quality attributes, or cross-cutting constraints change |
| `agent-workflow-architecture.md` | How to produce and review docs or code slices safely | Workflow, review order, or artifact requirements change |

## Shared terms

Keep these terms aligned across docs:

- 今日学习
- 单词训练
- 阅读训练
- 教练建议
- 专注模式
- 单词专注模式
- 阅读专注模式
- 预置阅读
- 学习画像摘要

## Change checklist

- Update `DESIGN.md` first when principles or constraints change.
- Update PRD before changing scope.
- Update IA before changing navigation or page structure.
- Update copy before changing page text.
- Update UI guidelines before changing visual or component rules.
- Run doc verification, content review, and relevant app checks before promoting large changes.
