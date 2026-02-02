import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Paystack has been removed. Use PayPal endpoints instead." },
    { status: 410 }
  );
}
