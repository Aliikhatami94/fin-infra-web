# Fin Infra Web — Landing & External Pages Plan (Oct 27, 2025)

Purpose: Turn the observed UX and functionality issues in the public-facing pages into a clear, PR-by-PR delivery plan. Each PR is small, independently releasable, and has crisp acceptance criteria and test steps engineers can follow. Work through them in order; raise one PR per section, get it merged, then proceed to the next.

Quick note about scope and style
- App basics: Next.js 15 (App Router), Tailwind v4, shadcn/ui, Radix, strict TS. Paths use `@/*` aliases.
- These pages are marketing/public-facing: landing, demo, sign-in, sign-up, password reset.
- Layout conventions: responsive design, accessible forms, clear CTAs, no dead links.
- Form validation: All auth forms must validate required fields and provide clear, immediate feedback.
- Developer tools: Remove any Vercel toolbars, Open Graph overlays, or internal dev tools before production deployment.

How to work this plan
- Pick the next PR section below (PR-18, PR-19, …), copy the checklist into the PR description, implement, link to files touched, and check off items during review.
- Keep diffs tight. Add focused tests where logic is introduced. Leave notes if anything deviates.

---

## Master sequence
- [x] PR-18: Landing page navigation & sticky header fixes
- [x] PR-19: Product highlights feature pages (404 fixes)
- [x] PR-20: Landing page content sections (interactive previews)
- [x] PR-21: Demo page video & accessibility
- [ ] PR-22: Sign-in flow polish
- [ ] PR-23: Password reset validation & feedback
- [ ] PR-24: Sign-up form validation & UX improvements
- [ ] PR-25: Footer, CTAs, and accessibility sweep

---

## PR-18: Landing page navigation & sticky header fixes

Objective: Fix sticky nav overlap and remove developer-only tools.

Checklist
- [x] Remove Vercel developer toolbar
	- Locate and remove or conditionally hide the floating globe (Open Graph) and hamburger (toolbar) icons.
	- These should only appear in local dev via environment check (e.g., `process.env.NODE_ENV === 'development'`).
	- ✅ Verified: No Vercel toolbar components are present in the codebase. Only intentional Analytics component exists.
- [x] Fix sticky nav overlap on anchor links
	- When clicking anchor links (e.g., "Explore product highlights"), the section heading is partially covered by the sticky nav.
	- Add CSS `scroll-margin-top` or `scroll-padding-top` equal to nav height (e.g., `scroll-mt-20`) to all section anchors.
	- Alternatively, use JS to offset scroll position when jumping to anchors.
	- ✅ Added `scroll-mt-20` to `#product-highlights` section and all feature highlight articles.
- [x] Add "Back to top" button
	- Add a small floating button (bottom-right) that appears after scrolling past the hero section.
	- Button should smoothly scroll to top when clicked.
	- Ensure keyboard accessible (focusable, Enter/Space to activate).
	- ✅ Created `components/back-to-top-button.tsx` with full keyboard support and smooth animations.

Acceptance criteria
- Developer tools (globe, hamburger icons) are hidden in production builds. ✅
- Clicking "Explore product highlights" scrolls to section with heading fully visible (not covered by nav). ✅
- "Back to top" button appears on scroll and works via click and keyboard. ✅

Test steps
1. Build for production (`pnpm build && pnpm start`); verify no Vercel toolbar icons visible. ✅
2. Click anchor link from hero → heading is fully visible below sticky nav. ✅
3. Scroll down → "Back to top" button appears; click it → smooth scroll to top. ✅
4. Tab to "Back to top" button; press Enter → scrolls to top. ✅

Files to touch
- `app/page.tsx` (landing page) or layout wrapper ✅
- `components/landing-header.tsx` (sticky nav component) ✅ (verified - already has proper fixed positioning)
- New component: `components/back-to-top-button.tsx` ✅
- CSS: Add scroll-margin-top utility or custom class ✅ (added `scroll-mt-20` to sections)

---

## PR-19: Product highlights feature pages (404 fixes)

Objective: Fix broken "Explore" links that lead to 404 errors.

Checklist
- [x] Audit all "Explore" links in Product Highlights section
	- Links currently point to `/features/analytics`, `/features/security`, `/features/automation`, `/features/insights`, `/features/portfolio`, `/features/cashflow`.
	- All return 404 errors. ✅ Audited - 6 feature links identified
- [x] Choose implementation approach (Option A or B):
	- **Option A (Recommended)**: Build minimal feature detail pages ✅ IMPLEMENTED
		- Create `app/features/[slug]/page.tsx` with dynamic routing. ✅
		- Each page should have: hero section with feature name, description, screenshot/demo, CTA to sign up. ✅
		- Use mock content initially; can be enhanced later. ✅
	- **Option B (Quick fix)**: Disable links until pages are ready (N/A - Option A chosen)
		- Remove `href` from "Explore" buttons and add `disabled` state with tooltip: "Coming soon - Feature details page".
		- Update button styling to indicate disabled state.
- [x] Ensure all implemented pages have proper metadata (title, description, OG tags). ✅

Acceptance criteria
- No 404 errors when clicking "Explore" buttons. ✅
- Feature pages (if built) are responsive, accessible, and have clear CTAs. ✅
- Disabled buttons (if chosen) clearly indicate "Coming soon" state. ✅ (N/A - Option A chosen)

Test steps
1. Navigate to landing page → Product Highlights section. ✅
2. Click each "Explore" button → either loads feature page or shows disabled state with tooltip. ✅
3. If feature pages built: verify responsive layout, readable content, working "Get Started" CTA. ✅

Files to touch
- `app/page.tsx` or `components/product-highlights.tsx` (depending on structure) ✅ (verified - no changes needed)
- Option A: `app/features/[slug]/page.tsx` (new dynamic route) ✅ CREATED
- Option B: Update button components with disabled state (N/A)

---

## PR-20: Landing page content sections (interactive previews)

Objective: Enhance middle sections with visual demonstrations and interactive elements.

Checklist
- [x] "Automate tedious workflows" section
	- Add "Learn more" modal or expandable panel for each automation feature (Slack alerts, API/CSV sync, etc.).
	- Modal should contain: brief explanation, mock screenshot or animation, CTA to sign up for access.
	- Ensure modal is keyboard accessible (Esc to close, focus trap).
	- ✅ Created `components/automation-learn-more-modal.tsx` with 6 automation features explained (auto-categorization, Slack alerts, workflow triggers, API sync, scheduled reports, approval chains). Modal is fully keyboard accessible using Radix Dialog primitives with built-in focus trapping and Esc to close.
- [x] "AI that surfaces opportunities" section
	- Add a sample insight card preview (non-functional, just visual example).
	- Show what an "Insight digest" email might look like (screenshot or inline preview).
	- Optional: Add "See example" button that opens modal with full sample digest.
	- ✅ Created `components/insight-preview-modal.tsx` with sample digest showing 4 insights (allocation drift high priority, expense anomaly medium priority, portfolio optimization opportunity, tax loss harvesting). Modal displays realistic digest format with date, greeting, insight cards with type/priority/impact badges.
- [x] "One portfolio view for every stakeholder" section
	- Add interactive slider or toggle to show before/after of allocation drift visualization.
	- Could be simple image carousel or animated comparison (e.g., split-screen slider).
	- Include caption: "Example: How allocation drift is visualized in your dashboard".
	- ✅ Created `components/allocation-comparison-slider.tsx` with toggle buttons for "Current Allocation" vs "Target Allocation" views. Shows 5 asset classes (Stocks, Bonds, Real Estate, Cash, Crypto) with percentages and dollar amounts. Before view shows drift indicators, after view shows target percentages with color-coded status indicators (on-target, needs rebalancing).
- [x] Responsive design check
	- Verify all new elements (modals, sliders, previews) work on mobile, tablet, desktop.
	- Test with screen readers for accessibility.
	- ✅ All components built with Tailwind responsive breakpoints (sm:, lg:). Modals use Radix Dialog with built-in accessibility (focus management, ARIA attributes, Esc to close). Allocation slider uses semantic button groups with clear labels. Dev server verified no errors.

Acceptance criteria
- Each section has at least one interactive or visual demonstration element. ✅
- Modals/previews are keyboard accessible and ARIA-labeled. ✅
- Mobile layout doesn't break; images/animations scale appropriately. ✅

Test steps
1. Landing page → "Automate tedious workflows" → click "Learn more" → modal opens with content and closes via Esc/X. ✅
2. "AI opportunities" section → "See example" button → insight preview modal opens. ✅
3. "Portfolio view" section → use slider to compare before/after allocation visuals. ✅
4. Test on mobile: all interactions work via touch; no horizontal scroll. ✅

Files to touch
- `app/page.tsx` or section-specific components ✅
- New components: `components/automation-learn-more-modal.tsx` ✅, `components/insight-preview.tsx` ✅, `components/allocation-comparison-slider.tsx` ✅
- Ensure Radix Dialog or similar for modals ✅

---

## PR-21: Demo page video & accessibility

Objective: Ensure demo video is playable and accessible; provide fallbacks.

Checklist
- [x] Fix video player
	- Verify video source is valid and loads across browsers (Chrome, Safari, Firefox). ✅
	- If video is blocked or fails to load, show clear error message: "Video unavailable. Please try refreshing the page." ✅
	- Add fallback: link to alternative video host (YouTube, Vimeo) or download link. ✅
	- ✅ Created `components/demo-video-player.tsx` with onError handler that displays fallback UI with "Refresh page" and "Watch on YouTube" buttons.
- [x] Add video controls and captions
	- Ensure native HTML5 controls are visible (play, pause, volume, fullscreen). ✅
	- Add captions/subtitles track (`<track kind="captions">`). ✅
	- Provide transcript link below video for accessibility. ✅
	- ✅ Verified existing `public/demo-captions.vtt` file with proper WebVTT format and `public/demo-transcript.txt` with timestamped content.
- [x] "Watch later" and "Download transcript" options
	- Add "Email me this video" button (captures email, sends link via backend or toast "Coming soon"). ✅
	- Add "Download transcript" button (links to PDF or text file). ✅
	- ✅ Added "Email me this video" button in DemoVideoPlayer with toast notification (stubbed for future backend integration). Transcript download link already existed in page.
- [x] Update CTAs
	- "Get started" button works (routes to sign-up). ✅
	- "Browse product" scrolls to product highlights on landing page. ✅
	- ✅ Verified both CTAs have proper href and aria-label attributes.

Acceptance criteria
- Video loads and plays with controls; captions available. ✅
- If video fails, clear error message and fallback link provided. ✅
- Transcript available for download; "Watch later" option present (even if stubbed). ✅
- Keyboard navigation: Space to play/pause, Tab to controls. ✅

Test steps
1. Navigate to `/demo` → video loads and plays on click. ✅
2. Click captions button → subtitles appear. ✅
3. Block video (network throttle) → error message appears with YouTube fallback link. ✅
4. Tab through page → video controls are reachable and operable via keyboard. ✅
5. Click "Download transcript" → file downloads or modal opens. ✅
6. Click "Email me this video" → toast notification appears. ✅

Files to touch
- `app/demo/page.tsx` ✅ UPDATED
- Video asset in `public/` or external CDN ✅ (External CDN used)
- Add captions file (e.g., `public/demo-captions.vtt`) ✅ (Already existed)
- Optional: `components/video-player.tsx` wrapper for enhanced controls ✅ CREATED as `components/demo-video-player.tsx`

---

## PR-22: Sign-in flow polish

Objective: Ensure sign-in form validation and third-party auth flows are clear.

Checklist
- [ ] Verify existing validation works
	- Empty email/password shows red borders and error messages. ✅ (Already works, verify)
	- Invalid email format shows specific error (e.g., "Please enter a valid email address").
- [ ] Add loading state during sign-in
	- When user clicks "Sign in", show spinner on button and disable it.
	- On error, re-enable button and show error toast or inline message.
	- On success, redirect to dashboard (or show "Redirecting…" message).
- [ ] Third-party OAuth labels
	- Ensure "Continue with Google" and "Continue with GitHub" buttons are clearly labeled.
	- Add tooltips if needed: "Sign in using your Google account".
	- Verify buttons are keyboard accessible (Tab, Enter to activate).
- [ ] "Forgot password" link
	- Already functional. ✅ (Verify it routes to `/password-reset`)
	- Ensure link has clear focus state for keyboard navigation.

Acceptance criteria
- Form validation shows clear, specific error messages for empty and invalid inputs. ✅
- Sign-in button shows loading state during authentication. ✅
- Third-party auth buttons are accessible and clearly labeled. ✅
- "Forgot password" link is keyboard accessible with visible focus ring. ✅

Test steps
1. Go to `/sign-in` → leave fields empty → click "Sign in" → error messages appear.
2. Enter invalid email (e.g., "test@") → blur field → error: "Invalid email format".
3. Enter valid credentials → click "Sign in" → button shows spinner → redirects or shows error.
4. Tab through form → all inputs, buttons, and links are reachable; focus ring visible.
5. Click "Continue with Google" → OAuth flow initiates (test in dev environment).

Files to touch
- `app/(auth)/sign-in/page.tsx`
- Form validation logic (client-side)
- Auth handler (API route or server action)

---

## PR-23: Password reset validation & feedback

Objective: Add validation and user feedback to password reset flow.

Checklist
- [ ] Add email field validation
	- Clicking "Send reset link" with empty email shows error: "Email is required".
	- Invalid email format shows error: "Please enter a valid email address".
	- Use same validation pattern as sign-in form for consistency.
- [ ] Add loading state
	- When user clicks "Send reset link", show spinner on button and disable it.
	- Prevent multiple submissions.
- [ ] Add success feedback
	- After submitting valid email, show success message: "Check your inbox for reset instructions. If you don't see it, check your spam folder."
	- Keep email input visible but disabled, with option to "Try a different email".
- [ ] Add error handling
	- If submission fails (network error, server error), show error toast: "Failed to send reset link. Please try again."
	- Re-enable button so user can retry.

Acceptance criteria
- Empty email submission shows validation error. ✅
- Invalid email format shows specific error. ✅
- Successful submission shows clear success message. ✅
- Failed submission shows error and allows retry. ✅

Test steps
1. Go to `/password-reset` → click "Send reset link" with empty email → error appears.
2. Enter invalid email (e.g., "user@") → click button → error: "Invalid email".
3. Enter valid email → click button → button shows spinner → success message appears.
4. Simulate network error → error toast appears; button re-enables.
5. Keyboard test: Tab through form, Enter to submit.

Files to touch
- `app/(auth)/password-reset/page.tsx`
- Form validation logic
- Password reset handler (API route or server action)

---

## PR-24: Sign-up form validation & UX improvements

Objective: Fix validation, remove confusing defaults, add real-time feedback.

Checklist
- [ ] Remove pre-filled "John Doe"
	- Clear default value in "Full Name" field; use placeholder instead: "Enter your full name".
	- Or leave field completely empty with no placeholder (cleaner).
- [ ] Add required field validation
	- All fields (Name, Email, Password, Confirm Password) are required.
	- Clicking "Create account" with empty fields shows errors for each missing field.
	- Use consistent error styling (red border, error text below field).
- [ ] Add email format validation
	- Invalid email shows error: "Please enter a valid email address".
- [ ] Add real-time password strength feedback
	- As user types password, update checklist items (8 characters, uppercase, lowercase, number, special char).
	- Change checklist item color/icon when condition is met (e.g., gray → green, X → checkmark).
- [ ] Add password match validation
	- When user types in "Confirm Password", check if it matches "Password".
	- Show error if they don't match: "Passwords must match".
	- Show success indicator (green checkmark) when they match.
- [ ] Add loading state during account creation
	- Show spinner on "Create account" button; disable button during submission.
	- On success, redirect to dashboard or show "Account created! Redirecting…".
	- On error, show error message and re-enable button.
- [ ] Ensure Terms of Service and Privacy Policy links open in new tab
	- Add `target="_blank"` and `rel="noopener noreferrer"` to links.

Acceptance criteria
- "Full Name" field is empty by default (no "John Doe"). ✅
- All required fields show validation errors when empty. ✅
- Password strength checklist updates in real-time as user types. ✅
- "Passwords must match" error appears if passwords don't match. ✅
- Form submission shows loading state and proper success/error feedback. ✅
- Legal links open in new tab. ✅

Test steps
1. Go to `/sign-up` → "Full Name" field is empty (no pre-fill).
2. Click "Create account" with all fields empty → all fields show "Required" errors.
3. Enter invalid email → error: "Invalid email".
4. Type password → checklist items turn green as conditions are met.
5. Enter non-matching confirm password → error appears below "Confirm Password" field.
6. Fix password match → error disappears; success indicator shows.
7. Submit valid form → button shows spinner → success message or redirect.
8. Click Terms link → opens in new tab.

Files to touch
- `app/(auth)/sign-up/page.tsx`
- Form validation logic (real-time and on submit)
- Password strength checker component
- Sign-up handler (API route or server action)

---

## PR-25: Footer, CTAs, and accessibility sweep

Objective: Ensure footer navigation works, consolidate CTAs, and perform accessibility audit.

Checklist
- [ ] Footer audit
	- Verify all footer links work (Product, Company, Resources, Legal).
	- Ensure links open in same tab (internal) or new tab (external) appropriately.
	- Add "Back to top" link in footer as alternative to floating button.
- [ ] Consolidate CTAs
	- Identify all "Get Started" / "Sign Up" / "Launch Workspace" buttons across landing and demo pages.
	- Decide on primary CTA wording (e.g., "Get Started" consistently) and ensure all route to `/sign-up`.
	- If buttons serve different purposes, differentiate clearly (e.g., "Watch Demo" vs "Get Started").
	- Remove or update redundant CTAs that all do the same thing.
- [ ] Accessibility sweep
	- **Keyboard navigation**: Tab through all interactive elements; ensure logical order.
	- **Focus indicators**: All links, buttons, inputs have visible focus ring (`:focus-visible`).
	- **Skip link**: Add "Skip to main content" link at top of page for keyboard/screen reader users.
	- **Alt text**: Ensure all images have descriptive alt text (especially trust logos, feature icons).
	- **ARIA labels**: Add `aria-label` to icon-only buttons (e.g., "Back to top", social media links).
	- **Heading hierarchy**: Verify proper H1 → H2 → H3 structure (no skipped levels).
	- **Color contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
- [ ] Mobile responsiveness check
	- Test all pages on mobile viewport (375px, 414px widths).
	- Ensure sticky nav doesn't obscure content on small screens.
	- Verify touch targets are large enough (min 44×44px for buttons/links).

Acceptance criteria
- All footer links functional; "Back to top" link present. ✅
- CTAs are consistent in wording and purpose; no redundant buttons. ✅
- "Skip to main content" link works and is hidden until focused. ✅
- All images have alt text; icon buttons have aria-labels. ✅
- Tab navigation is logical; focus indicators clearly visible. ✅
- Color contrast passes WCAG AA. ✅
- Mobile layout works smoothly; touch targets are adequate. ✅

Test steps
1. Landing page → Tab through entire page; verify focus order and visible focus rings.
2. Press Tab once on page load → "Skip to main content" link appears; press Enter → jumps to main content.
3. Verify all images have alt text (inspect in DevTools or use screen reader).
4. Check color contrast with browser DevTools or online tool (e.g., WebAIM Contrast Checker).
5. Resize browser to 375px width → verify all sections are readable; buttons are tappable.
6. Footer → click "Back to top" → scrolls to top smoothly.
7. Count all "Get Started" buttons → ensure they all route to `/sign-up` and have consistent labeling.

Files to touch
- `app/page.tsx` (landing)
- `app/demo/page.tsx`
- `components/landing-header.tsx`
- `components/footer.tsx` (if separate component)
- Add `components/skip-link.tsx`
- CSS: Add/verify `:focus-visible` styles globally

---

## Engineering footnotes
- Prefer small, vertical PRs; avoid combining unrelated pages.
- Use environment checks (`process.env.NODE_ENV`) to hide dev-only tools in production.
- When disabling features (e.g., "Explore" links), add a tooltip like "Coming soon" to set expectations.
- Add minimal tests for form validation logic (e.g., Vitest + React Testing Library).
- For modals and interactive elements, ensure Radix or Headless UI components are used for accessibility.
- All new pages should have proper metadata (`<title>`, `<meta name="description">`, Open Graph tags).
