# Boot: Booking System

**TL;DR (30 seconds):** Tours are sold as Shopify products. The booking form extends the standard cart flow with two custom fields: **(1) WhatsApp number** for driver coordination, **(2) Google Maps pickup location picker** that saves lat/lng + formatted address. Everything flows through Shopify cart → checkout → order via line item properties.

## Current State (2026-04-12)

- ✅ WhatsApp field on booking form, required, validated as phone
- ✅ Google Maps pickup location modal (search, click, drag marker)
- ✅ "Own arrival" toggle (added by parallel Claude session, see commit `cc71eda`)
- ✅ Lat/lng/address saved as cart line item properties
- ⚠️ Google Maps API key MUST be configured in Theme Settings (not committed — see `boot ops`)
- ⚠️ Mapbox token (for tour location display, separate from picker) MUST be configured too

## Key Files

| Path | Purpose |
|---|---|
| `snippets/product-booking-form.liquid` | Form UI + custom fields (WhatsApp, pickup) |
| `snippets/location-picker.liquid` | Modal HTML for Google Maps |
| `assets/location-picker.js` | Modal logic, geocoding, marker drag, "own arrival" toggle |
| `assets/location-picker.css` | Modal styles |
| `snippets/product-map.liquid` | Tour-location display (Mapbox, separate from picker) |

## How It Works

```
[Product page]
    ↓ user fills WhatsApp + other fields
    ↓ user clicks "Choose on Map" → location-picker modal opens
    ↓ user types a hotel/address OR drops a pin
    ↓ modal returns: formatted address + lat + lng
    ↓
[Add to Cart]
    → properties[WhatsApp]           phone
    → properties[Pickup Location]    formatted address
    → properties[Pickup Latitude]    coord
    → properties[Pickup Longitude]   coord
    ↓
[Shopify Checkout]  (native)
    ↓
[Shopify Order]
    → admin sees all 4 properties under "Custom Information"
```

## What You Can Do Right Now

- **Modify form fields** → edit `snippets/product-booking-form.liquid`, then `mcp__shopify-dev__validate_theme`
- **Change pickup picker UX** → `assets/location-picker.js` + `.css`
- **Add a new cart property** → add `<input name="properties[X]">` + document in `CLAUDE.md §10`
- **Debug "property not appearing in order"** → check `name="properties[...]"` attribute on the form
- **Test the flow** → Add to cart → go to `/cart` → verify properties appear with the line item

## Gotchas

- `/cart/add` is **hardcoded** in the form. Theme Check flags this — but it works. Don't touch without browser-testing (see `CLAUDE.md §12c`).
- The "own arrival" toggle was added by another Claude session — its state lives in `assets/location-picker.js`, not as a cart property. Verify the toggle logic before modifying.
- Google Maps loads **on demand** (scroll-into-view or click), not on page load — this protects Lighthouse 97%. **Don't add eager loading.**
- Mapbox (product-map.liquid) and Google Maps (location-picker) are **two different services** with two different tokens. They are NOT interchangeable.

## Authoritative Sources

- `CLAUDE.md §10` — API keys + cart property names
- `CLAUDE.md §12c` — browser-test rule before ANY change to these files
- `.claude/access.md` — how to configure the API keys
- Shopify docs: [cart line item properties](https://shopify.dev/docs/themes/architecture/templates/cart)

## Last Updated

2026-04-12 · commit pending
