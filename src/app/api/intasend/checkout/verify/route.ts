import { NextResponse } from "next/server";
import { checkStatus } from "@/lib/intasend";
import { generateDownloadToken } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { getCheckoutMetadata } from "@/lib/checkout-metadata-db";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { CheckoutMetadata } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();
    if (!invoiceId) {
      return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
    }

    const status = await checkStatus(invoiceId);
    const state = status?.state; // IntaSend returns state directly, not nested in invoice
    const metadata = await getCheckoutMetadata(invoiceId);

    console.log("🔍 Verify endpoint - Invoice ID:", invoiceId);
    console.log("🔍 Verify endpoint - API Status:", status);
    console.log("🔍 Verify endpoint - Payment State:", state);
    console.log("🔍 Verify endpoint - Database Metadata:", metadata);

    if (!metadata) {
      return NextResponse.json({ error: "Payment metadata not found. Please complete payment first." }, { status: 400 });
    }

    // Type cast the metadata to ensure TypeScript knows its structure
    const typedMetadata = metadata as CheckoutMetadata;
    const amount = parseFloat(status?.value) || undefined;
    const email = status?.account;

    // Handle resource purchase
    if (typedMetadata.type === "resource") {
      if (state !== "COMPLETE") {
        return NextResponse.json({ status: state || "PENDING", message: "Payment not completed yet" });
      }
      
      // Increment download count and generate token
      try {
        await incrementDownloadCount(typedMetadata.resourceId!);
        console.log("✅ Download count incremented for resource:", typedMetadata.resourceId);
      } catch (err) {
        console.error("❌ Failed to increment download count:", err);
      }
      
      const downloadToken = await generateDownloadToken(typedMetadata.resourceId!);
      return NextResponse.json({ status: "COMPLETED", downloadToken });
    }

    // Handle plan purchase
    if (typedMetadata.type === "plan") {
      // Persist payment record (idempotent on reference)
      try {
        await prisma.payment.create({
          data: {
            reference: invoiceId,
            email: email || typedMetadata.email || "",
            amount: amount || typedMetadata.totalAmount || 0,
            status: state || "UNKNOWN",
            metadata: typedMetadata,
          },
        });
      } catch (err: any) {
        // Ignore duplicate errors
        if (!String(err?.message || "").includes("Unique")) {
          console.error("Payment persistence error", err);
        }
      }
      return NextResponse.json({ status: state || "PENDING" });
    }

    return NextResponse.json({ error: "Unsupported metadata type" }, { status: 400 });
  } catch (error: any) {
    console.error("IntaSend verify error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to verify transaction" }, { status: 500 });
  }
}
