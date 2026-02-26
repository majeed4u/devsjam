# Blog review & features

## What was done

### Filters (category, tag, series)
- **Blog index** (`/blog`): "Filter by" section with links for all categories, tags, and series that have at least one published post. No extra API calls — derived from current posts.
- **Category page** (`/blog/category/$category`): Lists published posts in that category. Layout aligned to blog style (max-w-3xl, simple back link).
- **Tag page** (`/blog/tag/$tag`): Lists published posts with that tag. Same layout as category.
- **Series page** (`/blog/series/$series`): **New.** Lists published posts in the series, ordered by `seriesOrder`. Same layout.

### API & data
- **`getPosts`** now includes `series` (id, title, slug) so the frontend can show series on cards and series pages.
- **Public pages** only show **published** posts (home, blog index, category, tag, series, single post). Drafts stay visible in admin.

### Design alignment (DevOps personal blog)
- **Category / tag / series pages**: max-w-3xl, "← Blog" text link, no hero, no heavy animations. Single-column list of post cards.
- **Single post** (`/blog/$slug`): max-w-3xl, "← Blog" link, series line (e.g. "Series: Building DevJams · Part 1 of 3"), series prev/next nav at bottom, related posts as a simple list. Author bio copy set to DevOps.
- **About**: Copy updated to DevOps/infrastructure/CI-CD/reliability.
- **Post cards**: Show series badge when present; link to series page.
- **Related posts**: Simpler "Related posts" list (text links only).

---

## Monorepo layout (relevant parts)

```
apps/
  web/          # Vite + React + TanStack Router (blog UI)
  server/       # Elysia API + better-auth
packages/
  api/          # oRPC routers (post, category, tag, series)
  db/           # Prisma schema + migrations
  auth/         # better-auth config
  env/          # shared env
  config/       # shared TS config
```

- **Blog routes**: `apps/web/src/routes/` (index, about, blog/, blog/$slug, blog/category/$category, blog/tag/$tag, blog/series/$series).
- **API**: `packages/api/src/routers/` — post (getPosts with category + series + tags), category.gets, tag.gets, series.gets.

---

## What’s still missing or optional

1. **RSS feed** – No `/feed.xml` or similar. Add a server route that returns RSS for published posts if you want it.
2. **Newsletter** – `SubscribeNewsletter` is UI only (TODO in code: integrate Resend/Mailchimp). Hook it up or remove/hide for now.
3. **Author bio links** – Mail, GitHub, Twitter, LinkedIn are placeholders (`#`, `your@email.com`). Replace with real URLs or make them configurable (e.g. env or CMS).
4. **Search** – No full-text or client-side search. Could add a small search bar on `/blog` that filters by title/excerpt.
5. **Comments** – Schema has `Comment` and relation on `Post`; no public UI for comments yet. Add a comments section or disable.
6. **Analytics** – Admin has an analytics route; ensure view counts or events are wired if you use it.
7. **SEO** – Consider meta tags (OG, Twitter) and optional sitemap for posts.

---

## Summary

- **Filters**: Category, tag, and series are implemented and visible on the blog index; series has its own page and prev/next on posts.
- **Design**: Public blog pages use a consistent, content-first layout (max-w-3xl, DevOps-focused copy).
- **Gaps**: RSS, newsletter backend, author links, search, and comments are the main optional next steps.
