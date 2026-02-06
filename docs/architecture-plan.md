# Git-Based Multi-Tenant CMS Architecture Plan

## Problem Statement

Build a Git-based CMS that:
- Serves non-technical content producers via a UI interface
- Supports multiple companies/brands (multi-tenancy)
- Offers configurable theming (custom colors, light/dark mode)
- Handles rich text AND custom components with variants
- Scales without hitting GitHub API limits

---

## Key Technical Challenges

### 1. Content Storage & Git Scalability

**The Problem:**
- GitHub API limits: 5,000 requests/hour (authenticated)
- Content in main repo = merge queue chaos at scale
- Multiple tenants x frequent updates = Git bottleneck

**POC Approach:**
- Content lives in `/content/{tenant-id}/` within the monorepo
- Acceptable for single-tenant or low-frequency updates
- Simple to implement, easy to reason about

**Production Approach (choose one):**

| Approach | Pros | Cons |
|----------|------|------|
| **Separate content repos per tenant** | Clean isolation, independent merge queues | More infra complexity |
| **Content DB with Git-like versioning** | No API limits, fast queries | Lose native Git tooling |
| **Webhook -> DB sync** | Best of both worlds, Git as source of truth | Eventual consistency |
| **Build-time fetch + CDN cache** | Simple, fast reads | Stale content until rebuild |

**Recommendation for Scale:** Webhook-triggered sync to a content database (Postgres with jsonb, or dedicated like Sanity's backing store). Git remains source of truth for auditing/versioning, but reads come from DB.

---

### 2. Non-Technical User Interface

**The Problem:**
- Content producers can't use Git directly
- Need WYSIWYG editing with component support
- Must abstract Git operations (commit, PR, merge)

**Options:**

| Solution | Pros | Cons |
|----------|------|------|
| **Tina CMS** | Git-native, visual editing, Next.js first-class | Learning curve, some lock-in |
| **Decap CMS (ex-Netlify CMS)** | Simple, git-gateway | Limited component support |
| **Custom Editor** | Full control | Significant dev investment |
| **Payload CMS** | Great admin UI, self-hosted | Not Git-native (DB-first) |

**Recommendation:** Start with Tina CMS for POC (Git-native, good Next.js support, visual editing). Evaluate custom solution if Tina becomes limiting.

---

### 3. Rich Text + Custom Components

**The Problem:**
- Need Markdown-like simplicity + custom React components
- Components need variants (primary CTA, secondary CTA, etc.)
- Editor must let non-technical users insert these components

**Solution: MDX + Component Registry**

```
/libs/cms-components/
  +-- registry.ts          # Central component registry
  +-- Button/
  |   +-- Button.tsx       # Component implementation
  |   +-- Button.schema.ts # Props schema for editor
  |   +-- variants.ts      # primary, secondary, etc.
  +-- MediaCard/
  +-- Table/
  +-- ...
```

**Variant System:** Use `class-variance-authority` (CVA) pattern:
```tsx
const buttonVariants = cva("base-styles", {
  variants: {
    intent: { primary: "...", secondary: "..." },
    size: { sm: "...", md: "...", lg: "..." }
  }
});
```

**Editor Integration:** Each component exports a schema that describes its props, enabling the editor to render appropriate UI controls.

---

### 4. Multi-Tenancy & Theming

**The Problem:**
- Each tenant needs isolated content
- Custom brand colors, fonts, assets
- Light/dark mode support
- Route isolation (subdomain vs path-based)

**Architecture:**

```
/content/
  +-- {tenant-id}/
      +-- config.json      # Theme, branding, feature flags
      +-- pages/           # MDX content
      +-- assets/          # Tenant-specific media

/apps/web/
  +-- app/
      +-- [tenant]/        # Dynamic tenant routing
          +-- [...slug]/   # Catch-all for pages
```

**Theming Approach:**
- CSS variables at root level, overridden per tenant
- Tailwind CSS with `dark:` variants
- Tenant config loaded at request time (SSR) or build time (SSG)

```json
// content/acme-corp/config.json
{
  "theme": {
    "colors": {
      "primary": "#4F46E5",
      "secondary": "#10B981"
    },
    "darkMode": {
      "primary": "#818CF8",
      "secondary": "#34D399"
    }
  }
}
```

---

### 5. Caching & Performance Strategy

**The Problem:**
- Can't hit GitHub on every page load
- Need fast reads without stale content

**Layered Caching Strategy:**

```
[Browser] -> [CDN/Edge] -> [App Server] -> [Cache Layer] -> [Git/DB]
               ^                              ^
          Static assets              Redis/In-memory
          ISR pages                  Parsed content
```

**Implementation:**
1. **Build time (SSG):** Pre-render known pages
2. **ISR (Incremental Static Regeneration):** Revalidate on interval or on-demand
3. **Webhook invalidation:** GitHub webhook -> purge specific cache keys
4. **Edge caching:** Vercel/Cloudflare edge for static content

---

## Proposed NX Monorepo Structure

```
/
+-- apps/
|   +-- web/                    # Customer-facing Next.js app
|   |   +-- app/
|   |   |   +-- [tenant]/[...slug]/
|   |   +-- next.config.js
|   |
|   +-- cms-admin/              # Content editor UI (Tina or custom)
|       +-- ...
|
+-- libs/
|   +-- ui/                     # Shared UI components (non-CMS)
|   +-- cms-components/         # MDX-embeddable components
|   |   +-- Button/
|   |   +-- MediaCard/
|   |   +-- Table/
|   |   +-- registry.ts
|   |
|   +-- content-api/            # Content fetching & caching logic
|   |   +-- github.ts           # GitHub API client
|   |   +-- cache.ts            # Caching layer
|   |   +-- mdx.ts              # MDX parsing
|   |
|   +-- theme/                  # Theming system
|   |   +-- provider.tsx
|   |   +-- tokens.ts
|   |   +-- utils.ts
|   |
|   +-- tenant-config/          # Multi-tenant configuration
|       +-- loader.ts
|       +-- types.ts
|
+-- content/                    # POC: Content lives here
|   +-- {tenant-id}/
|       +-- config.json
|       +-- pages/
|           +-- *.mdx
|
+-- nx.json
+-- package.json
+-- tsconfig.base.json
```

---

## POC Implementation Plan

### Phase 1: Foundation
1. Initialize NX workspace with Next.js app
2. Set up Tailwind CSS with CSS variable theming
3. Create basic tenant routing (`/[tenant]/[...slug]`)
4. Implement content loading from local `/content` directory

### Phase 2: Component System
1. Create `cms-components` library
2. Build core components: Button, MediaCard, Table, Callout
3. Implement variant system with CVA
4. Set up MDX processing with component injection

### Phase 3: Theming
1. Build theme provider with light/dark mode
2. Create tenant config loader
3. Implement CSS variable injection from tenant config
4. Add theme toggle component

### Phase 4: Content Editor
1. Integrate Tina CMS (or build basic custom editor)
2. Configure content schemas
3. Set up local Git integration
4. Add component insertion in editor

### Phase 5: Multi-tenant Demo
1. Create 2-3 sample tenants with different themes
2. Demonstrate content isolation
3. Show component reuse across tenants

---

## Production Considerations (Future)

### Content Storage Migration
- [ ] Move to separate content repos per tenant
- [ ] Implement webhook -> DB sync pipeline
- [ ] Add content versioning/history in DB

### Scaling
- [ ] Edge caching with stale-while-revalidate
- [ ] ISR with on-demand revalidation
- [ ] Consider read replicas for content DB

### Editor Enhancements
- [ ] Real-time collaboration
- [ ] Draft/publish workflow with approval
- [ ] Content scheduling
- [ ] Asset management (images, videos)

### Security & Isolation
- [ ] Tenant data encryption
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Rate limiting per tenant

---

## Open Questions

1. **Editor Choice:** Tina CMS vs custom? Tina is faster to POC but less flexible.
2. **Deployment Target:** Vercel (great for Next.js ISR) vs self-hosted?
3. **Content Approval Workflow:** Is draft -> review -> publish needed for POC?
4. **Asset Storage:** Where do images/media live? Same repo? S3/Cloudinary?
5. **Authentication:** How do content producers authenticate to the editor?

---

## Verification Plan

### POC Success Criteria
- [ ] Render MDX content with custom components
- [ ] Two tenants with distinct themes (colors, light/dark)
- [ ] Basic editor allows non-technical content creation
- [ ] Content changes reflect without code deploy (ISR or similar)
- [ ] Component variants work correctly (Button: primary/secondary)

### Testing Approach
1. Create sample content for two fictional brands
2. Verify theme switching between tenants
3. Edit content via editor UI, verify Git commit created
4. Confirm component rendering in MDX
5. Test light/dark mode toggle per tenant
