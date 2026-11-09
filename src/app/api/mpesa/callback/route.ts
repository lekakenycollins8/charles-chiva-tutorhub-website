import { NextResponse } from "next/server";
import { extractCallbackMetadata } from "@/lib/mpesa";
import {
  getCheckoutMetadataRecord,
  updateCheckoutMetadataByCheckoutId,
} from "@/lib/checkout-metadata-db";
import {
  processSuccessfulPayment,
  recordFailedPayment,
  type PaymentCheckoutMetadata,
} from "@/lib/payment-fulfillment";

export async function POST(request: Request) {
  console.log("🪝 Mpesa callback webhook received");

  try {
    const body = await request.json();
    const headers = request.headers;

    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    console.log("📋 Headers:", Object.fromEntries(headers.entries()));

    const callbackMetadata = extractCallbackMetadata(body);

    if (!callbackMetadata) {
      console.error("❌ Failed to extract callback metadata");
      return NextResponse.json({ received: true });
    }

    console.log("🎯 Callback metadata:", callbackMetadata);

    const { merchantRequestID, checkoutRequestID, resultCode, resultDesc } = callbackMetadata;

    if (!merchantRequestID || !checkoutRequestID) {
      console.error("❌ Missing merchantRequestID or checkoutRequestID");
      return NextResponse.json({ received: true });
    }

    const checkout = await getCheckoutMetadataRecord(merchantRequestID);

    if (!checkout) {
      console.error("❌ No metadata found for merchantRequestID:", merchantRequestID);
      return NextResponse.json({ received: true });
    }

    const typedMetadata = checkout.metadata as PaymentCheckoutMetadata;
    console.log("🏷️ Retrieved metadata:", typedMetadata);

    const status = resultCode === 0 ? "COMPLETED" : "FAILED";
    await updateCheckoutMetadataByCheckoutId(merchantRequestID, checkoutRequestID, status);

    const currency = checkout.currency || process.env.MPESA_CURRENCY || "KES";
    const transactionType =
      process.env.MPESA_ENVIRONMENT === "production" && process.env.MPESA_TILL_NUMBER
        ? "CustomerBuyGoodsOnline"
        : "CustomerPayBillOnline";

    if (resultCode === 0) {
      console.log("✅ Payment successful");

      const amount = Number(callbackMetadata.Amount) || checkout.amount || Number(typedMetadata.amount) || 0;
      const phoneNumber = callbackMetadata.PhoneNumber || typedMetadata.phoneNumber;
      const mpesaReceiptNumber = callbackMetadata.MpesaReceiptNumber;

      try {
        await processSuccessfulPayment({
          provider: "mpesa",
          reference: checkoutRequestID,
          amount,
          currency,
          metadata: typedMetadata,
          transactionDetails: {
            merchantRequestID,
            checkoutRequestID,
            mpesaReceiptNumber,
            phoneNumber,
            transactionType,
            resultDesc,
          },
        });
        console.log("✅ Payment record processed for", typedMetadata.type);
      } catch (err) {
        console.error("❌ Webhook payment persist error:", err);
      }
    } else {
      console.log("❌ Payment failed:", resultDesc);

      try {
        await recordFailedPayment({
          provider: "mpesa",
          reference: checkoutRequestID,
          amount: Number(typedMetadata.amount) || checkout.amount || 0,
          currency,
          metadata: typedMetadata,
          transactionDetails: {
            merchantRequestID,
            checkoutRequestID,
            resultDesc,
            transactionType,
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!message.includes("Unique")) {
          console.error("Payment persistence error", err);
        }
      }
    }

    console.log("🎉 Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    const axiosError = error as { response?: { data?: unknown } };
    console.error("Mpesa webhook error:", axiosError.response?.data || error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
