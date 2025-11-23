# Travel Agency Automation - Quick Start Guide

## 🚀 Get Started in 30 Minutes

This quick start guide will get your travel agency automation up and running fast.

---

## Step 1: Install N8N (5 minutes)

### Cloud Option (Easiest)

```bash
# Go to n8n.io and sign up
# Your instance will be ready instantly at:
# https://your-name.app.n8n.cloud
```

### Self-Hosted Option

```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

Access: http://localhost:5678

---

## Step 2: Setup Google Sheets (5 minutes)

1. Create a new Google Sheet
2. Add these 8 tabs:
   - Bookings
   - ChatHistory
   - KnowledgeBase
   - DailyReports
   - FinancialReports
   - ReminderLog
   - VoucherLog
   - ChatbotLearning

3. In **Bookings** tab, add columns:
   ```
   bookingId | customerName | customerEmail | customerPhone | tourName | tourDate |
   pickupTime | pickupLocation | numberOfPeople | totalAmount | currency |
   paymentMethod | status | providerName | createdAt
   ```

4. Share sheet with your N8N service account email

---

## Step 3: Add Essential Credentials (10 minutes)

In N8N, go to **Settings → Credentials** and add:

### 1. Google Sheets
- Type: Service Account
- Upload your service account JSON file

### 2. Zoho Mail (SMTP)
- Host: smtp.zoho.com
- Port: 587
- User: your-email@domain.com
- Password: Your Zoho app password

### 3. LINE Messaging API
- Channel Access Token: (from LINE Developers Console)

### 4. OpenAI
- API Key: (from OpenAI platform)

---

## Step 4: Import Main Workflow (5 minutes)

1. Download `n8n-workflows/01-main-booking-workflow.json`
2. In N8N: **Workflows → Import from File**
3. Select the file
4. Click each credential icon and select your credentials
5. **Activate** the workflow (toggle in top right)

---

## Step 5: Test Your First Booking (5 minutes)

### Manual Test (No Shopify needed)

1. In N8N, open the main booking workflow
2. Click on "Shopify Webhook Trigger" node
3. Click "Execute Node"
4. In the test data, paste:

```json
{
  "id": "12345",
  "order_number": "1001",
  "customer": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "line_items": [{
    "name": "Beach Tour",
    "product_id": "123",
    "quantity": 2
  }],
  "total_price": "150.00",
  "currency": "USD",
  "financial_status": "paid",
  "payment_gateway_names": ["Credit Card"],
  "note": "Looking forward to the tour!",
  "note_attributes": [
    {"name": "tour_date", "value": "2024-06-15"},
    {"name": "pickup_location", "value": "Hotel Lobby"}
  ]
}
```

5. Click **"Execute Node"**
6. Check your Google Sheets - booking should be logged!
7. Check your email - acknowledgment email should be sent!

---

## Step 6: Setup Daily Reports (Optional, 2 minutes)

1. Import `04-daily-morning-reports.json`
2. Set credentials
3. Activate workflow

That's it! Reports will run automatically at 6 AM daily.

---

## Quick Configuration Checklist

- [ ] N8N installed and accessible
- [ ] Google Sheets created with tabs
- [ ] Google Sheets credential added
- [ ] Zoho Mail SMTP configured
- [ ] Main booking workflow imported
- [ ] Main booking workflow activated
- [ ] Test booking completed successfully
- [ ] Booking appears in Google Sheets

---

## What's Next?

### Essential (Do This Week)

1. **Add your providers**: Edit `config/providers.json`
2. **Setup Shopify webhook**: Point to your N8N webhook URL
3. **Configure LINE**: Add providers and get their User IDs
4. **Customize email templates**: Edit HTML files in `templates/`

### Important (Do This Month)

1. Import all remaining workflows
2. Setup Zoho CRM integration
3. Configure Twilio for SMS/calls
4. Train AI chatbot with your FAQs
5. Setup QuickBooks integration

### Optional (When Ready)

1. Add custom reports
2. Integrate with more platforms
3. Add multi-language support
4. Implement advanced analytics

---

## Common First-Time Issues

### "Credentials not found"
**Fix**: Make sure you've added credentials in N8N Settings → Credentials

### "Google Sheets permission denied"
**Fix**: Share your sheet with the service account email from your JSON file

### "Workflow not triggering"
**Fix**: Make sure the workflow is **activated** (toggle switch in top right)

### "Email not sending"
**Fix**: Use an app password, not your regular Zoho password

---

## Need Help?

1. Check **docs/setup-guide.md** for detailed instructions
2. Review **docs/workflow-guide.md** for workflow customization
3. Visit [N8N Community](https://community.n8n.io) for support

---

## Your Automation Journey

```
Week 1: ✅ Basic booking automation
Week 2: ✅ Provider communication + Daily reports
Week 3: ✅ Financial automation + Reminders
Week 4: ✅ AI Chatbot + Full integration
```

---

**Congratulations! Your travel agency is now automated! 🎉**

Start with the basics, then add more features as you grow.
