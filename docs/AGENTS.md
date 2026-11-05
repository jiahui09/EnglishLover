# DOCS KNOWLEDGE BASE

## OVERVIEW

`docs/` is the product, UX, architecture, copy, and agent-workflow authority for EnglishLover. It governs the Flutter prototype when product behavior, page text, visual direction, or AI boundaries are in question.

## WHERE TO LOOK

| Task | File | Notes |
|---|---|---|
| Reading order and terminology | `README.md` | Shared terms and update checklist. |
| Product scope | `ai-coach-prd.md` | P0/P1/P2, acceptance, learning loop. |
| Screen hierarchy | `ai-coach-information-architecture.md` | Navigation, focus-mode structure, page states. |
| Page copy and interactions | `ai-coach-core-page-copy-and-interactions.md` | User-facing text, boundaries, state copy. |
| UI rules | `ai-coach-ui-design-guidelines.md` | Gestalt, minimalism, tokens, components, responsive checks. |
| System design | `ai-coach-architecture-design.md` | Fact/inference/AI/mock layering, fallback, future backend. |
| Agent workflow | `agent-workflow-architecture.md` | Sliced work, critique, verification gates. |

## CONVENTIONS

- Update `../DESIGN.md` first when product principles, UI direction, or implementation constraints change.
- Keep these terms aligned exactly: 今日学习, 单词训练, 阅读训练, 教练建议, 专注模式, 单词专注模式, 阅读专注模式, 预置阅读, 学习画像摘要.
- When docs conflict, update the older or narrower source instead of silently choosing one.
- Major doc/code slices need fact pack, slice objective, quality rubric, independent critique, and verification evidence.
- Content should point to the next learning action; avoid generic encouragement or statistics detached from action.

## ANTI-PATTERNS

- Do not duplicate DTOs, APIs, or backend contracts that are not implemented or explicitly planned.
- Do not blur learning facts, derived judgments, AI output, preset content, and mock/prototype data.
- Do not describe AI output as certain, factual, or always available; failure and fallback are product states.
- Do not add scope that competes with the daily loop: word training, reading, analysis, coach advice.
- Do not promote generated content without `content-critic` or an equivalent independent review pass.

## VERIFICATION

```bash
python scripts/check-agent-workflow.py
```

Also run app checks when a doc change alters UI behavior, copy implemented in Flutter, focus mode, fallback behavior, or component rules.
