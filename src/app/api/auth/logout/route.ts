import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // With NextAuth, we should redirect to the signout endpoint
    // This API route is now mostly for compatibility with existing code
    
    // Create response with redirect to NextAuth signout
    const response = NextResponse.json(
      { 
        message: "Logout successful",
        redirectUrl: "/api/auth/signout"
      },
      { status: 200 }
    );
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
