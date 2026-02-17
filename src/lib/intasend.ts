const IntaSend = require('intasend-node');

const secretKey = process.env.INTASEND_SECRET_KEY;
const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY;

if (!secretKey || !publishableKey) {
  throw new Error("IntaSend credentials are not set (INTASEND_SECRET_KEY / INTASEND_PUBLISHABLE_KEY)");
}

// Initialize IntaSend client
const intasend = new IntaSend(
  publishableKey,
  secretKey,
  process.env.NODE_ENV !== "production" // Test mode in development
);

export async function createCheckout(payload: {
  amount: number;
  currency: string;
  email: string;
  first_name?: string;
  last_name?: string;
  callback_url: string;
  webhook?: string;
  comment?: string;
}) {
  try {
    console.log("🔧 IntaSend API: Creating checkout link with payload:", payload);
    
    // Use Checkout Link API directly (not SDK charge method)
    const axios = require('axios');
    const isTest = process.env.NODE_ENV !== "production";
    const baseUrl = isTest ? "https://sandbox.intasend.com/api/v1/checkout/" : "https://payment.intasend.com/api/v1/checkout/";
    
    const checkoutPayload = {
      public_key: process.env.INTASEND_PUBLISHABLE_KEY,
      amount: payload.amount,
      currency: payload.currency,
      email: payload.email,
      first_name: payload.first_name || "",
      last_name: payload.last_name || "",
      redirect_url: payload.callback_url,
      webhook_url: payload.webhook,
      comment: payload.comment,
    };
    
    console.log("📤 Sending request to:", baseUrl);
    console.log("📦 Request payload:", checkoutPayload);
    
    const response = await axios.post(baseUrl, checkoutPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ IntaSend API: Checkout response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ IntaSend create checkout error:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data
    });
    throw error;
  }
}

export async function checkStatus(invoiceId: string) {
  try {
    const collection = intasend.collection();
    const response = await collection.status(invoiceId);
    return response;
  } catch (error: any) {
    console.error("IntaSend check status error:", error);
    throw error;
  }
}

export function verifyWebhookSignature(payload: any, signature: string, webhookSecret?: string): boolean {
  const crypto = require('crypto');
  const secret = webhookSecret || process.env.INTASEND_WEBHOOK_SECRET;
  
  // If no secret is configured, skip verification (for development)
  if (!secret) {
    console.warn("⚠️ IntaSend webhook secret not set - skipping signature verification");
    return true;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error("IntaSend webhook signature verification error:", error);
    return false;
  }
}

export function extractMetadata(comment?: string): any {
  if (!comment) return null;
  
  try {
    return JSON.parse(comment);
  } catch (error) {
    console.error("Error parsing IntaSend metadata:", error);
    return null;
  }
}
