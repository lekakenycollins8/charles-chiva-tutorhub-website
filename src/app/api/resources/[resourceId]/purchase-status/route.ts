import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const sessionId = request.headers.get("session-id");
    
    if (!sessionId) {
      return NextResponse.json(
        { purchased: false },
        { status: 200 }
      );
    }
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const purchased = session.payment_status === "paid" && 
                     session.metadata?.resourceId === resourceId;
    
    return NextResponse.json(
      { purchased },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Purchase status error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
