# TradeHub Remediation Plan (UI/UX fixes by page)

This replaces the prior plan. It captures concrete PRs to resolve the observed UI/UX issues. One PR per section (or small bundles). Each PR lists goals, acceptance criteria, and tasks with likely files.

PR index
- PR01: Navigation & Routing Resilience (global)
- PR02: Overview
- PR03: Accounts
- PR04: Cash Flow
- PR05: Portfolio & Insights interactions
- PR06: Documents – Tasks clarity & overdue
- PR07: Documents – Uploads & filters
- PR08: Settings
- PR09: Security Center
- PR10: Accessibility & Visual Baseline (global)
- PR11: Link/Onboarding – Add/Link Accounts CTA
- PR12: Landing (Home)
- PR13: Sign‑In
- PR14: Sign‑Up
- PR15: Demo Page
- PR16: Error Handling & Feedback (global)

Global assumptions
- Follow Next.js App Router; prefer Server Components, add "use client" where needed.
- Reuse `components/ui/*`, Radix overlays, and Tailwind tokens in `app/globals.css`.
- Ship accessibility: visible focus, keyboard flows, aria labels/roles, adequate touch targets.

---

## PR01 – Navigation & Routing Resilience (global)
Goal: Prevent pop‑up blockers and cross‑origin issues; keep navigation in‑app with graceful fallback.

Acceptance Criteria
- All internal actions (e.g., “Review Assets”) navigate within the same origin/tab by default.
- Links that were opening blocked pages now open in‑app routes or modals; no pop‑up blocker triggers.
- If a navigation fails (network/guard), show an in‑app error and a “Back to dashboard” link.
- Badges on nav items (e.g., Accounts “2”) include a tooltip explaining the count.

Tasks (likely files)
- Centralize link helpers: `lib/linking.ts` (ensure internal-only navigation for app routes).
- Replace target="_blank" for app routes: portfolio insights, CTA links.
- Tooltip for nav badges: `components/sidebar.tsx`, `components/mobile-nav.tsx`.
- Error boundary/fallback messaging: `components/error-boundary.tsx` and shared empty/error states.

## PR02 – Overview
Goal: Make plan actions real or clearly “coming soon”; preserve masking UX.

Acceptance Criteria
- “Adjust plan” opens a real plan modal or dedicated route; if not available, the button is disabled with a tooltip “Coming soon”.
- Savings Rate card no longer shows misleading tooltip-only behavior.
- Hide/Show amounts toggle keeps the current mask behavior and exposes an eye/eye‑slash icon state.

Tasks (likely files)
- Plan modal/route: `components/plan-adjust-modal.tsx` (new) or `app/(dashboard)/overview/plan/page.tsx`.
- Wire CTA from Savings Rate card: `components/kpi-cards.tsx` or specific savings card.
- Toggle icon/state: `components/animated-switch.tsx`, `components/privacy-provider.tsx`.

## PR03 – Accounts
Goal: Add a clear “Link account” CTA, clarify badges, and wire “Review savings plan”.

Acceptance Criteria
- Prominent “Link account” / “Add bank” CTA visible above the table on desktop and via FAB on mobile.
- Accounts tab red badge has an explanatory tooltip (e.g., unresolved items).
- “Review savings plan” triggers a modal/route or is disabled with a clear tooltip if not ready.

Tasks (likely files)
- CTA + FAB: `app/(dashboard)/accounts/page.tsx`, `components/accounts-kpi-cards.tsx`.
- Tooltip for tab badge: `components/sidebar.tsx`.
- Wire/migrate plan action: `components/accounts-kpi-cards.tsx` or a small modal.

## PR04 – Cash Flow
Goal: Keep structure; minor UX improvements.

Acceptance Criteria
- Ensure pinning and suggestions render consistently and persist.
- Time scale controls are visible and keyboard accessible.

Tasks (likely files)
- Persistence: `components/cashflow-ai-insights.tsx`, `hooks/use-insight-pins.ts`.
- Controls: `components/cash-flow-kpis.tsx`, `components/cash-flow.tsx` (tab/aria polish).

## PR05 – Portfolio & Insights interactions
Goal: Prevent blocked navigation; clarify “Pin”/“Resolve” results.

Acceptance Criteria
- “Review Assets” and similar actions use in‑app navigation or modals (no pop‑ups). 
- “Pin” shows a visible pinned badge and a Pinned section surfaces above other insights on that surface.
- “Resolve” toggles state and persists per surface; resolved items can be restored.

Tasks (likely files)
- Adjust links to stay in‑app: `components/portfolio-ai-insights.tsx` and related.
- Pinned section: `components/ai-insights.tsx` (group pinned first), `components/insights/InsightCard.tsx` (badge already).
- Persistence: `hooks/use-insight-pins.ts`, `hooks/use-insight-dismissals.ts` (we added undismiss).

## PR06 – Documents – Tasks clarity & overdue
Goal: Clarify actions and overdue messaging.

Acceptance Criteria
- Actions like “Send reminder”, “Complete”, “Discuss” show a confirmation modal with a short description of impact.
- Overdue labels show the due date + relative time (e.g., “Due Apr 30 2024 – 541 days ago”) with a tooltip.
- Overdue badge toned to a readable, non-alarming palette; option to snooze/reschedule exists.

Tasks (likely files)
- Confirmations: `components/accountability-checklist.tsx` (documents surface), small `ConfirmDialog` component.
- Overdue formatting: `lib/format.ts`, documents task item where dates render.
- Snooze/reschedule: small dialog; persist via secure/local storage mock.

## PR07 – Documents – Uploads & filters
Goal: Clarify accepted types/sizes and make filters obviously active.

Acceptance Criteria
- Upload zone shows accepted file types and max size; shows progress during upload.
- Filter chips display selected state and aria-selected; multiple chips can be toggled.

Tasks (likely files)
- Upload zone: `components/document-upload-zone.tsx` (helper text, progress bar, ARIA).
- Filter chips: `components/documents-grid.tsx` (active styles, aria attributes).

## PR08 – Settings
Goal: Make saving transparent and safe.

Acceptance Criteria
- Toggles autosave with feedback (“Saving…” → “Saved”).
- Each toggle has helper text describing effect (Email, Push, Price Alerts, Trade Confirmations).
- “Reset to Defaults” shows a confirmation modal listing what resets.

Tasks (likely files)
- Autosave + toasts: `app/(dashboard)/settings/page.tsx`, `components/settings-group.tsx`, `components/ui/sonner`.
- Helper text copy: settings components.
- Reset confirm: `components/confirm-dialog.tsx` (new) used in settings.

## PR09 – Security Center
Goal: Show recent sessions, clarify downloads and masking.

Acceptance Criteria
- Recent sessions table renders sample data or an empty state with explanation; actions to end sessions work (mocked).
- “Download full audit log” shows confirmation with size estimate and directs to email link if large.
- Login alerts and masking toggles have tooltips/help icons explaining behavior.
- Alternate email is masked by default with “Reveal” and shows “Verified/Unverified” status.

Tasks (likely files)
- Sessions table: `app/(dashboard)/settings/security/page.tsx` (add sample data + empty state).
- Audit log flow: same page; confirm dialog + mock async.
- Help icons: inline `Tooltip`/`HelpCircle` next to toggles.
- Masked field component: `components/ui/masked-input.tsx` (new) used for alternate email.

## PR10 – Accessibility & Visual Baseline (global)
Goal: Improve ARIA, focus, touch targets, and color semantics.

Acceptance Criteria
- All interactive icons (dismiss X, arrows) meet 44×44 touch target on mobile.
- Icons that convey meaning have text labels or aria-labels; decorative icons are aria-hidden.
- Positive/negative color semantics include shape/icon cues; meet WCAG contrast.

Tasks (likely files)
- Touch targets + aria: pass across components (dismiss buttons, feature cards).
- Color semantics helpers: `lib/color-utils.ts` and usage in KPIs/charts.
- Focus styles: ensure consistent tokens in `app/globals.css`.

## PR11 – Link/Onboarding – Add/Link Accounts CTA
Goal: Make account linking obvious and track progress.

Acceptance Criteria
- “Link accounts” CTA visible on Accounts; FAB on mobile.
- If no accounts linked, show an onboarding empty state with “Link now” and short explainer.
- Progress indicator shown during linking (mocked) with success toast.

Tasks (likely files)
- CTA/FAB and empty state: `app/(dashboard)/accounts/page.tsx`, `components/accounts-kpi-cards.tsx`.
- Toasts: `components/ui/sonner`.
- Optional: `components/plaid-link-dialog.tsx` (mock flow).

## PR12 – Landing (Home)
Goal: Fix CTA routing and dead links; add trust hints.

Acceptance Criteria
- “Get Started” and “Start Trading” route to Sign‑Up (not Sign‑In).
- “Explore product highlights” links navigate to real feature pages or open in‑page sections.
- Add brief trust markers near top (e.g., partner logos/testimonials snippet).

Tasks (likely files)
- CTA routing: `app/page.tsx`.
- Feature highlight links/scroll: `app/page.tsx` + IDs or new routes under `app/(public)/features/*`.
- Trust markers: small component on landing.

## PR13 – Sign‑In
Goal: Improve provider UX and validation feedback.

Acceptance Criteria
- Third‑party buttons show loading and error states.
- Dynamic password strength hints removed (not needed on sign-in) but show inline error feedback on submit failures.
- Keyboard and screen reader users receive proper alerts (role="alert").

Tasks (likely files)
- Provider buttons: `app/(auth)/sign-in/page.tsx`.
- Error/alert region and aria: same page.

## PR14 – Sign‑Up
Goal: Dynamic password strength and inline validation.

Acceptance Criteria
- Password strength meter updates live with checks for length, numbers, symbols; shows progress bar and checklist.
- Inline validation for all fields before submit; mismatched passwords highlighted with helpful text.

Tasks (likely files)
- Strength meter: `components/ui/password-input.tsx` (new) or enhance existing input.
- Form validation (Zod/Yup or custom): `app/(auth)/sign-up/page.tsx`.

## PR15 – Demo Page
Goal: Fix routing and upgrade video.

Acceptance Criteria
- “Back to home” returns to `/`.
- “Browse product” scrolls to highlights on the home page; no dashboard navigation when unauthenticated.
- Replace placeholder video with a real demo link or a neutral placeholder; provide transcripts/captions if possible.

Tasks (likely files)
- Routing fixes: `app/demo/page.tsx`.
- Scroll-to-section wiring: landing IDs + anchor handling.
- Video component: accessible embeds with title and captions.

## PR16 – Error Handling & Feedback (global)
Goal: Provide clear feedback for actions and failures.

Acceptance Criteria
- Buttons that trigger async work show in-button loading and toasts on completion/error.
- Feature-gated or unimplemented actions are disabled by default with a “Coming soon” tooltip.
- App-wide error boundaries show friendly messages with retry/back actions.

Tasks (likely files)
- Loading states/toasts: shared `components/ui/button` usage + `components/ui/sonner`.
- Disabled + tooltip patterns: action buttons across cards/pages.
- Error boundary messaging: `components/error-boundary.tsx`.

---

Notes
- Keep PRs small and focused; split follow-ups as PRxx‑a/PRxx‑b if scope grows.
- Prefer secure storage hooks for persistence; mock data/flows until backends are ready.
