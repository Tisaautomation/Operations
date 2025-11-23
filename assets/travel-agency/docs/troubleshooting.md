# Troubleshooting Guide

## Common Issues and Solutions

---

## N8N Issues

### N8N Won't Start

**Symptoms:**
- N8N container/process fails to start
- Error messages in console
- Can't access N8N UI

**Solutions:**

1. **Check Docker status** (if using Docker):
```bash
docker ps -a
docker logs n8n
```

2. **Check port availability**:
```bash
# Check if port 5678 is already in use
netstat -an | grep 5678
# OR on Windows
netstat -an | findstr 5678
```

3. **Verify environment variables**:
```bash
docker exec n8n env | grep N8N
```

4. **Check disk space**:
```bash
df -h
```

5. **Reset N8N** (last resort):
```bash
# Backup your data first!
rm -rf ~/.n8n
docker-compose down -v
docker-compose up -d
```

---

### Workflows Not Executing

**Symptoms:**
- Workflows don't trigger
- No executions in history
- Webhooks not receiving data

**Solutions:**

1. **Verify workflow is activated**:
   - Open workflow
   - Check toggle switch in top right is ON (green)

2. **Check webhook URL accessibility**:
```bash
curl https://your-n8n-domain.com/webhook/test
```

3. **Review execution settings**:
   - Settings → Workflows
   - Ensure executions are enabled
   - Check timeout settings

4. **Check N8N logs**:
```bash
docker logs n8n --tail 100 -f
```

5. **Test workflow manually**:
   - Click "Execute Workflow" button
   - Check for errors in execution log

---

### Credentials Not Working

**Symptoms:**
- "Credentials invalid" errors
- API calls failing
- Authentication errors

**Solutions:**

1. **Verify credentials are selected**:
   - Open node with credential
   - Click credential dropdown
   - Ensure correct credential is selected

2. **Test credential**:
   - Settings → Credentials
   - Select credential
   - Click "Test Credential"

3. **Check expiration** (for OAuth):
   - OAuth tokens may expire
   - Re-authenticate if needed

4. **Verify API keys**:
   - Copy fresh API key from platform
   - Paste into N8N credential
   - Save and test

5. **Check permissions**:
   - Ensure API key has required scopes
   - Verify account has necessary permissions

---

## Integration Issues

### Shopify Webhook Not Triggering

**Symptoms:**
- Orders created but N8N not receiving data
- Webhook shows as inactive in Shopify

**Solutions:**

1. **Verify webhook URL**:
   - Shopify Admin → Settings → Notifications → Webhooks
   - URL should be: `https://your-n8n.com/webhook/shopify-booking`
   - Must be HTTPS (not HTTP)

2. **Check webhook delivery**:
   - Click on webhook in Shopify
   - View "Recent deliveries"
   - Check status codes (200 = success)

3. **Test webhook**:
   - Create test order in Shopify
   - Check N8N execution log immediately

4. **Verify N8N is publicly accessible**:
```bash
curl https://your-n8n.com/webhook/shopify-booking
# Should return N8N response, not error
```

5. **Check Shopify API version**:
   - Must be 2024-01 or newer
   - Update if needed

---

### LINE Messages Not Sending

**Symptoms:**
- No LINE messages received by providers
- "Invalid channel access token" errors
- Messages not delivered

**Solutions:**

1. **Verify Channel Access Token**:
   - LINE Developers Console
   - Messaging API → Channel access token
   - Copy long-lived token (not short-lived)
   - Update in N8N credential

2. **Check provider User IDs**:
   - Provider must add your LINE account as friend
   - Send test message to get User ID
   - Update in `config/providers.json`

3. **Verify webhook settings**:
   - LINE Developers → Messaging API
   - Webhook settings → Enable "Use webhook"
   - Webhook URL must be HTTPS

4. **Test LINE API**:
```bash
curl -X POST https://api.line.me/v2/bot/message/push \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_CHANNEL_ACCESS_TOKEN' \
  -d '{
    "to": "USER_ID",
    "messages": [{
      "type": "text",
      "text": "Test message"
    }]
  }'
```

5. **Check rate limits**:
   - LINE has message limits
   - Verify you haven't exceeded quota

---

### Emails Not Delivering

**Symptoms:**
- Customers not receiving emails
- SMTP errors in N8N logs
- Emails in spam folder

**Solutions:**

1. **Verify SMTP credentials**:
   - Username: Full email address
   - Password: App password (not regular password)
   - Host: smtp.zoho.com
   - Port: 587
   - TLS: Enabled

2. **Test SMTP connection**:
```bash
telnet smtp.zoho.com 587
# Should connect successfully
```

3. **Check Zoho app password**:
   - Zoho → Account → Security → App Passwords
   - Generate new app password
   - Use in N8N (not your regular password)

4. **Verify sender email**:
   - Must be valid Zoho email address
   - Must be verified in Zoho

5. **Check email templates**:
   - Templates must exist in `/data/templates/`
   - HTML must be valid
   - Variables properly formatted: `{{variable}}`

6. **Test email delivery**:
   - Send test email to yourself
   - Check spam/junk folder
   - Review email headers

7. **Setup email authentication**:
   - Add SPF record: `v=spf1 include:zoho.com ~all`
   - Add DKIM in Zoho settings
   - Verify DNS propagation

---

### Google Sheets Not Updating

**Symptoms:**
- Data not appearing in sheets
- "Permission denied" errors
- "Sheet not found" errors

**Solutions:**

1. **Verify sheet permissions**:
   - Open Google Sheet
   - Share → Add service account email
   - Give "Editor" access

2. **Check sheet ID**:
   - Get from URL: `docs.google.com/spreadsheets/d/SHEET_ID/edit`
   - Verify matches N8N configuration

3. **Verify tab names**:
   - Tab names are case-sensitive
   - "Bookings" ≠ "bookings"
   - Must match exactly in workflow

4. **Check column names**:
   - First row must have column headers
   - Must match fields in workflow
   - No extra spaces

5. **Test API access**:
   - Settings → Credentials → Google Sheets
   - Test credential
   - Should succeed

6. **Check service account**:
   - Ensure JSON file is valid
   - Verify service account is enabled in Google Cloud

---

### Zoho CRM Not Syncing

**Symptoms:**
- Contacts not created
- "Invalid token" errors
- CRM data out of sync

**Solutions:**

1. **Re-authenticate OAuth**:
   - Settings → Credentials → Zoho CRM
   - Click "Connect my account"
   - Complete OAuth flow

2. **Check CRM permissions**:
   - Zoho account must have CRM access
   - API must be enabled
   - Verify scopes include: ZohoCRM.modules.ALL

3. **Verify API limits**:
   - Zoho has daily API limits
   - Check current usage in Zoho

4. **Test API connection**:
   - Use Zoho CRM node
   - Try simple operation (read contacts)
   - Check for errors

---

### QuickBooks Integration Issues

**Symptoms:**
- Invoices not created
- "Unauthorized" errors
- Sync failures

**Solutions:**

1. **Re-authorize QuickBooks**:
   - OAuth tokens expire every 100 days
   - Reconnect account in N8N

2. **Verify Company ID**:
   - Realm ID must match your QuickBooks company
   - Found in QuickBooks URL

3. **Check API permissions**:
   - App must have accounting scope
   - Verify in QuickBooks developer portal

4. **Switch to production**:
   - If using sandbox, switch to production
   - Update environment variable

---

### Twilio Calls/SMS Not Working

**Symptoms:**
- Calls not connecting
- SMS not delivered
- "Invalid credentials" errors

**Solutions:**

1. **Verify Twilio credentials**:
   - Account SID (starts with AC)
   - Auth Token (32 characters)
   - Phone Number (format: +1234567890)

2. **Check phone number verification**:
   - Trial accounts: verify recipient numbers
   - Upgrade to paid for unrestricted

3. **Verify number capabilities**:
   - Twilio Console → Phone Numbers
   - Enable Voice and SMS
   - Configure webhook URLs

4. **Check balance**:
   - Ensure account has sufficient balance
   - Add funds if needed

5. **Test Twilio API**:
```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN \
  -d "From=+1234567890" \
  -d "To=+1234567890" \
  -d "Body=Test message"
```

---

### OpenAI Chatbot Issues

**Symptoms:**
- Chatbot not responding
- "API key invalid" errors
- Slow responses

**Solutions:**

1. **Verify API key**:
   - OpenAI Platform → API keys
   - Create new key
   - Update in N8N

2. **Check billing**:
   - Ensure payment method on file
   - Verify usage limits not exceeded

3. **Test API**:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

4. **Adjust rate limits**:
   - Reduce concurrent requests
   - Add delays between calls

5. **Optimize prompts**:
   - Reduce token usage
   - Shorter system prompts
   - Clear conversation history periodically

---

## Performance Issues

### Slow Workflow Execution

**Solutions:**

1. **Optimize Google Sheets queries**:
   - Use specific ranges instead of entire sheet
   - Limit rows returned
   - Cache frequently accessed data

2. **Reduce API calls**:
   - Batch operations when possible
   - Use conditional logic to skip unnecessary calls

3. **Upgrade N8N instance**:
   - Increase memory/CPU allocation
   - Use faster database (PostgreSQL)

4. **Split large workflows**:
   - Break into smaller workflows
   - Use sub-workflows

---

### High Memory Usage

**Solutions:**

1. **Limit execution data retention**:
   - Settings → Executions
   - Reduce retention days
   - Delete old executions

2. **Clean up workflows**:
   - Remove unused nodes
   - Delete test workflows

3. **Optimize database**:
   - Regular cleanup
   - Archive old data

---

## Data Issues

### Duplicate Bookings in Google Sheets

**Solutions:**

1. **Add unique constraint**:
   - Check for existing bookingId before inserting
   - Use update instead of append if exists

2. **Implement deduplication**:
```javascript
const existingBooking = await checkBookingExists(bookingId);
if (!existingBooking) {
  // Insert new booking
}
```

---

### Missing Data in Reports

**Solutions:**

1. **Verify data logging**:
   - Check all nodes execute successfully
   - Review execution history

2. **Check date filters**:
   - Ensure timezone settings correct
   - Verify date parsing logic

3. **Validate data format**:
   - Check date formats match
   - Verify field names correct

---

## Security Issues

### Unauthorized Access to N8N

**Solutions:**

1. **Enable authentication**:
```yaml
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=strong_password
```

2. **Use HTTPS**:
   - Setup SSL certificate
   - Redirect HTTP to HTTPS

3. **Implement IP whitelist** (if needed)

---

### API Keys Exposed

**Solutions:**

1. **Rotate all keys immediately**:
   - Generate new API keys
   - Update in N8N
   - Delete old keys

2. **Use environment variables**:
   - Never hardcode credentials
   - Store in N8N variables

3. **Review access logs**:
   - Check for unauthorized access
   - Monitor API usage

---

## Getting More Help

### N8N Community
- Forum: https://community.n8n.io
- Discord: https://discord.gg/n8n

### Platform Support
- Shopify: https://help.shopify.com
- LINE: https://developers.line.biz/en/support/
- Zoho: https://help.zoho.com
- Google: https://support.google.com
- QuickBooks: https://quickbooks.intuit.com/learn-support/
- Twilio: https://support.twilio.com
- OpenAI: https://help.openai.com

### Escalation Process

1. Check this troubleshooting guide
2. Review N8N execution logs
3. Search N8N community forum
4. Post detailed question with:
   - Error message
   - Workflow JSON (remove credentials)
   - N8N version
   - Steps to reproduce

---

**Remember**: Most issues can be resolved by checking credentials, verifying configuration, and reviewing execution logs!
