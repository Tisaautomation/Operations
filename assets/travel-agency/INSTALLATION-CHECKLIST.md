# Complete Installation Checklist

Use this checklist to ensure proper setup of your travel agency automation system.

---

## Phase 1: Prerequisites ✅

- [ ] Shopify store set up with tour products
- [ ] Domain name configured
- [ ] Email domain configured (for professional emails)
- [ ] Server/hosting for N8N (or N8N Cloud account)
- [ ] Credit card for paid services (Twilio, OpenAI, etc.)

---

## Phase 2: Account Creation ✅

### Essential Accounts

- [ ] **N8N** account created (cloud or self-hosted)
- [ ] **Google Workspace** account (for Sheets & Drive)
- [ ] **Zoho** account (CRM + Mail)
- [ ] **Shopify** store active
- [ ] **LINE** Business account and Messaging API channel

### Important Accounts

- [ ] **QuickBooks** account for accounting
- [ ] **Twilio** account for SMS/Voice
- [ ] **OpenAI** account for AI chatbot

### Optional Accounts

- [ ] **Stripe** / **PayPal** for payments (if not using Shopify Payments)
- [ ] Analytics platforms (Google Analytics, etc.)

---

## Phase 3: N8N Installation ✅

### N8N Cloud

- [ ] Sign up at n8n.io
- [ ] Choose plan (Pro recommended)
- [ ] Note your instance URL: `https://______.app.n8n.cloud`
- [ ] Configure custom domain (optional)

### Self-Hosted

- [ ] Server provisioned (min 2GB RAM, 2 CPU cores)
- [ ] Docker installed
- [ ] PostgreSQL database configured
- [ ] N8N container running
- [ ] N8N accessible via HTTPS
- [ ] SSL certificate configured
- [ ] Backup strategy implemented

**Test:**
```bash
# Access N8N UI
curl https://your-n8n-domain.com
# Should return HTML (not error)
```

---

## Phase 4: Google Cloud Setup ✅

### Google Cloud Project

- [ ] Create new project: "Travel Agency Automation"
- [ ] Enable Google Sheets API
- [ ] Enable Google Drive API
- [ ] Create service account
- [ ] Download service account JSON key
- [ ] Save JSON key securely

### Google Sheets

- [ ] Create main spreadsheet
- [ ] Add 8 tabs: Bookings, ChatHistory, KnowledgeBase, DailyReports, FinancialReports, ReminderLog, VoucherLog, ChatbotLearning
- [ ] Add column headers to each tab
- [ ] Share sheet with service account email (Editor access)
- [ ] Note spreadsheet ID from URL

**Test:**
- [ ] Can manually edit sheet
- [ ] Service account can access sheet

---

## Phase 5: LINE Setup ✅

### LINE Developers Console

- [ ] Create provider (your business name)
- [ ] Create Messaging API channel
- [ ] Copy Channel ID
- [ ] Copy Channel Secret
- [ ] Generate Channel Access Token (long-lived)
- [ ] Enable webhook
- [ ] Set webhook URL: `https://your-n8n.com/webhook/provider-response`
- [ ] Verify webhook

### Provider Setup

- [ ] Add Provider 1 as LINE friend
- [ ] Add Provider 2 as LINE friend
- [ ] Add Provider 3 as LINE friend
- [ ] Get each provider's User ID (send message, check webhook)
- [ ] Update `config/providers.json` with User IDs

**Test:**
- [ ] Send test message to provider
- [ ] Provider receives message
- [ ] Reply received in webhook

---

## Phase 6: Zoho Setup ✅

### Zoho CRM

- [ ] Zoho CRM account active
- [ ] Go to api-console.zoho.com
- [ ] Create server-based application
- [ ] Copy Client ID
- [ ] Copy Client Secret
- [ ] Note authorized redirect URI for N8N

### Zoho Mail

- [ ] Professional email set up (e.g., info@yourdomain.com)
- [ ] IMAP/POP access enabled
- [ ] App password generated (Account → Security → App Passwords)
- [ ] Note app password (NOT regular password)

**Test:**
- [ ] Send test email via SMTP
- [ ] Receive test email
- [ ] Check spam folder settings

---

## Phase 7: Shopify Setup ✅

### Shopify Configuration

- [ ] Store active and configured
- [ ] Tour products created
- [ ] Custom order fields added (tour_date, pickup_location, special_requests)
- [ ] Checkout customized
- [ ] Apps installed (if needed)

### Shopify API

- [ ] Create custom app: "N8N Integration"
- [ ] Configure Admin API scopes (read_orders, write_orders, read_customers, read_products)
- [ ] Install app
- [ ] Copy Admin API access token
- [ ] Copy API key
- [ ] Copy API secret

### Shopify Webhook

- [ ] Go to Settings → Notifications → Webhooks
- [ ] Create webhook: Order creation
- [ ] Format: JSON
- [ ] URL: `https://your-n8n.com/webhook/shopify-booking`
- [ ] API version: 2024-01
- [ ] Webhook active

**Test:**
- [ ] Create test order
- [ ] Webhook fires successfully
- [ ] Check delivery in Shopify

---

## Phase 8: QuickBooks Setup ✅

- [ ] QuickBooks Online account active
- [ ] Go to developer.intuit.com
- [ ] Create new app
- [ ] Add QuickBooks Online API scope
- [ ] Copy Client ID
- [ ] Copy Client Secret
- [ ] Note Company ID (Realm ID)
- [ ] Set redirect URI for N8N

**Test:**
- [ ] Connect via N8N OAuth
- [ ] Test create invoice

---

## Phase 9: Twilio Setup ✅

- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] Voice capability enabled
- [ ] SMS capability enabled
- [ ] Copy Account SID
- [ ] Copy Auth Token
- [ ] Copy phone number

**Test:**
- [ ] Send test SMS to your phone
- [ ] Make test call to your phone
- [ ] Verify delivery

---

## Phase 10: OpenAI Setup ✅

- [ ] OpenAI account created
- [ ] Payment method added
- [ ] API key generated
- [ ] Copy API key
- [ ] Set usage limits (optional)

**Test:**
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4","messages":[{"role":"user","content":"test"}]}'
```

---

## Phase 11: N8N Configuration ✅

### Environment Variables

- [ ] All variables from `config/environment-variables.env` added
- [ ] Business details configured
- [ ] API keys secured
- [ ] URLs correct

### N8N Credentials

Add each credential in Settings → Credentials:

- [ ] Google Sheets (Service Account JSON)
- [ ] Google Drive (Service Account JSON)
- [ ] Zoho CRM (OAuth2)
- [ ] Zoho Mail SMTP
- [ ] Shopify (API Key or OAuth2)
- [ ] LINE Messaging API
- [ ] QuickBooks (OAuth2)
- [ ] Twilio
- [ ] OpenAI

**Test each credential after adding!**

### Email Templates

- [ ] Create `/data/templates/` directory
- [ ] Upload `acknowledgment-email.html`
- [ ] Upload `confirmation-email.html`
- [ ] Upload `rejection-email.html`
- [ ] Upload `voucher-template.html`
- [ ] Upload `provider-morning-report.html`
- [ ] Upload `provider-evening-report.html`

---

## Phase 12: Workflow Import ✅

Import workflows in this order:

1. - [ ] Import `01-main-booking-workflow.json`
   - [ ] Configure all credentials
   - [ ] Test manually
   - [ ] Activate

2. - [ ] Import `04-daily-morning-reports.json`
   - [ ] Configure credentials
   - [ ] Test manually (Execute Workflow)
   - [ ] Activate

3. - [ ] Import `05-daily-evening-financial.json`
   - [ ] Configure credentials
   - [ ] Test manually
   - [ ] Activate

4. - [ ] Import `06-pre-tour-reminders.json`
   - [ ] Configure credentials
   - [ ] Test manually
   - [ ] Activate

5. - [ ] Import `07-voucher-delivery.json`
   - [ ] Configure credentials
   - [ ] Test manually
   - [ ] Activate

6. - [ ] Import `10-ai-chatbot-integration.json`
   - [ ] Configure credentials
   - [ ] Add FAQs to knowledge base
   - [ ] Test chatbot endpoint
   - [ ] Activate

---

## Phase 13: Testing ✅

### Test 1: Complete Booking Flow

- [ ] Create test order in Shopify
- [ ] Verify acknowledgment email received
- [ ] Check Google Sheets for booking entry
- [ ] Provider 1 receives LINE message
- [ ] Reply with CONFIRM + time + location
- [ ] Customer receives confirmation email
- [ ] Zoho CRM contact created
- [ ] QuickBooks invoice created (if configured)

### Test 2: Provider Fallback

- [ ] Create test order
- [ ] Provider 1 replies "FULLY BOOKED"
- [ ] Provider 2 receives LINE message
- [ ] Provider 2 confirms
- [ ] Customer receives confirmation

### Test 3: All Providers Booked

- [ ] Create test order
- [ ] All providers reply "FULLY BOOKED"
- [ ] Customer receives rejection email with alternatives

### Test 4: Daily Reports

- [ ] Manually trigger morning report workflow
- [ ] Providers receive schedule email
- [ ] Providers receive LINE summary
- [ ] Admin receives summary email

- [ ] Manually trigger evening report workflow
- [ ] Providers receive financial report
- [ ] Providers receive LINE summary
- [ ] QuickBooks invoice created
- [ ] Admin receives financial summary

### Test 5: Reminders

- [ ] Create booking for tomorrow
- [ ] Wait for 30 minutes before pickup time
- [ ] Customer receives call
- [ ] Customer receives SMS
- [ ] Customer receives email
- [ ] Provider receives notification

### Test 6: Voucher

- [ ] Create booking for tomorrow
- [ ] Manually trigger voucher workflow
- [ ] Customer receives voucher email with PDF
- [ ] Customer receives SMS notification
- [ ] Voucher saved to Google Drive
- [ ] Provider notified via LINE

### Test 7: Chatbot

- [ ] Send message to chatbot webhook
- [ ] Receive AI response
- [ ] Check chat history in Google Sheets
- [ ] Test booking intent detection
- [ ] Test human handoff

---

## Phase 14: Go Live ✅

### Final Checks

- [ ] All workflows activated
- [ ] All tests passed
- [ ] Provider configuration verified
- [ ] Email deliverability confirmed
- [ ] Backup systems in place
- [ ] Monitoring configured

### Website Integration

- [ ] Shopify webhook live
- [ ] Booking form includes custom fields
- [ ] Chatbot widget installed on website
- [ ] Test bookings from live website

### Team Training

- [ ] Admin trained on N8N dashboard
- [ ] Providers trained on LINE responses
- [ ] Support team trained on handoff process
- [ ] Documentation shared with team

### Launch

- [ ] Soft launch with limited bookings
- [ ] Monitor first 10 bookings closely
- [ ] Collect feedback from providers
- [ ] Collect feedback from customers
- [ ] Make adjustments as needed

---

## Phase 15: Post-Launch ✅

### Week 1

- [ ] Daily review of all executions
- [ ] Fix any errors immediately
- [ ] Optimize based on real usage
- [ ] Gather provider feedback

### Week 2

- [ ] Review automation performance
- [ ] Analyze chatbot conversations
- [ ] Update knowledge base
- [ ] Optimize email templates

### Week 3

- [ ] Financial reconciliation
- [ ] Provider satisfaction check
- [ ] Customer feedback analysis
- [ ] System performance review

### Month 1

- [ ] Comprehensive system audit
- [ ] Scale capacity if needed
- [ ] Plan Phase 2 improvements
- [ ] Document lessons learned

---

## Maintenance Schedule 📅

### Daily

- [ ] Review failed N8N executions
- [ ] Check provider response times
- [ ] Monitor chatbot performance

### Weekly

- [ ] Review Google Sheets data
- [ ] Audit financial reports
- [ ] Update knowledge base
- [ ] Provider check-in

### Monthly

- [ ] Full system audit
- [ ] Update integrations
- [ ] Review and renew API keys
- [ ] Backup all data
- [ ] Performance optimization

---

## Emergency Contacts 🆘

**N8N Issues:**
- Community: https://community.n8n.io
- Documentation: https://docs.n8n.io

**Platform Support:**
- Shopify: https://help.shopify.com
- LINE: https://developers.line.biz/en/support/
- Zoho: https://help.zoho.com
- Google: https://support.google.com
- QuickBooks: https://quickbooks.intuit.com/learn-support/
- Twilio: https://support.twilio.com
- OpenAI: https://help.openai.com

---

**Installation Complete! 🎉**

Your travel agency is now fully automated from booking to reporting!
