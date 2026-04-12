# Boot: Accounting

**TL;DR (30 seconds):** ⚠️ **This domain does NOT live in this repo.** Bookkeeping, invoices, financial reporting, tax filings, and accounting operations are outside the scope of this Shopify theme. They live separately — possibly in the user's accountant's system, QuickBooks, Xero, or a dedicated operations project.

## Current State

- ❌ Not in this repo
- ✅ The storefront **generates** orders that feed into accounting elsewhere

## What This Repo HAS That Touches Accounting

Only indirectly:

| Piece | What it does |
|---|---|
| Shopify orders | The theme's booking form produces cart → checkout → order with all custom properties. Shopify holds the order + tax + fees data. |
| Shopify Admin API (pending setup) | Can be used to export orders, payouts, tax reports programmatically — see `boot ops` for MCP setup |
| `custom.duration`, `custom.pickup`, etc. | Product metafields — **these do NOT contain pricing**. Price lives in Shopify's native `product.price` |

## What To Tell The User

If the user asks for accounting work here:

> *"Accounting no vive en este repo. El theme sólo produce órdenes vía Shopify; los reportes financieros viven en Shopify admin, en tu contador, o en un sistema separado (QuickBooks / Xero / un libro propio). Si tenés un repo de accounting, pasame el contexto o el boot de allá."*

## Possible Integration Points (Future, Not Built)

If accounting ever integrates here, these are the realistic options:

1. **Shopify webhook** on order creation → external ledger (Zapier / custom endpoint)
2. **Scheduled export script** that pulls Shopify orders via Admin API and generates a CSV for the accountant
3. **Custom Shopify admin page** (app extension) with a financial summary dashboard
4. **Tax-line inspection tool** — Shopify already breaks down tax per line; surface it in a dev-facing view

**None of this exists today.** Ask the user before building.

## Useful APIs (For Reference)

- Shopify Admin GraphQL — `orders`, `payouts`, `taxLines` fields
- Shopify Admin REST — `/orders.json`, `/payments.json`
- Shopify Analytics API — revenue reports

Access requires the `shopify-admin` MCP + token (see `boot ops` + `.claude/access.md §3`).

## Authoritative Sources

- Ask the user for the canonical accounting system/repo.
- Shopify docs: [Order resource](https://shopify.dev/docs/api/admin-graphql/latest/objects/Order)

## Last Updated

2026-04-12 · placeholder — update this file (or delete it) if accounting ever integrates
