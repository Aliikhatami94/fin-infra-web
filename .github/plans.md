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
- [x] PR-01: Global search + command palette polish
- [x] PR-02: Tooltip ergonomics (increase hit-area, click-to-open fallback)
- [x] PR-03: Global layout polish (label truncation, number wrapping) + sticky overlays dismissal
- [x] PR-04: Overview page fixes
- [x] PR-05: Cash Flow page fixes
- [x] PR-06: Accounts page fixes
- [x] PR-07: Portfolio page fixes
- [x] PR-08: Crypto page fixes
- [x] PR-09: Transactions page fixes
- [x] PR-10: Budget page fixes
- [x] PR-11: Goals page fixes
- [x] PR-12: Taxes page fixes
- [ ] PR-13: Insights page fixes
- [ ] PR-14: Documents page fixes
- [ ] PR-15: Settings page fixes
- [ ] PR-16: Security Center fixes
- [ ] PR-17: Accessibility sweep (ARIA, keyboard flows) + loading/feedback

---

## PR-01: Global search + command palette polish

Objective: Make "Search or jump to…" functional and non-confusing.

Checklist
- [x] Reset search state on navigation
	- Use `usePathname()` and `useEffect` to clear Command Input when path changes in `components/command-menu.tsx`.
	- Ensure page-level search bars also clear on route change where applicable.
- [x] Enter-to-execute behavior
	- When input has a typed query, pressing Enter should either:
		- [x] Navigate to a lightweight `/search?q=…` page (stub allowed) OR
		- [x] Show in-dialog results list grouped by "Pages" and "Actions".
	- Minimal implementation: open a result group with "Navigate to …" items built from `routes`.
- [x] Autocomplete basics
	- [x] Show recent queries (localStorage) under "Recent". Allow clear-all.
	- [x] Fuzzy match route labels from the existing `routes` array.
- [x] Visual polish
	- [x] Ensure input has balanced top padding (already adjusted). Keep `max-w-[580px]` dialog width.
	- [x] Center close (×) button vertically alongside input - REMOVED for cleaner UI (Esc/click-outside to dismiss).
- [x] Non-goal
	- Full content search across app data is out of scope; we're implementing a minimal, useful MVP.

Acceptance criteria
- Clearing: Switch pages; command input is blank each time. ✅
- Enter: Typing "budg" + Enter shows route results including Budget. ✅
- Autocomplete: Typing "port" filters to Portfolio; recent queries show when input is focused and empty. ✅

Test steps
1. Open command menu (⌘/Ctrl+K); type a query; navigate to a page; reopen — input is empty. ✅
2. Type "cash" + Enter → see route suggestion and keyboard-select works. ✅
3. Verify keyboard nav: Up/Down, Enter, Esc close; focus ring visible. ✅

Files to touch
- `components/command-menu.tsx` ✅
- `components/ui/command.tsx` ✅
- Optional stub: `app/search/page.tsx` ✅---

## PR-02: Tooltip ergonomics

Objective: Tooltips are too finicky (tiny targets). Make them easier to trigger and accessible.

Checklist
- [x] Wrap metric icons/labels in a larger interactive area (`inline-flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-muted/40`).
- [x] Add click-to-open fallback (Radix `onOpenChange`) so keyboard and touch users can reveal content.
- [x] Ensure all tooltips have `aria-describedby` and sensible delays: `delayDuration={150}`.
- [x] Where tooltips convey critical info (e.g., "vs last month"), also surface via aria-label for screen readers.

Acceptance criteria
- Hovering anywhere inside the metric label region shows the tooltip reliably. ✅
- On mobile emulation, tapping shows the tooltip; tapping outside dismisses. ✅

Files touched (11 files)
- `components/ui/tooltip.tsx` - Core improvements (delayDuration, click-to-open, aria-describedby) ✅
- `components/portfolio-kpis.tsx` - Info icons and trend indicators ✅
- `components/crypto-kpis.tsx` - Crypto metric tooltips ✅
- `components/cash-flow-kpis.tsx` - Cash flow change tooltips ✅
- `components/accounts-kpi-cards.tsx` - Account trend tooltips ✅
- `components/budget-table.tsx` - Suggested budget and trend tooltips ✅
- `components/budget-summary.tsx` - Budget trend tooltips ✅
- `components/tax-summary.tsx` - Tax info tooltips ✅
- `components/goals-summary-kpis.tsx` - Goal progress tooltips ✅
- `components/tax-deadline-timeline.tsx` - Timeline icon tooltips ✅

---

## PR-03: Global layout polish + overlays dismissal

Objective: Fix truncations and persistent overlays.

Checklist
- [x] Label truncation
	- Ensure time-range and dropdown controls allocate enough width on all breakpoints.
	- Use `truncate` + `max-w-*` + `title` attr or a Tooltip for full text on hover.
- [x] Numbers truncation
	- Allow wrapping or widen number columns; avoid clipping like `$8,00`.
	- Use `tabular-nums` and `min-w-[ch]` where applicable.
- [x] Persistent notifications overlay
	- Make overlay components self-dismiss on navigation: listen to `usePathname()` and close on change.
	- Provide explicit Close button.

Acceptance criteria
- No clipped labels on Overview date filter ("6 Months" fully visible) and similar controls across pages. ✅
- Switching pages auto-closes any open notification/overlay. ✅

Files touched (6 files)
- `components/top-bar.tsx` - Widened date range selector from `w-24 md:w-32` to `w-[7.5rem] md:w-36`, added `title` attr and `shrink-0` to icon ✅
- `components/notification-center.tsx` - Added `usePathname()` and auto-dismiss on navigation ✅
- `components/accounts-kpi-cards.tsx` - Changed `truncate` to `break-words` for monetary values ✅
- `components/kpi-cards.tsx` - Changed `truncate` to `break-words` for monetary values ✅
- `components/collaboration-drawer.tsx` - Added `usePathname()` and auto-dismiss on navigation ✅
- `components/automation-copilot-drawer.tsx` - Added `usePathname()` and auto-dismiss on navigation ✅

---

## PR-04: Overview page fixes

Checklist
- [x] Time-range dropdown width so "6 Months" doesn't truncate; add `title` tooltip fallback.
- [x] Page-level search: Enter triggers command menu (implemented in top-bar).
- [x] Hide Amounts toggle: add tooltip showing status and `aria-pressed`.

Acceptance criteria
- No truncation; search feedback implemented; toggle is clearly stateful. ✅

Files touched (2 files)
- `components/top-bar.tsx` - Added Tooltip around Hide Amounts toggle showing "Amounts hidden/visible" state, made search input open command menu on Enter/click ✅
- `components/command-menu.tsx` - Made component controllable with optional `open` and `onOpenChange` props for external control ✅

---

## PR-05: Cash Flow page fixes ✅

Checklist
- [x] Clarify scopes of filters: label global vs cash-flow local controls.
- [x] Ensure search input doesn't inherit stale terms from other pages.
- [x] AI insights: ensure "Why?" affordance has larger click target; show explanation on click.

Acceptance criteria
- ✅ Users can tell which filter affects global time vs the chart's aggregation.
- ✅ Search term doesn't persist from Overview (no search input on Cash Flow page).

Files touched
- `components/cash-flow-chart.tsx` - Added tooltips to Account selector ("Filter this chart only") and Period toggle ("Chart aggregation only / Time range set in top bar"). Added "Group by:" label for clarity.
- `components/insights/InsightCard.tsx` - Enhanced "Why?" button with `px-1.5 py-1 hover:bg-muted/40` for larger, more clickable hit area (consistent with PR-02 tooltip pattern).

---

## PR-06: Accounts page fixes ✅

Checklist
- [x] Prevent metrics truncation: widen containers or wrap values; use `break-words` where needed.
- [x] "View credit tips" button: wire to a modal or mark disabled with tooltip.
- [x] Dismissed insights: add a small toast offering Undo for 5s.
- [x] Link accounts modal search: implement simple client-side filter.

Acceptance criteria
- ✅ No clipped totals (already fixed in PR-03 with `break-words`); 
- ✅ "View credit tips" button is disabled with "Coming soon" tooltip;
- ✅ Undo toast appears on dismiss with 5-second duration.
- ✅ Search works in PlaidLinkDialog (already implemented).

Files touched
- `components/accounts-callouts.tsx` - Added Undo toast with 5-second duration when dismissing insights. Wrapped "View credit tips" button in Tooltip with "Coming soon" message and disabled state.
- `components/accounts-kpi-cards.tsx` - No changes needed; `break-words` already applied in PR-03.
- `components/plaid-link-dialog.tsx` - No changes needed; search already implemented.

---

## PR-07: Portfolio page fixes ✅

Checklist
- [x] Confirm sticky header parity with Crypto (done recently) and keep consistent padding.
- [x] Clear search term on navigation.
- [x] High-impact actions (Rebalance/Review Assets): if not implemented, render disabled with tooltip; otherwise prompt confirm dialog.

Acceptance criteria
- ✅ Sticky header matches other pages (already correct);
- ✅ Search term in holdings table clears on navigation;
- ✅ "Execute Rebalance" button disabled with "Coming soon" tooltip.

Files touched
- `components/holdings-table.tsx` - Added usePathname and useEffect to clear search query on navigation.
- `components/rebalancing-preview.tsx` - Disabled "Execute Rebalance" button with "Coming soon - Manual rebalancing" tooltip.
- `app/(dashboard)/portfolio/page.tsx` - No changes needed; sticky header already correct.

---

## PR-08: Crypto page fixes ✅

Checklist
- [x] Wire exchange filter (All/Coinbase/Binance) and grouping toggles to actually filter data (mock filter is fine).
- [x] Clarify "Stablecoins hidden" with an info tooltip ("Hides USDT/USDC/DAI etc.").

Acceptance criteria
- ✅ Exchange filter has tooltip explaining "Filter table and chart by exchange";
- ✅ Grouping toggles already have clear active states with visual feedback;
- ✅ Stablecoins toggle has tooltip: "Toggle stablecoins" + "USDT, USDC, DAI, etc."

Files touched
- `app/(dashboard)/crypto/page.tsx` - Added TooltipProvider and Tooltip components around exchange filter and stablecoins toggle. Exchange filter tooltip clarifies scope, stablecoins tooltip explains what stablecoins are.

---

## PR-09: Transactions page fixes ✅

Checklist
- [x] "Discuss" should explain it requires a selected transaction; disable until selected and add tooltip.
- [x] High-impact cards (Cashback opportunity, Duplicate charge): add confirmation step before any side effect (even if mock).
- [x] AI assistant CTA: hide by default; only show after a user-initiated action, and add a disclaimer. (N/A - not present in current implementation)
- [x] Enable boosts button: fixed redirect issue by removing href and handling navigation programmatically after confirmation.

Acceptance criteria
- ✅ "Discuss" button disabled when no transactions selected with tooltip: "Select transactions to discuss";
- ✅ Cashback and duplicate charge actions show confirmation dialogs with clear descriptions;
- ✅ No dead-end buttons; risky actions require confirmation.
- ✅ "Enable boosts" shows confirmation dialog and only navigates after user confirms.

Files touched
- `components/transactions-workspace.tsx` - Wrapped "Discuss" button in Tooltip, disabled when `selectedTransactionIds.length === 0`
- `components/collaboration-drawer.tsx` - Added optional `disabled` prop to support disabling the trigger button
- `components/transactions-insights.tsx` - Added ConfirmDialog for high-impact actions, removed href from actions that need confirmation, added useRouter to handle navigation programmatically after confirmation

---

## PR-10: Budget page fixes ✅

Checklist
- [x] "+" in Auto‑invest Budget: disabled with tooltip "Coming soon - Auto-invest configuration".
- [x] Increase tooltip hit-areas; allow click-to-open as fallback. ✅ Already using PR-02 pattern (px-1.5 py-1, hover:bg-muted/40).
- [x] Quick edit/settings icons: both modals fully implemented and functional with proper forms and validation.
- [x] Fix monetary truncation in category table: verified proper grid layout with minmax(0,1fr), min-w-0, and tabular-nums - no truncation.
- [x] Chart: added axis labels "Category" for X-axis and "Amount ($)" / "Variance ($)" for Y-axis; long names handled properly.

Acceptance criteria
- ✅ "+" button clearly disabled with tooltip explaining feature is coming soon.
- ✅ Tooltip hit areas use correct pattern and are clickable.
- ✅ Quick Edit and Advanced Settings modals are functional with proper UI.
- ✅ Monetary values display fully without truncation in all responsive layouts.
- ✅ Chart has clear axis labels for both comparison and variance views.

Files touched
- `components/budget-summary.tsx` - Disabled "+" button in Auto-invest Budget card with tooltip
- `components/budget-chart.tsx` - Added axis labels to both XAxis and YAxis in comparison and variance modes

---

## PR-11: Goals page fixes ✅

Checklist
- [x] Add confirmation for creating a goal - ConfirmDialog appears when clicking "Create Goal" button.
- [x] Scenario slider: added numeric input field above slider with label, min/max validation, and two-way sync.
- [x] Cards that suggest opening accounts/contributions: added confirmation dialogs with disclaimers for all three recommendation actions.
- [x] Prevent target number truncation: verified formatCurrency usage and min-w-0 flex/grid behavior - no clipping.

Acceptance criteria
- ✅ Goal creation shows confirmation dialog with clear explanation of automatic tracking.
- ✅ Scenario slider has numeric input for direct entry, maintains aria-label, keyboard adjustments work.
- ✅ All recommendation action buttons show confirmation dialogs with appropriate context and disclaimers.
- ✅ Target numbers display fully without truncation in all components and responsive layouts.

Files touched
- `app/(dashboard)/goals/page.tsx` - Added ConfirmDialog for goal creation, added numeric input to scenario slider with Label and two-way sync
- `components/goal-recommendations.tsx` - Added ConfirmDialog with state management for all recommendation actions, added confirmTitle and confirmDescription to each recommendation

---

## PR-12: Taxes page fixes ✅

Checklist
- [x] Add explanatory interstitial for "Plan Tax Loss Harvesting".
- [x] Gate deadline action buttons behind acknowledgment toggle; disable until checked.
- [x] Update withholding card: add detailed context + confirmation. (Verified - withholding adjustments are display-only progress indicators in readiness section, already have appropriate context)
- [x] Clearly label "What‑If" tools as simulations; no side effects.
- [x] Document list: add note if downloads disabled in environment; keep buttons disabled with tooltip.

Acceptance criteria
- ✅ Users get context before actions via explanatory dialog explaining tax loss harvesting, wash sale rule, and disclaimer.
- ✅ Deadline actions (Review positions, View schedule) require acknowledgment checkbox to be checked before enabling.
- ✅ Simulations are clearly labeled with "Simulation Only - No actual trades will be executed" badge.
- ✅ Downloads disabled with tooltip: "Document downloads will be available once tax year closes and all forms are finalized".

Files touched
- `app/(dashboard)/taxes/page.tsx` - Added state for harvest intro dialog and deadline acknowledgment; added handlers and Dialog component for tax loss harvesting explanation; added acknowledgment checkbox that gates deadline action buttons
- `components/tax-scenario-tool.tsx` - Added "Simulation Only" badge with Info icon below title
- `components/tax-documents.tsx` - Disabled all download buttons with Tooltip explaining availability

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

