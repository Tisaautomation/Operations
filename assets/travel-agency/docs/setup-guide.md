# Travel Agency Automation System - Complete Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [N8N Installation](#n8n-installation)
3. [Platform Integrations Setup](#platform-integrations-setup)
4. [Google Sheets Setup](#google-sheets-setup)
5. [Importing N8N Workflows](#importing-n8n-workflows)
6. [Configuration](#configuration)
7. [Testing](#testing)
8. [Going Live](#going-live)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have accounts for:

- ✅ **Shopify** - Your website and booking platform
- ✅ **N8N** - Workflow automation (self-hosted or cloud)
- ✅ **LINE Messaging API** - Provider communication
- ✅ **Zoho** - CRM and Email
- ✅ **Google Workspace** - Sheets and Drive
- ✅ **QuickBooks** - Accounting
- ✅ **Twilio** - SMS and voice calls (optional but recommended)
- ✅ **OpenAI** - AI chatbot

---

## N8N Installation

### Option 1: N8N Cloud (Recommended for Beginners)

1. Go to [https://n8n.io](https://n8n.io)
2. Sign up for an account
3. Choose a plan (Pro recommended for production)
4. Your N8N instance will be ready at `https://your-subdomain.app.n8n.cloud`

### Option 2: Self-Hosted N8N

#### Using Docker (Recommended)

```bash
# Create directory for N8N data
mkdir -p ~/.n8n

# Run N8N container
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# For production with PostgreSQL
docker-compose up -d
```

#### Docker Compose (Production)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: n8n_password
      POSTGRES_DB: n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=n8n_password
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
      - N8N_HOST=your-domain.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://your-domain.com/
    volumes:
      - n8n_data:/home/node/.n8n
      - ./templates:/data/templates
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:
```

Run:
```bash
docker-compose up -d
```

Access N8N at: `http://localhost:5678` or your configured domain

---

## Platform Integrations Setup

### 1. Shopify Integration

#### Create Shopify Webhook

1. Go to Shopify Admin → Settings → Notifications
2. Scroll to **Webhooks**
3. Click **Create webhook**
4. Configure:
   - **Event**: Order creation
   - **Format**: JSON
   - **URL**: `https://your-n8n-instance.com/webhook/shopify-booking`
   - **API Version**: 2024-01
5. Save

#### Get Shopify API Credentials

1. Go to Apps → Develop apps
2. Create a new app: "N8N Integration"
3. Configure Admin API scopes:
   - `read_orders`
   - `write_orders`
   - `read_customers`
   - `read_products`
4. Install app and copy:
   - Admin API access token
   - API key
   - API secret

### 2. LINE Messaging API Setup

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new provider (your business name)
3. Create a **Messaging API channel**
4. Get credentials:
   - **Channel ID**
   - **Channel Secret**
   - **Channel Access Token** (Long-lived)
5. Configure webhook:
   - URL: `https://your-n8n-instance.com/webhook/provider-response`
   - Enable **Use webhook**
6. Add your tour providers as friends on LINE
7. Get their LINE User IDs (from webhook when they message you)

### 3. Zoho Setup

#### Zoho CRM

1. Go to [Zoho CRM API Console](https://api-console.zoho.com/)
2. Create **Server-based Application**
3. Configure:
   - Client Name: "Travel Agency Automation"
   - Homepage URL: Your website
   - Authorized Redirect URIs: `https://your-n8n-instance.com/rest/oauth2-credential/callback`
4. Copy Client ID and Client Secret
5. Generate OAuth tokens in N8N (will guide you through authorization)

#### Zoho Mail SMTP

1. Go to Zoho Mail Settings
2. Enable IMAP/POP access
3. Create an App Password:
   - Go to Account → Security → App Passwords
   - Generate new password for "N8N"
4. SMTP Settings:
   - Host: `smtp.zoho.com`
   - Port: `587`
   - TLS: Enabled
   - Username: Your Zoho email
   - Password: App password (not your regular password)

### 4. Google Workspace Setup

#### Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Travel Agency Automation"
3. Enable APIs:
   - Google Sheets API
   - Google Drive API
4. Create Service Account:
   - IAM & Admin → Service Accounts
   - Create service account: "n8n-automation"
   - Create key (JSON) → Download file
5. Share your Google Sheets with service account email (found in JSON)

#### Create Google Sheets

Create a Google Sheet with these tabs:

**Tab 1: Bookings**
```
Columns: bookingId | orderId | customerName | customerEmail | customerPhone | tourName | tourDate | pickupTime | pickupLocation | numberOfPeople | totalAmount | currency | paymentMethod | paymentStatus | status | providerId | providerName | commissionRate | createdAt | voucherSent | reminderSent
```

**Tab 2: ChatHistory**
```
Columns: sessionId | customerId | customerName | customerEmail | role | content | timestamp
```

**Tab 3: KnowledgeBase**
```
Columns: question | answer | category | lastUpdated
```

**Tab 4: DailyReports**
```
Columns: reportDate | reportType | providerId | providerName | totalBookings | totalRevenue | status | sentAt
```

**Tab 5: FinancialReports**
```
Columns: reportDate | providerId | providerName | totalRevenue | commissionAmount | providerShare | settlementAmount | paymentStatus | createdAt
```

**Tab 6: ReminderLog**
```
Columns: bookingId | customerName | tourDate | reminderType | sentAt | status
```

**Tab 7: VoucherLog**
```
Columns: bookingId | customerName | tourDate | voucherUrl | sentAt | status
```

**Tab 8: ChatbotLearning**
```
Columns: analyzedDate | totalConversations | frequentQuestions | improvementSuggestions
```

### 5. QuickBooks Integration

1. Go to [QuickBooks Developer Portal](https://developer.intuit.com/)
2. Create new app
3. Add QuickBooks Online API
4. Get:
   - Client ID
   - Client Secret
5. Configure OAuth redirect: `https://your-n8n-instance.com/rest/oauth2-credential/callback`
6. Connect to your QuickBooks account through N8N

### 6. Twilio Setup (SMS & Voice)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get a phone number
3. Copy credentials:
   - Account SID
   - Auth Token
   - Phone Number
4. Enable Voice and SMS capabilities

### 7. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Set up billing
4. Copy API key
5. Recommended model: `gpt-4-turbo-preview` or `gpt-4`

---

## Configuration

### 1. Environment Variables in N8N

Go to N8N Settings → Variables and add all variables from `config/environment-variables.env`:

```bash
# Example - Add each variable
SHOPIFY_SHOP_URL=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
LINE_CHANNEL_ACCESS_TOKEN=your_token
ZOHO_MAIL_USER=info@yourtravelagency.com
# ... etc
```

**OR** if self-hosting, add to your `.env` file or docker-compose environment.

### 2. N8N Credentials

Add credentials for each service in N8N:

1. **Settings → Credentials → Add Credential**

Add these credentials:

- **Shopify** (OAuth2 or API Key)
- **LINE Messaging API** (Custom API with Channel Access Token)
- **Zoho CRM** (OAuth2)
- **Zoho Mail SMTP** (Email SMTP)
- **Google Sheets** (Service Account JSON)
- **Google Drive** (Service Account JSON)
- **QuickBooks** (OAuth2)
- **Twilio** (Account SID + Auth Token)
- **OpenAI** (API Key)

### 3. Provider Configuration

Edit `config/providers.json` with your actual provider details:

```json
{
  "providers": [
    {
      "id": "provider_1",
      "name": "Amazing Tours Co",
      "priority": 1,
      "lineId": "U1234567890abcdef",
      "phone": "+1234567890",
      "email": "contact@amazingtours.com",
      "commission_rate": 0.15,
      "payment_terms": "weekly",
      "active": true
    }
  ]
}
```

---

## Importing N8N Workflows

### Import Process

1. Open N8N
2. Click **Workflows** → **Import from File**
3. Import each workflow JSON file from `n8n-workflows/` folder:

Import in this order:

1. ✅ `01-main-booking-workflow.json`
2. ✅ `04-daily-morning-reports.json`
3. ✅ `05-daily-evening-financial.json`
4. ✅ `06-pre-tour-reminders.json`
5. ✅ `07-voucher-delivery.json`
6. ✅ `10-ai-chatbot-integration.json`

### Configure Each Workflow

For each imported workflow:

1. Open the workflow
2. Check each node with a **credential** icon
3. Select the appropriate credential you created
4. Update any URLs or endpoints
5. **Save** the workflow
6. **Activate** the workflow (toggle switch in top right)

### Copy Email Templates

1. Create folder in N8N: `/data/templates/`
2. Upload all HTML templates from `templates/` folder:
   - `acknowledgment-email.html`
   - `confirmation-email.html`
   - `rejection-email.html`
   - `voucher-template.html`
   - `provider-morning-report.html`
   - `provider-evening-report.html`

If using Docker, mount templates directory:
```bash
docker run -v ./templates:/data/templates n8nio/n8n
```

---

## Testing

### Test Workflow 1: Main Booking

1. Create a test order in Shopify
2. Check N8N execution log
3. Verify:
   - LINE message sent to Provider 1
   - Acknowledgment email sent to customer
   - Data logged to Google Sheets

### Test Workflow 2: Provider Response

1. Reply to the LINE message:
   - Type: `CONFIRM 09:00 AM, Hotel Lobby`
2. Check N8N execution
3. Verify:
   - Confirmation email sent to customer
   - Booking updated in Google Sheets
   - Contact created in Zoho CRM

### Test Workflow 3: Daily Reports

1. Manually trigger the workflow (click "Execute Workflow")
2. Check provider email
3. Verify morning and evening reports

### Test Workflow 4: Chatbot

1. Send POST request to chatbot webhook:
```bash
curl -X POST https://your-n8n-instance.com/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What tours do you offer?",
    "sessionId": "test-session-123",
    "customerName": "Test User",
    "customerEmail": "test@example.com"
  }'
```
2. Check response
3. Verify chat history in Google Sheets

---

## Going Live

### Pre-Launch Checklist

- [ ] All N8N workflows imported and activated
- [ ] All credentials configured correctly
- [ ] Shopify webhook configured and tested
- [ ] LINE providers added and tested
- [ ] Google Sheets created with proper structure
- [ ] Email templates uploaded
- [ ] Provider configuration complete
- [ ] Test bookings completed successfully
- [ ] All daily schedules configured (cron times)
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

### Website Integration

#### Shopify Booking Form

Ensure your Shopify order contains these custom fields:

```liquid
<!-- Add to your tour product page -->
<input type="text" name="properties[tour_date]" placeholder="Tour Date" required>
<input type="text" name="properties[pickup_location]" placeholder="Preferred Pickup Location">
<textarea name="properties[special_requests]" placeholder="Special Requests"></textarea>
```

#### Chatbot Widget

Add to your website (in theme.liquid or footer):

```html
<script>
  window.chatbotConfig = {
    webhookUrl: 'https://your-n8n-instance.com/webhook/chatbot',
    businessName: 'Your Travel Agency'
  };
</script>
<script src="https://your-website.com/chatbot-widget.js"></script>
```

### Monitoring

Set up monitoring for:

1. **N8N Workflow Executions**
   - Check failed executions daily
   - Set up email alerts for errors

2. **Google Sheets**
   - Monitor data accuracy
   - Check for duplicates

3. **Email Deliverability**
   - Monitor bounce rates
   - Check spam folders

4. **Provider Response Times**
   - Track average response time
   - Follow up on delayed responses

---

## Maintenance

### Daily Tasks

- Review failed N8N executions
- Check provider responses
- Monitor chatbot conversations
- Review financial reports

### Weekly Tasks

- Review Google Sheets data quality
- Update knowledge base for chatbot
- Analyze booking trends
- Provider performance review

### Monthly Tasks

- Audit all integrations
- Review and optimize workflows
- Update email templates
- Train chatbot with new FAQs
- Financial reconciliation

---

## Support & Troubleshooting

### Common Issues

#### Issue: Shopify webhook not triggering N8N

**Solution:**
1. Check webhook URL is correct
2. Verify N8N is accessible from internet
3. Check Shopify webhook delivery logs
4. Ensure webhook is active

#### Issue: LINE messages not sending

**Solution:**
1. Verify Channel Access Token is valid
2. Check provider LINE User IDs are correct
3. Ensure providers have added your LINE account
4. Check N8N execution logs for errors

#### Issue: Emails not sending

**Solution:**
1. Verify SMTP credentials
2. Check email templates exist in `/data/templates/`
3. Test SMTP connection
4. Check spam/junk folders
5. Verify sender email is authenticated (SPF, DKIM)

#### Issue: Google Sheets not updating

**Solution:**
1. Check service account has edit access to sheet
2. Verify sheet ID is correct
3. Check column names match exactly
4. Review N8N node configuration

### Getting Help

1. **N8N Community**: [https://community.n8n.io](https://community.n8n.io)
2. **Documentation**: Check README.md and workflow-guide.md
3. **N8N Docs**: [https://docs.n8n.io](https://docs.n8n.io)
4. **Support Email**: Create an issue tracking system

---

## Next Steps

After setup is complete:

1. ✅ **Run test bookings** to verify entire flow
2. ✅ **Train your team** on the system
3. ✅ **Monitor for 1 week** before full launch
4. ✅ **Collect feedback** from providers and customers
5. ✅ **Optimize workflows** based on real usage
6. ✅ **Scale up** as bookings increase

---

## Advanced Configuration

See `docs/workflow-guide.md` for:
- Customizing workflows
- Adding more providers
- Advanced chatbot training
- Custom reporting
- Integration with additional platforms

---

**Congratulations! Your travel agency is now fully automated! 🎉**
