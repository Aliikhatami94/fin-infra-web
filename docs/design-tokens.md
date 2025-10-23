# Design Tokens – Brand, Emotion & Trust Layer

The WS-F refresh introduces a unified palette and typography ramp that
reinforces Fin-Infra’s "confident calm" brand voice across light and dark
themes. Values below map directly to CSS custom properties defined in
`app/globals.css`.

## Color primitives

| Token | Light mode | Dark mode | Usage |
| --- | --- | --- | --- |
| `--primary` | `oklch(0.55 0.21 275)` | `oklch(0.7 0.22 275)` | Brand CTAs, focus rings |
| `--accent` | `oklch(0.92 0.07 155)` | `oklch(0.3 0.05 150)` | Positive storytelling surfaces |
| `--success` | `oklch(0.68 0.18 145)` | `oklch(0.72 0.21 150)` | Gains, confirmations |
| `--destructive` | `oklch(0.58 0.22 25)` | `oklch(0.5 0.24 25)` | Loss, destructive buttons |
| `--surface-wealth` | gradient | gradient | Wealth-focused hero states |
| `--surface-cashflow` | gradient | gradient | Cash/income cards |
| `--surface-security` | gradient | gradient | Trust and security CTAs |

Supporting data visualization hues live under `--chart-*` tokens. Each was
validated for WCAG AA contrast on both light and dark backgrounds using
`@axe-core/color` checks.

## Typography scale

Font sizing uses the `data-font-scale` attribute on `<html>`:

| Scale | Token override | Base size |
| --- | --- | --- |
| Compact | `--font-size-base: 0.9375rem` | Dense data tables |
| Default | _no override_ | 1rem |
| Comfort | `--font-size-base: 1.0625rem` | Reading-focused flows |
| Focus | `--font-size-base: 1.125rem` | Maximum legibility |

`--line-height-base` is fixed at `1.6` to maintain comfortable readability in
both dashboards and marketing copy.

## Shadows & motion

Two elevation tokens set the tone for emotion-led surfaces:

* `--shadow-soft`: Ambient hover states on cards and feature highlights.
* `--shadow-bold`: Hero and modal emphasis; pair with gradients for celebratory
  feedback moments.

Motion should respect reduced-motion preferences. When introducing new motion
primitives, keep durations ≤ 450ms with ease-out curves for approachability.

## Accessibility guardrails

* All semantic colors have a minimum contrast ratio of 4.5:1 against paired
  foreground text.
* Success/danger palettes are tuned to avoid red/green conflict; rely on icons
  and copy in addition to color.
* The dyslexia-friendly mode toggles `data-dyslexia="true"` and switches to the
  Atkinson Hyperlegible typeface to improve character differentiation.

Refer to this document when creating new UI so gradients, typography, and
motion cues remain cohesive with the WS-F vision.
