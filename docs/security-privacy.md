# Security & Privacy Checklist

Run through this checklist before shipping features that touch AI insights, analytics, or persisted data.

## Data handling

- [ ] Confirm that no raw account numbers, SSNs, or balances are logged or emitted to analytics events.
- [ ] Ensure sensitive insight metrics are marked as `sensitive` with anonymized fallbacks when privacy masking is enabled.
- [ ] Mask or aggregate any user-facing copy (`body`, `explanation`) that could leak confidential values.
- [ ] Document how long data is retained and how users can request deletion.

## Consent & notifications

- [ ] Verify email, push, and SMS notifications respect opt-in/opt-out preferences.
- [ ] Provide clear disclosure for AI-generated recommendations and allow users to dismiss or mute them.
- [ ] Ensure cookie banners and privacy notices are accurate and link to applicable policies.

## Storage & encryption

- [ ] Use `useSecureStorage` (or stronger alternatives) for any client-side persistence.
- [ ] Rotate encryption keys via `NEXT_PUBLIC_STORAGE_ENCRYPTION_FALLBACKS` when rolling secrets.
- [ ] Confirm environment variables required for encryption, sessions, and third-party APIs are present in CI.

## Third-party services

- [ ] Audit SDKs for telemetry and disable unnecessary data collection.
- [ ] Review scopes granted to Plaid, analytics providers, and AI vendors.
- [ ] Update privacy documentation when adding new vendors or changing data flows.

## Reviews & sign-off

- [ ] Capture mitigation notes in the PR description and link back to this checklist.
- [ ] Include QA evidence (screenshots/tests) demonstrating that masking and redaction work as expected.
- [ ] Obtain approval from a security/privacy reviewer for material changes.
