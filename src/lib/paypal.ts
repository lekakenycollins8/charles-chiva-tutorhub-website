import axios from "axios";

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const baseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

if (!clientId || !clientSecret) {
  throw new Error("PayPal credentials are not set (PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)");
}

// Simple in-memory token cache per runtime
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60_000) {
    return cachedAccessToken.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await axios.post(
    `${baseUrl}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, expires_in } = response.data;
  cachedAccessToken = {
    token: access_token,
    expiresAt: now + (expires_in - 60) * 1000,
  };

  return access_token;
}

export async function createOrder(payload: any) {
  const token = await getAccessToken();
  const response = await axios.post(`${baseUrl}/v2/checkout/orders`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

export async function captureOrder(orderId: string) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

export function getApprovalLink(order: any): string | null {
  const link = order?.links?.find((l: any) => l.rel === "approve");
  return link?.href || null;
}

export async function verifyWebhookSignature(params: {
  authAlgo: string;
  certUrl: string;
  transmissionId: string;
  transmissionSig: string;
  transmissionTime: string;
  webhookId: string;
  webhookEvent: any;
}) {
  const token = await getAccessToken();
  const response = await axios.post(
    `${baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      auth_algo: params.authAlgo,
      cert_url: params.certUrl,
      transmission_id: params.transmissionId,
      transmission_sig: params.transmissionSig,
      transmission_time: params.transmissionTime,
      webhook_id: params.webhookId,
      webhook_event: params.webhookEvent,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
