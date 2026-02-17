# IntaSend Webhook Testing Guide

## 🚀 Quick Setup

### 1. Install ngrok (if not already installed)
```bash
# Ubuntu/Debian
sudo apt install ngrok

# macOS
brew install ngrok

# Or download from: https://ngrok.com/download
```

### 2. Run the setup script
```bash
./setup-ngrok-webhook.sh
```

### 3. Configure IntaSend Webhook
1. Copy the webhook URL from the script output
2. Go to your IntaSend dashboard
3. Navigate to Webhooks section
4. Add the webhook URL: `https://your-ngrok-url.ngrok.io/api/intasend/webhook`
5. Select events: `invoice.completed`

### 4. Test Payment Flow
1. Go to your pricing page
2. Select a plan and fill customer info
3. Complete payment on IntaSend
4. Watch webhook logs in your terminal

## 🔍 Debugging Tips

### Check Webhook Logs
- Terminal: Watch the ngrok script output
- Browser: http://localhost:4040 (ngrok web interface)
- Console: Check your Next.js server logs

### Common Issues
1. **Signature verification fails**: Check your `INTASEND_WEBHOOK_SECRET` env variable
2. **No webhook received**: Verify webhook URL is correct and accessible
3. **Wrong event type**: Make sure you're listening for `invoice.completed`

### Manual Webhook Test
You can test webhooks manually with curl:
```bash
curl -X POST http://localhost:3000/api/intasend/webhook \
  -H "Content-Type: application/json" \
  -H "X-IntaSend-Signature: test-signature" \
  -d '{
    "event": "invoice.completed",
    "invoice": {
      "invoice_id": "TEST-123",
      "state": "COMPLETE",
      "value": "10.00",
      "customer": {
        "email": "test@example.com"
      },
      "customer_comment": "{\"type\":\"plan\",\"planId\":\"basic-hourly\"}"
    }
  }'
```

## 📊 Monitoring

### Ngrok Web Interface
- URL: http://localhost:4040
- View: Incoming requests, response codes, timing

### Application Logs
- Watch: `npm run dev` terminal for detailed webhook logs
- Look for: 🪝, 📦, ✅, ❌ emojis for webhook processing status

## 🛑 Cleanup

Stop ngrok when done:
```bash
# Find ngrok process
ps aux | grep ngrok

# Kill the process
kill <ngrok-pid>
```

## 🔐 Security Notes

- Never expose your webhook URL publicly in production
- Use HTTPS in production
- Verify webhook signatures (already implemented)
- Set proper webhook secrets in IntaSend dashboard
