## Dashboard polish rollout: PR-by-PR checklist

This plan turns the design polish proposal into a shippable, repo-aware sequence of small PRs. It follows our stack conventions: Next.js 15 App Router, React 19, Tailwind v4 via PostCSS (tokens in `app/globals.css`), shadcn/ui primitives under `components/ui`, and aliases from `components.json`.

- Source of truth for tokens: `app/globals.css` (no Tailwind config file in this repo).
- Prefer Server Components in `app/` and Client Components only when interactivity is needed.
- Quality gates per PR: `pnpm lint` and `pnpm exec tsc -p tsconfig.json --noEmit` must pass locally.

At the end you’ll find a rollout sequence and engineering notes to keep changes durable.

---

### PR 01 — Density & rhythm system (type + spacing + breakpoints)

Goal: Normalize scale; reduce visual bulk; establish a compact, consistent vertical rhythm from mobile → desktop.

Scope
- Global typography and spacing tokens in `app/globals.css`.
- Dashboard container width constraints used by a shell wrapper.

Implementation checklist
- [ ] Add density/spacing CSS variables to `:root` in `app/globals.css` (mobile-first):
	- [ ] `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`.
	- [ ] Define text sizes with line-height tokens: `--text-xs: 12/18`, `--text-sm: 13/20`, `--text-base: 15/22`, `--text-lg: 16/24`, `--text-xl: 18/26`.
	- [ ] Provide a few helper classes for rhythm if helpful (e.g., `.stack-1 > * + * { margin-top: var(--space-1) }`).
- [ ] Set body defaults mobile→desktop:
	- [ ] Mobile base 15px/22; bump to 16px/24 ≥ lg.
	- [ ] Headings scale up max 2 steps; ensure consistent margins using the spacing tokens.
- [ ] Constrain dashboard container widths (used by shell in PR-02):
	- [ ] `max-w-[1180px]` at lg, `max-w-[1320px]` at xl; full width on small screens.
- [ ] Audit card paddings across dashboard: ensure no card exceeds 24px padding on any side; prefer 12–16px on compact density (PR-03 will formalize variants).

Acceptance criteria
- Default text is 15–16px across dashboard; headings climb max two sizes above body.
- Vertical rhythm follows 4px base; sections and cards look compact but readable.
- Dashboard content no longer runs edge-to-edge on ultra-wide screens; max widths applied at lg/xl.

Verification
- Run lint/typecheck gates.
- Visual smoke-check on mobile and desktop home dashboards; spot-check two other dashboard pages.

Touchpoints
- `app/globals.css`
- Light audit of card/container usage in: `components/dashboard-layout.tsx`, key dashboard pages.

Notes
- Tailwind v4 is token-based here; avoid editing a Tailwind config file. Prefer tokens + utilities in CSS.

---

### PR 02 — Dashboard grid & section order

Goal: Predictable structure; single-column mobile, 12-col desktop; consistent section ordering.

Scope
- Introduce a shell that applies container + grid and is reused across dashboard pages.
- Standardize section ordering and headers across pages.

Implementation checklist
- [ ] Add `components/dashboard-shell.tsx` (Server Component) wrapping children with container + grid:
	- [ ] `mx-auto w-full px-3 sm:px-4 lg:px-6 xl:px-8 max-w-[1320px]`
	- [ ] `grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5`
- [ ] Adopt shell in primary dashboard pages under `app/(dashboard)/**/page.tsx` and `app/dashboard/**/page.tsx` (where applicable).
- [ ] Define canonical section order (top → bottom):
	- [ ] KPI strip → Insights → Performance/Charts → Allocation → Holdings/Accounts tables → Activity.
- [ ] Create or unify a `components/section-header.tsx` with optional right-aligned actions (filters/date-range), consistent spacing.
- [ ] Update existing sections to map into grid spans:
	- [ ] KPI tiles row: responsive 2-up on mobile; lg each `lg:col-span-3` with wrap.
	- [ ] Primary charts: `lg:col-span-8`.
	- [ ] Tables: `lg:col-span-12` (or split 8–12 per page needs).

Acceptance criteria
- No horizontal scrolling on mobile; sections stack predictably.
- KPI row aligns evenly; charts and tables occupy intended spans on desktop.

Verification
- Lint/typecheck.
- Manual check on at least two dashboard routes (mobile/desktop) to confirm layout and order.

Touchpoints
- `components/dashboard-shell.tsx` (new)
- `components/dashboard-layout.tsx` (reuse or replace per page)
- `components/kpi-cards.tsx` (grid spans)
- Dashboard page files under `app/(dashboard)/**/page.tsx`

Notes
- If an existing `dashboard-layout.tsx` already wraps pages, adapt it or compose it with the new shell.

---

### PR 03 — Card density variant (global)

Goal: Normalize card anatomy and padding; reduce bulk.

Scope
- Extend shadcn `Card` to support density variants via cva; introduce a right-aligned toolbar region.

Implementation checklist
- [ ] Update `components/ui/card.tsx` to export `cardVariants` with densities: `comfy`, `compact` (default), `ultra`.
- [ ] Ensure headers/footers are standardized: title truncates to one line; accessory icons/actions move to a `CardToolbar` on the right.
- [ ] Sweep dashboard cards to set `density="compact"` by default.

Acceptance criteria
- All dashboard cards use compact density; no icon rows consuming full width.
- Titles truncate; actions live in a toolbar area.

Verification
- Lint/typecheck.
- Visual check on a few key cards (KPIs, charts, insights) to confirm padding and toolbar alignment.

Touchpoints
- `components/ui/card.tsx`
- Card consumers under `components/**` used on dashboard pages.

---

### PR 04 — Unified KPI/Stat component

Goal: Consistent stat tiles with label, value, delta chip, optional sparkline, and subtle trend caption.

Scope
- Create reusable `Stat` primitive and refactor KPI strips to use it.

Implementation checklist
- [ ] Add `components/ui/stat.tsx` (Client Component only if sparkline or hover interactions required):
	- [ ] Props: `label`, `value`, `delta: { value: string; tone: 'positive' | 'negative' | 'neutral' }`, `sparkline?: { data: Array<{x:number;y:number}>; ariaLabel: string }`, `size?: 'sm'|'md'|'lg'`.
	- [ ] Tabular numbers for values; delta chip with arrow and color semantics.
	- [ ] Optional compact sparkline (height 36–44px) consistent with PR-06.
- [ ] Refactor `components/kpi-cards.tsx` to use `Stat` for each tile; normalize heights.

Acceptance criteria
- All KPI tiles have uniform height.
- Deltas always appear as chips with arrows; no free-floating red/green text.
- No stat shows more than two secondary lines.

Verification
- Lint/typecheck.
- Compare before/after KPI strip visually on mobile and desktop.

Touchpoints
- `components/ui/stat.tsx` (new)
- `components/kpi-cards.tsx`

---

### PR 05 — Mobile navigation & sticky utilities

Goal: Make mobile navigation compact and reachable; expose key utilities without crowding.

Scope
- Reduce top bar height; move secondary actions to kebab.
- Add a sticky utility row (household switcher + date range + quick filter) that collapses to chips.
- Introduce a bottom nav for primary sections.

Implementation checklist
- [ ] Update header component (where defined under `components/**`) to 48px height on mobile; overflow actions in a kebab menu.
- [ ] Add `components/mobile-utility-row.tsx` with sticky behavior; collapsible to chips on scroll.
- [ ] Add `components/mobile-bottom-nav.tsx` with primary sections (Overview, Accounts, Portfolio, Cash Flow, Insights); wire routes.
- [ ] Ensure no floating FAB overlaps content; adjust z-index as needed.

Acceptance criteria
- Above-the-fold on mobile shows: header + utility chips + first KPI row without cropping.
- Bottom nav reachable with thumb; no overlap with content.

Verification
- Lint/typecheck.
- Manual mobile viewport test (375–414px width) for sticky behaviors.

Touchpoints
- Header component(s) under `components/**`
- `components/mobile-utility-row.tsx` (new)
- `components/mobile-bottom-nav.tsx` (new)

---

### PR 06 — Charts polish (Recharts)

Goal: Lighter, consistent charts with standard heights and tints; optional benchmark overlay.

Scope
- Create `AreaChartCard` and `Sparkline` abstractions and apply to key charts.

Implementation checklist
- [ ] Add `components/charts/area-chart-card.tsx` wrapping a standardized card with height 240–280px, thinner gridlines (10–15% tint), and optional benchmark overlay (e.g., SPY) with legend chips.
- [ ] Add `components/charts/sparkline.tsx` (36–44px height) for use inside `Stat`.
- [ ] Replace existing heavy chart usages with the new components where appropriate.
- [ ] Ensure tooltips are compact, right-aligned numbers, and don’t occlude latest point.

Acceptance criteria
- Charts never exceed 280px height on desktop unless full-width special case.
- Tooltip polish and gridline tint applied consistently.

Verification
- Lint/typecheck.
- Visual checks on main performance and allocation charts.

Touchpoints
- `components/charts/area-chart-card.tsx` (new)
- `components/charts/sparkline.tsx` (new)
- Chart consumers across dashboard pages.

---

### PR 07 — Tables that breathe (TanStack Table + Virtual)

Goal: Improve readability and density; support large data with virtualization.

Scope
- Normalize row height, alignment, sticky header/first column, visibility controls; virtualize when large.

Implementation checklist
- [ ] Standardize table cell classes: row height 32–36px, numeric columns right-aligned, `tabular-nums` for currency.
- [ ] Add sticky header and optional sticky first column; horizontal scroll shadow cues for overflow.
- [ ] Virtualize when >200 rows; paginate otherwise (use existing TanStack Table patterns if present).
- [ ] Add column visibility controls (eye menu) with persistence (localStorage).

Acceptance criteria
- On mobile, rows collapse to two-column tiles: left = name/symbol; right = value/delta.
- Virtualization kicks in for large datasets without jank.

Verification
- Lint/typecheck.
- Test a 500-row scenario locally to confirm virtualization.

Touchpoints
- Holdings/Accounts tables under `components/**`.
- Table utilities/hooks if present under `hooks/**`.

---

### PR 08 — Insights: progressive disclosure

Goal: Reduce height and variability; keep summaries scannable and details on demand.

Scope
- Collapse cards to a one-liner summary + confidence chip; expand on tap/click; primary action visible; overflow for secondary actions.

Implementation checklist
- [ ] Refactor insights cards (`components/insights-*.tsx`) to collapsed default state with `aria-expanded` and keyboard toggling.
- [ ] Add a standardized confidence/severity chip using semantic tokens.
- [ ] Primary action button only; move secondary actions into an overflow menu.

Acceptance criteria
- Average collapsed insight height ≤ 88px.
- Fully keyboard accessible expand/collapse behavior.

Verification
- Lint/typecheck.
- Keyboard traversal test and screen reader labels for expanded state.

Touchpoints
- `components/insights-feed.tsx` and related insight card components.

---

### PR 09 — Loading, empty, and error states (consistent)

Goal: Make skeletons and zero states consistent and fast; unify retry banners.

Scope
- Skeleton primitives; zero state component; standardized retry banners.

Implementation checklist
- [ ] Add `components/ui/skeleton-card.tsx`, `components/ui/skeleton-row.tsx`.
- [ ] Add `components/ui/zero-state.tsx` (illustrations off by default; one clear CTA).
- [ ] Standardize retry banner component with icon and “copy error” affordance.
- [ ] Apply to all major data sections.

Acceptance criteria
- Skeletons appear within ~100ms; LCP not blocked by heavy charts/tables.
- Every data section has a zero state with a single obvious CTA.

Verification
- Lint/typecheck.
- Manual test: throttle network, confirm skeletons and zero states.

Touchpoints
- `components/ui/*` new primitives.
- Sections across dashboard pages.

---

### PR 10 — Accessibility & contrast hardening

Goal: Meet WCAG AA while preserving aesthetics; focus rings and reduced motion.

Scope
- Audit text/icon contrast; add focus rings; respect `prefers-reduced-motion`.

Implementation checklist
- [ ] Audit and adjust color tokens in `app/globals.css` to guarantee 4.5:1 (text on surfaces) and 3:1 for large text/UI icons.
- [ ] Add consistent `focus-visible` rings with `outline-offset-2` and brand hue.
- [ ] Disable chart animations when user prefers reduced motion.

Acceptance criteria
- Full keyboard traversal works everywhere.
- Lighthouse Accessibility ≥ 95 on both mobile and desktop dashboard pages.

Verification
- Lint/typecheck.
- Lighthouse run locally on two key pages in mobile/desktop modes.

Touchpoints
- `app/globals.css`
- Chart components and any animated UI.

---

### PR 11 — Motion & micro-feedback

Goal: Subtle delight without jitter; obey reduced-motion.

Scope
- Framer Motion entrance/exit for insights; KPI hover lift; button press feedback; conservative number animations.

Implementation checklist
- [ ] Add enter/exit animations to insights list; respect reduced-motion.
- [ ] KPI hover: small lift (`y:-2`) and `shadow-md`.
- [ ] Button press: 95% scale for ~80ms.
- [ ] Count-up only for hero numbers, duration ≤ 800ms.

Acceptance criteria
- No looping animations; reduced-motion audit passes.

Verification
- Lint/typecheck.
- Manual motion audit with reduced-motion enabled.

Touchpoints
- Insights components, KPI tiles, button primitives under `components/ui`.

---

### PR 12 — Data-viz & semantic color system

Goal: Lock category and delta colors; unify number formats.

Scope
- Category color map reused across charts and chips; positive/negative tokens unified; a shared number formatter utility.

Implementation checklist
- [ ] Add `lib/get-number-formatter.ts` exporting `getNumberFormatter({ style: 'currency' | 'percent' | 'decimal', currency?: string, maximumFractionDigits?: number })` backed by `Intl.NumberFormat`.
- [ ] Add color constants file `components/ui/config/dashboard.ts` (or under `lib/`) with category hues (Stocks/US/Intl/Cash/Crypto) and delta tokens (positive/negative/neutral).
- [ ] Apply to charts (PR-06), chips, and delta indicators.
- [ ] Standardize percent precision (e.g., 1 decimal between 0.1–99.9%).

Acceptance criteria
- SPY benchmark always appears in the same hue.
- Percentages share the same precision rules throughout.

Verification
- Lint/typecheck.
- Visual spot-check across charts and chips.

Touchpoints
- `components/ui/config/dashboard.ts` (new)
- `lib/get-number-formatter.ts` (new)
- Chart and chip consumers.

---

## Engineering notes (make it stick)

- Create and centralize dashboard constants in `components/ui/config/dashboard.ts`: heights, gaps, breakpoints, and section order. Components read from this file—no magic numbers.
- Add visual regression baselines with Playwright capturing: KPI strip, insights collapsed, one chart, table first 5 rows (mobile + desktop). Consider adding a `scripts/visual-tests/` folder and Playwright config in a follow-up PR.
- Add a local lint rule (eslint-plugin-local) to discourage raw px paddings/margins in dashboard files—prefer spacing tokens.

## Rollout sequence

1) PR-01 Density & Rhythm → 2) PR-02 Grid & Order → 3) PR-03/04 Card + KPI primitives → 4) PR-05 Mobile nav & sticky utilities → 5) PR-06/07 Charts + Tables → 6) PR-08 Insights → 7) PR-09/10/11/12 States, A11y, Motion, Colors.

Each PR is independently shippable and reduces visual noise while creating space for the core value: data.

## Verification gates per PR

- Lint/typecheck: `pnpm lint` and `pnpm exec tsc -p tsconfig.json --noEmit` should pass.
- Basic manual checks: mobile (≤ 414px width) and desktop (≥ 1280px) for the modified pages/components.
- Optional: add/update minimal Vitest tests when introducing new logic (formatters, hooks).

## Optional starter bundle (future PR)

When ready, we can land a starter PR that scaffolds the Card density variant, the Stat component, and the Dashboard shell so teams can plug them in page-by-page:

- `components/ui/card.tsx` density variants
- `components/ui/stat.tsx`
- `components/dashboard-shell.tsx`

This will expedite PR-03/04/02 adoption across dashboard surfaces.

