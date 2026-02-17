import { NextResponse } from "next/server";
import { verifyWebhookSignature, extractMetadata } from "@/lib/intasend";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { prisma } from "@/lib/db";
import { getCheckoutMetadata, findMetadataByPaymentDetails, updateMetadataWithInvoiceId } from "@/lib/checkout-metadata-db";
import { CheckoutMetadata, isCheckoutMetadata } from "@/lib/types";

export async function POST(request: Request) {
  console.log("🪝 IntaSend webhook received");
  
  try {
    const body = await request.json();
    const headers = request.headers;
    
    // Log the full webhook for debugging
    console.log("📦 Webhook payload:", JSON.stringify(body, null, 2));
    console.log("📋 Headers:", Object.fromEntries(headers.entries()));
    
    // Get IntaSend signature from headers
    const signature = headers.get("X-IntaSend-Signature") || headers.get("x-intasend-signature") || "";
    console.log("🔐 Signature:", signature);
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);
    console.log("✅ Signature valid:", isValid);
    
    if (!isValid) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("🎯 Webhook event type: invoice state -", body.state);

    // Handle completed payments (IntaSend sends invoice directly, not wrapped in event)
    if (body.state === "COMPLETE") {
      const invoice = body;
      console.log("📄 Invoice data:", JSON.stringify(invoice, null, 2));
      
      const invoiceId = invoice?.invoice_id;
      const email = invoice?.account;
      const amount = parseFloat(invoice?.value) || 0;
      const currency = invoice?.currency || "USD";

      console.log("🔍 Payment details:", { invoiceId, email, amount, currency });

      // Try to find metadata by invoiceId first (in case it was already set)
      let metadata = await getCheckoutMetadata(invoiceId);
      
      if (!metadata) {
        // If not found by invoiceId, find by payment details
        console.log("🔍 Looking up metadata by payment details...");
        const metadataRecord = await findMetadataByPaymentDetails(email, amount, currency);
        
        if (metadataRecord) {
          // Update the record with the invoiceId
          await updateMetadataWithInvoiceId(metadataRecord.id, invoiceId);
          metadata = metadataRecord.metadata as CheckoutMetadata;
          console.log("✅ Found and updated metadata with invoiceId:", invoiceId);
        }
      }

      if (!metadata) {
        console.error("❌ No metadata found for invoice:", invoiceId);
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
          const payment = await prisma.payment.create({
            data: {
              reference: invoiceId,
              email: email || typedMetadata.email || "",
              amount: amount || typedMetadata.totalAmount || 0,
              status: "COMPLETED",
              metadata: typedMetadata,
            },
          });
          console.log("✅ Payment record created:", payment.id);
        } catch (err: any) {
          if (!String(err?.message || "").includes("Unique")) {
            console.error("❌ Webhook payment persist error:", err);
          } else {
            console.log("ℹ️ Payment already exists (duplicate webhook)");
          }
        }
      }
    } else {
      console.log("ℹ️ Ignoring non-complete invoice state:", body.state);
    }

    console.log("🎉 Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("IntaSend webhook error:", error?.response?.data || error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
