# Marketing Screenshot System - Testing Checklist

## ✅ Pre-flight Checks

Before generating your first screenshots, verify:

### Dependencies Installed
```bash
# Check that these are in package.json
pnpm list @playwright/test
pnpm list tsx
pnpm list react-device-frameset
pnpm list framer-motion
```

### Scripts Available
```bash
# Verify package.json has these scripts
pnpm run shots --help 2>&1 | grep -q "tsx" && echo "✅ shots script exists"
```

### Dev Server Running
```bash
# Start dev server
pnpm dev
# Should see: ✓ Ready on http://localhost:3000
```

## 🧪 Test Plan

### Phase 1: Screenshot Generation

1. **Generate screenshots with auto-start**:
   ```bash
   pnpm shots:serve
   ```
   
   Expected output:
   ```
   > next dev
   ✓ Ready on http://localhost:3000
   ✅ Dashboard Overview - desktop -> public/marketing/shots/dashboard-desktop.png
   ✅ Portfolio - desktop -> public/marketing/shots/portfolio-desktop.png
   ✅ Cash Flow - desktop -> public/marketing/shots/cashflow-desktop.png
   ✅ Budget - desktop -> public/marketing/shots/budget-desktop.png
   ✅ Insights - desktop -> public/marketing/shots/insights-desktop.png
   ✅ Dashboard - phone -> public/marketing/shots/dashboard-phone.png
   ✅ Portfolio - phone -> public/marketing/shots/portfolio-phone.png
   ```

2. **Verify files created**:
   ```bash
   ls -lh public/marketing/shots/*.png
   ```
   
   Should see:
   - `dashboard-desktop.png` (2-5 MB)
   - `portfolio-desktop.png`
   - `cashflow-desktop.png`
   - `budget-desktop.png`
   - `insights-desktop.png`
   - `dashboard-phone.png` (1-3 MB)
   - `portfolio-phone.png`

3. **Manual screenshot generation** (with running server):
   ```bash
   # In one terminal
   pnpm dev
   
   # In another terminal
   MARKETING_BASE_URL=http://localhost:3000 pnpm shots
   ```

### Phase 2: Marketing Mode Verification

1. **Test marketing mode detection**:
   ```bash
   # Open in browser
   http://localhost:3000/overview?marketing=1
   ```
   
   Manual checks:
   - [ ] Page loads normally
   - [ ] No visible scrollbars
   - [ ] No blinking cursors in inputs
   - [ ] No loading spinners or skeletons

2. **Test without marketing mode**:
   ```bash
   http://localhost:3000/overview
   ```
   
   Should see:
   - [ ] Normal scrollbars (if content overflows)
   - [ ] Normal loading states
   - [ ] Normal interactive behavior

### Phase 3: DeviceFrame Component

1. **Create test page**:
   Create `app/test-marketing/page.tsx`:
   ```tsx
   import { DeviceFrame } from "@/components/device-frame"
   
   export default function TestMarketingPage() {
     return (
       <div className="container mx-auto p-8 space-y-12">
         <h1 className="text-3xl font-bold">Device Frame Test</h1>
         
         <section>
           <h2 className="text-xl font-semibold mb-4">Desktop Frame</h2>
           <DeviceFrame
             device="MacBook Pro"
             screenshot="/marketing/shots/dashboard-desktop.png"
             priority
           />
         </section>
         
         <section>
           <h2 className="text-xl font-semibold mb-4">Phone Frame</h2>
           <DeviceFrame
             device="iPhone 13"
             screenshot="/marketing/shots/dashboard-phone.png"
           />
         </section>
       </div>
     )
   }
   ```

2. **Visit test page**:
   ```bash
   http://localhost:3000/test-marketing
   ```
   
   Visual checks:
   - [ ] MacBook frame renders with chrome around screenshot
   - [ ] iPhone frame renders with device bezel
   - [ ] Screenshots fit properly within frames
   - [ ] Images are sharp (not blurry)
   - [ ] Frames animate on scroll-into-view

### Phase 4: Marketing Showcase Components

1. **Test MarketingShowcase**:
   Add to a page:
   ```tsx
   import { MarketingShowcase } from "@/components/marketing-showcase"
   
   <MarketingShowcase />
   ```
   
   Checks:
   - [ ] Desktop hero renders
   - [ ] Mobile grid shows 2 phones side-by-side
   - [ ] Additional desktop grid shows 2 screenshots
   - [ ] All frames animate on scroll

2. **Test MarketingShowcaseMinimal**:
   ```tsx
   import { MarketingShowcaseMinimal } from "@/components/marketing-showcase"
   
   <MarketingShowcaseMinimal />
   ```
   
   Checks:
   - [ ] Single desktop frame centered
   - [ ] Clean, simple layout

3. **Test MarketingShowcaseComparison**:
   ```tsx
   import { MarketingShowcaseComparison } from "@/components/marketing-showcase"
   
   <MarketingShowcaseComparison />
   ```
   
   Checks:
   - [ ] Features alternate left/right
   - [ ] Text descriptions appear
   - [ ] Screenshots match feature descriptions

### Phase 5: Production Build

1. **Build for production**:
   ```bash
   pnpm build
   ```
   
   Expected:
   - [ ] No build errors
   - [ ] No TypeScript errors
   - [ ] Marketing images included in build

2. **Test production server**:
   ```bash
   pnpm start
   ```
   
   Then navigate to:
   - [ ] `http://localhost:3000` (landing page)
   - [ ] `http://localhost:3000/test-marketing` (test page)
   
   All DeviceFrame components should work identically to dev mode.

### Phase 6: Error Scenarios

1. **Missing screenshot**:
   ```tsx
   <DeviceFrame
     device="MacBook Pro"
     screenshot="/marketing/shots/nonexistent.png"
   />
   ```
   
   Expected:
   - [ ] Next.js shows broken image placeholder
   - [ ] No console errors about component

2. **Network offline during screenshot capture**:
   ```bash
   # Stop dev server
   # Run shots script
   pnpm shots
   ```
   
   Expected:
   - [ ] Script fails with connection error
   - [ ] Error message mentions "ECONNREFUSED"

3. **Invalid device type**:
   ```tsx
   <DeviceFrame
     // @ts-expect-error testing invalid device
     device="Nintendo Switch"
     screenshot="/marketing/shots/dashboard-desktop.png"
   />
   ```
   
   Expected:
   - [ ] TypeScript error in editor
   - [ ] Build fails if forced

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module @playwright/test"
**Fix**: Run `pnpm install`

### Issue: "ECONNREFUSED localhost:3000"
**Fix**: Start dev server with `pnpm dev` first

### Issue: Screenshots are blurry
**Fix**: Increase `deviceScaleFactor` in `scripts/marketing-shots.ts`:
```typescript
deviceScaleFactor: 3 // Higher = sharper
```

### Issue: DeviceFrame shows empty
**Fix**: 
1. Check screenshot file exists in `public/marketing/shots/`
2. Check browser console for 404 errors
3. Verify image path starts with `/marketing/shots/`

### Issue: Frames don't animate
**Fix**: Ensure framer-motion is installed: `pnpm add framer-motion`

### Issue: TypeScript errors in device-frame.tsx
**Fix**: The library works despite peer dependency warnings. Types are correct.

## ✅ Sign-off Checklist

Before merging to main:

- [ ] All screenshots generated successfully
- [ ] Screenshots are sharp and well-framed
- [ ] DeviceFrame component renders all 3 device types
- [ ] Marketing mode hides scrollbars and cursors
- [ ] Marketing showcase components render correctly
- [ ] Production build succeeds
- [ ] No TypeScript errors
- [ ] No ESLint errors in new files
- [ ] Documentation is clear and accurate

## 📊 Performance Checks

Optional but recommended:

1. **Image sizes**:
   ```bash
   du -sh public/marketing/shots/*.png
   ```
   
   Target:
   - Desktop screenshots: < 5 MB each
   - Phone screenshots: < 3 MB each

2. **Build size impact**:
   ```bash
   pnpm build
   # Check .next/static/media for optimized images
   ```

3. **Lighthouse score** (with marketing showcase on landing page):
   - Performance: Should remain > 90
   - Best Practices: Should remain > 90
   - Use `priority` prop on above-the-fold images

## 🎯 Success Criteria

✅ System is production-ready when:

1. Screenshots capture deterministically with `?marketing=1`
2. All device frames render correctly in all browsers
3. Images are optimized and load quickly
4. No console errors or warnings
5. TypeScript and ESLint pass
6. Production build succeeds
7. Documentation is comprehensive
8. Team can regenerate screenshots easily

---

**Ready to deploy?** Run through this checklist and check all boxes before pushing to production!
