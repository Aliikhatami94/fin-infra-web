<!--
PR title convention: [PRxx] Surface – concise summary
Example: [PR12] Insights – Hide resolved and add category badges
-->

## Summary
- What problem does this solve and why now?
- One or two sentences describing the change at a high level.

## Plan mapping
- Plan item: PRxx (from .github/plans.md)
- Acceptance criteria addressed:
	- [ ] …
	- [ ] …

## Scope of changes
- Key changes (bullets):
	- …
	- …
- Non-goals (explicitly out of scope):
	- …

## UI/UX
- Screenshots / recordings (light + dark, desktop + mobile):
	- …
- Accessibility notes (aria, keyboard flows, focus states):
	- …

## Implementation notes
- Brief rationale for key decisions, trade-offs, or patterns chosen.
- Any feature flags or configuration toggles used.

## Testing
Run locally and check:
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] Manual QA in dev server (`pnpm dev`) across key routes
- [ ] Axe/ARIA sanity (keyboard nav, visible focus, labels)

## Performance
- Considerations (deferred charts, virtualization, CLS):
	- …
- Regressions expected? If yes, why acceptable and what’s next:
	- …

## Security & Privacy
- [ ] I have reviewed and completed the checklist in [docs/security-privacy.md](../docs/security-privacy.md).
- [ ] No new secrets introduced and no PII leaked in logs.

## Risk & Rollout
- Risk level (Low/Med/High): …
- Rollout/rollback plan (including flag strategy if any): …

## Dependencies / Migration
- New deps (name@version) and why: …
- Migrations or config changes required: …

## QA checklist
- [ ] Works in latest Chrome, Safari, Firefox
- [ ] Mobile layout verified
- [ ] Dark and light themes verified
- [ ] Vercel preview link added in PR description

## Linked work
- Issues / related PRs: …

## Reviewer notes
- Things to pay extra attention to (files, logic, edge cases): …
