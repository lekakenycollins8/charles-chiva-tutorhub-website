import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateDownloadToken } from "@/lib/auth-utils";
import type { PaymentProvider } from "@/lib/payment-config";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    const body = await request.json();
    const { reference, provider } = body as { reference?: string; provider?: PaymentProvider };

    if (!resourceId || !reference || !provider) {
      return NextResponse.json({ error: "resourceId, reference, and provider are required" }, { status: 400 });
    }

    if (provider !== "mpesa" && provider !== "paystack") {
      return NextResponse.json({ error: "Unsupported payment provider" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { reference },
      select: {
        id: true,
        reference: true,
        resourceId: true,
        status: true,
        paymentMethod: true,
      },
    });

    if (
      !payment ||
      payment.status !== "COMPLETED" ||
      payment.paymentMethod !== provider ||
      payment.resourceId !== resourceId
    ) {
      return NextResponse.json({ error: "Completed payment not found for this resource" }, { status: 403 });
    }

    const token = await generateDownloadToken(resourceId);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Download token error:", error);
    return NextResponse.json({ error: "Failed to authorize download" }, { status: 500 });
  }
}
