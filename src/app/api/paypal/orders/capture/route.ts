import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";
import { generateDownloadToken } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { pricingPlans } from "@/data/pricing";

export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();
    if (!orderID) {
      return NextResponse.json({ error: "orderID is required" }, { status: 400 });
    }

    const order = await captureOrder(orderID);
    const status = order?.status;
    const purchaseUnit = order?.purchase_units?.[0];
    const customId = purchaseUnit?.custom_id;
    if (!customId) {
      return NextResponse.json({ error: "Missing purchase unit metadata" }, { status: 400 });
    }

    let metadata: any;
    try {
      metadata = JSON.parse(customId);
    } catch (err) {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    const amountValue = purchaseUnit?.payments?.captures?.[0]?.amount?.value;
    const email = order?.payer?.email_address;

    // Handle resource purchase
    if (metadata.type === "resource") {
      if (status !== "COMPLETED") {
        return NextResponse.json({ status });
      }
      const downloadToken = await generateDownloadToken(metadata.resourceId);
      return NextResponse.json({ status: "COMPLETED", downloadToken });
    }

    // Handle plan purchase
    if (metadata.type === "plan") {
      // Persist payment record (idempotent on reference)
      try {
        await prisma.payment.create({
          data: {
            reference: orderID,
            email: email || metadata.email || "",
            amount: amountValue ? parseFloat(amountValue) : metadata.totalAmount || 0,
            status: status || "UNKNOWN",
            metadata,
          },
        });
      } catch (err: any) {
        // Ignore duplicate errors
        if (!String(err?.message || "").includes("Unique")) {
          console.error("Payment persistence error", err);
        }
      }
      return NextResponse.json({ status: status || "PENDING" });
    }

    return NextResponse.json({ error: "Unsupported metadata type" }, { status: 400 });
  } catch (error: any) {
    console.error("PayPal capture error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
