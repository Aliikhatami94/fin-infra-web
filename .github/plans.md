# TradeHub UI/UX Implementation Plan (Detailed PR Series)

This document replaces prior plans. It breaks the refreshed UX review into concrete PR-scoped work with goals, acceptance criteria, and tasks mapped to likely files to touch. Use one PR per section (or bundle adjacent ones) and check items as you ship.

PR index
- PR01–PR02: Landing & Authentication
- PR03–PR15: Dashboard & Core Pages
- PR16: General UX Baseline
- PR17: Landing Deep‑Dive
- PR18: Acceptance & QA

Global assumptions
- Follow App Router patterns in `app/*`; prefer Server Components by default, add "use client" when needed.
- Reuse primitives in `components/ui/*`, Radix-based overlays, and Tailwind tokens from `app/globals.css`.
- Keep accessibility first: visible focus, keyboard-only flows, aria-labels, proper roles.

## 1) Public Landing & Authentication

### PR01 – Home / Landing Page
Goal: Improve clarity, accessibility, and polish on the marketing homepage.

Acceptance Criteria
- Header is sticky; primary CTA (“Get Started”) appears as a solid button, “Sign In” as a text/ghost link.
- “Start Trading” and “Watch Demo” are keyboard-focusable with descriptive aria-labels.
- Feature cards align icons left, have equal heights, and subtle hover micro-interactions.
- On small screens, hero text has a semi-transparent overlay for legibility (meets WCAG AA).

Tasks (likely files)
- Header layout and CTAs: `app/page.tsx`, `components/*landing*`, `components/ui/button` usage.
- Feature cards polish: `components/*feature*`, equal heights via flex/grid utilities.
- Overlay on mobile: tweaks in `app/globals.css` or component-level class for hero background.
- Focus and aria audit: add aria-labels on CTAs, ensure tab order, visible focus styles.

### PR02 – Sign‑in / Sign‑up Flows
Goal: Reduce friction while improving validation and accessibility.

Acceptance Criteria
- Inline validation appears on field blur/type; invalid states are announced to screen readers.
- Password field has visibility toggle and strength meter with guidance text.
- Social sign-in buttons appear above email/password with icons and aria-labels.
- Submit errors are shown as an accessible alert region; “Forgot password?” routes correctly.

Tasks (likely files)
- Forms: `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`.
- UI inputs: create/enhance a PasswordInput in `components/ui/input` or enhance existing with strength meter.
- Validation: client hints with Zod/Yup or custom; aria-invalid, aria-describedby wiring.
- Error region: add `role="alert"` containers; route for reset if missing.

## 2) Dashboard & Core Pages

### PR03 – Overview
Goal: Make KPIs scannable, tasks actionable, and chart comparisons quicker.

Acceptance Criteria
- KPI cards have consistent widths/spacing and tooltips with clear definitions.
- Quick actions exist for major metrics (e.g., Net Worth → “See details”).
- Overdue tasks are grouped separately and support snooze/dismiss (persisted).
- Performance timeline can overlay a benchmark (e.g., SPY) without navigation.

Tasks (likely files)
- KPIs: `components/kpi-cards.tsx`, tooltip copy map in `lib/tooltips`.
- Task grouping: `components/accountability-checklist.tsx` or related checklist components.
- Chart overlay: `components/performance-timeline.tsx` add benchmark toggle and series.

### PR04 – Accounts
Goal: Improve at-a-glance trends and table ergonomics.

Acceptance Criteria
- Summary cards show 30‑day micro-sparklines.
- Callouts (utilization, emergency fund) are dismissible and persist.
- Accounts table has sticky/sortable headers, type filters, institution logos, and status badges with tooltips.

Tasks (likely files)
- Cards/sparklines: `components/accounts-kpi-cards.tsx` and a tiny sparkline component.
- Dismiss persistence: use `lib/security/use-secure-storage` or local storage hook.
- Table upgrades: `components/accounts-table/*` add sorting, filters, sticky header classes.

### PR05 – Portfolio
Goal: Clarify complex metrics and streamline actions.

Acceptance Criteria
- Sharpe, Beta, Volatility have info icons with explainers.
- AI insights are collapsible/hide-resolved with persistence.
- Direct “Rebalance” link exists; overweight/target visuals are clear.
- Filters for asset class/timeframe affect metrics panels.

Tasks (likely files)
- Metric info: popovers/tooltips in `components/portfolio-kpis.tsx`.
- Insights collapse: `components/portfolio-ai-insights.tsx` with persisted UI state.
- Rebalance link: wire to `components/rebalancing-preview.tsx` or a route.

### PR06 – Crypto
Goal: Make grouping tools clear and add trend context.

Acceptance Criteria
- Group-by toolbar with selected states (asset/exchange/staking); stablecoin toggle.
- Market cards include micro-sparklines and consistent arrows.
- Diversification suggestions include recommended weights (e.g., BTC/ETH/Alt pie) with actions.

Tasks (likely files)
- Toolbar: `components/crypto-kpis.tsx`, `components/crypto-chart.tsx`.
- Insights: `components/crypto-ai-insights.tsx` add visuals and actions.

### PR07 – Cash Flow
Goal: Surface time scale controls and actionable savings guidance.

Acceptance Criteria
- Net flow cards toggle daily/weekly/monthly.
- AI insights allow pinning; budget suggestions appear for overspending categories.

Tasks (likely files)
- Cards toggle: `components/cash-flow-kpis.tsx`, `components/cash-flow.tsx`.
- Insights: `components/cashflow-ai-insights.tsx`, persistence hook.

### PR08 – Transactions
Goal: Improve triage speed and batch actions.

Acceptance Criteria
- Insight cards are dismissible; resolved items don’t reappear.
- Quick filters chips + account tabs; add date-range picker.
- Multi-select with batch actions (categorize, tag, export).

Tasks (likely files)
- Insights: `components/insights-feed.tsx` (transactions context), persistence.
- Filters/table: `components/recent-transactions.tsx` or transactions workspace components.

### PR09 – Budget
Goal: Faster adjustments and clearer status.

Acceptance Criteria
- Progress ring color codes states (under/over budget).
- Inline quick-edit modal for category budgets.
- Month selector fully keyboard-accessible with aria.

Tasks (likely files)
- Ring and colors: `components/budget-summary.tsx`.
- Quick edit: `components/budget-table.tsx` modal + validation.

### PR10 – Goals
Goal: Improve comprehension and scenario planning.

Acceptance Criteria
- Replace raw “$60k | $188k” strings with progress bar + %.
- Slider + numeric input both drive live projections; show date impact.
- “Add to calendar” for contribution reminders.

Tasks (likely files)
- UI: `components/goals-summary-kpis.tsx`, `components/goals-grid.tsx`.
- Planner: `components/goal-detail-modal.tsx`.

### PR11 – Taxes
Goal: Bring urgency forward and explain readiness.

Acceptance Criteria
- Planning banner includes countdown to key dates (e.g., Dec 31).
- Insights grouped by urgency; document tasks link to Documents.
- Readiness bars open explainers describing criteria and counts.

Tasks (likely files)
- Banner/insights: `components/tax-summary.tsx`, `components/tax-year-comparison.tsx`.
- Explain readiness: `components/tax-scenario-tool.tsx` or a new explainer component.

### PR12 – Insights
Goal: Reduce clutter and add clarity.

Acceptance Criteria
- Consistent tab styles; active tab clearly highlighted.
- Category icons on cards; “Hide resolved insights” toggle persisted.
- Primary vs secondary actions are visually distinct.

Tasks (likely files)
- Tabs/cards: `components/ai-insights.tsx`, `components/ai-insights-banner.tsx`.
- Persistence: secure/local storage for hide-resolved state.

### PR13 – Documents
Goal: Faster filtering and clearer uploads.

Acceptance Criteria
- Filter chips scroll horizontally; icons indicate doc type.
- Overdue tasks show due dates and assignees; reminders and mark-as-done available.
- Upload zone clarifies encryption and accepted types/sizes; “Browse files” is prominent.
- Missing tax docs link back to Taxes page for context.

Tasks (likely files)
- Filters/chips: `components/documents-grid.tsx`.
- Upload zone: `components/document-upload-zone.tsx`.
- Tasks: `components/accountability-checklist.tsx` on documents surface.

### PR14 – Settings
Goal: Clearer controls and safe save flows.

Acceptance Criteria
- Notification toggles grouped with helper text; accessible labels.
- Appearance shows themes (Daylight, Midnight, Match System) + font scales with live preview; consider high-contrast.
- “Save All Settings” disabled until changes; toast confirmation on save; “Reset to Defaults” available.

Tasks (likely files)
- Settings pages: `app/(dashboard)/settings/page.tsx`, `app/(dashboard)/settings/appearance/page.tsx`, `app/(dashboard)/settings/security/page.tsx`.

### PR15 – Security Center
Goal: Increase trust and control.

Acceptance Criteria
- Recent sessions table sortable/filterable by device/status; optional mini-map icon (IP anonymized).
- Alerting allows alternate emails/phones; masking toggles accessible.
- Exports (CSV/PDF) include tooltip on retention; in-app notification when ready to download.

Tasks (likely files)
- Security center: `app/(dashboard)/settings/security/page.tsx` and related components.

## PR16 – General UX Baseline
Goal: Apply consistent design and performance patterns.

Acceptance Criteria
- Consistent padding, radius, and type scale across cards/tables.
- All interactive elements have keyboard access and aria-labels; meaningful icons have alt text/labels.
- Large tables virtualized; heavy charts deferred until in-view; no major CLS on key pages.

Tasks
- Token and utility pass: `app/globals.css`, shared card utilities, and `components/ui/*`.
- Virtualize long lists (where applicable) and add intersection observers for heavy charts.

## PR17 – Landing Page Deep‑Dive
Goal: Fix routing, clarify features, and improve discovery.

Acceptance Criteria
- “Watch Demo” routes to a real demo page or a video modal; if not ready, disabled/hidden.
- Feature cards route correctly; if “Risk Management” maps to Cash Flow, rename or add a dedicated risk page.
- Tooltips describe destination content; optional scroll-to-section on the landing page.
- CTAs have visible focus and descriptive aria-labels.

Tasks (likely files)
- Routing: `app/page.tsx`, possibly `app/demo/page.tsx` (new) or a video modal component.
- Card hover/focus states and tooltips: landing components.

## PR18 – Acceptance Criteria & QA
Goal: Verify accessibility, performance, and UX polish across surfaces.

Acceptance Criteria
- axe-core audits pass on landing, auth, and main dashboard routes.
- Deferred charts and table virtualization verified; keyboard-only navigation validated.
- Tooltips exist for complex metrics; sticky header and clear CTAs on landing confirmed.
- All CTAs/feature cards have valid routes; deep-links between related pages (e.g., Taxes → Documents) work.

Tasks
- Add a lightweight QA checklist; optional scripts for lighthouse/axe where feasible.

---

Notes
- Keep PRs small and focused. If a section balloons, split follow-ups as PRxx-a/PRxx-b.
- Where persistence is specified, use existing secure storage hooks where possible.
