# Marketing Screenshots

This directory contains automated screenshots of the app for use in marketing pages.

## Generate Screenshots

Run the following to capture screenshots:

```bash
pnpm shots:serve
```

This will create PNG files in this directory:
- `dashboard-desktop.png`
- `dashboard-phone.png`
- `portfolio-desktop.png`
- `portfolio-phone.png`
- `cashflow-desktop.png`
- `budget-desktop.png`
- `insights-desktop.png`

## Usage

These screenshots are used with the `DeviceFrame` component:

```tsx
import { DeviceFrame } from "@/components/device-frame"

<DeviceFrame 
  device="MacBook Pro" 
  screenshot="/marketing/shots/dashboard-desktop.png"
  priority
/>
```

See `docs/marketing-screenshots.md` for full documentation.
