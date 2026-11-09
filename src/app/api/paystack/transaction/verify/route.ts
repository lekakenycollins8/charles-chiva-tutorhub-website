import { NextResponse } from "next/server";
import { getCheckoutMetadataRecord, updateCheckoutMetadataByCheckoutId } from "@/lib/checkout-metadata-db";
import { toPaystackAmount, verifyTransaction } from "@/lib/paystack";
import {
  processSuccessfulPayment,
  recordFailedPayment,
  type PaymentCheckoutMetadata,
} from "@/lib/payment-fulfillment";

function mapPaystackStatus(status: string) {
  if (status === "success") return "success";
  if (["failed", "abandoned", "reversed"].includes(status)) return "failed";
  return "pending";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json({ error: "reference is required" }, { status: 400 });
    }

    const checkout = await getCheckoutMetadataRecord(reference);
    if (!checkout) {
      return NextResponse.json({ status: "error", message: "Payment session not found" }, { status: 404 });
    }

    const transaction = await verifyTransaction(reference);
    const mappedStatus = mapPaystackStatus(transaction.status);
    const metadata = checkout.metadata as PaymentCheckoutMetadata;

    if (mappedStatus !== "success") {
      if (mappedStatus === "failed") {
        await updateCheckoutMetadataByCheckoutId(checkout.checkoutId, checkout.invoiceId, "FAILED");
        await recordFailedPayment({
          provider: "paystack",
          reference,
          amount: checkout.amount,
          currency: checkout.currency,
          metadata,
          transactionDetails: {
            id: transaction.id,
            status: transaction.status,
            channel: transaction.channel,
            gateway_response: transaction.gateway_response,
          },
        }).catch((err) => console.error("Failed to record Paystack failed payment:", err));
      }

      return NextResponse.json({ status: mappedStatus, reference, paymentMethod: "paystack" });
    }

    const expectedAmount = toPaystackAmount(checkout.amount);
    if (transaction.amount !== expectedAmount || transaction.currency !== checkout.currency) {
      console.error("Paystack payment mismatch", {
        reference,
        expectedAmount,
        actualAmount: transaction.amount,
        expectedCurrency: checkout.currency,
        actualCurrency: transaction.currency,
      });
      return NextResponse.json(
        { status: "error", message: "Payment amount or currency mismatch" },
        { status: 409 }
      );
    }

    await processSuccessfulPayment({
      provider: "paystack",
      reference,
      amount: checkout.amount,
      currency: checkout.currency,
      metadata,
      transactionDetails: {
        id: transaction.id,
        status: transaction.status,
        channel: transaction.channel,
        paid_at: transaction.paid_at,
        gateway_response: transaction.gateway_response,
        authorization: transaction.authorization,
      },
    });

    await updateCheckoutMetadataByCheckoutId(checkout.checkoutId, checkout.invoiceId, "COMPLETED");

    return NextResponse.json({ status: "success", reference, paymentMethod: "paystack" });
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    console.error("Paystack verify error:", axiosError.response?.data || error);
    return NextResponse.json(
      { status: "error", message: axiosError.response?.data?.message || "Failed to verify Paystack payment" },
      { status: axiosError.response?.status || 500 }
    );
  }
}
