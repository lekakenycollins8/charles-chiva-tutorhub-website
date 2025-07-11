import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";
import { prisma } from "@/lib/db";

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
      const reference = data.reference;
      
      // Check if this is a resource payment or a pricing plan payment
      if (reference.startsWith('resource_') && metadata && metadata.resourceId) {
        // Resource payment - increment download count
        await incrementDownloadCount(metadata.resourceId);
      } 
      else if (reference.startsWith('plan_') && metadata && metadata.planId) {
        // Pricing plan payment - record the purchase
        try {
          // @ts-ignore
          await prisma.Payment.create({
            data: {
              reference: reference,
              email: data.customer.email,
              amount: metadata.totalAmount,
              status: 'completed',
              metadata: {
                planId: metadata.planId,
                planName: metadata.planName,
                quantity: metadata.quantity,
                priceUnit: metadata.priceUnit,
                unitPrice: metadata.unitPrice
              }
            }
          });
          
          // Here you would implement any additional business logic
          // such as creating a subscription, updating user access, etc.
          console.log(`Plan payment recorded: ${reference} for plan ${metadata.planName}`);
        } catch (error) {
          console.error('Error recording plan payment:', error);
          // Still return success to Paystack but log the error
        }
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
