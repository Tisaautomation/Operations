# Boot: Brand

**TL;DR (30 seconds):** Tour in Koh Samui. **Turquoise `#00CED1` → Purple `#9370DB`** gradient. **Poppins Bold** for headings, **Inter** for body. **"TIK"** wordmark with compass rose. Voice: premium-but-warm, trust-first, experiential. All brand tokens wired into `settings_data.json` and `theme.liquid` as CSS variables.

## Current State (2026-04-12)

- ✅ Full asset set committed in `assets/` (13 files — SVG + PNG + favicons + OG image)
- ✅ CSS variables defined in `layout/theme.liquid:47-70`
- ✅ 3 color schemes wired in `config/settings_data.json` (Turquoise, Purple, Grey)
- ✅ Logos vectorized to SVG (infinite scalability)
- ⚠️ Logos ALSO on Shopify CDN (`settings.logo`) — that's the primary source; local files are **fallbacks**

## Key Files

```
assets/
  ├── logo.svg              ← ⭐ PRIMARY (vector, gradient)
  ├── logo-white.svg        ← for dark backgrounds (Purple scheme)
  ├── logo-mono.svg         ← monochrome / print
  ├── logo.png              ← raster master (933×613, from Shopify CDN)
  ├── logo@2x.png           ← retina (1866×1226, re-rendered from SVG)
  ├── logo-white.png        ← crisp white raster (re-rendered from SVG)
  ├── favicon.ico           ← multi-res 16/32/48 for legacy browsers
  ├── favicon-16/32/48.png  ← modern browser tabs
  ├── apple-touch-icon.png  ← iOS home screen (180×180)
  ├── icon-192/512.png      ← Android PWA / manifest
  └── og-image.png          ← 1200×630 social share (gradient + white logo)

config/settings_data.json   ← color schemes defined here
layout/theme.liquid:47-70   ← CSS vars (--color-primary etc.)
```

## How It Works — Brand Tokens as CSS Variables

```css
--color-primary: #00CED1;          /* Turquoise */
--color-primary-hover: #009FA3;
--color-secondary: #9370DB;        /* Purple */
--color-text: #2F2F2F;             /* Dark grey */
--color-background: #FFFFFF;
--color-border: #E8E8E8;

--font-heading: 'Poppins', sans-serif;     /* Poppins Bold */
--font-body: 'Inter', sans-serif;          /* Inter Regular */
--font-subheading: 'Inter', sans-serif;    /* Inter Medium */

--radius-button: 20px;
--radius-card: 16px;
--radius-input: 12px;
--radius-badge: 12px;

--spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px;
--spacing-lg: 24px; --spacing-xl: 40px;
```

### Signature gradient (for heroes, CTA buttons, accents)

```css
background: linear-gradient(90deg, #00CED1, #9370DB);
```

## What You Can Do Right Now

- **Use a brand color** → `color: var(--color-primary);` — **NEVER hardcode hex**
- **Add a section with brand aesthetic** → use color scheme `turquoise`, `purple`, or `grey` in the section schema
- **Insert logo with admin fallback:**
   ```liquid
   {% if settings.logo %}
     <img src="{{ settings.logo | image_url: width: 400 }}" alt="{{ shop.name }}">
   {% else %}
     <img src="{{ 'logo.svg' | asset_url }}" alt="{{ shop.name }}" width="200">
   {% endif %}
   ```
- **For dark backgrounds (Purple scheme):** use `{{ 'logo-white.svg' | asset_url }}`
- **Change a color globally** → edit `config/settings_data.json` + CSS var in `theme.liquid` (ASK user first — never autopilot a brand change)

## Gotchas

- `logo.svg` is a **silhouette vectorized from PNG** with gradient injected via `<defs>`. Good but not as clean as a native vector from Illustrator. If the user ever shares the original vector source, replace.
- `logo-white.png` went through **2 versions** — the committed one is rendered from `logo-white.svg`, NOT the luminance-weighted first try.
- Shopify CDN **caps images at original upload size** — 933×613 for the logo, 512×512 for the favicon. The SVGs exceed that cap because they're vector.
- Brand colors are **also** used in: `<meta name="theme-color" content="#00CED1">`, checkout accent, page-loading bar, button gradient. If you change primary color, check all these.

## Authoritative Sources

- `CLAUDE.md §2` — voice & tone
- `CLAUDE.md §3` — color palette + gradient
- `CLAUDE.md §4` — typography
- `CLAUDE.md §5` — complete logo inventory + CDN URLs
- `CLAUDE.md §6` — shape, motion, spacing

## Last Updated

2026-04-12 · commit pending
