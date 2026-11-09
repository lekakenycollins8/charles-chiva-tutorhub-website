import axios from "axios";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_CURRENCY = "KES";

function requireSecretKey() {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("Paystack secret key not configured");
  }
  return PAYSTACK_SECRET_KEY;
}

export function toPaystackAmount(amount: number) {
  return Math.round(amount * 100);
}

export async function initializeTransaction({
  email,
  amount,
  reference,
  callbackUrl,
  metadata,
  channels,
}: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
  channels?: string[];
}) {
  const secretKey = requireSecretKey();

  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      email,
      amount: toPaystackAmount(amount),
      currency: PAYSTACK_CURRENCY,
      reference,
      callback_url: callbackUrl,
      metadata,
      ...(channels ? { channels } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data as {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function verifyTransaction(reference: string) {
  const secretKey = requireSecretKey();

  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  return response.data.data as {
    id: number;
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel?: string;
    paid_at?: string;
    metadata?: Record<string, unknown>;
    authorization?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  if (!PAYSTACK_SECRET_KEY || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");

  if (!/^[0-9a-f]{128}$/.test(signature) || !/^[0-9a-f]{128}$/.test(expected)) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
