import { NextResponse } from "next/server";
import { pricingPlans } from "@/data/pricing";
import { getResource } from "@/lib/actions/resource-actions";
import { initiateSTKPush } from "@/lib/mpesa";
import { storeCheckoutMetadata } from "@/lib/checkout-metadata-db";

const CURRENCY = process.env.MPESA_CURRENCY || "KES";

// Daraja limits: AccountReference max 12 chars for PayBill / 13 for Till, TransactionDesc max 13.
// Keep these short; full purchase details are stored in CheckoutMetadata.
const PLAN_ACCOUNT_REFERENCES: Record<string, string> = {
  "basic-hourly": "BASIC",
  "standard-weekly": "STDWEEK",
  "premium-monthly": "PREMMTH",
};

export async function POST(request: Request) {
  console.log("🚀 Mpesa STK push initiate API called");

  try {
    const body = await request.json();
    console.log("📦 Request body:", body);
    const { type } = body as { type: "plan" | "resource" };

    if (type === "plan") {
      const { planId, quantity, phoneNumber, email, firstName, lastName } = body as {
        planId: string;
        quantity: number;
        phoneNumber: string;
        email?: string;
        firstName?: string;
        lastName?: string;
      };

      if (!planId || !quantity || quantity < 1) {
        return NextResponse.json({ error: "Invalid plan/quantity" }, { status: 400 });
      }

      if (!phoneNumber) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }

      const plan = pricingPlans.find((p) => p.id === planId);
      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 });
      }
      if (plan.maxQuantity && quantity > plan.maxQuantity) {
        return NextResponse.json({ error: "Quantity exceeds limit" }, { status: 400 });
      }

      const total = plan.priceValue * quantity;
      const metadata = {
        type: "plan",
        planId,
        quantity,
        unitPrice: plan.priceValue,
        priceUnit: plan.priceUnit,
        email,
        firstName,
        lastName,
        phoneNumber,
        amount: total,
        currency: CURRENCY,
        paymentMethod: "mpesa",
        provider: "mpesa",
      };

      const response = await initiateSTKPush({
        phoneNumber,
        amount: total,
        accountReference: PLAN_ACCOUNT_REFERENCES[planId] ?? planId.slice(0, 12),
        transactionDesc: "Plan payment",
      });

      console.log("🎉 STK push initiated successfully");

      // Store metadata for callback processing using Mpesa's MerchantRequestID
      try {
        await storeCheckoutMetadata(
          response.merchantRequestID,
          response.checkoutRequestID,
          metadata,
          email || "",
          total,
          CURRENCY
        );
        console.log("✅ Checkout metadata stored successfully for merchant request ID:", response.merchantRequestID);
      } catch (err: any) {
        console.error("❌ Failed to store checkout metadata:", err);
        console.error("❌ Error details:", err?.message, err?.code);
        // Don't fail the request - the payment can still work, webhook will handle it
      }

      return NextResponse.json({
        merchantRequestID: response.merchantRequestID,
        checkoutRequestID: response.checkoutRequestID,
        responseCode: response.responseCode,
        responseDescription: response.responseDescription,
        customerMessage: response.customerMessage,
      });
    }

    if (type === "resource") {
      const { resourceId, phoneNumber, email, firstName, lastName } = body as {
        resourceId: string;
        phoneNumber: string;
        email?: string;
        firstName?: string;
        lastName?: string;
      };

      if (!resourceId) {
        return NextResponse.json({ error: "Resource ID required" }, { status: 400 });
      }

      if (!phoneNumber) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }

      const { success, resource } = await getResource(resourceId);
      if (!success || !resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }
      if (!resource.isPaid || !resource.price || resource.price <= 0) {
        return NextResponse.json({ error: "Resource is not payable" }, { status: 400 });
      }

      const metadata = {
        type: "resource",
        resourceId,
        email,
        firstName,
        lastName,
        phoneNumber,
        amount: resource.price,
        currency: CURRENCY,
        paymentMethod: "mpesa",
        provider: "mpesa",
      };

      const response = await initiateSTKPush({
        phoneNumber,
        amount: resource.price,
        accountReference: `RES${resourceId.slice(-8)}`,
        transactionDesc: "Res payment",
      });

      console.log("🎉 STK push initiated successfully");

      // Store metadata for callback processing using Mpesa's MerchantRequestID
      try {
        await storeCheckoutMetadata(
          response.merchantRequestID,
          response.checkoutRequestID,
          metadata,
          email || "",
          resource.price,
          CURRENCY
        );
        console.log("✅ Checkout metadata stored successfully for merchant request ID:", response.merchantRequestID);
      } catch (err: any) {
        console.error("❌ Failed to store checkout metadata:", err);
        console.error("❌ Error details:", err?.message, err?.code);
        // Don't fail the request - the payment can still work, webhook will handle it
      }

      return NextResponse.json({
        merchantRequestID: response.merchantRequestID,
        checkoutRequestID: response.checkoutRequestID,
        responseCode: response.responseCode,
        responseDescription: response.responseDescription,
        customerMessage: response.customerMessage,
      });
    }

    return NextResponse.json({ error: "Unsupported payment type" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ Mpesa STK push initiate error:", error?.response?.data || error);

    const errorMessage = error?.message || "Failed to initiate STK push";
    const statusCode = error?.response?.status || 500;

    return NextResponse.json({
      error: errorMessage,
      details: error?.response?.data || error?.message,
    }, { status: statusCode });
  }
}
