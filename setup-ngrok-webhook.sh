#!/bin/bash

# IntaSend Webhook Testing Setup with ngrok

echo "🚀 Setting up IntaSend webhook testing with ngrok..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok not found. Please install ngrok first:"
    echo "   1. Download from: https://ngrok.com/download"
    echo "   2. Or install with: sudo apt install ngrok (Ubuntu/Debian)"
    echo "   3. Or install with: brew install ngrok (macOS)"
    exit 1
fi

echo "✅ ngrok found"

# Start ngrok tunnel for port 3000
echo "🔗 Starting ngrok tunnel for localhost:3000..."

# Kill any existing ngrok processes
pkill ngrok 2>/dev/null || true

# Start ngrok in background
ngrok http 3000 --log=stdout > ngrok.log 2>&1 &
NGROK_PID=$!

echo "📝 Ngrok started with PID: $NGROK_PID"

# Wait for ngrok to start
sleep 5

# Get the ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL. Check ngrok.log for details."
    kill $NGROK_PID
    exit 1
fi

echo "✅ Ngrok tunnel created: $NGROK_URL"

# Webhook endpoint
WEBHOOK_URL="${NGROK_URL}/api/intasend/webhook"

echo "🪝 Your IntaSend webhook URL: $WEBHOOK_URL"
echo ""
echo "📋 Next steps:"
echo "   1. Copy this webhook URL and add it to your IntaSend dashboard"
echo "   2. Test a payment flow to trigger webhooks"
echo "   3. Check webhook logs in your terminal and ngrok web interface"
echo ""
echo "🌐 Ngrok Web Interface: http://localhost:4040"
echo "🛑 To stop ngrok: kill $NGROK_PID"
echo ""
echo "📄 Monitoring ngrok logs (press Ctrl+C to stop monitoring):"

# Monitor ngrok logs
tail -f ngrok.log &
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
