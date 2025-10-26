# Fin Infra Web — Dashboard Remediation Plan (Oct 26, 2025)

Purpose: Turn the observed UX and reliability issues into a clear, PR-by-PR delivery plan. Each PR is small, independently releasable, and has crisp acceptance criteria and test steps engineers can follow. Work through them in order; raise one PR per section, get it merged, then proceed to the next.

Quick note about scope and style
- App basics: Next.js 15 (App Router), Tailwind v4, shadcn/ui, Radix, strict TS. Paths use `@/*` aliases.
- Layout conventions to keep: max width `max-w-[1200px]`, padding `px-4 sm:px-6 lg:px-10`, sticky header `sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b`, body `py-6 space-y-6`.
- Confirmation flows: Any action that could change money, positions, taxes, sessions, or security must prompt a confirmation dialog with a clear explanation. If not implemented, render the control disabled with a tooltip.

How to work this plan
- Pick the next PR section below (PR-01, PR-02, …), copy the checklist into the PR description, implement, link to files touched, and check off items during review.
- Keep diffs tight. Add focused tests where logic is introduced. Leave notes if anything deviates.

---

## Master sequence
- [ ] PR-01: Global search + command palette polish
- [ ] PR-02: Tooltip ergonomics (increase hit-area, click-to-open fallback)
- [ ] PR-03: Global layout polish (label truncation, number wrapping) + sticky overlays dismissal
- [ ] PR-04: Overview page fixes
- [ ] PR-05: Cash Flow page fixes
- [ ] PR-06: Accounts page fixes
- [ ] PR-07: Portfolio page fixes
- [ ] PR-08: Crypto page fixes
- [ ] PR-09: Transactions page fixes
- [ ] PR-10: Budget page fixes
- [ ] PR-11: Goals page fixes
- [ ] PR-12: Taxes page fixes
- [ ] PR-13: Insights page fixes
- [ ] PR-14: Documents page fixes
- [ ] PR-15: Settings page fixes
- [ ] PR-16: Security Center fixes
- [ ] PR-17: Accessibility sweep (ARIA, keyboard flows) + loading/feedback

---

## PR-01: Global search + command palette polish

Objective: Make “Search or jump to…” functional and non-confusing.

Checklist
- [ ] Reset search state on navigation
	- Use `usePathname()` and `useEffect` to clear Command Input when path changes in `components/command-menu.tsx`.
	- Ensure page-level search bars also clear on route change where applicable.
- [ ] Enter-to-execute behavior
	- When input has a typed query, pressing Enter should either:
		- [ ] Navigate to a lightweight `/search?q=…` page (stub allowed) OR
		- [ ] Show in-dialog results list grouped by “Pages” and “Actions”.
	- Minimal implementation: open a result group with “Navigate to …” items built from `routes`.
- [ ] Autocomplete basics
	- [ ] Show recent queries (localStorage) under “Recent”. Allow clear-all.
	- [ ] Fuzzy match route labels from the existing `routes` array.
- [ ] Visual polish
	- [ ] Ensure input has balanced top padding (already adjusted). Keep `max-w-[580px]` dialog width.
	- [ ] Center close (×) button vertically alongside input (already adjusted). Verify visually.
- [ ] Non-goal
	- Full content search across app data is out of scope; we’re implementing a minimal, useful MVP.

Acceptance criteria
- Clearing: Switch pages; command input is blank each time.
- Enter: Typing “budg” + Enter shows route results including Budget.
- Autocomplete: Typing “port” filters to Portfolio; recent queries show when input is focused and empty.

Test steps
1. Open command menu (⌘/Ctrl+K); type a query; navigate to a page; reopen — input is empty.
2. Type “cash” + Enter → see route suggestion and keyboard-select works.
3. Verify keyboard nav: Up/Down, Enter, Esc close; focus ring visible. 

Files to touch
- `components/command-menu.tsx`
- `components/ui/command.tsx` (if extra structure needed for results)
- Optional stub: `app/search/page.tsx`

---

## PR-02: Tooltip ergonomics

Objective: Tooltips are too finicky (tiny targets). Make them easier to trigger and accessible.

Checklist
- [ ] Wrap metric icons/labels in a larger interactive area (`inline-flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-muted/40`).
- [ ] Add click-to-open fallback (Radix `onOpenChange`) so keyboard and touch users can reveal content.
- [ ] Ensure all tooltips have `aria-describedby` and sensible delays: `delayDuration={150}`.
- [ ] Where tooltips convey critical info (e.g., “vs last month”), also surface a secondary inline helper text on focus.

Acceptance criteria
- Hovering anywhere inside the metric label region shows the tooltip reliably.
- On mobile emulation, tapping shows the tooltip; tapping outside dismisses.

Files to touch
- Scattered: components rendering KPI/metric hints (search `Tooltip`, `HoverCard`).

---

## PR-03: Global layout polish + overlays dismissal

Objective: Fix truncations and persistent overlays.

Checklist
- [ ] Label truncation
	- Ensure time-range and dropdown controls allocate enough width on all breakpoints.
	- Use `truncate` + `max-w-*` + `title` attr or a Tooltip for full text on hover.
- [ ] Numbers truncation
	- Allow wrapping or widen number columns; avoid clipping like `$8,00`.
	- Use `tabular-nums` and `min-w-[ch]` where applicable.
- [ ] Persistent notifications overlay
	- Make overlay components self-dismiss on navigation: listen to `usePathname()` and close on change.
	- Provide explicit Close button.

Acceptance criteria
- No clipped labels on Overview date filter (“6 Months” fully visible) and similar controls across pages.
- Switching pages auto-closes any open notification/overlay.

Files to touch
- `components/*` controls used by Overview, Portfolio, Cash Flow
- Any overlay/notification provider component

---

## PR-04: Overview page fixes

Checklist
- [ ] Time-range dropdown width so “6 Months” doesn’t truncate; add `title` tooltip fallback.
- [ ] Page-level search: Enter triggers a scoped search (or disable with “Coming soon”).
- [ ] Hide Amounts toggle: add tooltip/status text (e.g., “Amounts hidden”) and `aria-pressed`.

Acceptance criteria
- No truncation; search feedback implemented or disabled with tooltip; toggle is clearly stateful.

Files to touch
- `app/(dashboard)/overview/page.tsx` and related filter components

---

## PR-05: Cash Flow page fixes

Checklist
- [ ] Clarify scopes of filters: label global vs cash-flow local controls.
- [ ] Ensure search input doesn’t inherit stale terms from other pages.
- [ ] AI insights: ensure “Why?” affordance has larger click target; show explanation on click.

Acceptance criteria
- Users can tell which filter affects global time vs the chart’s aggregation.
- Search term doesn’t persist from Overview.

Files to touch
- `app/(dashboard)/cash-flow/page.tsx` and components used by filters/insights

---

## PR-06: Accounts page fixes

Checklist
- [ ] Prevent metrics truncation: widen containers or wrap values; use `break-words` where needed.
- [ ] “View credit tips” button: wire to a modal or mark disabled with tooltip.
- [ ] Dismissed insights: add a small toast offering Undo for 5s.
- [ ] Link accounts modal search: implement simple client-side filter.

Acceptance criteria
- No clipped totals; button has a destination or is clearly disabled; Undo toast appears on dismiss.

---

## PR-07: Portfolio page fixes

Checklist
- [ ] Confirm sticky header parity with Crypto (done recently) and keep consistent padding.
- [ ] Clear search term on navigation.
- [ ] High-impact actions (Rebalance/Review Assets): if not implemented, render disabled with tooltip; otherwise prompt confirm dialog.

Acceptance criteria
- No stale query term; actions are either disabled-with-tooltip or confirm via modal.

---

## PR-08: Crypto page fixes

Checklist
- [ ] Wire exchange filter (All/Coinbase/Binance) and grouping toggles to actually filter data (mock filter is fine).
- [ ] Clarify “Stablecoins hidden” with an info tooltip (“Hides USDT/USDC/DAI etc.”).

Acceptance criteria
- Toggling filters visibly changes list/cards and returns when reset.

---

## PR-09: Transactions page fixes

Checklist
- [ ] “Discuss” should explain it requires a selected transaction; disable until selected and add tooltip.
- [ ] High-impact cards (Cashback opportunity, Duplicate charge): add confirmation step before any side effect (even if mock).
- [ ] AI assistant CTA: hide by default; only show after a user-initiated action, and add a disclaimer.

Acceptance criteria
- No dead-end buttons; risky actions require confirmation; assistant appears only on intent.

---

## PR-10: Budget page fixes

Checklist
- [ ] “+” in Auto‑invest Budget: implement modal or disable with tooltip.
- [ ] Increase tooltip hit-areas; allow click-to-open as fallback.
- [ ] Quick edit/settings icons: implement inline edit drawer (mock is fine) or disable clearly.
- [ ] Fix monetary truncation in category table; set flexible widths and wrapping.
- [ ] Chart: add axis labels; ensure long category names truncate with tooltip rather than wrap unpredictably.

Acceptance criteria
- Controls do something or are clearly disabled; numbers visible; chart labeled.

---

## PR-11: Goals page fixes

Checklist
- [ ] Add confirmation for creating a goal.
- [ ] Scenario slider: add numeric input and `aria-label`s; ensure keyboard adjustments work.
- [ ] Cards that suggest opening accounts/contributions: add confirmation dialogs and disclaimers.
- [ ] Prevent target number truncation; ensure cards scale.

Acceptance criteria
- Accessible slider; confirmations present; no clipped values.

---

## PR-12: Taxes page fixes

Checklist
- [ ] Add explanatory interstitial for “Plan Tax Loss Harvesting”.
- [ ] Gate deadline action buttons behind acknowledgment toggle; disable until checked.
- [ ] Update withholding card: add detailed context + confirmation.
- [ ] Clearly label “What‑If” tools as simulations; no side effects.
- [ ] Document list: add note if downloads disabled in environment; keep buttons disabled with tooltip.

Acceptance criteria
- Users get context before actions; simulations are labeled; downloads clarified.

---

## PR-13: Insights page fixes

Checklist
- [ ] Remove duplication with global search or ensure scopes are distinct.
- [ ] Add loading state for tab switches.
- [ ] High-impact actions show confirmation or are disabled with tooltip.
- [ ] “Resolved” insights are viewable via a filter.

Acceptance criteria
- Tabs load gracefully; actions are safe; resolved list accessible.

---

## PR-14: Documents page fixes

Checklist
- [ ] Task actions (Send reminder, Complete, Reschedule, Discuss) require confirmation; if not implemented, disable with tooltip.
- [ ] Ellipsis menu actions: wire basic menu with disabled states if needed.
- [ ] Upload button: disabled with tooltip in environments without file uploads.
- [ ] Search inside documents: simple client-side filter for visible data.

Acceptance criteria
- No dead controls; documents can be filtered; feature-flag uploads.

---

## PR-15: Settings page fixes

Checklist
- [ ] Toggles show a toast “Saved” when changed; keyboard toggling supported; `aria-pressed` provided.
- [ ] “Reset to Defaults” only appears where applicable or opens a modal to confirm reset.

Acceptance criteria
- State changes acknowledged; reset is explicit.

---

## PR-16: Security Center fixes

Checklist
- [ ] “End sessions” requires confirmation with details of the session being ended.
- [ ] Export/masking downloads: disabled with tooltip when unsupported.
- [ ] Backup phone: hide fully by default; “Reveal” control with confirmation and timer.
- [ ] Alert toggles: ensure they actually call mock handlers; add success feedback.

Acceptance criteria
- Sensitive actions require confirmation; privacy improved; user feedback present.

---

## PR-17: Accessibility + loading/feedback sweep

Checklist
- [ ] Add ARIA labels for toggles, sliders, dropdown triggers; ensure tab order is sensible.
- [ ] Modals: Esc to close, focus trapping, and close button accessible names.
- [ ] Keyboard navigation through command menu and page searches verified.
- [ ] Add loading indicators for Insights and Documents where data would fetch.

Acceptance criteria
- Keyboard-only run-through succeeds across main flows; screen-reader labels read meaningfully.

---

## Engineering footnotes
- Prefer small, vertical PRs; avoid combining unrelated pages.
- Use feature flags for risky CTAs; default to disabled in non-prod.
- When disabling, add a tooltip like “Coming soon” or “Requires confirmation in production”.
- Add minimal tests when introducing logic (e.g., search state reset, confirmation guards).

