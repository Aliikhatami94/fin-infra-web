# TradeHub QA & Acceptance Checklist

Use this checklist to validate the refreshed TradeHub experience before every release. It covers
accessibility, performance, and core UX flows that map to the implementation plan in
[plans.md](../.github/plans.md).

## 1. Accessibility & Compliance

- [ ] Run automated audits with [`pnpm qa:axe`](#automated-a11y-audits) across landing, auth, and dashboard routes.
- [ ] Confirm all primary CTAs and feature cards receive focus states and have descriptive `aria-label`s.
- [ ] Validate keyboard-only navigation for onboarding, portfolio charts, and settings toggles.
- [ ] Ensure tooltips are present for advanced metrics (Sharpe, Beta, Volatility, readiness bars) and are
      reachable via keyboard or aria descriptors.
- [ ] Check that toast, dialog, and alert components announce their purpose using `role="alert"` or
      `aria-live` when appropriate.

### Automated a11y audits

1. Start the application locally (`pnpm dev` or `pnpm start`).
2. In another terminal, run `pnpm qa:axe -- --baseUrl http://localhost:3000`.
3. Optional: provide a comma-separated list of routes with `--routes=/,/sign-in,/overview,/taxes`.
4. Add `--fail-on-violation` to exit with a non-zero status when running in CI.

## 2. Performance & Rendering

- [ ] Confirm heavy charts (Overview performance timeline, Portfolio allocation, Cash Flow trends) are
      deferred until visible and do not block initial interaction.
- [ ] Verify virtualized tables (Transactions, Documents, Security sessions) render smoothly while
      scrolling and announce row counts to screen readers.
- [ ] Capture Lighthouse snapshots for landing and overview routes using `pnpm qa:lighthouse` and record
      major regressions.
- [ ] Ensure lazy-loaded panels (AI insights, collapsible drawers) hydrate without layout shift.

## 3. Navigation & Routing

- [ ] Validate the landing page header remains sticky and CTAs route correctly (`/sign-in`, `/sign-up`,
      `/overview`).
- [ ] From Taxes, confirm document links deep-link into Documents with the correct filters applied.
- [ ] Check breadcrumb or quick-action links between Portfolio, Accounts, and Rebalancing flows.
- [ ] Confirm error states provide a recovery path (e.g., retry actions, back to dashboard buttons).

## 4. Interaction & Feedback

- [ ] Test dismissible banners, insights, and notifications for persistence after reload.
- [ ] Ensure inline validations appear on blur/type in auth flows and announce errors via assistive tech.
- [ ] Validate that save flows (Settings, Goals, Budget) disable actions until changes exist and surface
      success toasts on completion.
- [ ] Confirm dark/light/contrast themes apply globally, including charts and modals.

## 5. Data Integrity & Content

- [ ] Verify currency, percentages, and dates respect locale formatting across dashboard surfaces.
- [ ] Review tooltip and helper copy for accuracy, including benchmark definitions and readiness criteria.
- [ ] Ensure demo/placeholder data remains consistent between overview KPIs and detail pages.

## Reporting

Log issues in the release tracker with the failing checklist item, route, screenshot (if visual), and steps
for reproduction. Attach axe or Lighthouse output where available to speed up triage.
