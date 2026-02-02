import { NextResponse } from "next/server";
import { pricingPlans } from "@/data/pricing";
import { getResource } from "@/lib/actions/resource-actions";
import { createOrder, getApprovalLink } from "@/lib/paypal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const CURRENCY = process.env.PAYPAL_CURRENCY || "USD";

type CreatePayload = {
  intent: "CAPTURE";
  purchase_units: Array<{
    amount: { currency_code: string; value: string };
    description?: string;
    custom_id?: string;
  }>;
  application_context?: {
    return_url: string;
    cancel_url: string;
    landing_page?: "BILLING" | "LOGIN";
    user_action?: "PAY_NOW" | "CONTINUE";
  };
  payment_source?: {
    card?: {
      experience_context?: {
        brand_name?: string;
        locale?: string;
        landing_page?: "BILLING" | "LOGIN";
        user_action?: "PAY_NOW" | "CONTINUE";
        payment_method_preference?: "IMMEDIATE_PAYMENT_REQUIRED";
      };
    };
  };
};

function amountToString(amount: number) {
  return amount.toFixed(2);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body as { type: "plan" | "resource" };

    if (type === "plan") {
      const { planId, quantity, email, country, city } = body as {
        planId: string;
        quantity: number;
        email?: string;
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
      const custom = {
        type: "plan",
        planId,
        quantity,
        unitPrice: plan.priceValue,
        priceUnit: plan.priceUnit,
        email,
        country,
        city,
      };

      const payload: CreatePayload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: CURRENCY,
              value: amountToString(total),
            },
            description: `${plan.name} plan`,
            custom_id: JSON.stringify(custom),
          },
        ],
        application_context: {
          return_url: `${SITE_URL}/pricing/success`,
          cancel_url: `${SITE_URL}/pricing`,
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
        payment_source: {
          card: {
            experience_context: {
              landing_page: "BILLING",
              user_action: "PAY_NOW",
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            },
          },
        },
      };

      const order = await createOrder(payload);
      return NextResponse.json({ orderID: order.id, approvalUrl: getApprovalLink(order) });
    }

    if (type === "resource") {
      const { resourceId, email } = body as { resourceId: string; email?: string };
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

      const custom = {
        type: "resource",
        resourceId,
        email,
      };

      const payload: CreatePayload = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: CURRENCY,
              value: amountToString(resource.price),
            },
            description: `Resource: ${resource.title}`,
            custom_id: JSON.stringify(custom),
          },
        ],
        application_context: {
          return_url: `${SITE_URL}/resources/${resourceId}`,
          cancel_url: `${SITE_URL}/resources/${resourceId}`,
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
        payment_source: {
          card: {
            experience_context: {
              landing_page: "BILLING",
              user_action: "PAY_NOW",
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
            },
          },
        },
      };

      const order = await createOrder(payload);
      return NextResponse.json({ orderID: order.id, approvalUrl: getApprovalLink(order) });
    }

    return NextResponse.json({ error: "Unsupported payment type" }, { status: 400 });
  } catch (error: any) {
    console.error("PayPal create order error:", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
