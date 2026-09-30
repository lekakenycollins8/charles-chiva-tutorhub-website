# Paystack Payment Integration Setup

This document provides instructions for configuring Paystack payment integration in your application.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Getting Paystack API Keys

1. **Sign up for Paystack**: Go to [https://paystack.com](https://paystack.com) and create an account
2. **Navigate to Settings**: Go to Settings → API Keys
3. **Copy your keys**: You'll see both test and live keys
   - Use **Test keys** for development
   - Use **Live keys** for production

## Currency Configuration

The application defaults to **USD**. To use a different currency, add it to your `.env.local` file:

```bash
PAYSTACK_CURRENCY=USD
```

Paystack supports the following currencies depending on your account type:
- NGN (Nigerian Naira)
- GHS (Ghanaian Cedis)
- KES (Kenyan Shilling)
- ZAR (South African Rand)
- USD (US Dollars)

**Important**: Ensure your Paystack merchant account has the currency enabled. If you receive a "Currency not supported by merchant" error:
1. Check your Paystack dashboard to verify which currencies are enabled for your account
2. Contact Paystack support if the currency should be enabled
3. Use a currency that is already enabled on your account
4. Update your pricing values in `src/data/pricing.ts` to match the currency

## Webhook Configuration

1. **Set up your webhook URL**: In Paystack dashboard, go to Settings → Webhooks
2. **Add your webhook URL**: `https://your-domain.com/api/paystack/webhook`
3. **Select events**: Enable the following events:
   - `charge.success` - For successful payments
   - `charge.failed` - For failed payments (optional)

## Testing

### Test Mode
Paystack provides test mode with the following test card details:
- **Card Number**: `4084 0840 4084 0840`
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3-digit number (e.g., 123)
- **PIN**: Any 4-digit number (e.g., 1234)

### Test Scenarios
- **Successful payment**: Use valid test card details
- **Failed payment**: Use card number `4084 0840 4084 0841`
- **Insufficient funds**: Use card number `4084 0840 4084 0842`

## API Endpoints

The following Paystack API endpoints are implemented:

- **Initialize Transaction**: `POST /api/paystack/transaction/initialize`
- **Verify Transaction**: `POST /api/paystack/transaction/verify`
- **Webhook Handler**: `POST /api/paystack/webhook`

## Pricing

Current pricing plans (in KES):
- **Basic**: KES 1,300/hour
- **Standard**: KES 5,200/week
- **Premium**: KES 10,400/month

## Migration from IntaSend

If you're migrating from IntaSend:
1. Update environment variables (replace IntaSend keys with Paystack keys)
2. The database schema remains compatible
3. Existing payment records will continue to work
4. Webhook handling has been updated for Paystack's event structure

## Troubleshooting

### Webhook Not Receiving Events
- Ensure your webhook URL is publicly accessible
- Check Paystack dashboard for webhook delivery logs
- Verify your secret key matches the one in Paystack dashboard

### Transaction Verification Fails
- Ensure the reference is valid
- Check that the transaction was successful in Paystack dashboard
- Verify your secret key is correct

### Currency Issues
- Ensure `PAYSTACK_CURRENCY` matches your Paystack account's default currency
- Paystack may restrict certain currencies based on your account type

## Security Notes

- Never commit your secret keys to version control
- Use environment variables for all sensitive data
- Enable webhook signature verification in production
- Regularly rotate your API keys

## Support

For Paystack-specific issues:
- Paystack Documentation: https://paystack.com/docs
- Paystack Support: support@paystack.co
- Paystack Twitter: @paystack

For integration issues:
- Check the implementation in `/src/lib/paystack.ts`
- Review API endpoints in `/src/app/api/paystack/`
- Check webhook handler in `/src/app/api/paystack/webhook/route.ts`
