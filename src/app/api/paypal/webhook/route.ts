import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { prisma } from "@/lib/db";

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

export async function POST(request: Request) {
  if (!WEBHOOK_ID) {
    return NextResponse.json({ error: "PAYPAL_WEBHOOK_ID not set" }, { status: 500 });
  }

  try {
    const bodyText = await request.text();
    const webhookEvent = JSON.parse(bodyText);

    const headers = request.headers;
    const authAlgo = headers.get("paypal-auth-algo") || "";
    const certUrl = headers.get("paypal-cert-url") || "";
    const transmissionId = headers.get("paypal-transmission-id") || "";
    const transmissionSig = headers.get("paypal-transmission-sig") || "";
    const transmissionTime = headers.get("paypal-transmission-time") || "";

    const verification = await verifyWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookId: WEBHOOK_ID,
      webhookEvent,
    });

    if (verification?.verification_status !== "SUCCESS") {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle capture completed events
    if (webhookEvent.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = webhookEvent.resource;

      let metadata: any = undefined;
      try {
        if (resource?.custom_id) {
          metadata = JSON.parse(resource.custom_id);
        }
      } catch (err) {
        // ignore parse errors
      }

      const orderId = resource?.supplementary_data?.related_ids?.order_id || resource?.id;
      const email = resource?.payer?.email_address || resource?.billing_details?.email;
      const amount = resource?.amount?.value ? parseFloat(resource.amount.value) : undefined;

      if (metadata?.type === "resource" && metadata.resourceId) {
        try {
          await incrementDownloadCount(metadata.resourceId);
        } catch (err) {
          console.error("Webhook resource increment error", err);
        }
      }

      if (metadata?.type === "plan") {
        try {
          await prisma.payment.create({
            data: {
              reference: orderId,
              email: email || metadata.email || "",
              amount: amount || metadata.totalAmount || 0,
              status: "COMPLETED",
              metadata,
            },
          });
        } catch (err: any) {
          if (!String(err?.message || "").includes("Unique")) {
            console.error("Webhook payment persist error", err);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("PayPal webhook error:", error?.response?.data || error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
