import { NextResponse } from "next/server";
import { pricingPlans } from "@/data/pricing";
import { getResource } from "@/lib/actions/resource-actions";
import { initializeTransaction } from "@/lib/paystack";
import { storeCheckoutMetadata } from "@/lib/checkout-metadata-db";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const CURRENCY = process.env.PAYSTACK_CURRENCY || "USD";

function generateReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `PAY_${timestamp}_${random}`;
}

export async function POST(request: Request) {
  console.log("🚀 Paystack initialize transaction API called");
  
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
      const reference = generateReference();
      const metadata = {
        type: "plan",
        planId,
        quantity,
        unitPrice: plan.priceValue,
        priceUnit: plan.priceUnit,
        email,
        firstName,
        lastName,
        country,
        city,
      };

      const payload = {
        email: email || "",
        amount: total * 100, // Paystack expects amount in smallest currency unit
        currency: CURRENCY,
        reference,
        callback_url: `${SITE_URL}/pricing/success?reference=${reference}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Plan ID",
              variable_name: "plan_id",
              value: planId,
            },
            {
              display_name: "Quantity",
              variable_name: "quantity",
              value: quantity.toString(),
            },
          ],
          ...metadata,
        },
      };

      const response = await initializeTransaction(payload);
      console.log("🎉 Transaction initialized successfully");
      
      // Store metadata for webhook processing
      await storeCheckoutMetadata(reference, metadata, email || "", total, CURRENCY);
      
      return NextResponse.json({ 
        reference,
        authorizationUrl: response.data.authorization_url,
        access_code: response.data.access_code,
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

      const reference = generateReference();
      const metadata = {
        type: "resource",
        resourceId,
        email,
        firstName,
        lastName,
      };

      const payload = {
        email: email || "",
        amount: resource.price * 100, // Paystack expects amount in smallest currency unit
        currency: CURRENCY,
        reference,
        callback_url: `${SITE_URL}/resources/${resourceId}?reference=${reference}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Resource ID",
              variable_name: "resource_id",
              value: resourceId,
            },
          ],
          ...metadata,
        },
      };

      const response = await initializeTransaction(payload);
      console.log("🎉 Transaction initialized successfully");
      
      // Store metadata for webhook processing
      await storeCheckoutMetadata(reference, metadata, email || "", resource.price, CURRENCY);
      
      return NextResponse.json({ 
        reference,
        authorizationUrl: response.data.authorization_url,
        access_code: response.data.access_code,
      });
    }

    return NextResponse.json({ error: "Unsupported payment type" }, { status: 400 });
  } catch (error: any) {
    console.error("Paystack initialize transaction error:", error?.response?.data || error);
    
    // Return detailed error for debugging
    const errorMessage = error?.response?.data?.message || error?.message || "Failed to initialize transaction";
    const statusCode = error?.response?.status || 500;
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error?.response?.data || error?.message 
    }, { status: statusCode });
  }
}
