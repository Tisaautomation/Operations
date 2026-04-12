# CLAUDE.md — TourInKohSamui.com Operations

> **READ ME FIRST.** This is the canonical handoff for any Claude session working on this repo.
> If you are Claude: do not guess brand, colors, fonts, or conventions — they are all defined here.
> If anything you are about to do contradicts this file, stop and ask the user first.

---

## 1. Project at a Glance

| Field | Value |
|---|---|
| **Brand** | Tour in Koh Samui |
| **Domain** | [tourinkohsamui.com](https://tourinkohsamui.com) |
| **Platform** | Shopify (Horizon theme, forked & optimized) |
| **Theme version** | 2.0.0 |
| **Business** | Koh Samui's Premier Tour Marketplace — Verified Local Operators, Premium Experiences, Unforgettable Adventures |
| **Primary language** | English (site copy). User/owner communicates in Spanish. |
| **Location** | Koh Samui, Thailand |
| **Repo root** | `/home/user/Operations` |
| **Default branch** | `main` |
| **Active dev branch** | `claude/mythos-claude-exploration-URYSR` (current Claude session) |

---

## 2. Brand Identity

### Voice & Tone
- **Premium but warm** — "Koh Samui's Premier Tour Marketplace"
- **Trust-first** — emphasize "verified local operators"
- **Experiential** — sell the memory, not the ticket
- **Mobile-first** — most bookings happen from phones

### Positioning keywords
`premium · verified · local · unforgettable · curated · adventure · island · tropical`

---

## 3. Brand Colors — Design Tokens

All colors are already wired into `config/settings_data.json` and `layout/theme.liquid` as CSS variables. **Never hardcode these in new files — use the CSS variables.**

### Primary palette

| Token | Hex | Usage | CSS var |
|---|---|---|---|
| **Turquoise (Primary)** | `#00CED1` | Main brand color, headings, primary buttons, links, theme-color meta | `--color-primary` |
| **Turquoise hover** | `#009FA3` | Primary button hover, link hover | `--color-primary-hover` |
| **Purple (Secondary)** | `#9370DB` | Accent, gradients, secondary scheme primary | `--color-secondary` |
| **Purple hover** | `#7A5FD6` | Purple scheme hover states | — |
| **Dark grey (Text)** | `#2F2F2F` | Body text, dark backgrounds | `--color-text` |
| **White** | `#FFFFFF` | Backgrounds, button text | `--color-background` |
| **Light grey (Alt bg)** | `#F8F8F8` | Alternate section backgrounds, checkout sidebar | — |
| **Border grey** | `#E8E8E8` | Dividers, card borders, input borders | `--color-border` |
| **Medium grey** | `#666666` | Grey scheme primary, muted text | — |
| **Dark border** | `#444444` | Borders on dark/purple scheme | — |

### Signature gradient
```css
background: linear-gradient(90deg, #00CED1, #9370DB);
```
Used on: primary buttons, page-loading bar, any "hero" accent.

### Color schemes (defined in `config/settings_data.json`)
1. **Turquoise** — default, light bg, turquoise heading + primary
2. **Purple** — dark `#2F2F2F` bg, white text, purple primary (dramatic sections)
3. **Grey** — `#F8F8F8` bg, neutral `#666666` primary (alternate/quiet sections)

---

## 4. Typography

All type is already selected in `config/settings_data.json`. **Do not swap fonts without explicit user approval** — they match the logo wordmark.

| Role | Font | Shopify token | Weight |
|---|---|---|---|
| **Headings** | Poppins Bold | `poppins_n7` | 700 |
| **Subheadings** | Inter Medium | `inter_n5` | 500 |
| **Body** | Inter Regular | `inter_n4` | 400 |
| **Accent** | Poppins Bold | `poppins_n7` | 700 |

### Type scale (px)
| Element | Size |
|---|---|
| H1 | 62 |
| H2 | 48 |
| H3 | 36 |
| H4 | 28 |
| H5 | 18 |
| H6 | 16 |
| Subheading | 18 |
| Body | 16 (line-height 1.6) |

CSS variables exposed: `--font-heading`, `--font-body`, `--font-subheading`.

---

## 5. Logo & Visual Assets

> ⚠️ **Logos are NOT stored in this repo.** They live in Shopify's Files CDN and are referenced via `settings.logo` and `settings.favicon` in Liquid.

### Where to find / set the logo
- **Theme Settings → Header → Logo** (uploaded via Shopify admin)
- Referenced in Liquid as: `{{ settings.logo | img_url: '200x' }}`
- Structured data (Organization schema) pulls from `settings.logo` — see `layout/theme.liquid:185-186`

### Logo sizing (already configured)
| Viewport | Height |
|---|---|
| Desktop | 42px |
| Mobile | 32px |

### If you need the logo locally
Ask the user to drop it in `assets/` (e.g. `logo.svg`, `logo-white.svg`, `favicon.png`). Then reference as `{{ 'logo.svg' | asset_url }}`.

### Social profiles (canonical)
- Facebook: `https://facebook.com/tourinkohsamui`
- Instagram: `https://instagram.com/tourinkohsamui`
- YouTube: `https://youtube.com/@tourinkohsamui`
- Twitter/Pinterest/TikTok: **not set**

---

## 6. Design System — Shape & Motion

### Corner radius (px)
| Element | Radius |
|---|---|
| Primary buttons | 20 |
| Secondary buttons | 20 |
| Product cards | 16 |
| General cards | 16 |
| Input fields | 12 |
| Badges | 12 |
| Popovers | 16 |
| Variant swatches | 12 |

### Spacing scale (CSS vars)
```
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 40px
```

### Effects
- **Card hover:** lift (`translateY(-4px)`)
- **Badge position:** top-right
- **Variant swatch:** 40×40px
- **Page width:** `wide`
- **Sticky header:** enabled
- **Cart type:** drawer

---

## 7. Repository Structure

```
Operations/
├── CLAUDE.md                ← you are here (handoff for any Claude session)
├── README.md                ← human-facing docs (installation, features, changelog)
├── assets/
│   ├── theme.css            ← global styles
│   ├── theme.js             ← global JS
│   ├── product-page.css     ← product page styles
│   ├── product-page.js      ← product page interactivity
│   ├── location-picker.css  ← Google Maps modal
│   └── location-picker.js   ← location picker logic
├── config/
│   ├── settings_data.json   ← ALL theme settings (colors, fonts, defaults) — source of truth
│   └── settings_schema.json ← Shopify admin customization schema
├── layout/
│   └── theme.liquid         ← main layout, critical CSS inline, preconnects
├── sections/
│   ├── main-product.liquid  ← <300 lines (was 1,618 before refactor)
│   ├── hero-banner.liquid
│   ├── product-carousel.liquid
│   └── feature-slides.liquid
├── snippets/                ← modular product page pieces
│   ├── product-gallery.liquid
│   ├── product-info.liquid
│   ├── product-booking-form.liquid   ← WhatsApp + location picker
│   ├── product-description.liquid
│   ├── product-itinerary.liquid
│   ├── product-whats-included.liquid
│   ├── product-map.liquid            ← Mapbox tour location
│   ├── product-reviews.liquid
│   ├── product-schema.liquid         ← SEO structured data
│   └── location-picker.liquid        ← Google Maps modal
└── templates/
    ├── index.json           ← homepage
    ├── product.json         ← product page
    └── collection.json      ← collection page
```

### Legacy files (DO NOT MODIFY)
- `theme_export__tourinkohsamui-com-my-store-horizon__OLD THEME.zip`
- `theme_export__tourinkohsamui-com-my-store-horizon__OLD THEME (1).zip`

These are backups of the pre-refactor theme. Treat as read-only reference material only.

---

## 8. Collections (must exist in Shopify admin)

The homepage and navigation assume these handles exist:

1. `promotions` — special offers
2. `private-tours` — private experiences
3. `joint-tours` — group tours
4. `on-demand` — bookable on demand
5. `recommended-for-families` — family-friendly
6. `pages-explore-tours-full-moon-party` — Full Moon Party

---

## 9. Product Metafields (namespace: `custom.*` and `reviews.*`)

| Key | Type | Purpose |
|---|---|---|
| `custom.badge` | text | Badge label (e.g. "BESTSELLER") |
| `custom.subtitle` | text | Subtitle under product name |
| `custom.duration` | text | e.g. "8 hours" |
| `custom.pickup` | text | e.g. "Hotel pickup included" |
| `custom.language` | text | e.g. "English, Thai" |
| `custom.highlights` | text | Pipe-separated (`A\|B\|C`) |
| `custom.itinerary` | text | Format: `time\|title\|description\|\|time\|title\|description` |
| `custom.included` | text | Pipe-separated |
| `custom.excluded` | text | Pipe-separated |
| `custom.map_latitude` | number | Tour location lat |
| `custom.map_longitude` | number | Tour location lng |
| `custom.map_zoom` | number | Default 13 |
| `reviews.rating` | number | 1–5 average |
| `reviews.count` | number | Review count |

---

## 10. External APIs & Integrations

| Service | Purpose | Where to set |
|---|---|---|
| **Google Maps JavaScript API + Places API** | Pickup location picker on booking form | Theme Settings → Maps & APIs → Google Maps API Key |
| **Mapbox GL JS (Default Public Token)** | Tour location map on product pages | Theme Settings → Maps & APIs → Mapbox Access Token |

Both keys are read in JS via `window.themeSettings.googleMapsApiKey` / `.mapboxToken` (set in `layout/theme.liquid`).

### Keys to NEVER hardcode
Both keys are empty by default in `settings_data.json` and must be configured in the live store. Never commit keys to the repo.

### Booking form custom fields (cart line item properties)
- `properties[WhatsApp]` — phone for driver coordination
- `properties[Pickup Location]` — formatted address
- `properties[Pickup Latitude]` — coord
- `properties[Pickup Longitude]` — coord

---

## 11. Performance Targets (non-negotiable)

| Metric | Target |
|---|---|
| Lighthouse mobile | **95+** |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.5s |
| Total Blocking Time | < 200ms |
| Total page load (mobile) | < 2s |

### Performance rules for any new code
1. **Never** inline more than critical-above-fold CSS in sections. Put styles in `assets/*.css`.
2. All `<script>` tags must use `defer` unless there is a hard reason not to.
3. Images: first 3 eager, all subsequent `loading="lazy"` + `srcset` for responsive.
4. Maps load on demand (scroll-into-view or click).
5. Use `<link rel="preconnect">` for any new third-party origin.

---

## 12. Coding Conventions

### Liquid
- Snippets under 500 lines each. If a snippet grows past ~300 lines, consider splitting.
- Use `{%- -%}` (whitespace-trimming) for control flow; `{{- -}}` for output where whitespace matters.
- Scope IDs with `{{ product.id }}` or `{{ section.id }}` to avoid collisions when sections repeat.
- Prefer `{% render 'snippet' %}` over `{% include %}`.

### CSS
- Use CSS variables from `:root` (defined in `layout/theme.liquid`). Never hardcode brand colors.
- Mobile-first media queries (`min-width`, not `max-width`).
- Buttons must be ≥ 44px touch target on mobile.

### JS
- Vanilla JS. No framework. No build step.
- Defer-load everything except tiny inline boot scripts.
- Reads global config from `window.themeSettings`.

### Commits
- Present tense, imperative: "Add WhatsApp field", not "Added".
- Reference the file or feature area in the subject when useful.

### Branching
- Development happens on `claude/…` branches (current: `claude/mythos-claude-exploration-URYSR`).
- Never push to `main` directly without explicit user approval.

---

## 13. Shopify CLI Commands

```bash
shopify theme dev      # local preview with hot reload
shopify theme push     # deploy to live store
shopify theme pull     # sync settings from store
shopify theme check    # lint Liquid + theme quality
```

---

## 14. GitHub

- **Repository:** `tisaautomation/operations`
- Claude MCP tools are scoped to this repo only.
- Do NOT open PRs unless the user explicitly asks.

---

## 15. Where to Find Things — Quick Index

| Looking for… | Check here |
|---|---|
| Brand colors (hex) | This file §3, or `config/settings_data.json` |
| Font names | This file §4, or `config/settings_data.json` |
| Logo | Shopify admin → Theme Settings → Header. NOT in repo. |
| Favicon | Shopify admin → Theme Settings → `settings.favicon` |
| Corner radius / spacing | This file §6, or `layout/theme.liquid:47-70` |
| Signature gradient | This file §3, or `layout/theme.liquid:124` |
| Collection handles | This file §8 |
| Product metafields | This file §9 |
| API keys to configure | This file §10 |
| Performance budget | This file §11 |
| Social links | `config/settings_data.json:107-111` |
| Footer description | `config/settings_data.json:15` |
| Organization schema | `layout/theme.liquid:179-198` |
| Old theme (reference only) | `theme_export__*_OLD THEME*.zip` |

---

## 16. Session Startup Checklist (for Claude)

When you start a new session, before taking any design/code action:

1. ✅ Read this file (you're already doing it).
2. ✅ Check `git status` and `git branch --show-current`.
3. ✅ If the user asks about branding/colors/fonts → answer from §3, §4, §6. Do not invent.
4. ✅ If the user asks about logos → direct them to Shopify admin (§5). Do not hallucinate asset paths.
5. ✅ If you're about to change a token (color, font, radius) → confirm with the user first.
6. ✅ For every visual change, prefer editing CSS variables in `layout/theme.liquid:47-70` over hardcoding.
7. ✅ Never push to `main`. Develop on the `claude/…` branch.

---

## 17. Open Items / TODOs for Future Sessions

- [ ] Add logo files to `assets/` (`logo.svg`, `logo-white.svg`, `favicon.png`) so Claude can reference them locally.
- [ ] Create a `design/references/` folder with competitor mood board and hero inspiration.
- [ ] Add `design/tokens.json` as a machine-readable export of §3, §4, §6.
- [ ] Run Lighthouse post-deployment and fill in the "Current" column of the performance table.
- [ ] Configure production Google Maps + Mapbox keys in live store.

---

*Last updated by Claude session on branch `claude/mythos-claude-exploration-URYSR`.*
*If you update this file, bump the date and describe what changed at the bottom.*
