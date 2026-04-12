# Boot: Theme (Shopify Horizon)

**TL;DR (30 seconds):** Shopify Horizon-based theme. Heavily optimized: `main-product.liquid` went from 1,618 lines to <300, all inline CSS/JS extracted, lazy loading everywhere. **Lighthouse mobile 97%** in production. Uses Horizon's parent-theme inheritance for `header`/`footer`/`cart` — files that look "missing" to static linters are provided by Horizon at runtime.

## Current State (2026-04-12)

- ✅ Deployed to [tourinkohsamui.com](https://tourinkohsamui.com), Lighthouse **97%** mobile
- ✅ Modular snippets (product page = 9 snippets, each < 500 lines)
- ✅ Critical CSS inlined in `theme.liquid`, rest deferred via `media="print"` → `onload` swap
- ✅ All scripts `defer`-loaded
- ⚠️ 7 files have Theme Check deviations (see `CLAUDE.md §17`) — **intentional**, do NOT autofix

## Key Files

```
layout/theme.liquid          ← main layout, critical CSS, preconnects, meta
sections/
  ├── main-product.liquid    ← refactored from 1,618 → <300 lines
  ├── hero-banner.liquid
  ├── product-carousel.liquid
  └── feature-slides.liquid
snippets/                    ← product page broken into 9 pieces
  ├── product-gallery.liquid
  ├── product-info.liquid
  ├── product-booking-form.liquid   ← see `boot booking`
  ├── product-description.liquid
  ├── product-itinerary.liquid
  ├── product-whats-included.liquid
  ├── product-map.liquid
  ├── product-reviews.liquid
  └── product-schema.liquid
templates/
  ├── index.json             ← homepage
  ├── product.json           ← product page
  └── collection.json        ← collection page
config/
  ├── settings_data.json     ← SOURCE OF TRUTH for colors/fonts/defaults
  └── settings_schema.json   ← admin customization options
assets/
  ├── theme.css / theme.js         ← global
  ├── product-page.css / .js       ← product page
  └── location-picker.css / .js    ← booking modal
```

## How It Works

- **Horizon base theme** provides: `header`, `footer`, `cart-drawer`, `meta-tags`, `social-meta-tags` (NOT in this repo — inherited at runtime)
- **Our fork** provides: custom sections + product page refactor + booking form + maps + brand tokens
- **JSON templates** compose sections → sections render snippets → snippets render HTML
- **CSS variables** (defined in `layout/theme.liquid:47-70`) expose brand tokens everywhere — see `boot brand`

## What You Can Do Right Now

- **Add a new section** → create `sections/X.liquid` with `{% schema %}` block → `mcp__shopify-dev__validate_theme`
- **Edit product page** → go to the relevant `snippets/product-*.liquid`
- **Change global styles** → `assets/theme.css` or edit CSS vars in `layout/theme.liquid:47-70`
- **Preview locally** → `shopify theme dev` (requires Shopify CLI + auth — see `boot ops`)
- **Audit the whole theme** → `mcp__shopify-dev__validate_theme` (requires `learn_shopify_api` call first to get conversationId)

## Gotchas

- **Horizon's parent layer is NOT in this repo.** Don't create `header.liquid` or `footer.liquid` because Theme Check says they're missing — you'd be duplicating and masking the parent.
- **Max 50 iterations** in `for` loops without `{% paginate %}` (validate will catch it).
- `{% include %}` is deprecated — **always** `{% render %}`.
- `img_url` filter is deprecated → use `image_url` (safe to globally replace, Shopify guarantees backward-compat).
- **ALWAYS** validate with `validate_theme` before committing, then browser-test before deploying (`CLAUDE.md §12c`).

## Authoritative Sources

- `CLAUDE.md §7` — repository structure
- `CLAUDE.md §11` — performance targets
- `CLAUDE.md §12` — coding conventions
- `CLAUDE.md §12c` — browser-testing rule (MANDATORY)
- `CLAUDE.md §17` — Theme Check findings and what to NOT fix

## Last Updated

2026-04-12 · commit pending
