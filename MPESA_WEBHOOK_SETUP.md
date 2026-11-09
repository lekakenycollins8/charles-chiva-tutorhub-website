# Mpesa Webhook Testing with Ngrok

This guide explains how to set up ngrok for testing Mpesa STK push callbacks locally.

## Prerequisites

- ngrok installed on your machine
- Local development server running
- Mpesa sandbox credentials configured in `.env.local`

## Step 1: Install Ngrok

### Using npm (recommended)
```bash
npm install -g ngrok
```

### Or download from ngrok.com
Visit https://ngrok.com/download and follow the installation instructions for your OS.

## Step 2: Start Your Development Server

```bash
npm run dev
```

Your server should be running on `http://localhost:3000`

## Step 3: Start Ngrok Tunnel

```bash
ngrok http 3000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

## Step 4: Update Environment Variables

Update your `.env.local` file with the ngrok URL:

```env
MPESA_BASE_URL="https://sandbox.safaricom.co.ke"
MPESA_CALLBACK_URL="https://abc123.ngrok-free.app/api/mpesa/callback"
MPESA_ENVIRONMENT="sandbox"
```

Replace `abc123.ngrok-free.app` with your actual ngrok URL. `MPESA_BASE_URL` is required and must point to the Daraja environment you are testing (`https://sandbox.safaricom.co.ke` for sandbox, `https://api.safaricom.co.ke` for production).

## Step 5: Restart Your Development Server

Stop the current server (Ctrl+C) and restart it to load the new environment variable:

```bash
npm run dev
```

## Step 6: Test Mpesa STK Push

1. Navigate to the pricing page
2. Select a plan and enter your phone number
3. Initiate payment
4. Check your phone for the Mpesa prompt
5. Enter your PIN (any PIN works in sandbox)
6. Watch the server logs for the callback

## Troubleshooting

### Ngrok URL Changes
Ngrok free tier changes the URL each time you restart it. Update your `.env.local` each time.

### Callback Not Received
- Check ngrok is still running
- Verify the callback URL in `.env.local` matches the ngrok URL
- Check server logs for any errors
- Ensure your phone number is in the correct format (07XX... or 2547XX...)

### Signature Verification
In sandbox mode, signature verification is skipped. In production, you'll need to implement proper signature verification.

## Production Deployment

For production:
1. Use your actual domain instead of ngrok
2. Update `MPESA_CALLBACK_URL` to your production domain
3. Set `MPESA_BASE_URL="https://api.safaricom.co.ke"`
4. Set `MPESA_ENVIRONMENT="production"`
5. Use production Mpesa credentials (`MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_BUSINESS_SHORTCODE`)
6. Ensure your domain has SSL/TLS configured
