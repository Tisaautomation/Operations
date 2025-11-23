# N8N Workflows - Detailed Guide

## Overview

This document explains how each N8N workflow operates and how to customize them for your needs.

---

## Workflow 1: Main Booking Workflow

**File:** `01-main-booking-workflow.json`

### Flow Diagram

```
Shopify Order
    ↓
Parse Booking Data
    ↓
Load Provider Priority List
    ↓
Send LINE Request to Provider 1
    ↓
Send Acknowledgment Email to Customer
    ↓
Log to Google Sheets
    ↓
[Wait for Provider Response]
    ↓
Provider Confirms? → YES → Send Confirmation Email → Update CRM
                   ↓
                   NO → Try Provider 2 → ... → All Booked? → Rejection Email
```

### Key Nodes Explained

1. **Shopify Webhook Trigger**
   - Listens for new orders from Shopify
   - Automatically triggered when customer completes purchase
   - Webhook URL: `https://your-domain.com/webhook/shopify-booking`

2. **Parse Booking Data**
   - Extracts customer info, tour details, payment info
   - Generates unique booking ID
   - Formats data for subsequent nodes

3. **Load Provider Priority List**
   - Reads providers from config
   - Sorts by priority (1, 2, 3...)
   - Sets current provider to #1

4. **Send LINE Message to Provider**
   - Sends booking request via LINE
   - Includes booking details
   - Asks for CONFIRM or CANCEL response

5. **Provider Response Handler**
   - Parses provider's LINE reply
   - Extracts pickup time and location from CONFIRM
   - Routes to confirmation or next provider

### Customization Options

#### Add More Providers

Edit the "Set Providers Config" node:

```javascript
{
  provider4_name: "New Provider Name",
  provider4_line_id: "LINE_USER_ID",
  provider4_email: "email@provider.com"
}
```

#### Change Response Timeout

Modify the "Parse Provider Response" function:

```javascript
const TIMEOUT_MINUTES = 30; // Change to desired timeout
```

#### Customize Confirmation Logic

Update the "Parse Provider Response" function to handle different response formats.

---

## Workflow 2: Daily Morning Reports

**File:** `04-daily-morning-reports.json`

### Flow Diagram

```
6:00 AM Daily Trigger
    ↓
Fetch Today's Bookings
    ↓
Filter & Group by Provider
    ↓
For Each Provider:
    - Generate Report
    - Send Email
    - Send LINE Summary
    - Log Activity
    ↓
Send Admin Summary
```

### Customization

#### Change Report Time

Edit the Schedule Trigger node:

```
Cron Expression: 0 6 * * *
                 │ │ │ │ │
                 │ │ │ │ └─ Day of week (0-7)
                 │ │ │ └─── Month (1-12)
                 │ │ └───── Day of month (1-31)
                 │ └─────── Hour (0-23)
                 └───────── Minute (0-59)

Examples:
0 7 * * * = 7:00 AM daily
0 6 * * 1-5 = 6:00 AM weekdays only
0 8 * * 0 = 8:00 AM Sundays only
```

#### Add Custom Metrics

Edit "Group Bookings by Provider" function to calculate additional stats:

```javascript
providerBookings[providerId].customMetric = calculateYourMetric();
```

---

## Workflow 3: Daily Evening Financial Reports

**File:** `05-daily-evening-financial.json`

### Flow Diagram

```
8:00 PM Daily Trigger
    ↓
Fetch Today's Completed Tours
    ↓
Calculate Finances by Provider
    ↓
For Each Provider:
    - Generate Financial Report
    - Send Email + LINE
    - Create QuickBooks Invoice
    - Log to Sheets
    ↓
Send Admin Financial Summary
```

### Customization

#### Adjust Commission Rates

Default is 15%. To change per provider, update in Google Sheets or modify:

```javascript
const commissionRate = parseFloat(booking.commissionRate) || 0.20; // 20%
```

#### Payment Terms

Configure in `config/providers.json`:

```json
{
  "payment_terms": "weekly" // or "biweekly", "monthly"
}
```

#### Add Tax Calculations

Edit "Calculate Provider Finances" function:

```javascript
const tax = amount * 0.10; // 10% tax
provider.totalRevenue += (amount + tax);
```

---

## Workflow 4: Pre-Tour Reminders

**File:** `06-pre-tour-reminders.json`

### Flow Diagram

```
Every 15 Minutes Trigger
    ↓
Fetch Today's Confirmed Bookings
    ↓
Filter Tours Starting in 30 Minutes
    ↓
For Each Tour:
    - Make Reminder Call (Twilio)
    - Send SMS
    - Send Email
    - Mark as Reminded
    - Notify Provider
```

### Customization

#### Change Reminder Timing

Edit "Filter Tours Starting in 30 Minutes" function:

```javascript
// Send reminder if tour is between 25-35 minutes away
return timeDiff >= 25 && timeDiff <= 35;

// Change to 60 minutes:
return timeDiff >= 55 && timeDiff <= 65;
```

#### Disable Voice Calls

Remove or deactivate the "Make Reminder Call via Twilio" node.

#### Customize Reminder Message

Edit SMS message in "Send SMS Reminder via Twilio" node:

```
Your custom message here with {{variables}}
```

---

## Workflow 5: Voucher Delivery

**File:** `07-voucher-delivery.json`

### Flow Diagram

```
10:00 AM Daily Trigger
    ↓
Fetch All Confirmed Bookings
    ↓
Filter Tomorrow's Tours
    ↓
For Each Tour:
    - Load Voucher Template
    - Generate PDF
    - Upload to Google Drive
    - Email to Customer
    - Send SMS Notification
    - Notify Provider
    - Log Activity
```

### Customization

#### Change Delivery Time

Modify Schedule Trigger:

```
Cron: 0 18 * * * (6:00 PM)
```

#### Customize Voucher Design

Edit `templates/voucher-template.html` with your branding.

#### Add Attachments

Modify "Email Voucher to Customer" node to include additional files.

---

## Workflow 6: AI Chatbot Integration

**File:** `10-ai-chatbot-integration.json`

### Flow Diagram

```
Customer Message → Webhook
    ↓
Load Context (History + Knowledge Base)
    ↓
OpenAI GPT-4 Processing
    ↓
Analyze Response (Intent Detection)
    ↓
Save to History
    ↓
Booking Intent? → Create Lead in CRM
    ↓
Human Handoff? → Alert Support Team
    ↓
Return Response to Customer
```

### Daily Learning Process

```
2:00 AM Daily
    ↓
Analyze All Conversations
    ↓
Identify Common Questions
    ↓
Update Knowledge Base
    ↓
Send Learning Report to Admin
```

### Customization

#### Change AI Model

Edit "OpenAI Chat Completion" node:

```json
{
  "model": "gpt-4" // or "gpt-4-turbo-preview", "gpt-3.5-turbo"
}
```

#### Adjust AI Personality

Modify system prompt in "OpenAI Chat Completion":

```
You are a [friendly/professional/casual] travel assistant...
```

#### Add Custom Intents

Edit "Process AI Response" function:

```javascript
const customIntent = aiResponse.toLowerCase().includes('your_keyword');
if (customIntent) {
  // Take custom action
}
```

#### Improve Knowledge Base

Add entries to Google Sheets "KnowledgeBase" tab:

| question | answer | category |
|----------|--------|----------|
| What tours do you offer? | We offer beach tours, city tours... | Tours |
| What's your cancellation policy? | Free cancellation up to 24 hours... | Policies |

---

## Common Customizations

### Adding New Email Templates

1. Create HTML file in `templates/`
2. Add template configuration to `config/email-templates.json`
3. Create node to load template in workflow
4. Use "HTML" node with `mode: "loadTemplate"`

### Adding More Integrations

Example: Adding Slack notifications

1. Add Slack credential in N8N
2. Add Slack node after key actions
3. Configure message format
4. Test and activate

### Custom Reporting

Create new workflow:

1. Schedule Trigger (when to run)
2. Fetch data from Google Sheets
3. Aggregate and calculate metrics
4. Format report
5. Send via email or save to Drive

### Conditional Logic

Use IF nodes to create branches:

```
IF booking.totalAmount > 500
  → Send to Premium Provider
ELSE
  → Send to Standard Provider
```

---

## Performance Optimization

### Reduce API Calls

- Cache frequently accessed data
- Batch operations when possible
- Use Google Sheets as temporary storage

### Error Handling

Add error handling nodes:

1. After API calls, add "IF" node checking for errors
2. Create retry logic with "Loop" nodes
3. Send error notifications to admin

### Workflow Organization

- Use descriptive node names
- Add notes to complex nodes
- Group related workflows with tags
- Use workflow variables for shared config

---

## Monitoring & Debugging

### N8N Execution Logs

View execution history:
1. Workflows → Select workflow
2. Executions tab
3. Click on any execution to see detailed logs

### Common Debug Steps

1. Check node outputs (click on node → Output tab)
2. Review error messages in execution logs
3. Test nodes individually (Execute Node button)
4. Verify credentials are valid
5. Check API rate limits

### Setting Up Alerts

Create error alert workflow:

```
Error Trigger
    ↓
Filter Critical Errors
    ↓
Send Email/SMS Alert to Admin
```

---

## Best Practices

### Security

- Never hardcode credentials in workflows
- Use environment variables
- Regularly rotate API keys
- Implement webhook verification
- Enable N8N authentication

### Reliability

- Set up database backup (N8N data)
- Use PostgreSQL for production
- Monitor disk space
- Set execution timeouts
- Implement retry logic

### Scalability

- Use webhook triggers instead of polling
- Optimize Google Sheets queries
- Implement queue systems for high volume
- Consider N8N cloud for easier scaling

---

## Troubleshooting Guide

### Workflow Not Triggering

1. Check if workflow is activated (toggle on)
2. Verify trigger configuration
3. Test webhook URLs are accessible
4. Review N8N logs for errors

### Data Not Saving to Google Sheets

1. Verify service account has edit access
2. Check sheet ID is correct
3. Confirm column names match
4. Review append/update range

### Emails Not Delivering

1. Test SMTP credentials
2. Check email templates exist
3. Verify sender authentication
4. Review spam folders

### Provider Not Receiving LINE Messages

1. Confirm LINE Channel Access Token valid
2. Verify provider User ID correct
3. Check provider added your account
4. Review LINE API logs

---

## Advanced Topics

### Multi-Language Support

Detect customer language and send emails in their language:

```javascript
const language = detectLanguage(customer.email);
const template = language === 'es'
  ? 'confirmation-email-es.html'
  : 'confirmation-email-en.html';
```

### Dynamic Pricing

Calculate prices based on season, demand, etc:

```javascript
const price = baseprice * demandMultiplier * seasonalMultiplier;
```

### Automated Marketing

Create workflows for:
- Abandoned cart recovery
- Post-tour review requests
- Birthday/holiday promotions
- Loyalty program management

---

## Resources

- **N8N Documentation**: https://docs.n8n.io
- **N8N Community**: https://community.n8n.io
- **Workflow Templates**: https://n8n.io/workflows
- **API Documentation**: Check each platform's docs

---

**Happy Automating! 🚀**
