# Boot: Content (Collections, Metafields, Catalog)

**TL;DR (30 seconds):** 6 collections on the homepage (private tours, joint tours, on-demand, families, full moon party, promotions). Each product is a tour with **14 metafields** (namespaces `custom.*` and `reviews.*`) that drive the product page — duration, pickup info, itinerary, highlights, included/excluded, map coords, ratings.

## Current State (2026-04-12)

- ✅ 6 collections required by the homepage template
- ✅ 14 metafields documented and consumed by product page snippets
- ⚠️ Collections must exist with **EXACT handles** in Shopify admin (or navigation breaks)
- ⚠️ Metafields are optional per-product but recommended for rich display

## Collections (must exist with these exact handles)

| # | Handle | Purpose |
|---|---|---|
| 1 | `promotions` | Special offers |
| 2 | `private-tours` | Private tour experiences |
| 3 | `joint-tours` | Group tours |
| 4 | `on-demand` | On-demand bookings |
| 5 | `recommended-for-families` | Family-friendly |
| 6 | `pages-explore-tours-full-moon-party` | Full Moon Party |

## Metafields Schema

### `custom.*` namespace

| Key | Type | Purpose | Format |
|---|---|---|---|
| `custom.badge` | text | Product badge | e.g. "BESTSELLER" |
| `custom.subtitle` | text | Subtitle under title | free text |
| `custom.duration` | text | Tour duration | e.g. "8 hours" |
| `custom.pickup` | text | Pickup info | e.g. "Hotel pickup included" |
| `custom.language` | text | Languages offered | e.g. "English, Thai" |
| `custom.highlights` | text | Highlight list | pipe-separated `A\|B\|C` |
| `custom.itinerary` | text | Timeline | `time\|title\|desc\|\|time\|title\|desc` |
| `custom.included` | text | What's included | pipe-separated |
| `custom.excluded` | text | What's NOT included | pipe-separated |
| `custom.map_latitude` | number | Tour location lat | decimal |
| `custom.map_longitude` | number | Tour location lng | decimal |
| `custom.map_zoom` | number | Map zoom level | default 13 |

### `reviews.*` namespace

| Key | Type | Purpose |
|---|---|---|
| `reviews.rating` | number | Average 1–5 |
| `reviews.count` | number | Number of reviews |

## Key Files

| Snippet | Reads |
|---|---|
| `snippets/product-info.liquid` | `custom.duration`, `custom.pickup`, `custom.language`, `custom.badge`, `custom.subtitle` |
| `snippets/product-description.liquid` | `custom.highlights` |
| `snippets/product-itinerary.liquid` | `custom.itinerary` |
| `snippets/product-whats-included.liquid` | `custom.included`, `custom.excluded` |
| `snippets/product-map.liquid` | `custom.map_latitude`, `custom.map_longitude`, `custom.map_zoom` |
| `snippets/product-reviews.liquid` | `reviews.rating`, `reviews.count` |

## How It Works

```
Shopify admin
  ├── Collection handle → referenced in templates/index.json
  └── Product metafield values → read by Liquid snippets
        ↓
Liquid render
  {{ product.metafields.custom.duration }}
  {{ product.metafields.custom.highlights | split: '|' }}
  {{ product.metafields.reviews.rating }}
        ↓
HTML output on /products/<handle>
```

## What You Can Do Right Now

- **Add a collection** → create in Shopify admin with an English handle (kebab-case), then add the handle to `templates/index.json` and to `CLAUDE.md §8`.
- **Add a metafield** → Shopify admin → Settings → Custom data → Products → Add definition. Then update the relevant snippet to read it. Document in `CLAUDE.md §9`.
- **Audit metafields on a product** → Shopify admin → product → scroll to "Metafields" section.
- **Bulk edit products** → via Shopify Admin API (needs `shopify-admin` MCP — see `boot ops`).
- **Test a tour has all data** → `/products/<handle>` should show duration, itinerary, inclusions without gaps.

## Gotchas

- Collection handles are **case-sensitive and URL-safe**. Changing a handle breaks the homepage and navigation.
- **Empty metafield ≠ null** in Liquid → always guard with `{% if product.metafields.custom.X != blank %}`.
- `reviews.*` namespace is usually populated by a reviews app (Judge.me, Loox, etc.) — **don't write to it directly** from Admin API; the app may overwrite.
- Pipe-separated format is brittle: if a highlight contains a literal `|` character, the split breaks.
- The itinerary double-pipe `||` is the row separator, single `|` is the column separator. Get the delimiters right.

## Authoritative Sources

- `CLAUDE.md §8` — collections list (authoritative)
- `CLAUDE.md §9` — metafields table (authoritative)
- Shopify docs: [metafields](https://shopify.dev/docs/apps/custom-data/metafields)

## Last Updated

2026-04-12 · commit pending
