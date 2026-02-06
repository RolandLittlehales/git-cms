# Phase 4: Tina CMS Integration Plan

## Context

Phases 1-3 (foundation, components, theming) are complete. The app has two tenants (brand-a, brand-b) with MDX content, a component registry (Button, Callout, MediaCard, Table with CVA variants), and a theming system. Phase 4 integrates Tina CMS in **local mode** so non-technical users can visually edit content, insert components, and manage publishing status — all without touching Git directly.

---

## Approach: Filesystem-Only Local Mode

Tina runs alongside Next.js in dev. It builds an admin UI to `apps/web/public/admin/`, starts a local GraphQL server on `:4001`, and reads/writes MDX files directly. No cloud backend, no auth, no `useTina` hooks needed. Content editors use `/admin`, and changes are reflected via Next.js hot reload.

---

## Steps

### Step 1 — Install Tina packages

```bash
pnpm add tinacms @tinacms/cli
```

### Step 2 — Create `tina/config.ts` at workspace root

This is the core of the integration. One collection per tenant, shared field definitions via a helper function (avoids DRY violation).

**File:** `tina/config.ts`

Key decisions:
- `build.publicFolder: 'apps/web/public'` (NX monorepo — relative to workspace root)
- `format: 'mdx'` on each collection
- `isBody: true` on the rich-text body field
- Status field: `type: 'string'` with `options: ['draft', 'published', 'scheduled']`
- Rich-text `templates` array registers all 4 CMS components with their variant options as dropdowns
- Helper function `createTenantPageCollection(tenantId, label)` generates collection config to avoid duplication

**Component template mappings:**

| Component | Template Fields |
|-----------|----------------|
| Button | `intent` (primary/secondary/outline), `size` (sm/md/lg), `children` (string) |
| Callout | `intent` (info/success/warning/error), `children` (rich-text) |
| MediaCard | `title` (string), `description` (string), `image` (image) |
| Table | `children` (rich-text) |

Template `name` must match the React component name exactly (e.g., `"Button"`, `"Callout"`) since `next-mdx-remote` resolves them via the existing `componentRegistry`.

### Step 3 — Update `next.config.js` for admin rewrite

**File:** `apps/web/next.config.js`

Add a rewrite so `/admin` serves Tina's built admin UI:

```js
async rewrites() {
  return [{ source: '/admin', destination: '/admin/index.html' }];
}
```

### Step 4 — Update root `package.json` scripts

**File:** `package.json`

Single `pnpm dev` command starts **both** Tina and Next.js together:

```json
"scripts": {
  "dev": "tinacms dev -c \"pnpm nx dev web\"",
  "build": "tinacms build && pnpm nx build web"
}
```

How this works:
- `tinacms dev` starts the local GraphQL server on `:4001` + compiles the admin UI
- `-c "pnpm nx dev web"` runs Next.js dev server on `:3000` as a child process
- Both run concurrently in one terminal — `pnpm dev` is all you need
- Ctrl+C stops both

### Step 5 — Add `.gitignore` entries

**File:** `.gitignore`

```
tina/__generated__
apps/web/public/admin
```

### Step 6 — Add `ui.router` to collections for preview links

In the Tina config, add a `ui.router` function so the admin can link to the live page:

```ts
ui: {
  router: ({ document }) => `/${tenantId}/${document._sys.filename}`,
}
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `tina/config.ts` | **CREATE** — Tina schema, collections, templates |
| `apps/web/next.config.js` | **MODIFY** — Add `/admin` rewrite |
| `package.json` | **MODIFY** — Add `dev` and `build` scripts |
| `.gitignore` | **MODIFY** — Add Tina generated files |

## Files NOT Modified

- `libs/content-api/` — Unchanged. Tina writes files, existing filesystem API reads them.
- `libs/cms-components/` — Unchanged. Template names match component registry names.
- `apps/web/app/[tenant]/` — Unchanged. Pages render from filesystem as before.
- `apps/web/app/components/mdx-renderer.tsx` — Unchanged. `next-mdx-remote` resolves components via registry.

---

## Verification

1. `pnpm dev` (new script) — Both Tina GraphQL server and Next.js start
2. Visit `http://localhost:3000/admin` — Tina admin UI loads
3. See "Brand A Pages" and "Brand B Pages" collections
4. Open `brand-a/index` — All frontmatter fields visible (title, status, dates, author, description)
5. Rich-text editor shows body content
6. Click "+" in editor — Button, Callout, MediaCard, Table templates available
7. Insert a Button — Intent and Size dropdowns work
8. Save — File updated in `content/brand-a/pages/index.mdx`
9. Visit `http://localhost:3000/brand-a` — Changes reflected via hot reload
10. Change status to "draft" — Page hidden from public view
