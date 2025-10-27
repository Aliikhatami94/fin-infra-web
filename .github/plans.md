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

# Dashboard Review & Remediation Plan (Oct 27, 2025)

Purpose: Address remaining issues discovered during comprehensive dashboard review. The landing pages (PRs 18-25) are complete. This section focuses on the authenticated dashboard experience. Each PR is small, independently releasable, and has crisp acceptance criteria and test steps.

Quick note about scope and style
- App basics: Next.js 15 (App Router), Tailwind v4, shadcn/ui, Radix, strict TS. Paths use `@/*` aliases.
- These pages are authenticated dashboard pages: overview, accounts, transactions, cash flow, portfolio, crypto, budget, goals, taxes, insights, documents, settings.
- UX conventions: Responsive design, accessible interactions, clear confirmations for high-impact actions, proper loading states.
- Confirmation dialogs: All actions that move money, execute trades, or modify budgets must show confirmation modals.
- Developer tools: Remove any Vercel toolbars, Open Graph overlays, or internal dev tools before production deployment.

How to work this plan
- Pick the next PR section below (PR-26, PR-27, …), copy the checklist into the PR description, implement, link to files touched, and check off items during review.
- Keep diffs tight. Add focused tests where logic is introduced. Leave notes if anything deviates.

---

## Master sequence
- [x] PR-26: Remove developer toolbars from dashboard ✅
- [ ] PR-27: Fix Crypto page filters and toggles
- [ ] PR-28: Add confirmation dialogs for money-movement actions
- [ ] PR-29: Expand tooltip hover areas across dashboard
- [ ] PR-30: Clarify time-range controls
- [ ] PR-31: Add undo for dismissed insights/alerts
- [ ] PR-32: Confirmation dialogs for remaining high-impact actions
- [ ] PR-33: Dashboard accessibility improvements
- [ ] PR-34: Form validation and error handling

---

## PR-26: Remove developer toolbars from dashboard ✅ COMPLETE

Objective: Hide Vercel developer toolbar and Open Graph buttons in production builds.

Checklist
- [x] Locate Vercel toolbar components
	- Found `@vercel/analytics` in `app/layout.tsx`
	- Vercel platform toolbar controlled via dashboard settings, not code
- [x] Add environment checks
	- Wrapped `<Analytics />` in `process.env.NODE_ENV === 'production'` check
	- Analytics now only active in production builds
	- Prevents dev traffic from polluting analytics data
- [x] Test in production mode
	- Built with `pnpm build` - successful ✅
	- Ran `pnpm start` - production server started ✅
	- Verified Analytics component conditionally rendered
- [x] Documentation
	- Created `docs/vercel-toolbar.md` with configuration instructions
	- Documented how to disable Vercel platform toolbar via dashboard settings

Acceptance criteria
- [x] Vercel Analytics only in production (`process.env.NODE_ENV === 'production'`) ✅
- [x] Analytics disabled in development (`pnpm dev`) ✅
- [x] Production build successful ✅
- [x] TypeScript check passes ✅
- [x] ESLint check passes ✅

Test steps
1. ✅ Run `pnpm dev` on port 3003 → Analytics not rendered (dev mode).
2. ✅ Run `pnpm build && pnpm start` on port 3002 → Analytics rendered (production mode).
3. ✅ TypeScript check: `npx tsc --noEmit` → No errors.
4. ✅ ESLint check: `pnpm lint` → No errors.

Files touched
- `app/layout.tsx` - Wrapped `<Analytics />` in production check
- `docs/vercel-toolbar.md` - New documentation file

---

## PR-27: Fix Crypto page filters and toggles

Objective: Make exchange filters and view toggles functional on Crypto page.

Checklist
- [ ] Implement exchange filter logic
	- Wire up filter buttons: All, Coinbase, Binance
	- Filter crypto data by selected exchange
	- Update charts and tables when filter changes
	- Add loading state during filter application
- [ ] Implement view toggle logic
	- Wire up toggle buttons: By asset, By exchange, By staking
	- Change chart/table grouping based on selected view
	- Update data aggregation accordingly
	- Maintain filter state across view changes
- [ ] Implement "Stablecoins hidden" toggle
	- Filter out stablecoins (USDT, USDC, DAI, etc.) when enabled
	- Update totals and percentages accordingly
	- Add tooltip explaining which assets are considered stablecoins
- [ ] Add visual feedback
	- Active filter/toggle shows selected state (e.g., primary color)
	- Inactive filter/toggle shows default state
	- Loading spinner during data updates

Acceptance criteria
- Clicking "Coinbase" shows only Coinbase assets ✅
- Clicking "Binance" shows only Binance assets ✅
- Clicking "All" shows all assets ✅
- "By asset" groups data by cryptocurrency type ✅
- "By exchange" groups data by exchange platform ✅
- "By staking" groups data by staking status ✅
- "Stablecoins hidden" removes USDT, USDC, DAI from view ✅
- Totals update correctly when filtering ✅
- Charts reflect filtered data ✅

Test steps
1. Go to `/crypto` → click "Coinbase" filter → verify only Coinbase assets shown.
2. Check chart updates to show only Coinbase data.
3. Check totals recalculate without Binance assets.
4. Click "By exchange" toggle → verify data grouped by exchange with sub-totals.
5. Click "By staking" toggle → verify staking vs. non-staking assets separated.
6. Enable "Stablecoins hidden" → verify USDT, USDC, DAI disappear from list.
7. Check that total value excludes stablecoin values.
8. Disable toggle → stablecoins reappear.

Files to touch
- `app/(dashboard)/crypto/page.tsx`
- Crypto data filtering/grouping logic
- Filter button components
- Toggle components
- Chart configuration updates

---

## PR-28: Add confirmation dialogs for money-movement actions

Objective: Ensure all actions that move funds or execute trades require explicit user confirmation.

Checklist
- [ ] Portfolio "Rebalance" confirmation
	- Add modal showing proposed trades
	- Display current vs. target allocation
	- Show estimated transaction costs
	- Require "Confirm Rebalancing" button click
	- Allow cancel without changes
- [ ] Budget "Automate sweep" confirmation
	- Add modal explaining sweep automation
	- Show sweep rules (trigger amount, frequency, destination account)
	- Display example: "When checking account exceeds $5,000, move surplus to high-yield savings"
	- Require explicit opt-in
- [ ] Budget "Reallocate" confirmation
	- Show current vs. proposed budget allocations
	- List affected categories with before/after amounts
	- Highlight categories with reduced budgets
	- Require confirmation before applying
- [ ] Crypto "Apply target mix" confirmation
	- Show proposed trades to reach target allocation
	- Display transaction fees and slippage estimates
	- Warn about tax implications (if applicable)
	- Require explicit confirmation

Acceptance criteria
- "Rebalance" button opens modal before executing ✅
- Modal shows all proposed trades clearly ✅
- User can cancel without changes ✅
- "Automate sweep" shows rules and requires opt-in ✅
- "Reallocate" shows before/after budget comparison ✅
- "Apply target mix" shows trades and fees ✅
- All modals keyboard accessible (Esc to cancel) ✅

Test steps
1. Portfolio page → click "Rebalance" → modal opens showing proposed trades.
2. Verify modal shows: current allocation, target allocation, trades needed, estimated costs.
3. Click "Cancel" → modal closes, no changes made.
4. Budget page → click "Automate sweep" → modal shows automation rules.
5. Verify modal explains: trigger condition, destination account, frequency.
6. Click "Enable Automation" → success toast appears.
7. Budget page → click "Reallocate" → modal shows category changes.
8. Crypto page → click "Apply target mix" → modal shows trades and fees.

Files to touch
- `app/(dashboard)/portfolio/page.tsx`
- `app/(dashboard)/budget/page.tsx`
- `app/(dashboard)/crypto/page.tsx`
- New: `components/rebalance-confirmation-modal.tsx`
- New: `components/automate-sweep-modal.tsx`
- New: `components/reallocate-budget-modal.tsx`
- New: `components/apply-target-mix-modal.tsx`

---

## PR-29: Expand tooltip hover areas across dashboard

Objective: Make tooltips easier to trigger by increasing hover target sizes.

Checklist
- [ ] Audit tooltip usage across dashboard
	- Find all tooltips with small hover areas
	- Common locations: percentage changes, metric badges, info icons
- [ ] Increase hover target size
	- Wrap tooltip triggers in larger clickable area (min 44x44px)
	- Add padding to tooltip trigger elements
	- Use invisible padding (via CSS) to expand hover area
- [ ] Test on mobile devices
	- Verify tooltips work on touch devices
	- Ensure touch targets meet 44x44px minimum
	- Test on real devices if possible

Acceptance criteria
- All tooltips have min 44x44px hover area ✅
- Tooltips trigger reliably on first hover ✅
- Touch targets adequate on mobile ✅
- No visual layout shifts from larger hover areas ✅

Test steps
1. Overview page → hover over "+12.4% vs last month" → tooltip appears easily.
2. Accounts page → hover over sync status icons → tooltips appear.
3. Portfolio page → hover over Sharpe Ratio, Beta, Volatility → tooltips work.
4. Test on mobile device (or browser mobile mode) → tap info icons → tooltips appear.
5. Verify 44x44px touch target using browser DevTools.

Files to touch
- `components/ui/tooltip.tsx` (if global changes needed)
- Individual pages with small tooltip triggers
- Hover area CSS utilities

---

## PR-30: Clarify time-range controls

Objective: Make the difference between global date range and page-specific time-scales clear.

Checklist
- [ ] Add tooltips to global date range
	- Tooltip: "Report period: All data shown is from this date range"
	- Make tooltip accessible (keyboard focusable)
	- Position tooltip near selector
- [ ] Add tooltips to page-specific time-scales
	- Example (Cash Flow page): "Chart time scale: How data points are grouped for display"
	- Make tooltip accessible
- [ ] Consider renaming labels
	- Global: "Report Period" or "Data Range"
	- Page-specific: "Chart Time Scale" or "Display Granularity"
	- Ensure naming is consistent and intuitive
- [ ] Persist time-scale preferences
	- Save user's time-scale selection to localStorage
	- Restore selection on page load
	- Per-page or global preference (decide which makes sense)

Acceptance criteria
- Global date range has clear tooltip ✅
- Page-specific time-scales have clear tooltips ✅
- Labels are intuitive and distinct ✅
- Time-scale selection persists across page refreshes ✅
- Tooltips keyboard accessible ✅

Test steps
1. Dashboard → hover over global date range (top-right) → tooltip explains "Report period".
2. Cash Flow page → hover over Daily/Weekly/Monthly → tooltip explains "Chart time scale".
3. Select "Weekly" → refresh page → "Weekly" still selected.
4. Navigate to Portfolio page → navigate back to Cash Flow → selection persisted.
5. Tab through UI → tooltips accessible via keyboard.

Files to touch
- Global date range selector component
- Cash Flow time-scale component
- Other pages with time-scale controls
- LocalStorage persistence logic
- Tooltip components

---

## PR-31: Add undo for dismissed insights/alerts

Objective: Allow users to undo accidental dismissals of insights and alerts.

Checklist
- [ ] Add toast notification on dismiss
	- When user dismisses an insight, show toast: "Insight dismissed"
	- Include "Undo" button in toast
	- Toast auto-dismisses after 5 seconds
- [ ] Implement undo logic
	- Keep dismissed insight in state for 5 seconds
	- If user clicks "Undo", restore insight
	- If toast expires, permanently dismiss insight
- [ ] Apply to all dismissible elements
	- Accounts page: emergency-fund insights, alerts
	- Overview page: task dismissals
	- Insights page: all dismissible insights
	- Budget page: AI insights

Acceptance criteria
- Dismissing insight shows toast with "Undo" ✅
- Clicking "Undo" restores insight ✅
- Toast auto-dismisses after 5 seconds ✅
- After 5 seconds, insight permanently dismissed ✅
- Undo works across all pages with dismissible content ✅

Test steps
1. Accounts page → click dismiss on emergency-fund insight → toast appears.
2. Toast shows: "Insight dismissed" with "Undo" button.
3. Click "Undo" → insight reappears immediately.
4. Dismiss insight again → wait 5 seconds → toast disappears.
5. Insight does not reappear (permanently dismissed).
6. Repeat test on Insights page, Budget page, Overview page.

Files to touch
- `app/(dashboard)/accounts/page.tsx`
- `app/(dashboard)/overview/page.tsx`
- `app/(dashboard)/insights/page.tsx`
- `app/(dashboard)/budget/page.tsx`
- Toast notification system (sonner)
- Insight/alert dismissal handlers

---

## PR-32: Confirmation dialogs for remaining high-impact actions

Objective: Add confirmation modals for all remaining high-impact actions across dashboard.

Checklist
- [ ] Transactions page confirmations
	- "Enable boosts": Modal explaining cashback boosts, which accounts affected, opt-in required
	- "Review ride": If modifies transaction, add confirmation; if read-only, no change
- [ ] Goals page confirmations
	- "Adjust Goal": Show current vs. proposed goal, impact on monthly contributions, require confirmation
	- Scenario planner: Add "Apply Changes" button with confirmation modal
- [ ] Taxes page confirmations
	- "Upload Now": Modal clarifying which documents needed, upload requirements
	- "Plan Tax Loss Harvesting": Modal explaining tax implications, proposed trades, require confirmation
	- "Review Positions": If read-only, no change; if suggests trades, add confirmation
- [ ] Insights page confirmations
	- "Rebalance": Show proposed trades (may reuse Portfolio rebalance modal)
	- "Harvest with Copilot": Show trades and tax implications
	- "Upload Now": Clarify document requirements
- [ ] Documents page confirmations
	- "Send reminder": Show recipient and message preview, confirm send
	- "Complete": Confirm task completion
	- "Reschedule": Open date picker modal, confirm new due date
- [ ] Settings/Security confirmations
	- "End session": Confirm ending specific session, warn if current session
	- "End all other sessions": Strong confirmation modal, list affected sessions, require password/2FA

Acceptance criteria
- All high-impact actions require confirmation ✅
- Modals explain consequences clearly ✅
- User can cancel without side effects ✅
- Confirmations keyboard accessible ✅
- Toast notifications for successful actions ✅

Test steps
1. Transactions → "Enable boosts" → modal explains feature → opt-in required.
2. Goals → "Adjust Goal" → modal shows impact → confirm to apply.
3. Taxes → "Plan Tax Loss Harvesting" → modal shows trades and tax implications.
4. Insights → "Rebalance" → modal shows proposed trades.
5. Documents → "Send reminder" → modal shows recipient and message.
6. Settings → "End session" → confirm modal with session details.
7. Settings → "End all other sessions" → strong confirmation, list sessions.

Files to touch
- `app/(dashboard)/transactions/page.tsx`
- `app/(dashboard)/goals/page.tsx`
- `app/(dashboard)/taxes/page.tsx`
- `app/(dashboard)/insights/page.tsx`
- `app/(dashboard)/documents/page.tsx`
- `app/(dashboard)/settings/page.tsx`
- Multiple new confirmation modal components

---

## PR-33: Dashboard accessibility improvements

Objective: Ensure dashboard is fully keyboard accessible and screen-reader friendly.

Checklist
- [ ] Keyboard navigation audit
	- Tab through all dashboard pages
	- Verify logical tab order
	- Ensure all interactive elements focusable
	- Test Escape key closes modals
	- Test Enter/Space activates buttons
	- Test Arrow keys work in dropdowns/selects
- [ ] Add ARIA labels
	- Icon-only buttons need aria-label (e.g., "More actions", "Close modal")
	- Complex widgets need aria-describedby
	- Charts need alt text or aria-label
	- Live regions for dynamic content (toasts, loading states)
- [ ] Focus indicators
	- Verify all focusable elements have visible focus ring
	- Ensure focus ring meets contrast requirements (3:1)
	- Test focus indicators on dark mode
- [ ] Screen reader testing
	- Test with VoiceOver (Mac) or NVDA (Windows)
	- Ensure page structure makes sense
	- Verify headings hierarchy (H1 → H2 → H3)
	- Test modal announcements
	- Test toast notifications announced

Acceptance criteria
- All interactive elements reachable via keyboard ✅
- Tab order logical throughout dashboard ✅
- Escape closes all modals ✅
- All icon buttons have aria-labels ✅
- Focus indicators clearly visible ✅
- Screen reader announces page changes ✅
- Charts have text alternatives ✅

Test steps
1. Dashboard → Tab through Overview page → verify logical order, all buttons/links focusable.
2. Open modal → press Escape → modal closes.
3. Focus on icon button → verify aria-label announced by screen reader.
4. Navigate with screen reader → verify page structure makes sense.
5. Test dark mode → verify focus rings still visible.
6. Test on multiple pages (Accounts, Portfolio, Transactions).

Files to touch
- All dashboard page components
- Button and icon button components
- Modal components (add focus trap if missing)
- Chart components (add aria-labels)
- Toast notification system
- Global focus ring CSS

---

## PR-34: Form validation and error handling

Objective: Ensure all forms validate inputs properly and display clear error messages.

Checklist
- [ ] Budget quick-edit validation
	- No negative numbers (except for debt paydown)
	- No zero budgets (or show warning)
	- Maximum reasonable value (e.g., $999,999,999)
	- Show error message below input
- [ ] Goal adjustment validation
	- No negative goal amounts
	- Target date must be in future
	- Monthly contribution cannot exceed income
	- Show inline validation errors
- [ ] Transaction search/filter validation
	- Handle special characters gracefully
	- Validate date ranges (start before end)
	- Show "No results" message if empty
- [ ] Document upload validation
	- File type validation (PDF, CSV, etc.)
	- File size validation (e.g., max 10MB)
	- Show clear error: "File too large. Maximum 10MB."
	- Handle corrupted files gracefully
- [ ] Settings form validation
	- Email format validation
	- Phone number format validation
	- Password strength requirements
	- Confirm password matches
- [ ] Edge case handling
	- Paste into number inputs
	- Very large numbers
	- Copy/paste special characters
	- Empty required fields

Acceptance criteria
- Invalid inputs show clear error messages ✅
- Errors appear inline near input field ✅
- Forms prevent submission with invalid data ✅
- Error messages are specific and helpful ✅
- Edge cases handled gracefully ✅

Test steps
1. Budget page → quick-edit → enter -100 → error: "Budget cannot be negative".
2. Enter 0 → warning: "Zero budget means no spending limit".
3. Enter 99999999999999 → error: "Budget exceeds maximum value".
4. Goals page → adjust goal → target date in past → error: "Target date must be in future".
5. Documents → upload 50MB file → error: "File too large. Maximum 10MB".
6. Settings → enter invalid email → error: "Please enter a valid email address".
7. Paste "abc" into number field → input rejected or cleared with error.

Files to touch
- `app/(dashboard)/budget/page.tsx`
- `app/(dashboard)/goals/page.tsx`
- `app/(dashboard)/transactions/page.tsx`
- `app/(dashboard)/documents/page.tsx`
- `app/(dashboard)/settings/page.tsx`
- Form validation utilities
- Input components with validation

---

## Engineering footnotes
- Use Radix UI Dialog for all confirmation modals (focus trap, Esc to close built-in)
- Toast notifications via sonner (already installed)
- Persist user preferences to localStorage (time-scale selections, filter states)
- Add loading states for all async operations (use Skeleton components)
- Log all high-impact actions for audit trail (consider adding audit log table)
- Consider rate limiting for money movement actions
- Use optimistic UI updates where appropriate (instant feedback, revert on error)
- Ensure all modals are keyboard accessible with proper focus management
- Add Vitest tests for validation logic
- Document all high-impact action workflows for user guide



## Executive Summary

**What's Working Well:**
- Numbers display fully (no truncation)
- Search bars reset between pages
- Modals and quick-edit forms function correctly
- Global date-range label displays properly
- Sidebar expansion reveals page labels
- Metrics cards show full values with percentage changes
- Navigation between pages works correctly
- Settings persist properly
- Most tooltips and "Why?" explanations function

**Critical Issues to Address:**
1. Vercel developer toolbar still visible in dashboard (should be hidden in production)
2. Crypto filters (exchange, view toggles) are non-functional placeholders
3. High-impact actions lack confirmation dialogs
4. Tooltip hover areas are too small
5. Dual time-range controls are confusing (global vs. page-specific)

---

## Dashboard Pages Review

### Global/Navigation

**Status:** Mostly functional

**What Works:**
- Sidebar expansion button reveals page labels ✅
- Global search bar resets when navigating to new pages ✅
- Date-range selector displays properly (1 Month) ✅

**Issues:**
- [ ] **CRITICAL**: Vercel developer toolbar and Open Graph buttons visible in bottom-right across all pages
  - Should be hidden in production builds
  - Use environment check: `process.env.NODE_ENV === 'development'`
- [ ] Dual time-range confusion: Global date range (top-right) vs. page-specific time-scales (e.g., Cash Flow Daily/Weekly/Monthly)
  - Add tooltips or labels clarifying scope
  - Consider renaming to "Report Period" vs "Chart Time Scale"

**Files to touch:**
- `app/layout.tsx` or dashboard layout wrapper
- Add conditional rendering for Vercel toolbar components

---

### Overview Page

**Status:** Functional with minor UX improvements needed

**What Works:**
- Metrics cards show full numbers (Net Worth: $487,234, Investable Assets: $324,891) ✅
- Percentage changes display correctly (+12.4% vs last month) ✅
- Action buttons navigate properly ("See details" → Accounts page) ✅
- Shared accountability tasks display with assign/remind/reschedule buttons ✅

**Issues:**
- [ ] Tooltip hover areas too small for "+12.4% vs last month"
  - Expand clickable/hoverable area by increasing padding
  - Target: min 44x44px touch target
- [ ] High-impact action buttons need confirmation dialogs
  - "Allocate cash" should show modal: "This will move funds between accounts"
  - "Drill into trades" is safe (read-only navigation)

**Files to touch:**
- `app/(dashboard)/overview/page.tsx` or equivalent
- Tooltip wrapper component (increase hover area)
- Add confirmation modals for money-movement actions

---

### Accounts Page

**Status:** Functional

**What Works:**
- Total Cash, Total Credit Debt, Total Investments display fully ✅
- Emergency-fund insight with "Review savings plan" modal ✅
- "Link accounts" button opens bank search modal with filtering ✅
- All Accounts table shows balances, changes, sync time, status ✅

**Issues:**
- [ ] Dismiss alerts lack "undo" option
  - Add toast notification with "Undo" button
  - Keep dismissed insights in state for 5 seconds
- [ ] More-actions menus (three dots) functionality unknown
  - Audit actions: if they modify data, add confirmation dialogs
  - Document available actions

**Files to touch:**
- `app/(dashboard)/accounts/page.tsx`
- Toast notification system (sonner already installed)
- More-actions menu component

---

### Transactions Page

**Status:** Functional with confirmation needed

**What Works:**
- High-impact suggestions cards expand with "Why?" explanation ✅
- Quick filters work (Last 7 days, Large transactions, etc.) ✅
- Date-range dropdown shows "Last 30 days" default ✅
- Search bar blank on first open ✅
- Assign button opens member picker ✅

**Issues:**
- [ ] **HIGH PRIORITY**: "Enable boosts" button lacks confirmation
  - Add modal: "This will enable cashback boosts for eligible purchases"
  - Show which accounts will be affected
- [ ] "Review ride" button functionality unclear
  - If it modifies transaction categorization, add confirmation
  - If it opens details view (read-only), no confirmation needed
- [ ] "Discuss" button behavior not explored
  - Document expected behavior (chat interface?)

**Files to touch:**
- `app/(dashboard)/transactions/page.tsx`
- Confirmation modal components
- Action button handlers

---

### Cash Flow Page

**Status:** Functional with minor clarifications needed

**What Works:**
- Time-scale controls (Daily/Weekly/Monthly) display correctly ✅
- Metrics fully visible (Net Cash Flow, Total Inflow, Total Outflow) ✅
- Tooltips function properly ✅
- Insight cards show "Why?" explanations ✅
- "View details" / "View Cash Flow" buttons navigate correctly ✅

**Issues:**
- [ ] Clarify relationship between time-scale toggles and global date range
  - Add tooltip: "Chart time scale (independent of report period)"
  - Or: "Display granularity: how data points are grouped"
- [ ] Ensure time-scale selection persists across sessions
  - Save preference to localStorage or user settings

**Files to touch:**
- `app/(dashboard)/cash-flow/page.tsx`
- Time-scale toggle component with tooltip

---

### Portfolio Page

**Status:** Functional with confirmation needed

**What Works:**
- Metrics display fully (Total Value: $187,650.45, P/L: +$24,650.45) ✅
- Sharpe Ratio, Beta, Volatility, YTD Return visible ✅
- Pinned insight "Diversification opportunity" has working "Why?" ✅

**Issues:**
- [ ] **HIGH PRIORITY**: "Rebalance" button lacks confirmation
  - Add modal showing proposed trades
  - Require explicit "Confirm Rebalancing" action
  - Show estimated transaction costs
- [ ] "Review Assets" button functionality unclear
  - If read-only (opens asset list), no confirmation needed
  - If it suggests changes, add confirmation
- [ ] "Compare scenarios" button needs modal
  - Should open scenario comparison tool
  - No execution without explicit user action

**Files to touch:**
- `app/(dashboard)/portfolio/page.tsx`
- Rebalancing confirmation modal
- Scenario comparison modal

---

### Crypto Page

**Status:** Partially functional - filters broken

**What Works:**
- Metrics display fully (Total Crypto Value, BTC Dominance, 24h Change) ✅
- Tooltips function ✅
- AI Market Insights show diversification suggestions ✅

**Issues:**
- [ ] **CRITICAL**: Exchange filters (All, Coinbase, Binance) don't update data
  - Implement filter logic to update charts and tables
  - Add loading state when filtering
- [ ] **CRITICAL**: View toggles (By asset, By exchange, By staking) non-functional
  - Implement view switching logic
  - Update chart configurations based on selected view
- [ ] "Stablecoins hidden" toggle has no effect
  - Implement filtering logic to exclude/include stablecoins
  - Update totals when toggled
- [ ] **HIGH PRIORITY**: "Apply target mix" lacks confirmation
  - Show proposed trades in modal
  - Require explicit confirmation
- [ ] "Simulate in Copilot" / "Launch Copilot" need clarification
  - If they execute trades, add confirmation
  - If simulation-only, clearly label as such

**Files to touch:**
- `app/(dashboard)/crypto/page.tsx`
- Filter/toggle handler functions
- Data fetching/filtering logic
- Confirmation modals for trade actions

---

### Budget Page

**Status:** Functional with confirmation needed

**What Works:**
- Quick-edit modal changes budget amounts ✅
- Advanced settings enable rollover and warning thresholds ✅
- Budget by Category table displays properly ✅
- Cash-flow automation scenarios show comparative metrics ✅

**Issues:**
- [ ] **HIGH PRIORITY**: "Automate sweep" button lacks confirmation
  - Add modal: "This will automatically move funds to high-yield savings"
  - Show sweep rules and frequency
  - Require explicit opt-in
- [ ] **HIGH PRIORITY**: "Reallocate" button lacks confirmation
  - Show which categories will be affected
  - Display before/after budget allocations
- [ ] "Adjust Budget" in insights needs confirmation
  - Show proposed budget change
  - Allow user to modify before applying
- [ ] "Add Category" button not tested
  - Verify modal opens with form validation
  - Test category creation flow

**Files to touch:**
- `app/(dashboard)/budget/page.tsx`
- Automation confirmation modals
- Budget adjustment modal

---

### Goals Page

**Status:** Functional with confirmation needed

**What Works:**
- Progress metrics display clearly ✅
- Scenario planner slider updates text dynamically ✅
- AI Goal Insights show "Why?" explanations ✅

**Issues:**
- [ ] **HIGH PRIORITY**: "Adjust Goal" button lacks confirmation
  - Show current vs. proposed goal parameters
  - Explain impact on required monthly contributions
  - Require explicit confirmation
- [ ] Scenario planner changes not applied automatically
  - Add "Apply Changes" button
  - Show confirmation modal before updating goal

**Files to touch:**
- `app/(dashboard)/goals/page.tsx`
- Goal adjustment modal
- Scenario planner confirmation

---

### Taxes Page

**Status:** Functional with good safeguards

**What Works:**
- Tax countdown displays clearly ✅
- Deadlines listed with checkboxes (good safeguard) ✅
- AI Tax Insights show urgent and upcoming items ✅

**Issues:**
- [ ] **HIGH PRIORITY**: "Upload Now" button needs clarity
  - Add modal explaining which documents are needed
  - Show upload requirements
  - Confirm upload destination
- [ ] "Review Positions" button functionality unclear
  - If read-only, no confirmation needed
  - If it suggests trades, add confirmation
- [ ] "Plan Tax Loss Harvesting" needs modal
  - Explain tax-loss harvesting
  - Show proposed trades
  - Require explicit confirmation before execution

**Files to touch:**
- `app/(dashboard)/taxes/page.tsx`
- Tax document upload modal
- Tax-loss harvesting planner modal

---

### Insights Page

**Status:** Functional

**What Works:**
- Filter search bar functions ✅
- "Hide resolved insights" switch works ✅
- Category tabs work ✅
- Pinned cards show "Why?" explanations ✅

**Issues:**
- [ ] **HIGH PRIORITY**: All action buttons need confirmation
  - "Rebalance" → show proposed trades
  - "Harvest with Copilot" → explain tax implications
  - "Upload Now" → clarify document requirements
- [ ] Resolved insights might need "restore" option
  - Allow users to unhide dismissed insights
  - Add to settings or insights filter

**Files to touch:**
- `app/(dashboard)/insights/page.tsx`
- Confirmation modals for each action type

---

### Documents Page

**Status:** Functional (file upload not testable)

**What Works:**
- Task list displays with assign/remind/reschedule options ✅
- Due date tooltips function ✅
- Search bar, sort, filter dropdowns work ✅
- Filter chips display correctly ✅
- Upload section shows file requirements ✅

**Issues:**
- [ ] "Send reminder", "Complete", "Reschedule" buttons need confirmation
  - "Send reminder" → show recipient and message preview
  - "Complete" → confirm task completion
  - "Reschedule" → open date picker modal
- [ ] File upload functionality not testable
  - Ensure proper validation (file type, size)
  - Show upload progress
  - Display success/error messages
- [ ] AI Document Insights section empty
  - Verify intended behavior when documents present
  - Add placeholder/empty state messaging

**Files to touch:**
- `app/(dashboard)/documents/page.tsx`
- Task action modals
- File upload component with validation

---

### Settings & Security Center

**Status:** Functional

**What Works:**
- Notification toggles persist and show "All settings saved" ✅
- Appearance controls (theme, font scale) respond immediately ✅
- Active/recent sessions listed with details ✅
- Login alerts and masking ON by default ✅
- Alternate email reveal function works ✅

**Issues:**
- [ ] "End" session buttons need confirmation
  - Modal: "End session on [Device] at [Location]?"
  - Warn if ending current session
- [ ] "End all other sessions" needs strong confirmation
  - Modal: "This will sign you out of all other devices"
  - List affected sessions
  - Require password re-entry or 2FA
- [ ] "Download full audit log" not tested
  - Verify CSV/PDF download works
  - Include proper date range and filtering

**Files to touch:**
- `app/(dashboard)/settings/page.tsx`
- `app/(dashboard)/security/page.tsx` (if separate)
- Session management confirmation modals

---

## Priority Remediation Roadmap

### Phase 1: Critical Issues (Week 1)

**PR-26: Remove developer toolbars and overlays**
- Hide Vercel toolbar in production
- Remove Open Graph debug buttons
- Add environment checks

**PR-27: Fix Crypto page filters**
- Implement exchange filter logic
- Implement view toggle logic (By asset/exchange/staking)
- Fix "Stablecoins hidden" toggle
- Add loading states

**PR-28: Add confirmation dialogs for money movement**
- Portfolio rebalancing confirmation
- Budget "Automate sweep" confirmation
- Budget "Reallocate" confirmation
- Crypto "Apply target mix" confirmation

### Phase 2: High-Priority UX (Week 2)

**PR-29: Expand tooltip hover areas**
- Increase touch targets to 44x44px minimum
- Add padding to tooltip trigger areas
- Test on mobile devices

**PR-30: Clarify time-range controls**
- Add tooltips to global date range
- Add tooltips to page-specific time scales
- Consider renaming for clarity
- Persist time-scale preferences

**PR-31: Add undo for dismissed insights**
- Toast notifications with "Undo" button
- Keep dismissed state for 5 seconds
- Implement restore functionality

### Phase 3: Polish & Documentation (Week 3)

**PR-32: Confirmation dialogs for remaining actions**
- Tax document upload modal
- Goal adjustment confirmation
- Transaction action confirmations
- Document task action modals

**PR-33: Accessibility improvements**
- Add ARIA labels for all icon buttons
- Ensure keyboard navigation for modals/sliders
- Add alt-text for charts (where applicable)
- Test with screen readers

**PR-34: Form validation & error handling**
- Quick-edit budget validation (no negative numbers)
- Handle invalid inputs gracefully
- Display clear error messages
- Test edge cases

---

## Testing Checklist (All Pages)

Before marking any PR complete, verify:

- [ ] No developer toolbars visible
- [ ] All filters update data as expected
- [ ] High-impact actions show confirmation dialogs
- [ ] Tooltips have adequate hover areas (44x44px minimum)
- [ ] Time-range controls clearly labeled
- [ ] Dismissed insights have undo option
- [ ] All forms validate inputs
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] ARIA labels present on icon buttons
- [ ] Mobile responsive (375px, 414px widths)
- [ ] Touch targets adequate (44x44px minimum)

---

## Accessibility Audit Items

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Logical tab order throughout dashboard
- [ ] Escape key closes modals
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in select dropdowns

### Screen Reader Support
- [ ] ARIA labels on all icon buttons
- [ ] ARIA descriptions for complex widgets
- [ ] Role attributes on custom components
- [ ] Live regions for dynamic content updates
- [ ] Skip links for main content areas

### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators clearly visible
- [ ] Text resizable to 200% without loss of content
- [ ] Color not sole means of conveying information
- [ ] High-contrast mode available in settings

### Alternative Text
- [ ] Alt text for all informational images
- [ ] aria-hidden on decorative icons
- [ ] Text alternatives for charts/graphs
- [ ] Transcripts for video content (if any)

---

## Edge Case Testing

### Form Inputs
- [ ] Negative numbers in budget fields
- [ ] Zero values in contribution fields
- [ ] Very large numbers (> 1 trillion)
- [ ] Special characters in search
- [ ] Empty required fields
- [ ] Paste into number inputs

### Date Ranges
- [ ] Future dates
- [ ] Dates before account creation
- [ ] Invalid date formats
- [ ] Leap year handling
- [ ] Time zone edge cases

### File Uploads
- [ ] Oversized files (> limit)
- [ ] Invalid file types
- [ ] Empty files
- [ ] Corrupted files
- [ ] Multiple simultaneous uploads

---

## Engineering Notes

- Use consistent confirmation modal pattern across dashboard
- Toast notifications for undo actions (sonner already installed)
- Persist user preferences (time-scale, filters) to localStorage
- Add loading states for all async operations
- Log all high-impact actions for audit trail
- Consider rate limiting for money movement actions
- Add optimistic UI updates where appropriate
- Ensure all modals are keyboard accessible (focus trap)
- Use Radix UI primitives for consistent behavior
- Document all high-impact action workflows

