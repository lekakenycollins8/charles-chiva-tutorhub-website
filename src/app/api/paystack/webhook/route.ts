import { NextResponse } from "next/server";
import { toPaystackAmount, verifyWebhookSignature } from "@/lib/paystack";
import {
  getCheckoutMetadataRecord,
  updateCheckoutMetadataByCheckoutId,
} from "@/lib/checkout-metadata-db";
import {
  processSuccessfulPayment,
  recordFailedPayment,
  type PaymentCheckoutMetadata,
} from "@/lib/payment-fulfillment";

type PaystackWebhookTransaction = {
  id?: number;
  status?: string;
  reference?: string;
  amount?: number;
  currency?: string;
  channel?: string;
  paid_at?: string;
  gateway_response?: string;
  authorization?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event?.event as string | undefined;
    const transaction = event?.data as PaystackWebhookTransaction | undefined;
    const reference = transaction?.reference as string | undefined;

    if (!reference) {
      return NextResponse.json({ received: true });
    }

    const checkout = await getCheckoutMetadataRecord(reference);
    const metadata = (checkout?.metadata ?? transaction?.metadata) as unknown as PaymentCheckoutMetadata | undefined;

    if (!metadata?.type) {
      console.error("Paystack webhook missing checkout metadata", { reference, eventType });
      return NextResponse.json({ received: true });
    }

    const amountMajor = checkout
      ? checkout.amount
      : Number(metadata.amount ?? (transaction?.amount == null ? NaN : transaction.amount / 100));
    const currency = checkout ? checkout.currency : String(metadata.currency || transaction?.currency || "KES");

    if (eventType === "charge.failed") {
      if (checkout) {
        await updateCheckoutMetadataByCheckoutId(checkout.checkoutId, checkout.invoiceId, "FAILED");
      }
      await recordFailedPayment({
        provider: "paystack",
        reference,
        amount: Number.isFinite(amountMajor) ? amountMajor : 0,
        currency,
        metadata,
        transactionDetails: {
          id: transaction?.id,
          status: transaction?.status,
          channel: transaction?.channel,
          gateway_response: transaction?.gateway_response,
        },
      }).catch((err) => console.error("Failed to record Paystack webhook failure:", err));

      return NextResponse.json({ received: true });
    }

    if (eventType !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    if (
      transaction?.status !== "success" ||
      !Number.isFinite(amountMajor) ||
      transaction?.amount !== toPaystackAmount(amountMajor) ||
      transaction?.currency !== currency
    ) {
      console.error("Paystack webhook payment validation failed", {
        reference,
        status: transaction?.status,
        expectedAmount: Number.isFinite(amountMajor) ? toPaystackAmount(amountMajor) : amountMajor,
        actualAmount: transaction?.amount,
        expectedCurrency: currency,
        actualCurrency: transaction?.currency,
      });
      return NextResponse.json({ received: true });
    }

    await processSuccessfulPayment({
      provider: "paystack",
      reference,
      amount: amountMajor,
      currency,
      metadata,
      transactionDetails: {
        id: transaction?.id,
        status: transaction?.status,
        channel: transaction?.channel,
        paid_at: transaction?.paid_at,
        gateway_response: transaction?.gateway_response,
        authorization: transaction?.authorization,
      },
    });

    if (checkout) {
      await updateCheckoutMetadataByCheckoutId(checkout.checkoutId, checkout.invoiceId, "COMPLETED");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
