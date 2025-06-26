# Chiva TutorHub Stripe Integration Plan

This document outlines the plan for integrating Stripe payment processing into the Chiva TutorHub website for handling payments for premium resources and tutoring services.

## Stripe Integration Overview

The Chiva TutorHub website will use Stripe to process payments for:
1. Premium educational resources (PDFs, study materials, etc.)
2. Tutoring service packages (Basic, Standard, Premium)

## Technology Stack

- **Stripe.js and Elements** for secure payment form UI
- **Stripe API** for server-side payment processing
- **Next.js API Routes** for secure backend implementation
- **MongoDB** for storing payment records

## Implementation Plan

### 1. Stripe Account Setup

- Create a Stripe account for Chiva TutorHub
- Configure account settings (business information, payout methods)
- Set up webhook endpoints for payment events
- Generate API keys (publishable and secret)

### 2. Environment Configuration

```
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Client-Side Implementation

#### Payment Form Component

```jsx
// components/checkout/PaymentForm.jsx
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentForm({ amount, resourceId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  
  // Get payment intent on component mount
  useEffect(() => {
    async function getPaymentIntent() {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, resourceId }),
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    }
    
    getPaymentIntent();
  }, [amount, resourceId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: e.target.name.value,
          email: e.target.email.value,
        },
      },
    });
    
    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="mt-1 p-3 border rounded-md shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {processing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}
```

#### Stripe Provider Setup

```jsx
// components/checkout/StripeProvider.jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

#### Checkout Page

```jsx
// pages/checkout/[resourceId].jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StripeProvider from '@/components/checkout/StripeProvider';
import PaymentForm from '@/components/checkout/PaymentForm';

export default function CheckoutPage() {
  const router = useRouter();
  const { resourceId } = router.query;
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);
  
  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`);
      const data = await response.json();
      setResource(data);
    } catch (error) {
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSuccess = (paymentIntent) => {
    // Redirect to success page with access to the resource
    router.push(`/resources/success?resource=${resourceId}&payment=${paymentIntent.id}`);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!resource) {
    return <div>Resource not found</div>;
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="font-semibold">{resource.title}</h2>
        <p className="text-gray-600">{resource.description}</p>
        <p className="text-lg font-bold mt-2">${resource.price.toFixed(2)}</p>
      </div>
      
      <StripeProvider>
        <PaymentForm
          amount={Math.round(resource.price * 100)} // Convert to cents for Stripe
          resourceId={resourceId}
          onSuccess={handlePaymentSuccess}
        />
      </StripeProvider>
    </div>
  );
}
```

### 4. Server-Side Implementation

#### Create Payment Intent API

```javascript
// pages/api/create-payment-intent.js
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { amount, resourceId } = req.body;
    
    // Verify the resource exists and the amount is correct
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    if (Math.round(resource.price * 100) !== amount) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        resourceId,
      },
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
}
```

#### Webhook Handler

```javascript
// pages/api/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Record the payment in the database
    await prisma.payment.create({
      data: {
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: 'completed',
        customerEmail: paymentIntent.receipt_email || '',
        resourceId: paymentIntent.metadata.resourceId,
        stripePaymentId: paymentIntent.id,
      },
    });
    
    // You could also update the resource download count or other metrics here
  }
  
  res.status(200).json({ received: true });
}
```

#### Payment Success Handler

```javascript
// pages/api/payment-success.js
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { resourceId, paymentId } = req.query;
    
    // Verify the payment exists and is successful
    const payment = await prisma.payment.findFirst({
      where: {
        resourceId,
        stripePaymentId: paymentId,
        status: 'completed',
      },
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found or not completed' });
    }
    
    // Get the resource details
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Increment the download count
    await prisma.resource.update({
      where: { id: resourceId },
      data: { downloads: { increment: 1 } },
    });
    
    // Return the resource details and download URL
    res.status(200).json({
      resource: {
        id: resource.id,
        title: resource.title,
        fileUrl: resource.fileUrl,
      },
    });
  } catch (error) {
    console.error('Error processing payment success:', error);
    res.status(500).json({ message: 'Error processing payment success' });
  }
}
```

### 5. Success and Error Pages

#### Success Page

```jsx
// pages/resources/success.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SuccessPage() {
  const router = useRouter();
  const { resource, payment } = router.query;
  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (resource && payment) {
      fetchPaymentSuccess();
    }
  }, [resource, payment]);
  
  const fetchPaymentSuccess = async () => {
    try {
      const response = await fetch(`/api/payment-success?resourceId=${resource}&paymentId=${payment}`);
      const data = await response.json();
      setResourceData(data.resource);
    } catch (error) {
      console.error('Error fetching payment success:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!resourceData) {
    return <div>Error loading resource</div>;
  }
  
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="mb-6">
        <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase.</p>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="font-semibold">{resourceData.title}</h2>
        <a
          href={resourceData.fileUrl}
          download
          className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download Resource
        </a>
      </div>
      
      <Link href="/resources" className="text-blue-500 hover:underline">
        Browse more resources
      </Link>
    </div>
  );
}
```

### 6. Service Package Payments

For tutoring service packages, a similar approach will be used but with different product types in Stripe:

```javascript
// pages/api/create-service-payment.js
import Stripe from 'stripe';
import { pricingPlans } from '@/data/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { planName, customerName, customerEmail } = req.body;
    
    // Find the selected plan
    const plan = pricingPlans.find(p => p.name === planName);
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Parse the price (removing '/hr', '/week', or '/month')
    const price = parseFloat(plan.price.split('/')[0]) * 100; // Convert to cents
    
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      metadata: {
        planName,
        customerName,
      },
      receipt_email: customerEmail,
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating service payment:', error);
    res.status(500).json({ message: 'Error creating service payment' });
  }
}
```

## Testing Plan

1. **Test in Development Mode**
   - Use Stripe test cards to simulate successful and failed payments
   - Verify webhook handling for various payment events
   - Test error handling and edge cases

2. **Test Payment Flows**
   - Resource purchase flow
   - Service package purchase flow
   - Error handling and validation

3. **Test Integration Points**
   - Verify database records are created correctly
   - Ensure access to paid resources works properly
   - Test email receipts and notifications

## Security Considerations

1. **PCI Compliance**
   - Use Stripe Elements to avoid handling card data directly
   - Ensure HTTPS is enabled for all payment pages

2. **API Security**
   - Store API keys securely in environment variables
   - Validate all inputs on server-side
   - Implement proper error handling

3. **Webhook Security**
   - Verify webhook signatures
   - Implement idempotency to prevent duplicate processing

## Deployment Considerations

1. **Environment Variables**
   - Set up proper environment variables for production
   - Use different Stripe API keys for development and production

2. **Webhook Configuration**
   - Update webhook URL in Stripe dashboard for production
   - Generate new webhook secret for production

3. **Testing in Production**
   - Perform end-to-end testing in production environment
   - Monitor initial transactions closely
