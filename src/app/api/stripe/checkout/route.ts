import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";

export async function POST(request: Request) {
  try {
    const { resourceId, price } = await request.json();
    
    if (!resourceId || !price) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Educational Resource",
          },
          unit_amount: Math.round(price * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/resources/${resourceId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/resources/${resourceId}?payment=cancel`,
      metadata: {
        resourceId,
      },
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
