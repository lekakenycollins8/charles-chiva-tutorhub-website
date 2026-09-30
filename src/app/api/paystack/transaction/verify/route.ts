import { NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { generateDownloadToken } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { getCheckoutMetadata } from "@/lib/checkout-metadata-db";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { CheckoutMetadata } from "@/lib/types";

async function handleVerification(reference: string) {
  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  const response = await verifyTransaction(reference);
  const transaction = response.data;
  const metadata = await getCheckoutMetadata(reference);

  console.log("🔍 Verify endpoint - Reference:", reference);
  console.log("🔍 Verify endpoint - Transaction:", transaction);
  console.log("🔍 Verify endpoint - Database Metadata:", metadata);

  if (!metadata) {
    return NextResponse.json({ error: "Payment metadata not found. Please complete payment first." }, { status: 400 });
  }

  // Type cast the metadata to ensure TypeScript knows its structure
  const typedMetadata = metadata as CheckoutMetadata;
  const status = transaction.status;
  const amount = transaction.amount / 100; // Convert from kobo to KES
  const email = transaction.customer.email;

  // Handle resource purchase
  if (typedMetadata.type === "resource") {
    if (status !== "success") {
      return NextResponse.json({ status, message: "Payment not completed yet" });
    }
    
    // Increment download count and generate token
    try {
      await incrementDownloadCount(typedMetadata.resourceId!);
      console.log("✅ Download count incremented for resource:", typedMetadata.resourceId);
    } catch (err) {
      console.error("❌ Failed to increment download count:", err);
    }
    
    const downloadToken = await generateDownloadToken(typedMetadata.resourceId!);
    return NextResponse.json({ status: "success", downloadToken });
  }

  // Handle plan purchase
  if (typedMetadata.type === "plan") {
    // Persist payment record (idempotent on reference)
    try {
      await prisma.payment.create({
        data: {
          reference,
          email: email || typedMetadata.email || "",
          amount: amount || typedMetadata.totalAmount || 0,
          status: status.toUpperCase(),
          metadata: typedMetadata,
        },
      });
    } catch (err: any) {
      // Ignore duplicate errors
      if (!String(err?.message || "").includes("Unique")) {
        console.error("Payment persistence error", err);
      }
    }
    return NextResponse.json({ status: "success", transaction });
  }

  return NextResponse.json({ error: "Unsupported metadata type" }, { status: 400 });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    return await handleVerification(reference || '');
  } catch (error: any) {
    console.error("Paystack verify error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to verify transaction" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();
    return await handleVerification(reference);
  } catch (error: any) {
    console.error("Paystack verify error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to verify transaction" }, { status: 500 });
  }
}
