import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = (await headersList).get("x-paystack-signature") as string;

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.event === "charge.success") {
      const data = event.data;
      const metadata = data.metadata;
      
      // Increment download count for the purchased resource
      if (metadata && metadata.resourceId) {
        await incrementDownloadCount(metadata.resourceId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
