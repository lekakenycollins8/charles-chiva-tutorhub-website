#!/bin/bash

echo "🚀 Starting ngrok for IntaSend webhook testing..."

# Kill any existing ngrok processes
pkill -f ngrok 2>/dev/null || true
sleep 2

# Start ngrok using the local binary
echo "🔗 Starting ngrok tunnel for localhost:3000..."
cd /tmp && ./ngrok http 3000 --log=stdout > /home/leky_reborn/charles-chiva-tutorhub-website/ngrok.log 2>&1 &
NGROK_PID=$!

echo "📝 Ngrok started with PID: $NGROK_PID"

# Wait for ngrok to initialize
sleep 5

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL. Check ngrok.log for details."
    echo "📄 Ngrok log:"
    tail -10 /home/leky_reborn/charles-chiva-tutorhub-website/ngrok.log
    kill $NGROK_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Ngrok tunnel created: $NGROK_URL"

# Webhook endpoint
WEBHOOK_URL="${NGROK_URL}/api/intasend/webhook"

echo ""
echo "🪝 Your IntaSend webhook URL: $WEBHOOK_URL"
echo ""
echo "📋 Next steps:"
echo "   1. Copy this webhook URL and add it to your IntaSend dashboard"
echo "   2. Select the 'invoice.completed' event"
echo "   3. Test a payment flow to trigger webhooks"
echo "   4. Check webhook logs in your terminal"
echo ""
echo "🌐 Ngrok Web Interface: http://localhost:4040"
echo "🛑 To stop ngrok: kill $NGROK_PID"
echo ""
echo "📄 Monitoring ngrok logs (press Ctrl+C to stop monitoring):"

# Monitor ngrok logs
tail -f /home/leky_reborn/charles-chiva-tutorhub-website/ngrok.log &
TAIL_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping ngrok..."
    kill $NGROK_PID 2>/dev/null || true
    kill $TAIL_PID 2>/dev/null || true
    echo "✅ Cleanup complete"
    exit 0
}

# Set up trap to cleanup on Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
