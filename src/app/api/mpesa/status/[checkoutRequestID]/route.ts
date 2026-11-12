import { NextResponse } from "next/server";
import { queryTransactionStatus } from "@/lib/mpesa";
import { getCheckoutMetadata } from "@/lib/checkout-metadata-db";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ checkoutRequestID: string }> }
) {
  const { checkoutRequestID } = await params;

  if (!checkoutRequestID) {
    return NextResponse.json({ error: "checkoutRequestID is required" }, { status: 400 });
  }

  try {
    const [payment, metadata] = await Promise.all([
      prisma.payment.findUnique({ where: { reference: checkoutRequestID } }),
      getCheckoutMetadata(checkoutRequestID),
    ]);

    // Terminal state already recorded by the webhook: no need to hit Daraja
    if (payment && (payment.status === "COMPLETED" || payment.status === "FAILED")) {
      return NextResponse.json({ mpesaStatus: null, paymentRecord: payment, metadata });
    }

    // Best-effort Daraja query. Failure here means "still pending", not an error.
    let mpesaStatus: unknown = null;
    try {
      mpesaStatus = await queryTransactionStatus(checkoutRequestID);
    } catch (err) {
      console.warn("Daraja status query unavailable (treating as pending):", err instanceof Error ? err.message : err);
    }

    return NextResponse.json({ mpesaStatus, paymentRecord: payment, metadata });
  } catch (error) {
    // Only genuine DB failures reach here
    console.error("❌ Mpesa status route error:", error);
    return NextResponse.json({ error: "Failed to load payment status" }, { status: 500 });
  }
}
