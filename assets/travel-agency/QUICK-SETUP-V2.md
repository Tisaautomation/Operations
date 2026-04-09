# Quick Setup Guide - Version 2.0 Updates

## 🚀 Get the New Features Running Fast

This guide helps you implement the new payment system, location selector, and WhatsApp integration.

---

## Step 1: Update Environment Variables (5 minutes)

Edit `config/environment-variables.env` and add:

```bash
# Your Payment Details
THAI_BANK_NAME=Your Bank Name
THAI_BANK_ACCOUNT_NAME=Your Business Name
THAI_BANK_ACCOUNT_NUMBER=Your Account Number
THAI_BANK_BRANCH=Branch Name

# PromptPay (Thai mobile or Tax ID)
PROMPTPAY_ID=0812345678

# PayPal.me
PAYPAL_USERNAME=yourbusiness
# Creates: paypal.com/paypalme/yourbusiness

# Stripe (from Stripe Dashboard → Payment Links)
STRIPE_PAYMENT_LINK_BASE=https://buy.stripe.com/test_xxxxx

# Wise Email
WISE_EMAIL=payments@yourbusiness.com

# Revolut Username
REVOLUT_USERNAME=yourbusiness

# Google Maps API Key
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXX

# WhatsApp (from Twilio)
TWILIO_WHATSAPP_NUMBER=whatsapp:+66812345678

# Timezone
TIMEZONE=Asia/Bangkok
```

---

## Step 2: Get Google Maps API Key (10 minutes)

### Quick Steps:

1. Go to https://console.cloud.google.com/
2. Create project: "Travel Agency Maps"
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to Credentials → Create API Key
5. Copy API key
6. (Optional) Restrict to your domain

**Cost**: Free for first 28,000 map loads per month

---

## Step 3: Setup Payment Accounts (30 minutes)

### Option 1: Cash on Tour (COT)
✅ **No setup needed** - Just inform customers

### Option 2: Thai Bank Transfer
1. Have your bank account details ready
2. Update environment variables (done in Step 1)
3. Test by sending test payment

### Option 3: PromptPay QR Code
1. Register PromptPay with your Thai bank
2. Link to mobile number or Tax ID
3. Add to environment variables
4. QR codes auto-generate!

### Option 4: PayPal
1. Create PayPal.me link: https://paypal.me/
2. Choose username
3. Add to environment variables

### Option 5: Stripe
1. Sign up: https://stripe.com
2. Dashboard → Payment Links → Create
3. Set amount to "Customer chooses"
4. Copy link base URL
5. Add to environment variables

### Option 6 & 7: Wise & Revolut
1. Create business account
2. Enable payment links
3. Add details to environment variables

**Don't have all payment methods?** That's okay! The system will show only the ones you configure.

---

## Step 4: Update Shopify Form (20 minutes)

### A. Add WhatsApp Field

In your product template, add:

```liquid
<div class="form-group">
  <label for="whatsapp_number">WhatsApp Number *</label>
  <input type="tel"
         name="properties[whatsapp_number]"
         id="whatsapp_number"
         required
         placeholder="+66812345678">
  <small>Driver will contact you on WhatsApp 30 min before pickup</small>
</div>
```

### B. Add Google Maps Location Selector

1. **In theme.liquid** (before `</head>`):
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>
```

2. **In product template**:

Copy the complete form code from `docs/shopify-form-setup.md`

**Quick version:**
```html
<!-- Search box -->
<input type="text" id="location_search" placeholder="Search location...">

<!-- Hidden fields -->
<input type="hidden" name="properties[pickup_location]" id="pickup_location">
<input type="hidden" name="properties[pickup_lat]" id="pickup_lat">
<input type="hidden" name="properties[pickup_lng]" id="pickup_lng">
<input type="hidden" name="properties[pickup_map_url]" id="pickup_map_url">

<!-- Map -->
<div id="map" style="width:100%; height:400px;"></div>

<!-- Selected location display -->
<div id="selected_location" style="display:none;">
  <strong>Selected:</strong> <span id="location_display"></span>
</div>
```

3. **Add JavaScript** (see full code in `docs/shopify-form-setup.md`)

### C. Disable Payment at Checkout

**Shopify Settings → Checkout:**
- Add manual payment method: "Pay After Confirmation"
- Instructions: "Multiple payment options will be sent after booking confirmation"

---

## Step 5: Import Updated N8N Workflow (15 minutes)

### Import Process:

1. **Backup current workflow**
   - Export existing `01-main-booking-workflow.json`
   - Save to safe location

2. **Import new workflow**
   - N8N → Workflows → Import
   - Select `n8n-workflows/01-main-booking-workflow-UPDATED.json`

3. **Configure credentials**
   - Open workflow
   - Click each node with credential icon
   - Select appropriate credential

4. **Upload new email templates**
   - Upload `confirmation-email-with-payment.html` to `/data/templates/`
   - Upload `alternative-location-email.html` to `/data/templates/`

5. **Activate workflow**
   - Toggle switch to ON
   - Workflow is live!

---

## Step 6: Test Complete Flow (20 minutes)

### Test Checklist:

**1. Test Booking Form**
- [ ] Visit your Shopify store
- [ ] Select a tour
- [ ] Fill all fields including WhatsApp
- [ ] Select location on map
- [ ] Submit booking
- [ ] NO payment should be required

**2. Check Provider LINE Message**
- [ ] Provider receives LINE message
- [ ] Message shows customer location map link
- [ ] Three buttons appear: CONFIRM / CANCEL / ALTERNATIVE

**3. Test CONFIRM Flow**
- [ ] Click CONFIRM button
- [ ] Reply with: "PICKUP TIME: 9:00 AM - 9:20 AM"
- [ ] Customer receives confirmation email
- [ ] Email shows all 7 payment methods
- [ ] QR code displays (if PromptPay configured)
- [ ] Payment links are clickable

**4. Test ALTERNATIVE LOCATION**
- [ ] Click ALTERNATIVE LOCATION button
- [ ] Send new location
- [ ] Customer receives location change email
- [ ] Email shows old and new location
- [ ] Map links work

**5. Test CANCEL Flow**
- [ ] Click CANCEL
- [ ] System routes to next provider
- [ ] If all cancel: Rejection email sent

**6. Test WhatsApp**
- [ ] Customer receives WhatsApp confirmation
- [ ] Message includes tour details
- [ ] Driver contact confirmed

---

## Step 7: Train Your Providers (10 minutes)

### Show providers how to:

1. **Read LINE Messages**
   - Location map link
   - Customer details
   - Payment status

2. **Use Action Buttons**
   - ✅ **Green CONFIRM**: Tour is available
   - ❌ **Red CANCEL**: Fully booked
   - ⚠️ **Yellow ALTERNATIVE**: Location issue

3. **Respond to Pickup Time Request**
   - Format: "PICKUP TIME: 9:00 AM - 9:20 AM"
   - Give time range for flexibility

4. **Suggest Alternative Location**
   - When original location has access issues
   - Send clear address or share location pin
   - System notifies customer automatically

---

## Troubleshooting Quick Fixes

### Map not loading?
```
Check: Google Maps API key in theme.liquid
Check: Billing enabled on Google Cloud
Check: APIs enabled (Maps, Places, Geocoding)
```

### Payment links not working?
```
Check: Environment variables set correctly
Check: Payment accounts active
Check: Email template uploaded to N8N
```

### WhatsApp not sending?
```
Check: TWILIO_WHATSAPP_NUMBER in environment
Check: Twilio account active
Check: WhatsApp Business API enabled
```

### LINE buttons not showing?
```
Check: LINE API version supports action buttons
Check: Message format correct
Check: Quick Reply items properly formatted
```

---

## What Changed from Version 1.0?

| Feature | Version 1.0 | Version 2.0 |
|---------|-------------|-------------|
| **Payment** | Required at booking | After confirmation |
| **Payment Methods** | Shopify payments only | 7 options (COT, Bank, QR, PayPal, Stripe, Wise, Revolut) |
| **Location** | Text field | Interactive Google Maps |
| **Driver Contact** | Phone only | WhatsApp (mandatory) |
| **Provider Interface** | Text replies | Action buttons |
| **Alternative Pickup** | Not supported | Fully automated |
| **Coordinates** | Not captured | GPS lat/lng saved |
| **Map Links** | Not available | Auto-generated |

---

## Payment Method Priority

**Recommended order for Thai customers:**

1. **PromptPay QR** (Most popular in Thailand)
2. **Cash on Tour** (No hassle)
3. **Thai Bank Transfer** (Traditional)
4. **Credit Card (Stripe)** (International)
5. **PayPal** (International)
6. **Wise/Revolut** (Expats)

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Google Maps API | Free | Up to 28K loads/month |
| PromptPay | Free | No fees |
| Thai Bank Transfer | Free | Manual processing |
| Stripe | 3.4% + ฿11 | Per transaction |
| PayPal | 3.9% + ฿11 | Per transaction |
| Wise | ~1% | Currency dependent |
| Revolut | 0-2% | Depends on account |
| Twilio WhatsApp | $0.005/msg | Very cheap |

---

## Go Live Checklist

Before enabling for real customers:

- [ ] All payment accounts active
- [ ] Google Maps API key working
- [ ] Test booking completed successfully
- [ ] All email templates rendering correctly
- [ ] Provider LINE buttons working
- [ ] WhatsApp messages sending
- [ ] QR codes generating (if using PromptPay)
- [ ] Alternative location flow tested
- [ ] Providers trained on new system
- [ ] Admin tested full flow

---

## Support

**Need help?**

1. Check `UPDATES-CHANGELOG.md` for detailed changes
2. Read `docs/shopify-form-setup.md` for form code
3. Review `docs/troubleshooting.md` for common issues
4. Check N8N execution logs for errors

---

**Version 2.0 Setup Complete! 🎉**

Your travel agency now has:
- ✅ No upfront payment (higher conversions)
- ✅ 7 flexible payment options
- ✅ Interactive map location selector
- ✅ WhatsApp driver communication
- ✅ Smart provider interface with buttons
- ✅ Alternative location handling

**Go make those bookings! 🚀**
