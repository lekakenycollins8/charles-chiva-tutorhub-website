# Paystack Payment Integration Guide

## Overview

This document provides a comprehensive guide for implementing Paystack payment processing in a Next.js application with TypeScript. It's designed to help coding assistants implement the integration through a single prompt, replacing an existing Stripe implementation with Paystack.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Implementation](#backend-implementation)
   - [Paystack Library](#paystack-library)
   - [Initialize Transaction Endpoint](#initialize-transaction-endpoint)
   - [Webhook Handler](#webhook-handler)
4. [Frontend Implementation](#frontend-implementation)
   - [Payment Button Component](#payment-button-component)
   - [Handling Successful Payments](#handling-successful-payments)
5. [Currency Display Updates](#currency-display-updates)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Migration Checklist](#migration-checklist)

## Prerequisites

- Next.js application with TypeScript
- Existing payment flow (e.g., Stripe) to be replaced
- Paystack account with API keys
- Basic understanding of server actions or API routes

## Environment Setup

Add the following environment variables to your `.env.local` file:

```
PAYSTACK_SECRET_KEY=your_secret_key
PAYSTACK_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_SITE_URL=your_site_url
```

## Backend Implementation

### Paystack Library

Create a utility file for Paystack API interactions:

```typescript
// src/lib/paystack.ts
import axios from 'axios';

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set');
}

// Create a configured instance of axios for Paystack API calls
export const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Helper functions for Paystack operations
export const paystack = {
  // Initialize a transaction
  initializeTransaction: async (data: {
    email: string;
    amount: number; // amount in kobo (smallest currency unit)
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }) => {
    const response = await paystackAPI.post('/transaction/initialize', data);
    return response.data;
  },

  // Verify a transaction
  verifyTransaction: async (reference: string) => {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    return response.data;
  },

  // Get transaction details
  getTransaction: async (id: number) => {
    const response = await paystackAPI.get(`/transaction/${id}`);
    return response.data;
  }
};
```

### Initialize Transaction Endpoint

Create an API route to initialize Paystack transactions:

```typescript
// src/app/api/paystack/initialize/route.ts
import { NextResponse } from "next/server";
import { paystack } from "@/lib/paystack";
import { generateDownloadToken } from "@/lib/auth-utils"; // Adjust based on your token generation method
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { resourceId, price, email } = await request.json();
    
    if (!resourceId || !price || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Generate a download token or access token
    const token = await generateDownloadToken(resourceId);
    
    // Generate a unique reference for this transaction
    const reference = `resource_${resourceId}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Create Paystack transaction
    const response = await paystack.initializeTransaction({
      email,
      amount: Math.round(price * 100), // Convert to kobo (smallest currency unit)
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/resources/${resourceId}?payment=success&token=${token}`,
      metadata: {
        resourceId,
        token,
        custom_fields: [
          {
            display_name: "Resource ID",
            variable_name: "resource_id",
            value: resourceId
          }
        ]
      }
    });
    
    return NextResponse.json({ 
      authorization_url: response.data.authorization_url,
      access_code: response.data.access_code,
      reference: response.data.reference
    });
  } catch (error: any) {
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Webhook Handler

Create a webhook handler to process Paystack payment confirmations:

```typescript
// src/app/api/paystack/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { incrementDownloadCount } from "@/lib/actions/resource-actions"; // Adjust based on your post-payment actions

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === "charge.success") {
      const data = event.data;
      const metadata = data.metadata;
      
      // Process the successful payment
      // For example, increment download count, grant access, etc.
      if (metadata && metadata.resourceId) {
        await incrementDownloadCount(metadata.resourceId);
        // Add any other post-payment actions here
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
```

## Frontend Implementation

### Payment Button Component

Update or create a payment button component that integrates with Paystack:

```tsx
// src/components/resources/PaymentButton.tsx
'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface PaymentButtonProps {
  resourceId: string;
  price: number | null;
  isPaid: boolean;
  userEmail?: string;
  className?: string;
}

export default function PaymentButton({ 
  resourceId, 
  price,
  isPaid,
  userEmail,
  className 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check for token in URL on component mount
    const token = searchParams.get('token');
    const paymentStatus = searchParams.get('payment');
    
    if (token && paymentStatus === 'success') {
      // Store the token in localStorage for future use
      localStorage.setItem(`payment-token-${resourceId}`, token);
      setHasValidToken(true);
      
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());
    } else if (localStorage.getItem(`payment-token-${resourceId}`)) {
      setHasValidToken(true);
    }
  }, [resourceId, searchParams]);

  const handlePayment = async () => {
    if (isPaid && !hasValidToken) {
      // Initiate Paystack checkout
      setLoading(true);
      try {
        // Check if user email is available
        const email = userEmail || prompt('Please enter your email address to continue with payment:');
        
        if (!email) {
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            price,
            email
          }),
        });
        
        const { authorization_url } = await response.json();
        
        // Redirect to Paystack payment page
        window.location.href = authorization_url;
      } catch (error) {
        console.error('Payment initialization error:', error);
        setLoading(false);
      }
    } else {
      // Handle already purchased resources
      // Implement your access logic here
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {isPaid && !hasValidToken ? 'Purchase Now' : 'Access Content'}
        </>
      )}
    </button>
  );
}
```

### Handling Successful Payments

Implement logic to handle successful payments and grant access to paid content:

```typescript
// src/lib/actions/payment-actions.ts
import { paystack } from "@/lib/paystack";
import { prisma } from "@/lib/db";

export async function verifyPayment(reference: string) {
  try {
    const verification = await paystack.verifyTransaction(reference);
    
    if (verification.data.status === "success") {
      const metadata = verification.data.metadata;
      
      // Record the payment in your database
      await prisma.payment.create({
        data: {
          amount: verification.data.amount / 100, // Convert from kobo to main currency
          reference: verification.data.reference,
          email: verification.data.customer.email,
          resourceId: metadata.resourceId,
          status: "completed"
        }
      });
      
      // Grant access to the resource
      // This depends on your application's access control mechanism
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Payment verification error:", error);
    return false;
  }
}
```

## Currency Display Updates

Update all currency displays to show USD ($) instead of other currencies:

```tsx
// Example of currency formatting in components
{resource.isPaid ? `$${resource.price}` : 'Free'}
```

Create a utility function for consistent currency formatting:

```typescript
// src/lib/utils.ts
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Free';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Usage in components:
// import { formatCurrency } from "@/lib/utils";
// ...
// {formatCurrency(resource.price)}
```

## Testing

### Test Accounts and Cards

Paystack provides test cards for development:

```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry Date: Any future date
PIN: 0000
OTP: 123456
```

### Testing Workflow

1. Set up your application with test API keys
2. Create a test purchase flow
3. Complete a test transaction using the test cards
4. Verify webhook handling (use ngrok for local testing)
5. Confirm that access is granted after payment

## Production Deployment

### Preparation Checklist

1. Switch from test to live Paystack API keys
2. Update webhook URL in your Paystack dashboard
3. Implement proper error handling and logging
4. Set up monitoring for payment flows
5. Test the complete payment flow in production environment

## Migration Checklist

When migrating from another payment provider (e.g., Stripe) to Paystack:

1. ✅ Replace API keys and environment variables
2. ✅ Create Paystack library and API endpoints
3. ✅ Update frontend components to use Paystack
4. ✅ Set up webhook handling for Paystack events
5. ✅ Update currency display to USD ($) throughout the application
6. ✅ Test the complete payment flow
7. ✅ Deploy to production

### Key Differences Between Stripe and Paystack

1. **API Structure**:
   - Stripe uses sessions for checkout
   - Paystack uses transaction initialization

2. **Webhook Events**:
   - Stripe: `checkout.session.completed`
   - Paystack: `charge.success`

3. **Currency Handling**:
   - Stripe: Amount in cents (smallest unit)
   - Paystack: Amount in kobo (smallest unit)

4. **Integration Methods**:
   - Stripe: Redirect or Elements
   - Paystack: Redirect, inline, or popup

5. **Response Format**:
   - Stripe returns `sessionId`
   - Paystack returns `authorization_url`, `access_code`, and `reference`
