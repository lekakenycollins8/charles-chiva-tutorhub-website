const axios = require('axios');

// Environment variables
const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_BUSINESS_SHORTCODE = process.env.MPESA_BUSINESS_SHORTCODE;
const MPESA_TILL_NUMBER = process.env.MPESA_TILL_NUMBER;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

// Base URLs
const SANDBOX_BASE_URL = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_BASE_URL = 'https://api.safaricom.co.ke';

const getBaseUrl = () => {
  return MPESA_ENVIRONMENT === 'production' ? PRODUCTION_BASE_URL : SANDBOX_BASE_URL;
};

// Get transaction type based on environment and whether we have a till number
const getTransactionType = () => {
  // Production with Till Number uses CustomerBuyGoodsOnline
  if (MPESA_ENVIRONMENT === 'production' && MPESA_TILL_NUMBER) {
    return 'CustomerBuyGoodsOnline';
  }
  // Sandbox or Paybill uses CustomerPayBillOnline
  return 'CustomerPayBillOnline';
};

// Generate OAuth access token
export async function generateAccessToken() {
  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    console.error("❌ MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET not set");
    console.error("❌ MPESA_CONSUMER_KEY:", MPESA_CONSUMER_KEY ? `${MPESA_CONSUMER_KEY.substring(0, 7)}...` : 'NOT SET');
    console.error("❌ MPESA_CONSUMER_SECRET:", MPESA_CONSUMER_SECRET ? `${MPESA_CONSUMER_SECRET.substring(0, 7)}...` : 'NOT SET');
    throw new Error("Mpesa credentials not configured");
  }

  try {
    console.log("🔧 Mpesa API: Generating access token");
    console.log("🔧 Environment:", MPESA_ENVIRONMENT);
    console.log("🔧 Base URL:", getBaseUrl());
    console.log("🔧 Consumer Key (first 10 chars):", MPESA_CONSUMER_KEY.substring(0, 10) + '...');
    console.log("🔧 Consumer Secret (first 10 chars):", MPESA_CONSUMER_SECRET.substring(0, 10) + '...');
    console.log("🔧 Consumer Key length:", MPESA_CONSUMER_KEY.length);
    console.log("🔧 Consumer Secret length:", MPESA_CONSUMER_SECRET.length);

    const authString = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
    const auth = Buffer.from(authString).toString('base64');
    console.log("🔧 Auth string (first 20 chars):", authString.substring(0, 20) + '...');
    console.log("🔧 Auth header (first 20 chars):", auth.substring(0, 20) + '...');

    const response = await axios.get(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const accessToken = response.data.access_token;
    console.log("✅ Mpesa API: Access token generated successfully");
    return accessToken;
  } catch (error: any) {
    console.error("❌ Mpesa OAuth error:");
    console.error("❌ Status:", error?.response?.status);
    console.error("❌ Status Text:", error?.response?.statusText);
    console.error("❌ Error Data:", JSON.stringify(error?.response?.data, null, 2));
    console.error("❌ Error Message:", error?.message);
    console.error("❌ Request URL:", `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`);
    console.error("❌ Request Headers:", error?.request?.getHeaders ? error.request.getHeaders() : 'N/A');
    throw new Error(error?.response?.data?.errorMessage || error?.message || 'Failed to generate Mpesa access token');
  }
}

// Generate password for STK push (Base64 encoded shortcode + passkey + timestamp)
export function generatePassword() {
  if (!MPESA_BUSINESS_SHORTCODE || !MPESA_PASSKEY) {
    console.error("❌ MPESA_BUSINESS_SHORTCODE or MPESA_PASSKEY not set");
    throw new Error("Mpesa credentials not configured");
  }

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  const password = Buffer.from(`${MPESA_BUSINESS_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
  return { password, timestamp };
}

// Normalize phone number to Mpesa format (2547XXXXXXXX)
export function normalizePhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // If starts with 0, replace with 254
  if (cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  }

  // If starts with 7 (assuming Kenyan number), add 254
  if (cleaned.startsWith('7') && cleaned.length === 9) {
    return '254' + cleaned;
  }

  // If already starts with 254, return as is
  if (cleaned.startsWith('254')) {
    return cleaned;
  }

  // Default: return as is (might be invalid)
  return cleaned;
}

// Initiate STK Push payment
export async function initiateSTKPush(params: {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}) {
  try {
    console.log("🔧 Mpesa API: Initiating STK push");
    console.log("🔧 Parameters:", { ...params, phoneNumber: params.phoneNumber.substring(0, 6) + '***' });

    const accessToken = await generateAccessToken();
    const { password, timestamp } = generatePassword();

    const normalizedPhone = normalizePhoneNumber(params.phoneNumber);
    console.log("🔧 Normalized phone number:", normalizedPhone.substring(0, 6) + '***');

    // Determine PartyB (use Till Number in production with Till, otherwise use shortcode)
    const partyB = MPESA_ENVIRONMENT === 'production' && MPESA_TILL_NUMBER
      ? MPESA_TILL_NUMBER
      : MPESA_BUSINESS_SHORTCODE;

    const payload = {
      BusinessShortCode: MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: getTransactionType(),
      Amount: params.amount,
      PartyA: normalizedPhone,
      PartyB: partyB,
      PhoneNumber: normalizedPhone,
      CallBackURL: MPESA_CALLBACK_URL,
      AccountReference: params.accountReference,
      TransactionDesc: params.transactionDesc,
    };

    console.log("🔧 STK Push payload:", {
      ...payload,
      Password: '***',
      PartyA: normalizedPhone.substring(0, 6) + '***',
      PhoneNumber: normalizedPhone.substring(0, 6) + '***',
    });

    const response = await axios.post(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Mpesa API: STK push initiated successfully");
    console.log("✅ Response:", response.data);

    return {
      success: true,
      merchantRequestID: response.data.MerchantRequestID,
      checkoutRequestID: response.data.CheckoutRequestID,
      responseCode: response.data.ResponseCode,
      responseDescription: response.data.ResponseDescription,
      customerMessage: response.data.CustomerMessage,
    };
  } catch (error: any) {
    console.error("❌ Mpesa STK push error:");
    console.error("❌ Status:", error?.response?.status);
    console.error("❌ Status Text:", error?.response?.statusText);
    console.error("❌ Error Data:", JSON.stringify(error?.response?.data, null, 2));
    console.error("❌ Error Message:", error?.message);

    throw new Error(error?.response?.data?.errorMessage || error?.message || 'Failed to initiate STK push');
  }
}

// Query transaction status
export async function queryTransactionStatus(checkoutRequestID: string) {
  try {
    console.log("🔧 Mpesa API: Querying transaction status for:", checkoutRequestID);

    const accessToken = await generateAccessToken();
    const { password, timestamp } = generatePassword();

    const payload = {
      BusinessShortCode: MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const response = await axios.post(`${getBaseUrl()}/mpesa/stkpushquery/v1/query`, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("✅ Mpesa API: Transaction status queried successfully");
    return response.data;
  } catch (error: any) {
    console.error("❌ Mpesa query transaction status error:", error?.response?.data || error);
    throw new Error('Failed to query transaction status');
  }
}

// Verify callback signature (for production security)
export function verifyCallbackSignature(payload: any, signature: string): boolean {
  // In production, you should verify the signature using your credentials
  // For now, we'll skip this in sandbox
  if (MPESA_ENVIRONMENT === 'sandbox') {
    console.log("⚠️ Skipping signature verification in sandbox");
    return true;
  }

  // TODO: Implement signature verification for production
  // The signature is typically a hash of the payload using your credentials
  console.warn("⚠️ Signature verification not implemented for production");
  return true;
}

// Extract metadata from callback
export function extractCallbackMetadata(callbackData: any) {
  try {
    const stkCallback = callbackData.Body?.stkCallback;

    if (!stkCallback) {
      return null;
    }

    const metadata: any = {
      merchantRequestID: stkCallback.MerchantRequestID,
      checkoutRequestID: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc,
    };

    // Extract callback metadata if payment was successful
    if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const items = stkCallback.CallbackMetadata.Item;
      items.forEach((item: any) => {
        metadata[item.Name] = item.Value;
      });
    }

    return metadata;
  } catch (error) {
    console.error("Error extracting callback metadata:", error);
    return null;
  }
}
