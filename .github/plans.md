## Dashboard UX Plan — PR-by-PR Checklist (Global, page-agnostic)

Scope: Applies across Overview, Accounts, Taxes, Investments, Budgets, and future dashboards. Each PR is small, shippable, and reversible. No page-specific redesigns—just a shared skeleton, density system, and hierarchy that modules inherit.

### Success criteria (Definition of Done)
- [ ] 5-second test: users can name the top 3 KPIs without scrolling.
- [ ] One-thumb test (mobile): first screen shows 3 KPIs + one actionable insight with no pinch/zoom.
- [ ] Density win: above-the-fold shows ≥30% more information at the same width with equal or better readability.
- [ ] Consistency: same visual rhythm and action pattern across all modules.

---

## Sprint 1 — Foundation

### PR 1 — Density mode foundation (tokens + provider)
Goal: A single attribute toggles Comfortable vs Compact density globally; default Compact on ≤1280px and all mobile; user preference persisted.

- Changes
	- [x] Add `DensityProvider` with `data-density` attribute on `<html>` and localStorage persistence.
	- [x] Wire CSS tokens for spacing, radius, icon, KPI text size in `app/globals.css`.
	- [x] Expose a quick toggle (temporary in command menu or header) for validation.
- Files
	- [x] `app/providers/density-provider.tsx` (new)
	- [x] `app/layout.tsx` (wrap with `DensityProvider`)
	- [x] `app/globals.css` (add tokens):
				`--space-card`, `--space-gap`, `--kpi-size`, `--radius-lg`, icon size deltas
- Acceptance / QA
	- [x] Density persists after reload and across routes.
	- [x] Compact reduces paddings/fonts ~12–16% without truncating key labels.
	- [x] No layout shift on toggle; dark mode unaffected.
	- [x] Mobile defaults to Compact; desktop >1280px defaults to Comfortable.
- Rollout
	- [x] Ship behind a temporary toggle in UI; remove toggle after PR 4.
	- [x] Low risk; easy rollback by removing provider wrapper.

### PR 2 — DashboardShell skeleton (layout contract)
Goal: Replace page wrappers with a single shell enforcing the narrative: KPIs → Bands → Insights → Accountability bar.

- Changes
	- [x] Add `DashboardShell` that lays out: `kpis`, `bands[]` (6/6 desktop), `insights`, optional sticky footer.
	- [x] Apply `DashboardShell` to Overview only (first adoption).
- Files
	- [x] `components/dashboard/shell.tsx` (new)
	- [x] `app/(dashboard)/page.tsx` or current Overview route to adopt the shell
- Acceptance / QA
	- [x] Shell renders with container widths (1280 base, 1440 wide).
	- [x] 12-col grid with `gap-[var(--space-gap)]` matches tokens.
	- [x] No regressions in header/footer or providers.
- Rollout
	- [x] Start with Overview only; other pages migrate in PR 11–12.

### PR 3 — KPI Rail (Hero KPI Rail, desktop grid + mobile chips)
Goal: Normalize top KPIs into a single component that scales across breakpoints.

- Changes
	- [ ] Add `KpiRail` component with label, value, delta, optional tiny chart.
	- [ ] Desktop: 12-col grid; each KPI 3 cols. Tablet: 6 cols. Mobile: horizontal scrollable chips.
	- [ ] Keyboard roving-tablist; screen reader-friendly number announcements.
- Files
	- [ ] `components/dashboard/kpi-rail.tsx` (new)
	- [ ] Update Overview to use `KpiRail` for top KPIs.
- Acceptance / QA
	- [ ] First paint shows 3+ KPIs on mobile chips; no horizontal overflow beyond rail.
	- [ ] SR reads “$487,234 US dollars, up 12.4 percent”.
	- [ ] 5-second test success on Overview.

### PR 4 — MetricCard variants (hero/standard/compact) + convert 2 cards
Goal: Define card variants once; convert two representative cards on Overview to validate density + action model.

- Changes
	- [ ] Add `MetricCard` with `hero | standard | compact` variants.
	- [ ] Enforce “one primary action; secondary in kebab menu”.
	- [ ] Icons neutral unless stateful; shared sparkline style stub.
- Files
	- [ ] `components/dashboard/metric-card.tsx` (new)
	- [ ] Convert 2 cards on Overview to `MetricCard` (one hero, one compact).
- Acceptance / QA
	- [ ] Variants respect tokens in both densities.
	- [ ] Primary action has clear focus states and a11y name.
	- [ ] No footer link clutter in compact.

---

## Sprint 2 — Polish and propagation

### PR 5 — Typographic hierarchy (global)
Goal: Numbers lead; restrained type scale across the app.

- Changes
	- [ ] Apply scale: 12 / 14 / 16 / 18 / 24 / 32 (28 in compact for KPIs).
	- [ ] Labels 12–14 semi-muted; delta microcopy 12 with arrow glyph in consistent position.
	- [ ] Tabular/lining numerals for KPI values.
- Files
	- [ ] `app/globals.css` (type tokens/util classes)
	- [ ] `components/dashboard/*` where text sizes defined
- Acceptance / QA
	- [ ] “Funky/too big” feel eliminated; no text wrapping in hero KPIs.
	- [ ] Delta placement consistent across converted cards.

### PR 6 — Layout grid standardization
Goal: Predictable grid rhythms and breakpoints.

- Changes
	- [ ] Container widths: 1280 base, 1440 wide.
	- [ ] Grid: 12-col, 24px gutter desktop; 8-col, 16px tablet; 4-col mobile (via utilities).
	- [ ] Hero Rail spans 12; each hero KPI 3 cols desktop, 6 cols tablet.
	- [ ] Health Bands are 6/6; stack ≤1024px.
- Files
	- [ ] `app/globals.css` (container utilities if needed)
	- [ ] `components/dashboard/shell.tsx`, `kpi-rail.tsx` (class adjustments)
- Acceptance / QA
	- [ ] No page ships custom paddings/margins that violate tokens.
	- [ ] Shell grid validated on desktop/tablet/mobile.

### PR 7 — Mobile pattern baseline
Goal: Mobile-first experience that’s not “shrunk desktop”.

- Changes
	- [ ] KPI Rail chips: value, label, tiny sparkline.
	- [ ] Action shelf: 1–2 top recommendations below the rail.
	- [ ] Sticky context top bar (household + date range), hides on scroll down, reveals on scroll up.
	- [ ] Long text truncates to 1 line with ellipsis; expand on tap.
- Files
	- [ ] `components/dashboard/kpi-rail.tsx` (chips behavior)
	- [ ] `components/dashboard/action-shelf.tsx` (new)
	- [ ] `components/dashboard/sticky-context-bar.tsx` (new)
- Acceptance / QA
	- [ ] One-thumb test passes on Overview.
	- [ ] Scroll interactions do not cause reflow/jank.

### PR 8 — Insights Stream + Accountability Bar
Goal: Proactive insights with one action; shared accountability footer on desktop.

- Changes
	- [ ] Add `InsightsStream` component (Title → One-sentence why → One primary action).
	- [ ] Add `AccountabilityBar` (sticky bottom strip desktop, collapsible mobile).
	- [ ] Time-sensitive blocks auto-rank to top.
- Files
	- [ ] `components/dashboard/insights-stream.tsx` (new)
	- [ ] `components/dashboard/accountability-bar.tsx` (new)
	- [ ] Wire into Overview via `DashboardShell` props.
- Acceptance / QA
	- [ ] Copy uses verb-object (“Review positions”, not “See details”).
	- [ ] Sticky bar does not overlap system nav; safe-area insets respected.

### PR 9 — Motion presets + skeletons
Goal: Micro-motion polish without theatrics; consistent skeletons.

- Changes
	- [ ] Add motion tokens/presets: enter stagger 40ms, 160–200ms ease-out; update ticks animate last 20%.
	- [ ] Hover lift 2–3px; active compress 1px.
	- [ ] Skeletons match final footprint; no layout jump.
- Files
	- [ ] `lib/motion-variants.ts` (new)
	- [ ] Apply to `MetricCard`, `KpiRail`, and Insights items.
- Acceptance / QA
	- [ ] No CLS spikes; animations respect reduced motion settings.

### PR 10 — Color semantics & iconography
Goal: Curb “carnival effect”; hue only when stateful.

- Changes
	- [ ] Icons neutral by default; gains/losses use softer tints; saturated only for >|2σ| moves/alerts.
	- [ ] One accent (indigo/purple) for focus states and CTAs only.
	- [ ] Shared sparkline gradient + y-axis smoothing.
- Files
	- [ ] `app/globals.css` (semantic color tokens if needed)
	- [ ] `components/*` icon usages; sparkline config centralization
- Acceptance / QA
	- [ ] Visual audit across converted modules shows calm, consistent accents.

### PR 11 — A11y & touch targets sweep
Goal: Elevate baseline accessibility and touch ergonomics.

- Changes
	- [ ] Minimum text 14px; tap targets ≥44px height.
	- [ ] Keyboard order matches visual; KPI Rail is a roving-tablist.
	- [ ] SR number announcements include units and delta direction.
- Files
	- [ ] `components/dashboard/kpi-rail.tsx`, `metric-card.tsx`, interactive elements
- Acceptance / QA
	- [ ] Contrast AA+; keyboard-only flows complete all primary actions.

### PR 12 — Propagate shell + rail + card across remaining dashboards
Goal: Roll the skeleton and variants to Accounts, Taxes, Investments, Budgets, etc.

- Changes
	- [ ] Replace page wrappers with `DashboardShell` per route.
	- [ ] Convert top KPIs to `KpiRail` per page.
	- [ ] Convert at least 2 cards per page to `MetricCard` variants.
- Files
	- [ ] `app/(dashboard)/*/page.tsx` and colocated subcomponents
- Acceptance / QA
	- [ ] 5-second test passes for each dashboard.
	- [ ] Above-the-fold density increased ≥30% per page.
	- [ ] No custom paddings/margins outside tokens.

---

## Global QA checklist (run on each PR)
- [ ] Lint/typecheck pass locally.
- [ ] Dark mode and high-contrast themes verified.
- [ ] Mobile (≤375px), tablet (768–1024px), desktop (1280/1440) screenshots compared.
- [ ] Keyboard and SR smoke test for new/changed components.
- [ ] No CLS or major performance regressions.

## Copy and content rules (apply as you convert)
- [ ] Insight card structure: Title → One-sentence why → One action.
- [ ] Verb-object actions only (“Plan payoff”, “Fix utilization”).
- [ ] Time-sensitive modules float to top of Insights Stream automatically.

## Notes and rollback
- Each PR is additive and can be rolled back independently.
- Start adoption on Overview; propagate once patterns are proven.
- Keep page logic intact; this plan modifies layout, density, and presentation only.

## Appendix — Token deltas (reference)
- Comfortable → Compact
	- `--space-card`: 20px → 16px
	- `--space-gap`: 24px → 16px
	- `--kpi-size`: 32px → 28px
	- `--radius-lg`: 16px → 12px
	- Icon sizes: 24 → 20

## Appendix — Suggested component APIs (reference only; implement in PRs)
- DensityProvider: `{ density: "comfortable" | "compact"; setDensity(d) }`
- KpiRail: `{ items: { label: string; value: string; delta?: string; chart?: React.ReactNode }[] }`
- MetricCard: `{ variant?: "hero" | "standard" | "compact"; title: string; value: React.ReactNode; delta?: React.ReactNode; chart?: React.ReactNode; action?: React.ReactNode }`
- DashboardShell: `{ kpis: React.ReactNode; bands: React.ReactNode[]; insights: React.ReactNode; footer?: React.ReactNode }`

