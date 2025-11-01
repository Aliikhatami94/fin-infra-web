# Marketing Screenshots System

Production-grade automated screenshot generation for landing page marketing assets.

## Overview

This system captures real UI screenshots (not mockups) from your running app, then presents them in polished device frames on the landing page. It combines:

- **Playwright automation**: Headless browser screenshot capture
- **Marketing mode flag**: `?marketing=1` query parameter freezes data and hides loaders
- **Device frames**: iPhone/MacBook chrome using `react-device-frameset`
- **High-DPI output**: 2x-3x scale for retina displays

## Quick Start

### 1. Generate Screenshots

Start your dev server and capture screenshots:

```bash
pnpm shots:serve
```

This will:
1. Start Next.js dev server
2. Wait 5 seconds for startup
3. Run Playwright script to capture screenshots
4. Save PNGs to `public/marketing/shots/`

Or, if your server is already running:

```bash
MARKETING_BASE_URL=http://localhost:3000 pnpm shots
```

For production/staging URLs:

```bash
MARKETING_BASE_URL=https://yourdomain.com pnpm shots
```

### 2. Use DeviceFrame Component

Import and use the `DeviceFrame` component in your landing page:

```tsx
import { DeviceFrame } from "@/components/device-frame"

export function HeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Desktop screenshot */}
      <DeviceFrame
        device="MacBook Pro"
        screenshot="/marketing/shots/dashboard-desktop.png"
        priority
        className="lg:col-span-2"
      />
      
      {/* Mobile screenshots */}
      <DeviceFrame
        device="iPhone 13"
        screenshot="/marketing/shots/dashboard-phone.png"
      />
      <DeviceFrame
        device="iPhone 13"
        screenshot="/marketing/shots/portfolio-phone.png"
      />
    </div>
  )
}
```

## Marketing Mode

The `?marketing=1` query parameter activates special styling for cleaner screenshots:

### Client-side Detection

```tsx
"use client"
import { useSearchParams } from "next/navigation"
import { isMarketingMode } from "@/lib/marketingMode"

export function MyComponent() {
  const searchParams = useSearchParams()
  const isMarketing = isMarketingMode(searchParams)
  
  if (isMarketing) {
    return <FrozenUIState />
  }
  
  return <LiveUIState />
}
```

### Server-side Detection

```tsx
import { isMarketingMode } from "@/lib/marketingMode"

export default function Page({ searchParams }: { searchParams: { marketing?: string } }) {
  const isMarketing = isMarketingMode(
    new URLSearchParams(searchParams as Record<string, string>)
  )
  
  return <MyComponent isMarketingMode={isMarketing} />
}
```

### CSS Styling

Marketing mode automatically applies these styles (see `app/globals.css`):

```css
html[data-marketing-mode="true"] {
  ::-webkit-scrollbar {
    display: none; /* Hide scrollbars */
  }
  * {
    scroll-behavior: auto !important; /* Disable smooth scroll */
    caret-color: transparent !important; /* Hide text cursors */
  }
}
```

Add this to your root layout to activate:

```tsx
import { isMarketingMode } from "@/lib/marketingMode"

export default function RootLayout({ searchParams }: { searchParams: any }) {
  const isMarketing = isMarketingMode(new URLSearchParams(searchParams))
  
  return (
    <html data-marketing-mode={isMarketing ? "true" : "false"}>
      {/* ... */}
    </html>
  )
}
```

## Configuration

### Screenshot Targets

Edit `scripts/marketing-shots.ts` to configure what gets captured:

```typescript
const SHOTS: Shot[] = [
  {
    name: "Dashboard Overview - desktop",
    url: "/overview?marketing=1",
    file: "dashboard-desktop.png",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    fullPage: false,
  },
  {
    name: "Dashboard - phone",
    url: "/overview?marketing=1",
    file: "dashboard-phone.png",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    fullPage: false,
    emulate: "iPhone 13",
  },
  // Add more...
]
```

### Device Types

Available device options for `DeviceFrame`:

- `"iPhone 13"` - Modern iPhone dimensions (390x844)
- `"MacBook Pro"` - Desktop display (1440x900)
- `"iPad"` - Tablet dimensions (768x1024)

### Viewport Sizes

Common presets:

```typescript
// Desktop
{ width: 1440, height: 900, deviceScaleFactor: 2 }

// iPhone
{ width: 390, height: 844, deviceScaleFactor: 3, emulate: "iPhone 13" }

// iPad
{ width: 768, height: 1024, deviceScaleFactor: 2, emulate: "iPad Mini" }
```

## Best Practices

### 1. Deterministic Data

When `?marketing=1` is detected, show fixed/sample data:

```tsx
const data = isMarketing
  ? SAMPLE_DATA // Fixed demo data
  : actualData // Live API data
```

### 2. Hide Loading States

```tsx
{!isMarketing && isLoading && <Spinner />}
{!isMarketing && !isLoading && <Content />}
{isMarketing && <Content />}
```

### 3. Animations

Disable or reduce animations in marketing mode for instant snapshots:

```tsx
<motion.div
  animate={isMarketing ? undefined : { opacity: 1 }}
  transition={isMarketing ? { duration: 0 } : { duration: 0.6 }}
>
  {/* content */}
</motion.div>
```

### 4. High-DPI Assets

Always use `deviceScaleFactor: 2` or higher for sharp screenshots on retina displays.

### 5. Full Page vs Viewport

- `fullPage: false` - Captures only visible viewport (faster, recommended)
- `fullPage: true` - Scrolls and captures entire page (slower, for long pages)

## Output

Screenshots are saved to:

```
public/
  marketing/
    shots/
      dashboard-desktop.png
      dashboard-phone.png
      portfolio-desktop.png
      portfolio-phone.png
      cashflow-desktop.png
      budget-desktop.png
      insights-desktop.png
```

These are served statically at `/marketing/shots/*.png`.

## Troubleshooting

### "Cannot find module @playwright/test"

Install dependencies:

```bash
pnpm install
```

### "ECONNREFUSED localhost:3000"

Start your dev server first:

```bash
pnpm dev
```

Or use `pnpm shots:serve` to start automatically.

### Screenshots look blurry

Increase `deviceScaleFactor`:

```typescript
{ deviceScaleFactor: 3 } // Higher = sharper but larger file
```

### DeviceFrame types error

The library has React 16/17 types but works with React 19. The `// @ts-ignore` comment suppresses this warning.

### CSS linting errors

Tailwind v4 directives (`@apply`, `@theme`) may show CSS lint warnings. These are safe to ignore - they compile correctly.

## CI/CD Integration

### Capture on Deploy

Add to your deployment workflow:

```yaml
# .github/workflows/deploy.yml
- name: Build app
  run: pnpm build

- name: Start server and capture screenshots
  run: |
    pnpm start &
    sleep 10
    MARKETING_BASE_URL=http://localhost:3000 pnpm shots

- name: Deploy
  run: vercel deploy --prod
```

### Version Screenshots

Track screenshot changes in git:

```bash
git add public/marketing/shots/
git commit -m "Update marketing screenshots"
```

Or regenerate on every build and commit manually when design changes.

## Advanced

### Custom Device Frames

Extend the device map in `device-frame.tsx`:

```typescript
const deviceMap: Record<DeviceType, string> = {
  "iPhone 13": "iPhone 13",
  "MacBook Pro": "MacBook Pro",
  "iPad": "iPad Mini",
  "Galaxy S21": "Galaxy Note 8", // Use similar devices
}
```

See [react-device-frameset docs](https://github.com/zheeeng/react-device-frameset) for available devices.

### Programmatic Usage

Import the script in your own automation:

```typescript
import { chromium } from "@playwright/test"

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto("https://yourdomain.com/overview?marketing=1")
await page.screenshot({ path: "output.png", type: "png" })
await browser.close()
```

## Related Files

- `scripts/marketing-shots.ts` - Playwright automation script
- `components/device-frame.tsx` - React component for device mockups
- `lib/marketingMode.ts` - Marketing mode detection utility
- `app/globals.css` - Marketing mode CSS styles
- `package.json` - npm scripts: `shots` and `shots:serve`

---

**Need help?** Check the inline comments in `scripts/marketing-shots.ts` and `components/device-frame.tsx`.
