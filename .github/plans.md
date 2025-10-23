# Fin‑Infra Web – Technical Excellence Plan (v2)

Purpose: Evolve this Next.js 15 + React 19 UI into a production‑grade, competitive experience on par with Quicken Simplifi by elevating code quality, performance, accessibility, and UX polish. This plan replaces the prior remediation checklist and reflects the current codebase state (dynamic chart loading, centralized mocks, formatting utils, CI, and strict TS already present).

Scope focuses on: architectural hygiene, design system hardening, performance and a11y, typed data boundaries, testing, and targeted product polish that improves perceived quality without overhauling features.

## Guiding Principles
- Server Components by default; client only where interactivity is required.
- One source of truth per concern (types, colors, formatters, mocks, chart theme).
- Prefer composition over inheritance; keep components small, typed, testable.
- Optimize for Core Web Vitals and perceived responsiveness (skeletons, defers, virtualization).
- Accessibility is a product feature: WCAG AA color contrast, keyboard flows, and screen reader UX.

## Current State Summary (observations)
- Strong foundation: App Router, providers (Theme/Privacy/DateRange), consistent tokens in `app/globals.css`, shadcn/ui primitives, dynamic import for heavy charts, centralized mocks in `lib/mock`, formatters in `lib/format`, color utils + tests, CI (lint, typecheck, vitest), and route‑scoped layouts.
- Opportunities:
  - Domain types scattered (e.g., `components/accounts-table/types.ts`); consolidate for reuse across features.
  - Chart configurations and tooltips repeated across components.
  - Several large tables could benefit from row virtualization and column helpers.
  - A11y coverage is good but not systematic (no automated checks, inconsistent aria/labeling patterns).
  - Analytics/telemetry and error boundaries are minimal.
  - Some duplication and naming inconsistency across components and skeletons.

## Workstreams

### WS1 – Architecture & Types Hygiene
Goal: Centralize domain contracts and reduce duplication.

Deliverables
- Create `types/domain.ts` with shared interfaces: `Account`, `Transaction`, `Holding`, `Document`, `Goal`.
- Refactor consumers to import from `types/domain` instead of local type files where appropriate.
- Introduce `lib/schemas/*` (zod) for runtime validation of external data (future API) that narrows to domain types.
- Add `lib/services/*` as thin data adapters (mock now, API later) with typed return values.

Acceptance
- Single import path for domain types; no duplicate interface definitions.
- `pnpm typecheck` passes; no `as any` in changed files.

### WS2 – Design System Hardening
Goal: Ensure a cohesive, professional UI across pages and states.

Deliverables
- Extract a `components/charts/` kit:
  - `ChartContainer`, `ThemedAxis`, `Grid`, `TooltipCard`, tick formatters using `lib/format` + `lib/color-utils`.
  - Migrate: `performance-timeline`, `cash-flow`, `networth-chart`, `net-worth-history-chart`, `portfolio-value-chart`, `crypto-chart` to use the shared kit.
- Normalize skeletons and empty states:
  - Keep all skeletons in `components/*-skeletons.tsx` with consistent sizes and aria‑hints.
- Token usage audit:
  - Replace hardcoded HSL values in components with CSS variables or `colors.*` from `lib/color-utils` when possible.

Acceptance
- Visual consistency across charts and cards; fewer diff‑only style changes when iterating.

### WS3 – Performance & Web Vitals
Goal: Reduce JS, improve interactivity, and keep LCP/INP healthy.

Deliverables
- Table virtualization for large lists (100+ rows):
  - Apply to `components/holdings-table.tsx`, `components/crypto-table.tsx`, `components/accounts-table/*` using `@tanstack/react-virtual` or `react-virtuoso`.
- Progressive hydration for non‑critical widgets (keep current dynamic imports; add `prefetch` hints where helpful).
- Add optional bundle analyzer and budgets:
  - Integrate `@next/bundle-analyzer` (dev only) and document size budgets per route.
- Image/asset hygiene: confirm `images.unoptimized: true` is desired; otherwise enable Next Image where impactful.

Acceptance
- Measured reduction in hydrated JS on dashboard routes; smoother scroll in large tables.
- No regressions in functionality; CI includes a “build with analyzer” job (non‑blocking).

### WS4 – Accessibility (AA + keyboard flows)
Goal: Systematize a11y rather than spot‑fixing.

Deliverables
- Axe checks on key routes using Playwright + axe‑core (smoke suite for `/`, `/overview`, `/accounts`, `/portfolio`, `/documents`).
- Ensure focus management and visible focus rings for dialogs/menus.
- Expand `aria-label` and `aria-describedby` on interactive money values and chart controls.
- Contrast audit for chart colors and badges against AA.

Acceptance
- Zero critical axe violations on smoke pages; documented follow‑ups for minors.

### WS5 – Data Boundaries & Error Handling
Goal: Prepare for real data with predictable failures.

Deliverables
- Route handlers under `app/api/mock/*` that serve `lib/mock` data with zod validation.
- Lightweight error boundaries around chart heavy areas and data tables; friendly retry UIs.
- Centralized fetch wrapper with abort + timeout and typed results.

Acceptance
- Client components fetch via typed adapters; errors render consistent fallbacks.

### WS6 – Testing & CI Maturity
Goal: Targeted confidence without over‑engineering.

Deliverables
- Unit tests: `lib/format`, `lib/navigation`, `lib/color-utils` (edge cases), chart formatters.
- Component tests (Vitest + RTL): one per major surface (KPIs, HoldingsTable sorting, AccountsListMobile interactions).
- Add Playwright E2E for core journeys (navigate sidebar → overview → portfolio; open dialog; filter holdings).
- Extend CI with E2E job (allowed to be opt‑in/skipped on external PRs).

Acceptance
- All tests pass in CI; flaky tests quarantined; coverage reports for utils.

### WS7 – Observability & UX Instrumentation
Goal: Understand user flows and issues to prioritize polish.

Deliverables
- Event map for navigation, filters, dialogs; add typed `lib/analytics.ts` (console/no‑op in dev, plug‑in later).
- Add `onError` logging in error boundaries with a centralized `lib/logging.ts` interface.

Acceptance
- Events fire in dev console; errors include component name + route context.

### WS8 – Security & Privacy
Goal: Minimize risk ahead of data integration.

Deliverables
- Scrub `console.log` used for demo/actions; gate behind `if (process.env.NODE_ENV !== 'production')` or remove.
- Verify PII mask coverage with `MaskableValue`; add tests for masked vs unmasked rendering.
- Document `.env.example` with future keys (Plaid/public tokens, feature flags such as `NEXT_PUBLIC_ENABLE_VANTA`).

Acceptance
- No stray logs in prod builds; masking works consistently.

### WS9 – Product Polish for Simplifi Parity (targeted)
Goal: Improve perceived completeness without backend work.

Deliverables
- Transactions UX: bulk select actions, category badges, quick filters (7/30/90d), and rule icon affordances (stubbed).
- Budget/Cash‑flow views: add “planned vs actual” toggles and recurring expense indicators using mock cadence.
- Goals: add “what‑if” sliders to `goal-detail-modal` using local state + `lib/format`.
- Documents: quick actions toolbar (download/delete) already present; add drag‑and‑drop + multi‑type filter chips.

Acceptance
- Demos feel cohesive and competitive; all polish uses existing mocks and components.

## Milestones & Sequencing
- M1 (Week 1): WS1, WS2 (chart kit + types), small refactors only.
- M2 (Week 2): WS3 (virtualization + analyzer), WS4 (axe smoke tests), WS5 (mock APIs).
- M3 (Week 3): WS6 (tests), WS7 (analytics/logging), WS8 (privacy scrub).
- M4 (Week 4): WS9 (product polish passes), final design QA and bug bash.

## Success Metrics
- Core Web Vitals: LCP < 2.5s, INP < 200ms on dashboard routes (local + hosted preview).
- Hydrated JS reduced on portfolio/crypto pages; table scroll FPS ≥ 55 on mid‑tier devices.
- A11y: zero critical axe issues on smoke pages.
- Type safety: no `any`/unsafe casts in changed areas; single domain types import path.
- CI: green on lint, typecheck, unit, and smoke E2E.

## Initial Ticket Backlog (concrete)
1) types/domain.ts: move `Account`, `Transaction` from `components/accounts-table/types.ts`; add `Holding`, `Document`, `Goal`.
2) components/charts/: add `ChartContainer`, `TooltipCard`, `ThemedAxis`; migrate `performance-timeline.tsx` and `cash-flow.tsx` first.
3) holdings-table.tsx: add row virtualization; keep API identical; measure render time.
4) crypto-table.tsx and accounts-table/*: introduce virtualization; ensure keyboard navigation remains intact.
5) app/api/mock/: expose `accounts`, `documents`, `goals` from `lib/mock/*` with zod validation.
6) Add Playwright + axe smoke suite for `/`, `/overview`, `/accounts`, `/portfolio`, `/documents`.
7) Introduce `lib/analytics.ts` and instrument sidebar navigation and date‑range changes.
8) Privacy sweep: replace demo `console.log` with dev‑guarded logs; add unit tests for `MaskableValue`.
9) Documents page: add drag‑and‑drop area and keyboard accessible multi‑select (reusing existing selection state).
10) Bundle analyzer: add optional `ANALYZE=true pnpm build` docs and CI job.

## Risks & Mitigations
- Virtualization regressions (row height, focus): Ship behind a feature flag; add quick revert path.
- Shared chart kit churn: Migrate 1–2 charts first, settle APIs, then roll out.
- Test flakiness in CI: Quarantine flaky E2E; keep unit tests authoritative for merges.

— End of v2 plan —

## Cross-Cutting Items
- Import Path Consistency: Prefer `@/…` aliases instead of mixed relative paths.
- Accessibility: Ensure each page has a single `<main id="main-content">` and that interactive elements have discernible names/roles.
- Documentation: Update README with development scripts, env flags (e.g., `NEXT_PUBLIC_ENABLE_VANTA`).

## Suggested Commands
- Typecheck: `pnpm tsc --noEmit`
- Lint: `pnpm lint` or `pnpm exec eslint .`
- Analyze bundle (optional): Next.js bundle analyzer or manual inspection via DevTools.

## Risks & Mitigations
- Re-enabling lint/TS may surface many warnings: sequence fixes by scope (PR03) before gating in CI (PR06).
- Dependency pinning can cause lockfile churn: do in a dedicated PR (PR06) and test locally.
- Dynamic imports can alter timing: verify charts and tooltips on slow devices.

## Success Criteria (overall)
- No disabled safety checks in next.config.
- Lint/type checks pass; no `any`/casts in critical paths.
- Consistent branding, skip link works everywhere.
- Reduced bundle and stable routing/layout across the app.
