## Fin‑Infra Web – Technical Excellence Plan (v3)

### Purpose

Evolve the Next.js 15/React 19 financial dashboard into a polished, production‑grade experience that rivals consumer fintech apps (e.g., Quicken Simplifi). This version builds on the v2 plan by incorporating patterns observed across pages—AI insight cards, charts, sliders, tables, and personalization settings—and suggests improvements for modularity, reusability, accessibility and UX polish.

---

### Guiding Principles (unchanged)

* Server Components by default. Use client components only when interactivity is required.
* Single source of truth. Centralize types, colors, formatters, mocks, chart themes and AI‑insight definitions.
* Composition over inheritance. Keep components small, typed, testable and composable.
* Optimized perceived performance. Maintain Core Web Vitals (LCP/INP), use skeletons, defer/stream heavy components and virtualize long lists.
* Accessibility is a first‑class feature. Comply with WCAG AA (color contrast, keyboard flows, aria patterns) and provide accessible tooltips, toggles, sliders and charts.
* AI insights are modular. Centralize insights logic and presentation to ensure consistency and maintainability across pages.
* Privacy and security. Mask PII and scrub logs in production.

---

### Current State Observations (v3)

The app already has a solid foundation: route‑scoped layouts, strict TypeScript, centralized mocks and formatters, dynamic chart imports and shadcn/ui primitives. However, there are additional opportunities noted during the walkthrough:

* Repeated AI Insight patterns: Many pages display “AI Insights” cards with recommendations—e.g., AI Document Insights (Documents page), AI Market Insights (Crypto), AI Cash Flow Insights (Cash Flow), AI Budget Insights (Budget), AI Goal Insights (Goals) and “Smart Recommendations.” These cards share similar structure and call‑to‑action buttons. Centralizing the insight definitions and card component will reduce duplication and ease instrumentation.
* Shared chart patterns: Portfolio, Crypto, Cash Flow, Budget and Taxes all feature time‑series or pie/donut charts. Some charts include interactive elements like comparison toggles and time‑range switches, while others (e.g., Portfolio Allocation) provide tabbed views by asset class/sector/region. Consolidating the chart components into a kit (as planned) remains critical.
* What‑if sliders and calculators: The Goals page uses “what‑if” suggestions (increase monthly contribution), and the Taxes page includes a “What‑If Tax Scenario” with a marginal‑tax‑rate slider. This pattern should be generalized into a reusable slider component with accessible labeling.
* Tables requiring virtualization: Accounts, Portfolio holdings, and Crypto holdings pages show tables with potentially hundreds of rows (e.g., holdings table listing tickers and metrics). Crypto holdings have additional columns like staking and weight percentages. The current plan already calls for virtualization, but the design should cover not only accounts and holdings but also crypto, budget categories and documents if data volume grows.
* Insight feed & filters: The Insights page shows pinned cards and category filters (spending trends, investment health, goals forecast). This feed could be backed by a typed analytics service and benefit from a standardized card and filtering API.
* Settings toggles: The Settings page has switches for email notifications, push notifications, price alerts and trade confirmations. These toggles should be accessible (proper roles and labels) and come from a shared toggle component.

---

### New Workstream: WS0 – AI Insights & Recommendations

Goal: Centralize AI‑driven insight definitions and card components for consistency across pages.

Deliverables

* Create `lib/insights/definitions.ts` with typed insight definitions (id, title, body, category, actions).
* Build a `components/insights/InsightCard.tsx` component that accepts an insight object and renders icon, title, message, metrics (current vs target), and CTA buttons. Ensure keyboard focus management and ARIA attributes for dynamic explanations (e.g., “Why?” links).
* Update pages (Documents, Portfolio, Crypto, Cash Flow, Budget, Goals, Taxes, Insights) to import and render from this shared component.
* Introduce an `lib/insights/service.ts` mock service that returns insights by category (e.g., spending, investment health, tax planning) and supports pagination or filtering.

Acceptance Criteria

* All insight cards across pages use the shared component.
* Adding or editing an insight only requires updating the definitions file.
* Unit tests cover the InsightCard component (e.g., CTA click handlers, accessible labeling).

---

### Revised Workstreams from v2

#### WS1 – Architecture & Types Hygiene (unchanged)

- [x] Centralize domain interfaces into `types/domain.ts`.
- [x] Introduce zod schemas in `lib/schemas`.
- [x] Add typed data adapters in `lib/services`.

#### WS2 – Design System & Component Hardening (expanded)

Goal: Extend the design system beyond charts to include insight cards, sliders, toggles and action buttons.

Deliverables

* Chart Kit: Implement `ChartContainer`, `ThemedAxis`, `Grid`, `TooltipCard` as planned, ensuring they support time‑range toggles (1D/7D/30D/6M/1Y/All on the Crypto page), comparison lines (e.g., compare portfolio vs SPY), and unit labels.
* Insight Card Component: (see WS0).
* Slider Component: Add `components/ui/Slider` with accessible labels and dynamic value display; reuse in tax what‑if scenarios and future goal simulations.
* Toggle & Switch Components: Standardize toggle design for Settings (email notifications, push notifications, price alerts, trade confirmations), hide‑$0‑balance switch on Accounts, show‑stablecoins switch on Crypto, etc.
* Action Button Variants: Provide a consistent style for CTA buttons (e.g., “Set Alert,” “Enable Staking,” “View Analysis,” “Rebalance,” “Adjust Goal,” “Optimize”) across pages.
* Normalize skeletons and empty states as in v2 (documents skeletons, accounts/holdings skeletons, etc.).
* Audit token usage and replace hard‑coded HSL values with variables.

Acceptance

* Shared components used across pages; visual consistency (colors, spacing, states).
* Storybook (optional) shows examples of insight cards, sliders and toggles.

#### WS3 – Performance & Web Vitals (expanded)

* Virtualize large tables: extend virtualization not only to accounts and holdings but also to crypto holdings and budget categories.
* Evaluate virtualization libraries: use `@tanstack/react-table` with `react-virtual` or `react-virtuoso` for dynamic rows and sticky columns. Ensure row actions (e.g., context menu) and keyboard navigation remain accessible.
* Progressive hydration: continue dynamic imports for charts; prefetch modules for heavy analyses triggered by CTA buttons (e.g., “View Analysis” on Crypto page).
* Add optional prefetch hints for features like insights feed when user hovers over a tab.
* Enable Next Image for all static assets unless `images.unoptimized` is intentionally kept for placeholder environment.
* Add `@next/bundle-analyzer` budgets for each route.

#### WS4 – Accessibility (expanded)

* Incorporate Axe checks for all new components (InsightCard, Slider, Toggle).
* Standardize aria roles for interactive financial values (e.g., properly label net cash flow, total crypto value).
* Ensure all charts have text alternatives or accessible summaries (via `<figcaption>` or off‑screen text).
* Provide keyboard controls for time‑range switches (arrow keys to navigate 1D/7D/30D) and group selectors (e.g., "Group by Account" in holdings table).
* Add skip links to main content on each page and ensure each page has one `<main>` tag.

#### WS5 – Data Boundaries & Error Handling (expanded)

* Expand typed API mocks to include insights and tax scenarios.
* Add error boundaries around AI insight containers and interactive calculators. Provide fallback UIs with retry instructions.

#### WS6 – Testing & CI Maturity (expanded)

* Add tests for new shared components (InsightCard, Slider, Toggle, ChartKit).
* Add component tests for interactive flows: toggling notifications, adding goals, adjusting budgets, enabling staking, rebalancing. Use Vitest + RTL.
* Extend Playwright E2E tests to cover new flows triggered by insights (e.g., navigate from “Dining expenses increased” card to Cash Flow details).
* Include accessibility assertions in E2E (via axe) for new pages (Taxes, Insights, Settings).
* Quarantine flakey tests, maintain high coverage.

#### WS7 – Observability & UX Instrumentation (expanded)

* Expand event mapping to include user actions triggered by AI insight cards (e.g., clicked Set Alert, Adjust Budget, Rebalance).
* Instrument toggles and sliders to capture user preferences (with dev‑only console output).
* Expose typed analytics functions for AI cards (e.g., `trackInsightAction(insightId, actionType)`).

#### WS8 – Security & Privacy (unchanged)

* Continue to scrub logs; ensure that sensitive financial values used in AI insights are masked when shown in logs.
* Document environment variables (public Plaid keys, feature flags).

#### WS9 – Product Polish for Simplifi Parity (expanded)

* Documents page: add drag‑and‑drop upload area and chip filters (already planned). Consider adding document preview modals with keyboard navigation and accessible controls for download/delete actions.
* Transactions UX: as planned, add bulk select, badges and quick filters. Ensure virtualization if transaction lists are long.
* Budget & Cash Flow: add “planned vs actual” toggles and recurring expense indicators, and unify with the ChartKit.
* Goals: implement what‑if sliders (leveraging new Slider component) for adjusting contributions and visualizing target date changes.
* Taxes: expand the What‑If Tax Scenario to allow simulating multiple harvest scenarios; unify slider with new component.
* Crypto: allow grouping by exchange and staking state; prefetch stable‑coin data on demand; integrate cross‑asset risk allocation chart with ChartKit.

---

### Milestones & Sequencing (revised)

* M1 (Week 1): WS1 (types), WS2 (initial chart kit + toggle/slider components), WS0 (insight definitions & card component). Small refactors only.
* M2 (Week 2): WS3 (virtualization across accounts/portfolio/crypto tables), WS4 (axe checks), WS5 (API mocks). Begin migrating pages to use insight cards and new components.
* M3 (Week 3): WS6 (unit/component tests, E2E), WS7 (analytics/logging), WS8 (privacy scrub). Continue migrating AI cards and charts.
* M4 (Week 4): WS9 (product polish), finalize design QA and bug bash. Document new patterns in README (insight definitions, slider/toggle usage).

---

### Success Metrics

* Performance: Maintain LCP < 2.5 s and INP < 200 ms on heavy pages. Virtualized tables scroll smoothly at ≥55 FPS on mid‑tier devices.
* Type safety: Single domain types import path and typed insights definitions; no `any` or unsafe casts.
* A11y: Zero critical Axe violations on all smoke routes, plus accessible AI cards, sliders and toggles.
* UX: Insight cards are cohesive, actionable and reusable. Users can adjust goals and tax scenarios via reusable sliders. Settings toggles work consistently across devices.
* CI: Green on lint, typecheck, unit, component and E2E tests; optional analyzer job for bundle budgets.

---

This v3 plan builds on your existing roadmap and the observations from the live UI. It focuses on consolidating repeating patterns (insights, charts, sliders, toggles) into reusable, well‑typed components, enhancing performance through virtualization, hardening accessibility and testing, and adding targeted polish to compete with top‑tier personal finance apps.
