import { NextResponse } from "next/server";
import { queryTransactionStatus } from "@/lib/mpesa";
import { getCheckoutMetadata } from "@/lib/checkout-metadata-db";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ checkoutRequestID: string }> }
) {
  try {
    const { checkoutRequestID } = await params;

    if (!checkoutRequestID) {
      return NextResponse.json({ error: "checkoutRequestID is required" }, { status: 400 });
    }

    console.log("🔍 Querying transaction status for:", checkoutRequestID);

    // Query Mpesa API for transaction status
    const statusResponse = await queryTransactionStatus(checkoutRequestID);

    console.log("✅ Mpesa status response:", statusResponse);

    // Also check our database for any existing payment record
    const payment = await prisma.payment.findUnique({
      where: { reference: checkoutRequestID },
    });

    // Get metadata for additional context
    const metadata = await getCheckoutMetadata(checkoutRequestID);

    return NextResponse.json({
      mpesaStatus: statusResponse,
      paymentRecord: payment,
      metadata,
    });
  } catch (error: any) {
    console.error("❌ Mpesa status query error:", error?.response?.data || error);
    return NextResponse.json(
      { error: "Failed to query transaction status" },
      { status: 500 }
    );
  }
}
