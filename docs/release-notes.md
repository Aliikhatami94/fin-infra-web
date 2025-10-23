# Release Notes – WS-G Measurement & Growth

## New
- **Growth dashboards:** Added a `/growth` workspace gated by the `growthDashboards` feature flag. Activation, retention, and automation adoption charts use Money Graph mocks and log `cohort_view` analytics events.
- **Experiment flag utilities:** `lib/analytics/experiments.ts` now parses `NEXT_PUBLIC_EXPERIMENT_FLAGS`, exposes `useFeatureFlag`, and governs navigation items plus sampling behaviour.
- **Feedback prompts:** Introduced a reusable `FeedbackPrompt` dialog that captures qualitative signals after onboarding completion and Copilot automations.

## Improvements
- **Insight awareness:** Insights gain unread badges backed by secure storage. Viewing or acting on a card marks it read and emits `insight_read_state` analytics.
- **Onboarding instrumentation:** Guided onboarding tracks step views/completions, collects drop-off reasons, and requests post-journey feedback before routing to the dashboard.
- **Share & export analytics:** Budget exports and the measurement workspace emit `share_export` events so growth teams can attribute downstream sharing.

## Environment
- Added `.env.example` with experimentation keys (`NEXT_PUBLIC_EXPERIMENT_FLAGS`, `NEXT_PUBLIC_EXPERIMENT_COHORT`, `NEXT_PUBLIC_ATTRIBUTION_SOURCE`) and expanded env validation to cover them.
