---
name: content-critic
description: Independently review EnglishLover AI-generated content, prompt bundles, plans, docs, UX copy, and page text for factuality, product fit, coach voice, hallucination risk, scope creep, and verification gaps. Use after a draft is produced and before it is promoted or implemented.
---

# Content Critic

Review generated artifacts independently. Do not rewrite the artifact unless the user explicitly asks for a revision pass; default output is a verdict with findings.

## Evidence sources

Prioritize:

1. `DESIGN.md`
2. `docs/README.md`
3. `docs/ai-coach-prd.md`
4. `docs/ai-coach-information-architecture.md`
5. `docs/ai-coach-core-page-copy-and-interactions.md`
6. `docs/ai-coach-ui-design-guidelines.md`
7. `docs/ai-coach-architecture-design.md`
8. `docs/agent-workflow-architecture.md`
9. Current code or plan files relevant to the slice

## Product invariants

- Core loop: `单词背诵 -> 阅读理解 -> 练习解析 -> 教练建议`.
- Word training and reading comprehension enter focus mode; reading focus mode covers generation, preset reading, reading text, answering, and analysis states.
- Focus mode hides unrelated navigation, learning profile summary, historical stats, and competing recommendations.
- AI generation failures keep the learning loop alive through retry or preset reading.
- Learning profile is a learning-profile summary inside the coach-advice page in the first release, not a competing primary tab.
- UI style is calm, minimal, light Material, inclusive, and token/component driven.

## Review checklist

- Factuality: every concrete claim traces to repository evidence or user input.
- Product fit: output supports the learning loop rather than adding distracting scope.
- Voice: private-coach, specific, calm, non-punitive, no generic hype.
- Actionability: next user or agent can act without guessing.
- AI boundary: uncertainty, fallback, and non-standard-answer wording remain transparent.
- UX clarity: one primary action in learning flows; focus mode rules are preserved.
- Design fit: Gestalt grouping, minimal information, light Material hierarchy, inclusive scenarios, and atomic components are not contradicted.
- Verification: output states how it will be tested or inspected.

## Verdict format

```markdown
## Verdict
APPROVE | REVISE | BLOCK

## Findings
- [severity] <issue> — evidence: `<path>`; fix: <specific action>

## Missing evidence
- <unknown or unchecked area>

## Promotion condition
<what must be true before this artifact can be used>
```

## Severity

- `blocker`: factual contradiction, invented API/data, unsafe or misleading AI claim, impossible verification.
- `major`: product drift, vague content, missing fallback, weak testability, or focus-mode breakage.
- `minor`: wording clarity, small consistency issue, formatting.
