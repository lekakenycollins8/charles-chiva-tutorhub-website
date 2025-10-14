import { NextResponse } from "next/server";
import { paystack } from "@/lib/paystack";
import { pricingPlans } from "@/data/pricing";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { planId, quantity, email, country, city } = await request.json();
    
    if (!planId || !quantity || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Find the selected plan
    const plan = pricingPlans.find(p => p.id === planId);
    
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }
    
    // Validate quantity
    const qty = parseInt(quantity.toString());
    if (isNaN(qty) || qty < 1 || (plan.maxQuantity && qty > plan.maxQuantity)) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }
    
    // Calculate total price (convert to smallest currency unit - kobo)
    const totalAmount = Math.round(plan.priceValue * qty * 100);
    
    // Generate a unique reference for this transaction
    const reference = `plan_${planId}_qty${qty}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Create Paystack transaction
    const response = await paystack.initializeTransaction({
      email,
      amount: totalAmount,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/success?payment=success&reference=${reference}`,
      metadata: {
        planId,
        planName: plan.name,
        quantity: qty,
        unitPrice: plan.priceValue,
        priceUnit: plan.priceUnit,
        totalAmount: totalAmount / 100, // Store in dollars for readability
        country: country || 'Not specified',
        city: city || 'Not specified',
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan_name",
            value: plan.name
          },
          {
            display_name: "Quantity",
            variable_name: "quantity",
            value: qty.toString()
          },
          {
            display_name: "Unit",
            variable_name: "unit",
            value: plan.priceUnit
          },
          {
            display_name: "Country",
            variable_name: "country",
            value: country || 'Not specified'
          },
          {
            display_name: "City",
            variable_name: "city",
            value: city || 'Not specified'
          }
        ]
      }
    });
    
    return NextResponse.json({ 
      authorization_url: response.data.authorization_url,
      access_code: response.data.access_code,
      reference: response.data.reference
    });
  } catch (error: any) {
    console.error("Paystack pricing initialization error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
