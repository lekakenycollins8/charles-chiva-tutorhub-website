import { NextResponse } from "next/server";
import { verifyWebhookSignature, extractMetadata } from "@/lib/paystack";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { prisma } from "@/lib/db";
import { getCheckoutMetadata } from "@/lib/checkout-metadata-db";
import { CheckoutMetadata, isCheckoutMetadata } from "@/lib/types";

export async function POST(request: Request) {
  console.log("🪝 Paystack webhook received");
  
  try {
    const body = await request.json();
    const headers = request.headers;
    
    // Log the full webhook for debugging
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    console.log("📋 Headers:", Object.fromEntries(headers.entries()));
    
    // Get Paystack signature from headers
    const signature = headers.get("x-paystack-signature") || headers.get("X-Paystack-Signature") || "";
    console.log("🔐 Signature:", signature);
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);
    console.log("✅ Signature valid:", isValid);
    
    if (!isValid) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("🎯 Webhook event type:", body.event);

    // Handle successful charge events
    if (body.event === "charge.success") {
      const transaction = body.data;
      console.log("📄 Transaction data:", JSON.stringify(transaction, null, 2));
      
      const reference = transaction?.reference;
      const email = transaction?.customer?.email;
      const amount = (parseFloat(transaction?.amount) || 0) / 100; // Convert from kobo to KES
      const currency = transaction?.currency || "KES";

      console.log("🔍 Payment details:", { reference, email, amount, currency });

      // Try to find metadata by reference
      let metadata = await getCheckoutMetadata(reference);
      
      if (!metadata) {
        console.error("❌ No metadata found for reference:", reference);
        return NextResponse.json({ received: true });
      }

      // Type cast the metadata to ensure TypeScript knows its structure
      const typedMetadata = metadata as CheckoutMetadata;
      console.log("🏷️ Retrieved metadata:", typedMetadata);

      if (typedMetadata.type === "resource" && typedMetadata.resourceId) {
        try {
          console.log("📥 Incrementing download count for resource:", typedMetadata.resourceId);
          await incrementDownloadCount(typedMetadata.resourceId);
          console.log("✅ Download count incremented");
        } catch (err) {
          console.error("❌ Webhook resource increment error:", err);
        }
      }

      if (typedMetadata.type === "plan") {
        try {
          console.log("💳 Creating payment record for plan purchase");
          console.log("💳 Payment data:", { reference, email, amount, status: "COMPLETED" });
          
          // Check if payment already exists
          const existingPayment = await prisma.payment.findUnique({
            where: { reference }
          });
          
          if (existingPayment) {
            console.log("ℹ️ Payment already exists:", existingPayment.id);
            console.log("ℹ️ Existing payment status:", existingPayment.status);
          } else {
            const payment = await prisma.payment.create({
              data: {
                reference,
                email: email || typedMetadata.email || "",
                amount: amount || typedMetadata.totalAmount || 0,
                status: "COMPLETED",
                metadata: typedMetadata,
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
      console.log("ℹ️ Ignoring non-success event:", body.event);
    }

    console.log("🎉 Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack webhook error:", error?.response?.data || error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
