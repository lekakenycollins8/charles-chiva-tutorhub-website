#!/bin/bash

WEBHOOK_URL="https://axton-susceptive-keila.ngrok-free.dev/api/intasend/webhook"

echo "🧪 Testing IntaSend webhook endpoint..."
echo "🔗 URL: $WEBHOOK_URL"
echo ""

# Test with sample payload
curl -X POST "$WEBHOOK_URL" \
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

echo ""
echo ""
echo "✅ Webhook test sent!"
echo "📋 Check your Next.js server logs for the webhook processing details"
