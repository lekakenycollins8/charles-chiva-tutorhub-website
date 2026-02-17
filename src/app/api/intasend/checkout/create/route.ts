import { NextResponse } from "next/server";
import { pricingPlans } from "@/data/pricing";
import { getResource } from "@/lib/actions/resource-actions";
import { createCheckout } from "@/lib/intasend";
import { storeCheckoutMetadata } from "@/lib/checkout-metadata-db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const CURRENCY = process.env.INTASEND_CURRENCY || "USD";

function amountToString(amount: number) {
  return amount.toFixed(2);
}

export async function POST(request: Request) {
  console.log("🚀 IntaSend create checkout API called");
  
  try {
    const body = await request.json();
    console.log("📦 Request body:", body);
    const { type } = body as { type: "plan" | "resource" };

    if (type === "plan") {
      const { planId, quantity, email, firstName, lastName, country, city } = body as {
        planId: string;
        quantity: number;
        email?: string;
        firstName?: string;
        lastName?: string;
        country?: string;
        city?: string;
      };

      if (!planId || !quantity || quantity < 1) {
        return NextResponse.json({ error: "Invalid plan/quantity" }, { status: 400 });
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
        country,
        city,
      };

      const payload = {
        amount: total,
        currency: CURRENCY,
        email: email || "",
        first_name: firstName || "",
        last_name: lastName || "",
        callback_url: `${SITE_URL}/pricing/success`,
        webhook: `${SITE_URL}/api/intasend/webhook`,
        comment: JSON.stringify(metadata),
      };

      const response = await createCheckout(payload);
      console.log("🎉 Checkout created successfully");
      
      // Store metadata for webhook processing
      storeCheckoutMetadata(response.id, metadata, email || "", total, CURRENCY);
      
      return NextResponse.json({ 
        transactionId: response.id,
        checkoutUrl: response.url 
      });
    }

    if (type === "resource") {
      const { resourceId, email, firstName, lastName } = body as { 
        resourceId: string; 
        email?: string;
        firstName?: string;
        lastName?: string;
      };
      
      if (!resourceId) {
        return NextResponse.json({ error: "Resource ID required" }, { status: 400 });
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
      };

      const payload = {
        amount: resource.price,
        currency: CURRENCY,
        email: email || "",
        first_name: firstName || "",
        last_name: lastName || "",
        callback_url: `${SITE_URL}/resources/${resourceId}`,
        webhook: `${SITE_URL}/api/intasend/webhook`,
        comment: JSON.stringify(metadata),
      };

      const response = await createCheckout(payload);
      console.log("🎉 Checkout created successfully");
      
      // Store metadata for webhook processing
      storeCheckoutMetadata(response.id, metadata, email || "", resource.price, CURRENCY);
      
      return NextResponse.json({ 
        transactionId: response.id,
        checkoutUrl: response.url 
      });
    }

    return NextResponse.json({ error: "Unsupported payment type" }, { status: 400 });
  } catch (error: any) {
    console.error("IntaSend create checkout error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
