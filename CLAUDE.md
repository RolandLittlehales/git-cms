# Git-CMS Project Guidelines

## Coding Standards

### Naming

- Use descriptive, meaningful names everywhere — no `const p`, `const vars`, `function X`, etc.
- Variables, functions, and parameters should clearly convey their purpose
- Prefer verbose clarity over terse brevity

### Paradigm

- Prefer **functional programming** where possible
  - Pure functions, immutable data, composition over mutation
  - Avoid classes unless the framework requires them (e.g. React error boundaries)
  - Use `map`, `filter`, `reduce` over imperative loops when it reads clearly

### Design Principles

- **KISS** — Keep It Simple, Stupid. Simplest solution that works.
- **YAGNI** — You Aren't Gonna Need It. Don't build for hypothetical futures.
- No premature abstractions — three similar lines > one clever abstraction nobody asked for

### Comments

- Comments explain **WHY**, never **WHAT**
- If the code needs a WHAT comment, the code itself should be rewritten to be self-explanatory
- No commented-out code — delete it, Git remembers

---

## Next.js Best Practices (App Router / v16 + React 19)

### Server-First Architecture

- **Prefer server-side by default** — server components, server actions, server-side data fetching
- Only move logic to the client when it genuinely requires browser APIs or interactivity
- Use **Server Actions** (`'use server'`) for mutations (form submissions, content updates, status changes) instead of API routes where possible
- Server Actions keep logic colocated with the UI that triggers it and avoid unnecessary client-server round-trips

### Server vs Client Components

- **Default to Server Components** — everything is a server component unless explicitly marked `'use client'`
- Only add `'use client'` when the component needs: browser APIs, event handlers (onClick, onChange, etc.), React hooks (useState, useEffect, useContext), or third-party client-only libraries
- Keep client components as **leaf nodes** — push `'use client'` as far down the tree as possible
- Never mark a layout or page as `'use client'` if only a small child needs interactivity — extract the interactive part into its own client component instead

### Data Fetching

- Fetch data in **Server Components** using `async/await` directly — no useEffect, no client-side fetching for initial data
- For the POC, read from the filesystem directly in server components (no fetch needed)
- Use Next.js `generateStaticParams()` for pre-rendering known dynamic routes

### Route Params (Next.js 16 / React 19)

- `params` is now a **Promise** in page/layout components — always `await params`
- In client components, use React 19's `use()` hook to unwrap the params promise
- Same applies to `searchParams`

### Layouts & Templates

- Use `layout.tsx` for shared UI that persists across navigations (nav, sidebar, theme wrapper)
- Layouts receive `children` and `params` — use them to scope theming per tenant
- Keep layouts as server components; extract interactive parts into client child components

### File Conventions

- `page.tsx` — route UI
- `layout.tsx` — shared wrapping UI
- `loading.tsx` — loading UI (Suspense boundary)
- `not-found.tsx` — 404 UI
- `error.tsx` — error boundary (must be `'use client'`)

---

## React Best Practices (v19)

### General

- Prefer **function components** exclusively — no class components
- Colocate related code — keep component, its types, and its styles together
- Props interfaces go in the same file as the component (no separate `types.ts` per component unless shared across multiple files)

### Hooks

- Only call hooks at the top level, never inside conditions or loops
- Use `use()` (React 19) for reading promises and context in render
- Prefer derived state over `useState` + `useEffect` sync — if a value can be computed from props/other state, compute it inline

### Hydration

- Use `useLayoutEffect` (not `useEffect`) for DOM changes that must apply before the browser paints — e.g., color mode, theme variables, scroll position
- Never initialize `useState` with a value that differs between server and client (e.g., reading `window` or `document`) — this creates a hydration mismatch that `suppressHydrationWarning` hides but doesn't fix
- For client state that depends on browser APIs, initialize with the server-safe default and correct it in `useLayoutEffect`

### Composition

- Prefer **composition over configuration** — pass children/render props instead of giant config objects
- Use the `children` prop liberally for flexible layouts

---

## Tina CMS Best Practices

### Schema Design

- Define schemas in `tina/config.ts` using `defineConfig`
- Each collection maps to a content directory (`content/{tenant}/pages/`)
- Use `format: 'mdx'` for collections that need custom component support
- Mark body fields with `isBody: true` so Tina maps them to the MDX body content
- Mark title fields with `isTitle: true` and `required: true`

### Custom Components in Rich Text

- Register custom MDX components as `templates` on `rich-text` fields
- Each template defines `name`, `label`, and `fields` — this generates the editor UI automatically
- Template `name` must match the JSX component name used in MDX files
- Use `type: 'string'` with `options` array for variant/enum fields (e.g., intent: primary/secondary)

### Local Mode (POC)

- Tina local mode reads/writes directly to the filesystem — no GitHub API needed
- `tina dev` runs alongside `next dev`
- Content changes are written directly to `/content` as file modifications
- No authentication required in local mode

### Content Modeling

- Use frontmatter fields for metadata (status, dates, author) — defined as top-level collection fields
- Use `rich-text` with `isBody: true` for the main content area
- Status field should use `type: 'string'` with `options: ['draft', 'published', 'scheduled']`
- Date fields use `type: 'datetime'`

---

## Tailwind CSS Best Practices (v4)

### Theming

- Use CSS custom properties (variables) for tenant-specific colors
- Reference variables in Tailwind classes via `text-[var(--color-primary)]` or define them in `@theme`
- Dark mode via the `dark:` variant, toggled by a class on `<html>`

### General

- Prefer utility classes over custom CSS
- Extract repeated patterns into components, not into CSS abstractions
- Use the `@tailwindcss/typography` plugin for prose/MDX content styling

### Inline Styles

- **Never use inline `style` props to set visual properties** that CSS variables or Tailwind utility classes can handle — inline styles bypass the cascade, break dark mode fallbacks, and cause hydration mismatches in client components
- For dynamic per-element values (e.g., a color from data), set a **scoped CSS variable** via `style` and reference it with a Tailwind arbitrary value: `style={{ '--x': value }}` + `className="bg-[var(--x)]"`
- In client components that hydrate, **never render inline styles on the server that differ from client initial state** — this causes flash-of-wrong-content even with `suppressHydrationWarning`
- If a client component must defer styles until after hydration, gate them behind a `hydrated` state flag set in `useLayoutEffect`

---

## Tech Stack

- **Monorepo**: Nx + pnpm workspaces
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + CSS variables for theming
- **Content**: MDX with gray-matter frontmatter, filesystem-based
- **Components**: class-variance-authority (CVA) for variant system
- **CMS**: Tina CMS (local mode for POC)

## Project Structure

- `apps/web` — Customer-facing Next.js app
- `libs/content-api` — Content loading from filesystem, MDX parsing
- `libs/cms-components` — MDX-embeddable components with CVA variants
- `libs/theme` — Theming system (CSS variables, dark mode, provider)
- `libs/tenant-config` — Multi-tenant configuration types and loader
- `content/{tenant-id}/` — Tenant content (config.json + pages/\*.mdx)

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.

<!-- nx configuration end-->
