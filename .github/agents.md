# AGENTS.md

## What this repo is
- A Next.js 15 + React 19 TypeScript application: Autoclar - an automated financial clarity platform with rich UI components (Radix UI, shadcn/ui style), charts, AI insights, and an app-router layout.
- Tailwind CSS v4 drives styling (via `@tailwindcss/postcss`) with design tokens defined in `app/globals.css`. Many reusable components live under `components/`.
- Deployed on Vercel and synchronized with v0.app; changes made in v0 can auto-sync back to this repository.

## Product goal
- Automate financial clarity for users by providing intelligent insights, unified data visualization, and effortless financial oversight.
- Deliver a responsive, accessible platform that automatically surfaces actionable finance insights, eliminates manual tracking, and provides real-time clarity with AI-driven automation.
- Keep the codebase simple to extend: new pages/components should follow the existing app-router and UI patterns, with minimal boilerplate.
- Maintain a cohesive design system via Tailwind tokens, utility classes, and shared UI primitives in `components/ui`.

## Design principles
- **Minimal & Modern**: Clean interfaces with purposeful whitespace, avoiding visual clutter. Every element should serve a clear purpose.
- **Visual Hierarchy**: Use size, weight, color, and spacing to guide user attention. Primary actions and critical information should be immediately obvious.
- **Responsive Excellence**: Design for both contexts - spacious desktop layouts with multi-column grids, compact mobile layouts optimized for thumb navigation.
- **Professional Polish**: Refined details matter - proper spacing (4px/8px grid), consistent rounded corners, subtle shadows, smooth animations.
- **Consistent Design Language**: Reuse patterns, maintain color semantics (green=positive, red=negative, blue=action), unified typography scale.
- **Beautiful Animations**: Smooth micro-interactions (0.2-0.3s duration), purposeful motion that enhances UX without distraction. Use framer-motion for complex animations.

## Tech stack
- Next.js 15 (App Router) and React 19; TypeScript strict mode enabled.
- Styling: Tailwind CSS v4 + `tw-animate-css`; shadcn/ui conventions (see `components.json`).
- UI primitives and patterns: Radix UI, lucide-react icons, sonner toasts, recharts, framer-motion.
- Analytics: `@vercel/analytics` wired in `app/layout.tsx`.

## Dev setup and checks
- Package manager: pnpm (pnpm-lock.yaml present). Node 18.18+ or 20+ recommended for Next.js 15.
- Install deps, run dev server, build, and lint using the existing scripts:
	- Install: `pnpm install`
	- Dev: `pnpm dev` (starts Next.js in development mode)
	- Start: `pnpm start` (serve the production build)
	- Lint: `pnpm lint` (eslint .)
- Optional typecheck during development (not a script): `pnpm exec tsc -p tsconfig.json --noEmit`.

## Project scripts (from package.json)
- `dev`: next dev
- `build`: next build
- `start`: next start
- `lint`: eslint .

## Architecture map
- App router (`app/`)
	- Global layout at `app/layout.tsx` imports `app/globals.css` and sets up providers: Theme, Privacy, DateRange, and Vercel Analytics.
	- Routes are organized into segments like `(auth)/`, `(dashboard)/`, and `insights/`, with `page.tsx` files defining pages.
- Components (`components/`)
	- Feature components: tables, charts, KPI cards, panels, modals, insights, etc.
	- UI primitives in `components/ui/` following shadcn conventions.
	- Shared providers (e.g., `theme-provider.tsx`, `privacy-provider.tsx`, `date-range-provider.tsx`).
- Utilities (`lib/`): small helpers like `utils.ts`, `motion-variants.ts`, `color-utils.ts`.
- Styles
	- Tailwind v4 is configured via PostCSS (`postcss.config.mjs`).
	- Global tokens, CSS variables, and base styles live in `app/globals.css` (preferred) and `styles/globals.css` (legacy or alternate theme tokens).
- Types (`types/`): ambient type declarations as needed.

## UI system and conventions
- **shadcn/ui components MUST be used for all UI primitives**
	- **ALWAYS check `components/ui/` directory before creating any custom UI component**
	- Available shadcn components (non-exhaustive): Button, Card, CardHeader, CardContent, CardFooter, Dialog, DialogTrigger, DialogContent, Popover, Select, Tabs, TabsList, TabsTrigger, TabsContent, Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, Collapsible, CollapsibleTrigger, CollapsibleContent, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Sheet, Drawer, and many more
	- These components are production-ready, accessible (ARIA), keyboard-navigable, and built on battle-tested Radix UI primitives
	- See `components.json` for style preset, aliases, and paths. Aliases include:
		- `components` → `@/components`
		- `ui` → `@/components/ui`
		- `utils` → `@/lib/utils`
		- `lib` → `@/lib`
		- `hooks` → `@/hooks`
- **Custom components must compose shadcn primitives**
	- Only create custom components for domain-specific patterns not covered by shadcn
	- Even in custom components, always build on top of shadcn/ui primitives
	- Examples: For collapsible sections, use `Collapsible` from shadcn. For carousels, use `Carousel` from shadcn. For modals, use `Dialog` from shadcn.
	- Never manually implement features like scroll tracking, collapse animations, or modal overlays - shadcn handles these robustly
- **Design implementation standards**
	- Keep designs minimal: transparent backgrounds, subtle borders, avoid heavy fills
	- Use proper spacing: 4px/8px grid system (gap-1, gap-2, gap-4, etc.)
	- Size appropriately: Compact badges (px-2 py-0.5), reasonable buttons (h-8-10), proper touch targets (min 44px on mobile)
	- Typography hierarchy: Use font-semibold sparingly, prefer font-medium for emphasis, font-normal as default
	- Color semantics: Emerald/green for positive, red for negative, amber for warnings, blue for actions
	- Rounded corners: rounded-md for cards/badges, rounded-lg for larger containers, rounded-full only for avatars/dots
- **Responsive design patterns**
	- Desktop (lg: 1024px+): Multi-column grids, side-by-side layouts, hover states, tooltips
	- Tablet (md: 768px): 2-column grids, collapsible sections
	- Mobile (<768px): Single column, carousels for horizontal content, bottom sheets over modals, larger touch targets
	- Use Tailwind breakpoints: `md:`, `lg:`, `xl:` prefixes
- **Animation guidelines**
	- Duration: 0.2s for micro-interactions, 0.3s for layout changes, 0.4s max for complex transitions
	- Easing: Use `ease-in-out` or `[0.4, 0, 0.2, 1]` (Tailwind's ease-out equivalent)
	- Purpose: Animations should provide feedback, guide attention, or indicate state changes
	- Tools: framer-motion for complex animations, Tailwind transitions for simple hover/focus states
	- Never animate for decoration - every animation should enhance UX
- Tailwind v4 usage
	- Use design tokens from `:root` in `app/globals.css`. Prefer utility classes and pre-defined helpers like `.card-standard`, `.text-heading`, etc.
	- Dark mode uses the `dark` class on `<html>` via the `ThemeProvider`.
- Radix UI primitives power all shadcn/ui components and provide accessibility and composability.
- Charts with Recharts; animations with framer-motion; icons via lucide-react.
- Client vs Server Components
	- Use Server Components by default in `app/` routes. Add `"use client"` only where interactivity, hooks, or browser APIs are needed.

## Data & state
- This template is primarily UI-focused; there is no backend in this repo.
- Local state: React state and context providers (Theme, Privacy, DateRange). Add additional context providers in `app/layout.tsx` if cross-app state is needed.
- External data fetching can use Next.js route handlers (`app/api/*`) or client-side requests; add as needed.

## Deployment
- Vercel is the primary target. The repo is linked to a Vercel project and v0.app project per `README.md`.
- Image optimization is disabled (`images.unoptimized = true`). ESLint and TypeScript build-time errors are ignored during `next build` per `next.config.mjs`.

## Typical workflows (copy/paste ready)
- Install and run locally
	- `pnpm install`
	- `pnpm dev` → open http://localhost:3000
- Create a new page (App Router)
	- Add `app/my-page/page.tsx` exporting a React component (Server Component by default).
- Add a client component
	- Create `components/my-widget.tsx` with `"use client"` if it uses state/effects or browser APIs.
- Use a UI primitive
	- **ALWAYS import from `@/components/ui/*` first** - check for existing shadcn components before creating custom UI
	- Available: Button, Card, Dialog, Collapsible, Carousel, Accordion, Tabs, Select, Popover, Tooltip, Sheet, Drawer, etc.
	- Only compose custom patterns when shadcn doesn't provide the exact component needed
- Typecheck and lint before commit
	- `pnpm exec tsc -p tsconfig.json --noEmit`
	- `pnpm lint`

## Contribution expectations
- **Use shadcn/ui components first, always**: Before building any UI pattern, check if shadcn provides it. Available in `components/ui/`: Button, Card, Dialog, Collapsible, Carousel, Accordion, Tabs, Select, Popover, Tooltip, Sheet, Drawer, and more.
- **Prioritize design quality**: Every component should be minimal, modern, and polished. Question if every element is necessary. Reduce visual noise.
- **Maintain visual hierarchy**: Use size, weight, spacing, and color intentionally. Guide users to important actions and information.
- **Design for both desktop and mobile**: Test responsive behavior. Desktop should feel spacious and efficient. Mobile should be thumb-friendly and focused.
- **Polish details**: Proper spacing, consistent sizing, smooth animations, semantic colors, accessible contrasts.
- Follow existing file structure and naming conventions; colocate page-specific components near their route or place reusable ones under `components/`.
- Keep UI consistent with the design tokens in `app/globals.css`; prefer shared utilities and variants.
- Maintain TypeScript strictness; add or refine types in `types/` when introducing new patterns.
- If you add new aliases or shared modules, update imports to use the `@/*` path aliases defined in `tsconfig.json`.
- No tests exist yet; if you introduce business logic beyond presentation, add lightweight tests (e.g., Vitest + React Testing Library) and a `test` script in `package.json`.

## Agent workflow expectations
- **Check for shadcn components FIRST**: Before implementing any UI pattern, search `components/ui/` to see if shadcn already provides it. Examples: Collapsible, Carousel, Accordion, Dialog, Popover, Tabs, Select, etc.
- **Design review checkpoint**: Before implementing any UI change, verify it meets design principles - minimal, clean, proper hierarchy, responsive, polished, consistent.
- Plan first: before any edits, write a clear, step-by-step task plan and keep it updated as you progress.
- Hard gates between stages: Do not Implement until Research and Design are completed and recorded. Do not mark Verify until checks are green. Do not update Docs until Verify has passed. Follow this order: Research → Design → Implement → Verify → Docs.
- For UI-only changes, Verify by running the dev server locally and lint/typecheck; for logic changes, add minimal tests and run them.
- When adding new components, prefer small, composable pieces and **always compose from shadcn/ui primitives** rather than building from scratch.
- **Quality over speed**: Take time to get spacing, sizing, colors, and animations right. A polished, minimal design is better than a feature-complete but cluttered one.

## Quality gates
- Lint/Typecheck: `pnpm lint` and `pnpm exec tsc -p tsconfig.json --noEmit` should pass locally.
- Tests: if present, all test suites must pass before merging.

## Notes
- ESLint and TypeScript build errors are ignored during `next build` for deployment speed; still fix issues locally before merging.
- Tailwind v4 uses the PostCSS plugin; there is no separate `tailwind.config.*` in this repo. Theme tokens live in CSS.
- The repo contains both `app/globals.css` (primary) and `styles/globals.css` (alternate/legacy tokens). Prefer the former, as it is imported by `app/layout.tsx`.
