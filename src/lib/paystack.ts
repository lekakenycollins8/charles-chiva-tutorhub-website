const axios = require('axios');

const getSecretKey = () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("❌ PAYSTACK_SECRET_KEY environment variable is not set");
    console.error("❌ Please add PAYSTACK_SECRET_KEY to your .env.local file");
    console.error("❌ Get your keys from: https://paystack.com/dashboard/settings/api");
    return null;
  }
  return secretKey;
};

const baseUrl = "https://api.paystack.co";

export async function initializeTransaction(payload: {
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: any;
  plan?: string;
  channels?: string[];
}) {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error("Paystack secret key is not configured");
  }

  try {
    console.log("🔧 Paystack API: Initializing transaction with payload:", payload);
    
    const response = await axios.post(`${baseUrl}/transaction/initialize`, payload, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Paystack API: Transaction initialized:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Paystack initialize transaction error:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data
    });
    throw error;
  }
}

export async function verifyTransaction(reference: string) {
  const secretKey = getSecretKey();
  if (!secretKey) {
    throw new Error("Paystack secret key is not configured");
  }

  try {
    console.log("🔧 Paystack API: Verifying transaction with reference:", reference);
    
    const response = await axios.get(`${baseUrl}/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });
    
    console.log("✅ Paystack API: Transaction verified:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Paystack verify transaction error:", error);
    console.error("❌ Error details:", {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data
    });
    throw error;
  }
}

export function verifyWebhookSignature(payload: any, signature: string): boolean {
  const crypto = require('crypto');
  const secret = process.env.PAYSTACK_SECRET_KEY;
  
  if (!secret) {
    console.warn("⚠️ Paystack secret key not set - skipping signature verification");
    return true;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === expectedSignature;
  } catch (error) {
    console.error("Paystack webhook signature verification error:", error);
    return false;
  }
}

export function extractMetadata(metadata?: any): any {
  if (!metadata) return null;
  
  try {
    // Paystack metadata is already an object, not a string
    return typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
  } catch (error) {
    console.error("Error parsing Paystack metadata:", error);
    return null;
  }
}
