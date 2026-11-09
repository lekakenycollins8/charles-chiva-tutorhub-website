import { NextResponse } from "next/server";
import { pricingPlans } from "@/data/pricing";
import { getResource } from "@/lib/actions/resource-actions";
import { initializeTransaction } from "@/lib/paystack";
import {
  storeCheckoutMetadata,
  updateCheckoutMetadataByCheckoutId,
} from "@/lib/checkout-metadata-db";
import type { PaymentCheckoutMetadata } from "@/lib/payment-fulfillment";

const CURRENCY = "KES";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function buildReference(type: "plan" | "resource", id: string) {
  return `${type}-${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body as { type?: "plan" | "resource" };

    if (!type || (type !== "plan" && type !== "resource")) {
      return NextResponse.json({ error: "Unsupported payment type" }, { status: 400 });
    }

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : undefined;
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : undefined;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }

    let amount = 0;
    let callbackUrl = "";
    let metadata: PaymentCheckoutMetadata;
    let reference = "";

    if (type === "plan") {
      const { planId, quantity } = body as { planId?: string; quantity?: number };

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

      amount = plan.priceValue * quantity;
      callbackUrl = `${getBaseUrl()}/pricing/success?provider=paystack`;
      reference = buildReference("plan", planId);
      metadata = {
        type: "plan",
        planId,
        quantity,
        unitPrice: plan.priceValue,
        priceUnit: plan.priceUnit,
        email,
        firstName,
        lastName,
        amount,
        currency: CURRENCY,
        paymentMethod: "paystack",
        provider: "paystack",
      };
    } else {
      const { resourceId } = body as { resourceId?: string };

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

      amount = resource.price;
      callbackUrl = `${getBaseUrl()}/resources/${resourceId}?provider=paystack`;
      reference = buildReference("resource", resourceId);
      metadata = {
        type: "resource",
        resourceId,
        email,
        firstName,
        lastName,
        amount,
        currency: CURRENCY,
        paymentMethod: "paystack",
        provider: "paystack",
      };
    }

    await storeCheckoutMetadata(reference, reference, metadata, email, amount, CURRENCY, "paystack");

    let initialized;
    try {
      initialized = await initializeTransaction({
        email,
        amount,
        reference,
        callbackUrl,
        metadata: {
          ...metadata,
          checkoutReference: reference,
        },
      });
    } catch (initError) {
      try {
        await updateCheckoutMetadataByCheckoutId(reference, reference, "FAILED");
      } catch {
        // Ignore cleanup failure; the original Paystack error is more useful.
      }
      throw initError;
    }

    try {
      await updateCheckoutMetadataByCheckoutId(reference, initialized.access_code, "PENDING");
    } catch (err) {
      console.error("Failed to update Paystack checkout invoice ID:", err);
    }

    return NextResponse.json({
      authorizationUrl: initialized.authorization_url,
      accessCode: initialized.access_code,
      reference: initialized.reference,
    });
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    console.error("Paystack initialize error:", axiosError.response?.data || error);

    const statusCode = axiosError.response?.status || 500;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to initialize Paystack payment";

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
