# Fin-Infra Web Remediation Plan

This plan sequences focused PRs to address routing/layout correctness, type safety, accessibility, security, performance, and maintainability. Each PR is small, verifiable, and reversible. Follow the order to minimize risk and avoid cascading conflicts.

## Progress Tracker

- [x] PR01 – Navigation + Layout Corrections
- [x] PR02 – Fix KPI Trend Color Bug
- [x] PR03 – Type Hygiene (remove `any`/casts)
- [x] PR04 – Branding + Fonts
- [x] PR05 – Security: Vanta + Auth Logs
- [x] PR06 – Re-enable Type + Lint Gates and Pin Versions
- [ ] PR07 – Performance: Split Heavy UI (partial)
- [x] PR08 – Refactor Large Components (no behavior change)
- [ ] PR09 – Formatting Utilities + Mock Centralization
- [x] PR10 – Tests + CI (targeted)

## Guiding Principles
- Prefer small, incremental PRs with clear acceptance criteria.
- Fix root causes, not symptoms (no band-aids).
- Keep behavior stable unless explicitly called out.
- Server components where possible; client only when needed.
- Pin versions; re-enable safety nets (TS + ESLint) early.

## Execution Order (by PR)

### PR01 – Navigation + Layout Corrections
Goal: Single source of layout truth, correct routes, and reliable active-state.

Changes
- Sidebar
  - components/sidebar.tsx
    - Update Overview href to `/overview` (was `/`).
    - Active state: use `pathname.startsWith(item.href)`; keep `aria-current` when active.
- Command Menu
  - components/command-menu.tsx
    - Update Overview route to `/overview`.
- Remove duplicate layout usage
  - app/(dashboard)/billing/page.tsx: render only page content (do not wrap in `DashboardLayout`).
  - app/(dashboard)/accounts/[id]/page.tsx: remove local `TopBar`/`Sidebar`; rely on `(dashboard)/layout`.
  - app/(dashboard)/documents/loading.tsx: remove `TopBar`/`Sidebar`; keep skeleton-only.
- Skip link target
  - app/page.tsx: wrap content in `<main id="main-content">…</main>` so the global skip link works on landing.

Acceptance Criteria
- Navigating to nested routes (e.g., `/accounts/123`) keeps sidebar item highlighted.
- Landing page skip link focuses the hero section’s main element.
- No duplicate top bars/sidebars on dashboard pages and loading states.

Rollback: Revert the PR safely; no data migrations.

---

### PR02 – Fix KPI Trend Color Bug
Goal: Correct visual semantics in KPI cards.

Changes
- components/kpi-cards.tsx
  - Compute `const trendSign = kpi.trend === 'up' ? 1 : -1;`
  - Pass `trendSign` to `getValueColor` and `getValueBgColor` instead of string.
- Optional (alternative): Update lib/color-utils.ts to accept `'up' | 'down'` union. Keep scope small for now.

Acceptance Criteria
- “Up” trends render green, “down” render red consistently (icons, badges, sparklines). 

Rollback: Revert file; visuals return to prior state.

---

### PR03 – Type Hygiene (remove `any`/casts)
Goal: Strengthen strict typing, remove unsafe casts.

Changes
- Charts/tooltips and handlers
  - components/cash-flow-chart.tsx, components/stock-chart.tsx, components/networth-chart.tsx, components/portfolio-value-chart.tsx, components/allocation-grid.tsx, components/allocation-chart.tsx
  - Replace `any` tooltip props with typed payloads (create small local interfaces per dataset).
- Union type correctness in UI
  - components/allocation-chart.tsx: `setView` typed; remove `as any`.
  - components/top-bar.tsx: `setDateRange` typed; remove `as any`.
  - app/(dashboard)/insights/page.tsx & app/(dashboard)/documents/page.tsx: remove casts for dropdown radio groups by defining unions.
- Icon types
  - components/goal-detail-modal.tsx: `icon` → `React.ComponentType<{ className?: string }>`.
- tsconfig.json
  - Set `allowJs: false` (no JS files present).

Acceptance Criteria
- `pnpm tsc --noEmit` passes locally.
- No remaining `as any` in the touched files.

Rollback: Revert individual files if a component regresses.

---

### PR04 – Branding + Fonts
Goal: Consistent product name and typography.

Changes
- Add `lib/brand.ts`
  - `export const BRAND = { name: 'TradeHub', tagline: 'Stock Trading Dashboard' }`
- Replace hardcoded names
  - components/top-bar.tsx, app/(auth)/layout.tsx, app/(auth)/sign-in/page.tsx, app/page.tsx metadata/title
- Fonts
  - app/layout.tsx: apply `_inter.className` on `<body>` (and `_jetbrainsMono` on `.font-mono` if needed via CSS var).

Acceptance Criteria
- App shows the same brand name across top bar, auth, landing, and metadata.
- No unused font imports.

Rollback: Revert replacements; no functional risk.

---

### PR05 – Security: Vanta + Auth Logs
Goal: Reduce exposure from remote scripts and remove sensitive logs.

Changes
- components/vanta-background.tsx
  - Use `next/script` with `strategy="afterInteractive"`.
  - Gate effect behind `process.env.NEXT_PUBLIC_ENABLE_VANTA === 'true'`.
  - Optionally defer init via IntersectionObserver.
- Auth pages
  - app/(auth)/sign-in/page.tsx, app/(auth)/sign-up/page.tsx, app/(auth)/reset-password/page.tsx, app/(auth)/forgot-password/page.tsx
  - Remove `console.log` of credentials/providers or wrap in `if (process.env.NODE_ENV !== 'production')`.

Acceptance Criteria
- No console logs of credentials in production.
- Vanta disabled by default unless explicitly enabled.

Rollback: Switch env var off to disable effect; logs already removed are safe.

---

### PR06 – Re-enable Type + Lint Gates and Pin Versions
Goal: Turn safety rails back on and stabilize dependency surface.

Status: Implemented (local); CI gating pending
- `.eslintrc.json` extends `next/core-web-vitals` + `@typescript-eslint/recommended`; `lint` script present.
- Dependencies are pinned (no `latest` ranges).
- Note: No GitHub Actions workflow present to enforce gates in CI.

Changes
- next.config.mjs
  - Remove `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` overrides.
- ESLint
  - Add `.eslintrc` extending `next/core-web-vitals` + `plugin:@typescript-eslint/recommended`.
  - Add `"lint": "next lint"` (or keep `eslint .`).
- Dependencies
  - Replace `"latest"` with pinned caret ranges for Radix, framer-motion, recharts, etc.
  - Document the pinning strategy; schedule Renovate/Dependabot later.

Acceptance Criteria
- CI and local builds fail on TS errors and lint errors.
- No `latest` in `dependencies`.

Rollback: Temporarily re-introduce ignore flags if blocking, then roll forward.

---

### PR07 – Performance: Split Heavy UI
Goal: Reduce main bundle and hydration cost.

Status: Partial
- Dynamic imports with `ssr: false` cover heavy charts plus overview holdings/insights/chat, the accounts dashboard surface, and key portfolio widgets (KPIs, AI insights, allocation grid, holdings table).
- Accounts landing page now renders as a server component with lightweight skeleton fallbacks while client bundles hydrate in the background.
- Next steps (tracked under UI-M07): measure bundle impact, consider table virtualization, and evaluate server components for additional shells.

Changes
- Dynamic imports with `ssr: false` for heavy charts
  - components/performance-timeline.tsx, portfolio charts, crypto charts.
- Reduce client component surface
  - Convert shells/containers to server components where possible; keep charts and interactive widgets client.
- Defer non-critical animations.

Acceptance Criteria
- Lower initial JS by bundle analyzer (manual check) and snappier hydration.

Rollback: Revert individual dynamic imports if regressions occur.

---

### PR08 – Refactor Large Components (no behavior change)
Goal: Improve maintainability by splitting monoliths.

Status: Implemented (AccountsTable)
- `components/accounts-table/` folder contains extracted subcomponents and utilities; `index.tsx` provides the public API.
- Optional cleanup: `components/dashboard-header.tsx` appears unused and can be removed after confirmation.

Changes
- components/accounts-table.tsx (>800 lines)
  - Extract `AccountRow`, `AccountDetailPanel`, `AccountsTableDesktop`, `AccountsListMobile`, `filters/sort` utils.

Acceptance Criteria
- No visual/behavior change; file sizes shrink; easier to test.

Rollback: Revert directory to original monolith file.

---

### PR09 – Formatting Utilities + Mock Centralization
Goal: Consistent number/date formatting and mock data management.

Status: Not started
- `lib/format.ts` and `lib/mock/` not present; formatting calls and mock data remain scattered.

Changes
- lib/format.ts
  - `formatCurrency(n: number)`, `formatPercent(n: number)`, `formatDate(d: Date)` utilities.
- Replace scattered `toLocaleString`/inline options with helpers.
- Centralize mock data under `lib/mock/` for accounts, documents, goals, etc.

Acceptance Criteria
- Consistent display across components; single source for mocks.

Rollback: Safe revert; helpers are additive.

---

### PR10 – Tests + CI (targeted)
Goal: Add confidence without over-investing.

Status: Implemented
- Vitest configured with targeted unit tests for `lib/color-utils` and navigation helpers (`isActiveRoute`).
- GitHub Action runs lint, typecheck, and tests for pushes/PRs to main/dev.
- Scripts added for `pnpm test` and `pnpm typecheck`.
- Format helper coverage will follow once `lib/format.ts` lands (PR09).

Changes
- Unit tests (vitest or jest) for
  - `lib/format.ts`
  - `lib/color-utils.ts` edge cases
  - `isActiveRoute(pathname, href)` helper (extract from sidebar)
- Optional: add GitHub Action for `pnpm i && pnpm lint && pnpm typecheck && pnpm test`.

Acceptance Criteria
- Tests pass locally and in CI; coverage for critical helpers.

Rollback: Disable workflow if needed; keep tests locally.

---

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

