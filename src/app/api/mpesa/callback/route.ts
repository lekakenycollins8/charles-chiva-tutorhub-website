import { NextResponse } from "next/server";
import { verifyCallbackSignature, extractCallbackMetadata } from "@/lib/mpesa";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { prisma } from "@/lib/db";
import { getCheckoutMetadata, updateCheckoutMetadataByCheckoutId } from "@/lib/checkout-metadata-db";
import { CheckoutMetadata, isCheckoutMetadata } from "@/lib/types";

export async function POST(request: Request) {
  console.log("🪝 Mpesa callback webhook received");

  try {
    const body = await request.json();
    const headers = request.headers;

    // Log the full webhook for debugging
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    console.log("📋 Headers:", Object.fromEntries(headers.entries()));

    // Extract callback metadata
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

    // Find metadata by merchantRequestID
    const metadata = await getCheckoutMetadata(merchantRequestID);

    if (!metadata) {
      console.error("❌ No metadata found for merchantRequestID:", merchantRequestID);
      return NextResponse.json({ received: true });
    }

    const typedMetadata = metadata as CheckoutMetadata;
    console.log("🏷️ Retrieved metadata:", typedMetadata);

    // Update checkout metadata status
    const status = resultCode === 0 ? "COMPLETED" : "FAILED";
    await updateCheckoutMetadataByCheckoutId(merchantRequestID, checkoutRequestID, status);

    // Handle successful payment
    if (resultCode === 0) {
      console.log("✅ Payment successful");

      const amount = callbackMetadata.Amount || typedMetadata.amount;
      const phoneNumber = callbackMetadata.PhoneNumber || typedMetadata.phoneNumber;
      const mpesaReceiptNumber = callbackMetadata.MpesaReceiptNumber;

      // Handle resource purchase
      if (typedMetadata.type === "resource" && typedMetadata.resourceId) {
        try {
          console.log("📥 Incrementing download count for resource:", typedMetadata.resourceId);
          await incrementDownloadCount(typedMetadata.resourceId);
          console.log("✅ Download count incremented");
        } catch (err) {
          console.error("❌ Webhook resource increment error:", err);
        }
      }

      // Handle plan purchase
      if (typedMetadata.type === "plan") {
        try {
          console.log("💳 Creating payment record for plan purchase");
          console.log("💳 Payment data:", {
            reference: checkoutRequestID,
            email: typedMetadata.email,
            amount,
            status: "COMPLETED",
          });

          // Check if payment already exists
          const existingPayment = await prisma.payment.findUnique({
            where: { reference: checkoutRequestID },
          });

          if (existingPayment) {
            console.log("ℹ️ Payment already exists:", existingPayment.id);
            console.log("ℹ️ Existing payment status:", existingPayment.status);
          } else {
            const payment = await prisma.payment.create({
              data: {
                reference: checkoutRequestID,
                email: typedMetadata.email || "",
                amount: amount || 0,
                status: "COMPLETED",
                metadata: typedMetadata,
                merchantRequestID,
                mpesaReceiptNumber,
                phoneNumber,
                paymentMethod: "mpesa",
                transactionType: process.env.MPESA_ENVIRONMENT === "production" && process.env.MPESA_TILL_NUMBER
                  ? "CustomerBuyGoodsOnline"
                  : "CustomerPayBillOnline",
              },
            });
            console.log("✅ Payment record created:", payment.id);
          }
        } catch (err: any) {
          console.error("❌ Webhook payment persist error:", err);
          console.error("❌ Error details:", err?.message, err?.code);
        }
      }
    } else {
      console.log("❌ Payment failed:", resultDesc);
      // Create failed payment record for tracking
      try {
        await prisma.payment.create({
          data: {
            reference: checkoutRequestID,
            email: typedMetadata.email || "",
            amount: typedMetadata.amount || 0,
            status: "FAILED",
            metadata: typedMetadata,
            merchantRequestID,
            paymentMethod: "mpesa",
          },
        });
      } catch (err: any) {
        // Ignore duplicate errors
        if (!String(err?.message || "").includes("Unique")) {
          console.error("Payment persistence error", err);
        }
      }
    }

    console.log("🎉 Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Mpesa webhook error:", error?.response?.data || error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
