# Fin Infra Web – Stock/Finance Trading Dashboard

A modern, responsive trading dashboard built with Next.js 15, React 19, and TypeScript. It surfaces portfolio data, watchlists, rich charts, documents/tax views, and AI insights with an accessible, fast UX.

## Overview

- App Router architecture with Server Components by default; client components where interactivity is needed.
- Tailwind CSS v4 drives styling via design tokens defined in `app/globals.css`.
- Reusable UI primitives follow shadcn/ui conventions and Radix UI accessibility.
- Charts and animations via Recharts and Framer Motion. Icons via lucide-react. Toasters via sonner.

### Key features

- Portfolio, accounts, holdings, and KPI cards
- Charts: net worth, allocation, performance, cash flow, crypto
- Watchlist and order book panels
- AI insights panels (portfolio, documents, budget, crypto)
- Documents and tax utilities (summaries, year comparison, scenarios)
- Responsive layout, theme switching, and accessible interactions

## Tech stack

- Next.js 15 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Radix UI + shadcn/ui conventions
- Recharts, framer-motion, lucide-react, sonner
- Package manager: pnpm

## Requirements

- Node.js 18.18+ or 20+
- pnpm installed

## Quick start

```bash
pnpm install
pnpm dev
# App will be available at http://localhost:3000
```

## Scripts

- `dev`: start the Next.js dev server
- `build`: production build
- `start`: serve the production build
- `lint`: run ESLint
- `test`: run Vitest test suites
- `typecheck`: run TypeScript without emit

## Project structure

```
app/                 # App Router: layouts, pages, and route groups
	globals.css        # Design tokens and global styles (Tailwind v4)
	layout.tsx         # Providers and global layout shell
	(auth)/            # Auth-related routes
	(dashboard)/       # Main dashboard routes
	insights/          # Insights pages

components/          # Feature components + UI primitives
	ui/                # shadcn/ui-style primitives

lib/                 # Utilities and helpers
	color-utils.ts
	motion-variants.ts
	utils.ts
	navigation.ts      # Path normalization & active-route helpers
	# mock/            # (If present) central mock data source

public/              # Static assets
styles/              # (Legacy/alternate globals if present)
types/               # Ambient type declarations
```

## Conventions

- Server Components by default in `app/*`. Use `"use client"` only where hooks, state, or browser APIs are needed.
- Tailwind v4 utilities with tokens defined in `app/globals.css`. Dark mode handled via a `ThemeProvider`.
- UI primitives follow shadcn/ui patterns and Radix accessibility.
- Path aliases (see `tsconfig.json`):
	- `@/components`, `@/components/ui`
	- `@/lib`, `@/hooks`, `@/utils`
- Data: this repo is primarily UI-focused; mock/demo data may live under `lib/mock`. Add route handlers under `app/api/*` or client-side fetches for real data.

## Testing

Vitest is configured for unit tests.

```bash
pnpm test
```

## Continuous integration

GitHub Actions workflow runs on pushes/PRs to main/dev to:

- Lint (ESLint)
- Typecheck (tsc)
- Run tests (Vitest)

## Deployment

This is a standard Next.js application. To create a production build and run it locally:

```bash
pnpm build
pnpm start
```

You can deploy the compiled app to any Node-compatible environment or hosting platform that supports Next.js.

## Contributing

- Keep UI consistent with the design tokens in `app/globals.css` and reuse `components/ui` primitives.
- Prefer small, composable components and Server Components by default.
- Maintain TypeScript strictness and update or add types in `types/` when needed.
- Before committing, run:

```bash
pnpm exec tsc -p tsconfig.json --noEmit
pnpm lint
pnpm test
```
