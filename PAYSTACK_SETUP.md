# Paystack Payment Integration

Paystack is implemented as a hosted-checkout redirect flow for pricing plans and paid resource downloads.

## Environment Variables

Add these to `.env.local` / deployment env:

```bash
# Active payment provider: paystack or mpesa
ACTIVE_PAYMENT_PROVIDER=paystack

# Paystack secret key (server-side only)
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base URL used for Paystack callback redirects and webhook testing
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Notes:
- Use `sk_test_...` for testing and `sk_live_...` for production.
- Currency is fixed to `KES` in code; no `PAYSTACK_CURRENCY` env is required.
- No separate webhook signing secret is required; webhooks are verified with `PAYSTACK_SECRET_KEY` via `x-paystack-signature`.
- Hosted redirect does not require `PAYSTACK_PUBLIC_KEY` or the inline popup SDK.

## API Endpoints

- `POST /api/paystack/transaction/initialize` — creates a Paystack checkout session for `type: "plan"` or `type: "resource"` and returns `authorizationUrl`.
- `GET /api/paystack/transaction/verify?reference=...` — verifies a transaction with Paystack and completes the local payment record.
- `POST /api/paystack/webhook` — handles Paystack webhook events, currently `charge.success` and `charge.failed`.
- `POST /api/resources/[resourceId]/download-token` — issues a JWT download token after a completed payment is found.

## Callback URLs

The initialize route sets per-transaction callback URLs:

- Plans: `/pricing/success?provider=paystack`
- Resources: `/resources/[resourceId]?provider=paystack`

Paystack appends `reference=...` to the callback URL. The app must verify the reference server-side before granting access; visiting the callback URL alone is not proof of payment.

## Webhook Setup

1. In the Paystack dashboard, add webhook URL: `https://your-domain.com/api/paystack/webhook`
2. Subscribe to `charge.success` and optionally `charge.failed`.
3. For local testing, expose the app with ngrok and set `NEXT_PUBLIC_SITE_URL` to the ngrok URL, then use `https://<ngrok-url>/api/paystack/webhook` in Paystack test mode.

The webhook route reads the raw request body and verifies `x-paystack-signature` using `PAYSTACK_SECRET_KEY` before processing.

## Testing

Paystack test card:

- Card: `4084 0840 4084 0840`
- Expiry: any future date
- CVV: any 3 digits
- PIN/OTP: follow the test checkout prompts

Test both flows:

1. Pricing plan purchase → should create a completed `Payment` and show `/pricing/success`.
2. Paid resource purchase → should create a completed `Payment` with `resourceId`, issue a download JWT, and download the file.

## Switching Providers

- `ACTIVE_PAYMENT_PROVIDER=paystack` shows Paystack checkout only.
- `ACTIVE_PAYMENT_PROVIDER=mpesa` shows the existing M-Pesa STK flow only.
- M-Pesa credentials remain configured with the existing `MPESA_*` variables when re-enabled.
