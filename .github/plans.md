## ClarityLedger UI/UX Polish Roadmap — PR-by-PR Plan

This plan sequences six focused pull requests to apply design-system-level polish across desktop and mobile. Each PR lists scope, desktop vs mobile changes, files likely touched, acceptance criteria, and QA notes. The work aligns with our stack: Next.js 15 App Router, React 19, Tailwind CSS v4 tokens in `app/globals.css`, and shadcn/ui primitives under `components/ui`.

Notes
- Prefer Server Components under `app/*` and opt into Client Components only for interactivity.
- Keep typography and spacing tokens centralized in `app/globals.css` where possible; use Tailwind utilities otherwise.
- Reuse existing UI primitives; avoid ad-hoc styles that bypass tokens.

---

## PR #1 — Typography & Grid Pass

Goal
- Establish calmer hierarchy and better rhythm. Reduce oversized numerals, balance label weights, and adjust responsive grids for KPI-heavy areas on desktop and mobile.

Desktop
- KPI numbers: reduce font size ~20%; keep line-height tight but readable.
- KPI labels: lighten to normal weight and use muted foreground.
- Long labels: apply balanced wrapping.
- Grids: use 4-column at `xl`, 3-column at `lg`, avoid full-width stretches for equal-weight KPIs.

Mobile/Small Screens
- Switch KPI layouts to `grid-cols-2 gap-2` by default.
- Scale down: numbers at `text-lg`, labels at `text-xs` muted.
- Hide secondary, non-critical metadata (tooltips/timestamps) behind icons or omit.

Files likely touched
- `app/(dashboard)/**/page.tsx` and related layouts where KPI groups are assembled.
- `components/kpi-cards.tsx`, `components/accounts-kpi-cards.tsx`, `components/cash-flow-kpis.tsx`, `components/crypto-kpis.tsx`, `components/goals-summary-kpis.tsx`.
- `app/globals.css` for any token-level tweaks (optional, minimal).

Implementation checklist
- Apply smaller type scale to KPI numerals and lighten labels.
- Add `text-balance` on long KPI labels.
- Update responsive grid breakpoints: 4-col at xl, 3-col at lg; 2-col on mobile.
- Ensure no regressions in wrapping or overflow.

Acceptance criteria
- KPI rows feel less “puffy”; numbers ~20% smaller than current.
- Desktop shows 3–4 columns where space allows; mobile shows 2 columns.
- No clipped labels; long labels wrap elegantly.

QA notes
- Verify across common widths: 360, 390, 768, 1024, 1280, 1440, 1600.
- Dark mode parity.

---

## PR #2 — Insights Visual Hierarchy

Goal
- Break monotony so insights read distinct from metrics, with subtle boundaries and icon tints.

Desktop
- Add a left accent border for insights sections: thin divider using muted color.
- Tighten section padding (e.g., vertical padding reduced).
- Assign distinct, semantically meaningful icon tints: investment=blue, savings=green, warning=amber.

Mobile/Small Screens
- Maintain accent border at reduced width to avoid visual heaviness.
- Ensure insight cards stack cleanly with compact spacing.
- Consider default-collapsed blocks for long insight lists.

Files likely touched
- `components/ai-insights.tsx`, `components/insights-feed.tsx`, `components/insight-preview-modal.tsx`.
- Any section wrapper components where insights are grouped.

Implementation checklist
- Add divider/left-accent styling to insight wrappers.
- Reduce vertical padding for insight sections.
- Apply icon color variants by insight type.

Acceptance criteria
- Insights are visually distinct from KPI/metric cards at a glance.
- Spacing feels tighter without crowding.
- Iconography communicates insight type consistently.

QA notes
- Check color contrast AA/AAA for accent borders and icon tints in light/dark modes.

---

## PR #3 — Tables & Alignment Polish

Goal
- Improve scan-ability and density. Standardize numeric alignment, typeface, and row affordances.

Desktop
- Right-align all numeric cells.
- Use monospace for currency/values at small size.
- Introduce subtle zebra striping or hover shading for row focus.
- Reduce row height by ~10px for compactness.

Mobile/Small Screens
- Ensure horizontal scroll where needed using overflow handling.
- Keep numeric columns aligned within the scrollable container.
- Preserve tap targets ≥ 40px where rows remain actionable.

Files likely touched
- `components/holdings-table.tsx`, `components/accounts-page.client.tsx` (list sections), `components/crypto-table.tsx`, `components/capital-gains-table.tsx`.
- Any shared table primitives if present in `components/ui`.

Implementation checklist
- Apply right alignment (`text-right`) on numeric `<td>` elements.
- Use `font-mono text-sm` for currency and value fields.
- Add row hover state and optional zebra background.
- Tighten row padding to reduce height ~10px while keeping readability.

Acceptance criteria
- Numeric columns are consistently right-aligned with monospace.
- Row density improved without truncation or overflow.
- Hover/active states aid scanning.

QA notes
- Verify truncation/ellipsis policies for narrow columns.
- Keyboard focus order and visible focus ring on rows/interactive cells.

---

## PR #4 — Charts & Headers

Goal
- Anchor charts with clear titles and time filters; improve padding and legend coherence.

Desktop
- Title + timeframe filter grouped in a compact, single row with justified layout.
- Increase inner padding for pie/donut charts to improve breathing room.
- Reduce legend dot size for subtlety and better balance.
- Add light gridlines to performance charts to aid value tracking.

Mobile/Small Screens
- Place timeframe filter beneath the title on tight widths while keeping the group visually connected.
- Simplify legends or collapse into a single-row legend beneath the chart.
- Consider toggles to defer heavier charts behind a “Show Performance” expander.

Files likely touched
- `components/exchange-analytics.tsx`, `components/cash-flow-chart.tsx`, `components/allocation-chart.tsx`, `components/crypto-chart.tsx`.
- Any chart header subcomponents.

Implementation checklist
- Introduce a shared chart header pattern: Title + Filter group.
- Adjust donut/pie inner radius or padding for breathing room.
- Apply subtle gridlines to line/area charts.
- Tweak legend item sizing and spacing.

Acceptance criteria
- All charts present with a consistent header pattern.
- Legends are legible but unobtrusive; no label overlap.
- Pie/donut charts no longer feel cramped.

QA notes
- Verify responsiveness at common breakpoints; ensure filter controls remain accessible.

---

## PR #5 — Mobile Responsiveness Sweep

Goal
- Systematically optimize small-screen ergonomics: layout, typography, and section structure for faster scanning with less scroll fatigue.

Mobile/Small Screens
- KPI grid: `grid-cols-2 gap-2`; numbers `text-lg`, labels `text-xs` uppercase/compact.
- Global small-screen scale: headings at medium size, body small muted, labels extra small uppercase with tracking.
- Sticky mini-section headers with backdrop blur and semi-opaque background for context while scrolling.
- Collapse long sections (Insights, Holdings) using an Accordion or Collapse pattern.
- Add horizontal scrolling affordances for wide tables and keep y-scroll minimal.

Desktop
- No major visual changes beyond maintaining parity with mobile structural adjustments.
- Ensure grids and sticky headers degrade gracefully at larger sizes.

Files likely touched
- `app/(dashboard)/**/page.tsx`, `components/mobile-nav.tsx`.
- `components/insights-feed.tsx`, `components/holdings-table.tsx` (overflow handling), and section wrappers.

Implementation checklist
- Implement sticky section headers on mobile with appropriate top offsets (respect safe areas).
- Introduce collapsible containers for long sections.
- Reduce container paddings on mobile widths.
- Confirm semantic headings and landmarks for screen readers.

Acceptance criteria
- Reduced scroll length to reach key content; sticky headers provide clear section context.
- Wide content is horizontally scrollable with visual cues.
- Typography scale matches the specified mobile guidelines.

QA notes
- Test on iOS Safari and Chrome Android for sticky behavior and scroll performance.
- Verify safe-area insets on notched devices.

---

## PR #6 — Microinteractions

Goal
- Add subtle motion and state feedback to make the interface feel responsive and alive without distracting from financial data.

Desktop
- Animate KPI value changes with light transitions.
- Animate chart entry (fade + slight slide) on mount.
- Apply tooltips with small delay for icon affordances.
- Smooth color transitions for positive/negative deltas.

Mobile/Small Screens
- Keep animations short and GPU-friendly; avoid jank on scroll.
- Respect reduced-motion preferences across devices.

Files likely touched
- KPI and chart components listed in PRs #1 and #4.
- `components/ai-insights.tsx` and other icon-heavy areas for tooltips.

Implementation checklist
- Add motion utilities or framer-motion where needed.
- Use Tailwind transitions for color and layout changes.
- Honor `prefers-reduced-motion` in CSS or motion library configuration.

Acceptance criteria
- Animations feel subtle and purposeful; no layout shift.
- Tooltips do not obscure primary data and use a small open delay.
- Reduced-motion users see static transitions.

QA notes
- Performance check on low-end mobile; ensure 60fps or acceptable smoothness.
- Verify no animation triggers unwanted reflows.

---

### Sequencing and Dependencies
- PR #1 lays the foundation; subsequent PRs assume the revised type scale and grids.
- PR #2 and #3 can proceed in parallel after #1, but ship separately.
- PR #4 depends on common header pattern decisions; coordinate with #1 for typography.
- PR #5 consolidates small-screen improvements across earlier PRs; ship after #1–#4.
- PR #6 is safe to layer after structural changes; ensure motion respects new layouts.

### Verification and Quality Gates
- Run `pnpm lint` and `pnpm exec tsc -p tsconfig.json --noEmit` locally; green before merging.
- Visual regression spot-check across light/dark and key breakpoints.
- Accessibility checks: color contrast, focus order, keyboard access, and motion preferences.

### Rollback Plan
- Each PR should limit scope to a small set of components.
- If regressions are found, revert the PR wholesale; avoid partial backouts.

### Metrics to Watch (post-merge)
- Engagement: time-on-page and interaction with collapsible sections/toggles.
- Performance: First Input Delay/INP changes after adding animations.
- Support signals: user feedback on readability and scanning speed.

