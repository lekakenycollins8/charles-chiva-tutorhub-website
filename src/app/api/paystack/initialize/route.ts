import { NextResponse } from "next/server";
import { paystack } from "@/lib/paystack";
import { generateDownloadToken } from "@/lib/auth-utils";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { resourceId, price, email, country, city } = await request.json();
    
    if (!resourceId || !price || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Generate a download token (reusing existing function)
    const token = await generateDownloadToken(resourceId);
    
    // Generate a unique reference for this transaction
    const reference = `resource_${resourceId}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Create Paystack transaction
    const response = await paystack.initializeTransaction({
      email,
      amount: Math.round(price * 100), // Convert to kobo (smallest currency unit)
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/resources/${resourceId}?payment=success&token=${token}`,
      metadata: {
        resourceId,
        token,
        country: country || 'Not specified',
        city: city || 'Not specified',
        custom_fields: [
          {
            display_name: "Resource ID",
            variable_name: "resource_id",
            value: resourceId
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
    console.error("Paystack initialization error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
