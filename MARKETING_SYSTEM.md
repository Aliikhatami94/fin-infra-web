# Marketing Screenshot System - Quick Start

## ✅ Installation Complete

All dependencies installed and configured:
- ✅ Playwright (`@playwright/test`) - Browser automation
- ✅ tsx - TypeScript execution
- ✅ react-device-frameset - Device mockup frames
- ✅ framer-motion - Already present for animations

## 📁 Files Created

### Core System
- `scripts/marketing-shots.ts` - Playwright automation script
- `lib/marketingMode.ts` - Marketing mode detection utility
- `components/device-frame.tsx` - Device frame wrapper component
- `components/marketing-showcase.tsx` - Example integrations

### Documentation
- `docs/marketing-screenshots.md` - Full documentation
- `public/marketing/shots/README.md` - Output directory guide

### Configuration
- `package.json` - Added `shots` and `shots:serve` scripts
- `app/globals.css` - Added marketing mode CSS styles

## 🚀 Quick Start

### 1. Install Playwright Browsers (First Time Only)

```bash
pnpm exec playwright install chromium
```

### 2. Generate Screenshots

```bash
pnpm shots:serve
```

This will:
1. Start dev server
2. Capture screenshots of all configured pages
3. Save PNGs to `public/marketing/shots/`

### 3. Use in Landing Page

```tsx
import { DeviceFrame } from "@/components/device-frame"

export function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Desktop screenshot */}
      <DeviceFrame
        device="MacBook Pro"
        screenshot="/marketing/shots/dashboard-desktop-dark.png"
        colorScheme="dark"
        priority
        className="lg:col-span-2"
      />
      
      {/* Mobile screenshots - Light and Dark */}
      <DeviceFrame
        device="iPhone 13"
        screenshot="/marketing/shots/dashboard-phone-light.png"
        colorScheme="light"
      />
      <DeviceFrame
        device="iPhone 13"
        screenshot="/marketing/shots/dashboard-phone-dark.png"
        colorScheme="dark"
      />
    </div>
  )
}
```

Or use the pre-built showcase components:

```tsx
import { MarketingShowcase } from "@/components/marketing-showcase"

export default function LandingPage() {
  return (
    <>
      {/* Your hero content */}
      <MarketingShowcase />
    </>
  )
}
```

## 📸 Screenshot Targets (Configured)

**5 pages × 2 themes × 2 devices = 20 screenshots total**

For each page (Dashboard, Portfolio, Cash Flow, Budget, Insights):
- Desktop Light: `{page}-desktop-light.png` (1440x900, 2x scale)
- Desktop Dark: `{page}-desktop-dark.png` (1440x900, 2x scale)
- Phone Light: `{page}-phone-light.png` (390x844, 3x scale)
- Phone Dark: `{page}-phone-dark.png` (390x844, 3x scale)

All pages use `?marketing=1` query parameter for:
- Bypassing authentication/onboarding checks
- Always showing values (privacy mode disabled)
- Cleaner UI (no scrollbars, cursors hidden)

## 🎨 Device Options

Available device frames:
- `"iPhone 13"` - Modern iPhone (uses iPhone X frame)
- `"MacBook Pro"` - Desktop display
- `"iPad"` - Tablet (uses iPad Mini frame)

## 🔧 Marketing Mode

When `?marketing=1` is added to a URL:
- CSS automatically hides scrollbars and cursors
- You can detect it with `isMarketingMode(searchParams)`
- Use it to show fixed demo data instead of live data

Example:

```tsx
import { isMarketingMode } from "@/lib/marketingMode"
import { useSearchParams } from "next/navigation"

export function MyComponent() {
  const searchParams = useSearchParams()
  const isMarketing = isMarketingMode(searchParams)
  
  const data = isMarketing ? DEMO_DATA : actualData
  
  return <Chart data={data} />
}
```

## 📦 Package Scripts

- `pnpm shots` - Run screenshot capture (requires running server)
- `pnpm shots:serve` - Start server + capture screenshots

## 🎯 Next Steps

1. **Capture initial screenshots**:
   ```bash
   pnpm shots:serve
   ```

2. **Add to landing page**:
   - Import `DeviceFrame` or `MarketingShowcase`
   - Point to screenshots in `public/marketing/shots/`

3. **Customize marketing mode** (optional):
   - Add demo data for cleaner screenshots
   - Hide loading states when marketing mode is active

4. **Update screenshot config** (optional):
   - Edit `scripts/marketing-shots.ts` to add/remove pages
   - Adjust viewports, scale factors, or device emulation

## 📖 Full Documentation

See `docs/marketing-screenshots.md` for:
- Advanced configuration
- CI/CD integration
- Troubleshooting
- Best practices
- Marketing mode implementation patterns

## ✨ Example Integrations

Three pre-built showcase components in `components/marketing-showcase.tsx`:

1. **MarketingShowcase** - Full grid with desktop hero + mobile grid
2. **MarketingShowcaseMinimal** - Single desktop hero
3. **MarketingShowcaseComparison** - Feature comparison with alternating screenshots

Import any of these into your landing page to get started quickly!

---

**Questions?** Check the full docs at `docs/marketing-screenshots.md`
