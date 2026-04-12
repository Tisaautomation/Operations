# Boot: Marketing

**TL;DR (30 seconds):** ⚠️ **This domain does NOT live in this repo.** Tour in Koh Samui's marketing — campaigns, SEO plans, social media pipelines, content strategy, ad accounts — lives in a **separate project**. The user has referenced it in past sessions as *"Marketing Re-Generated"*. If the user says *"boot marketing"* inside this repo, point them to the correct location.

## Current State

- ❌ Not in this repo
- ✅ Marketing-adjacent pieces that DO live here (read on)

## What This Repo HAS That Touches Marketing

| Piece | Where | Notes |
|---|---|---|
| OG social share image | `assets/og-image.png` | 1200×630 — used for Facebook/LinkedIn/WhatsApp previews |
| Meta tags / Open Graph | `layout/theme.liquid` + `snippets/meta-tags.liquid`* | *provided by Horizon parent |
| Schema.org Organization | `layout/theme.liquid:179-198` | Structured data for Google |
| Schema.org Product | `snippets/product-schema.liquid` | Per-product structured data |
| Social profile links | `config/settings_data.json:107-111` | Facebook, Instagram, YouTube |

## What To Tell The User

If the user asks for marketing work here:

> *"Marketing no vive en este repo (Operations). Tiene su propio proyecto — creo que lo llamás 'Marketing Re-Generated'. Dale el boot allá, o pasame el contexto que necesitás. Aquí sólo tenemos lo que toca al storefront: la OG image, meta tags, structured data, y links sociales."*

## What CAN Be Done Here (Storefront-Side Marketing)

Even without the full marketing context, these are legit tasks for this repo:

- **Regenerate OG image** for a specific campaign
- **Update meta descriptions** / title tags (via Shopify admin or theme settings)
- **Add schema.org** structured data for a new content type
- **Tune social links** in footer (`config/settings_data.json`)
- **Add UTM-aware tracking** to outbound links (careful — GDPR/cookie law)
- **Create a landing page** as a Shopify page + custom template

## Authoritative Sources

- Ask the user for the canonical marketing repo/project URL.
- `CLAUDE.md §2` — voice & tone (can be reused for marketing copy)
- `CLAUDE.md §5` — logo + brand assets usable in marketing materials

## Last Updated

2026-04-12 · placeholder — update this file (or delete it) if marketing consolidates into this repo
