# Mobile Header - Visual Testing Guide

## Quick Test Checklist

### 1. Desktop View (>1024px)
- [ ] Header always visible (no auto-hide)
- [ ] All elements visible: menu, search, workspace badge, privacy toggle, date range, notifications, profile
- [ ] Height: 56px (14 × 0.25rem)
- [ ] Glass effect active
- [ ] Shadow appears on scroll

### 2. Tablet View (768px-1024px)
- [ ] Header auto-hides on scroll down
- [ ] Header reappears on scroll up
- [ ] Workspace badge hidden
- [ ] Privacy toggle visible
- [ ] Date range selector visible
- [ ] Height: 48px (12 × 0.25rem)

### 3. Mobile View (<768px)
- [ ] Header auto-hides on scroll down
- [ ] Header reappears on scroll up
- [ ] Only visible: hamburger, search, notifications, profile
- [ ] Hidden: workspace badge, privacy toggle, date range
- [ ] Height: 44px (11 × 0.25rem)
- [ ] Smooth slide up/down animation (300ms)

### 4. Scroll Behavior
- [ ] Header shows immediately at top of page
- [ ] Starts hiding after scrolling down >100px
- [ ] Reappears immediately when scrolling up
- [ ] No jitter or flickering during scroll
- [ ] Background becomes solid with shadow after 10px scroll

### 5. Interactions
- [ ] Hamburger menu opens sidebar (mobile)
- [ ] Search bar opens command menu
- [ ] Notifications button opens notification center
- [ ] Profile dropdown shows all options
- [ ] All buttons have proper touch targets (44px+)

### 6. Visual Polish
- [ ] Backdrop blur effect visible
- [ ] Smooth transitions between states
- [ ] Icons properly sized for each breakpoint
- [ ] Spacing consistent across breakpoints
- [ ] No layout shift when header hides/shows

### 7. Accessibility
- [ ] All buttons keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] Keyboard navigation works

## Testing URLs

1. **Local Development**: http://localhost:3001
2. **Dashboard**: http://localhost:3001/dashboard
3. **Accounts**: http://localhost:3001/dashboard/accounts
4. **Portfolio**: http://localhost:3001/dashboard/portfolio

## Browser Testing Matrix

| Browser | Mobile | Tablet | Desktop | Status |
|---------|--------|--------|---------|--------|
| Chrome | ☐ | ☐ | ☐ | Pending |
| Safari | ☐ | ☐ | ☐ | Pending |
| Firefox | ☐ | ☐ | ☐ | Pending |
| Edge | ☐ | ☐ | ☐ | Pending |

## Device Testing

### Mobile Devices
- [ ] iPhone 14 Pro (390×844)
- [ ] iPhone SE (375×667)
- [ ] Samsung Galaxy S21 (360×800)
- [ ] Pixel 7 (412×915)

### Tablets
- [ ] iPad Air (820×1180)
- [ ] iPad Pro 11" (834×1194)
- [ ] Galaxy Tab (768×1024)

## Chrome DevTools Testing

1. Open DevTools (F12)
2. Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Test each device preset
4. Test custom dimensions
5. Test orientation changes

## Performance Check

Open Chrome DevTools Performance tab:
- [ ] Scroll at 60fps (no dropped frames)
- [ ] Smooth transform animations
- [ ] No layout thrashing
- [ ] Memory stable during scroll

## Expected Behavior Examples

### Mobile Scroll Sequence
```
1. Page loads → Header visible
2. Scroll down 150px → Header slides up (hidden)
3. Continue scrolling down → Header stays hidden
4. Scroll up 5px → Header slides down (visible)
5. Scroll to top → Header remains visible
```

### Visual States
```
At top: Semi-transparent (80% opacity), no shadow
After 10px scroll: Solid (95% opacity), subtle shadow
Hidden: Transform translateY(-100%)
Visible: Transform translateY(0)
```

## Common Issues to Watch For

1. **Jitter**: Header flashing during small scroll movements
   - Should NOT happen (threshold prevents this)

2. **Stuck Header**: Header doesn't reappear on scroll up
   - Should NOT happen (scroll listener handles this)

3. **Layout Shift**: Content jumps when header hides/shows
   - Should NOT happen (header position fixed)

4. **Touch Conflicts**: Can't tap buttons during scroll
   - Should NOT happen (z-index: 40 keeps it on top)

5. **Performance**: Laggy scroll on low-end devices
   - Monitor with DevTools Performance tab

## Sign-Off

- [ ] All mobile tests passed
- [ ] All tablet tests passed  
- [ ] All desktop tests passed
- [ ] Accessibility verified
- [ ] Performance validated
- [ ] Cross-browser tested

**Tested By**: _______________  
**Date**: _______________  
**Notes**: _______________

---

## Quick Demo Script

1. Open http://localhost:3001/dashboard
2. Resize to mobile (375px width)
3. Scroll down slowly → watch header disappear
4. Scroll up → watch header reappear
5. Repeat at different speeds
6. Test on real device for best results

## Video Demo (Optional)

Record screen demonstrating:
- Desktop layout
- Tablet auto-hide
- Mobile compact view
- Smooth transitions
- All interactions working
