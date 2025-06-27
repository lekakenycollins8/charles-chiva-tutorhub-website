import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Use Better-Auth API to sign out
    try {
      const result = await auth.api.signOut({
        headers: request.headers,
        asResponse: true,
      });
      
      // Create response with the same status
      const response = NextResponse.json(
        { message: "Logout successful" },
        { status: result.status }
      );
      
      // Copy all headers from the Better-Auth response
      const authHeaders = result.headers;
      authHeaders.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          // Cookies are handled separately
          return;
        }
        response.headers.set(key, value);
      });
      
      // Copy cookies from the Better-Auth response
      const cookies = authHeaders.getSetCookie();
      cookies.forEach(cookie => {
        const [name, ...parts] = cookie.split('=');
        response.cookies.set({
          name,
          value: "", // Empty value for logout
          maxAge: 0, // Expire immediately
          path: "/",
        });
      });
      
      return response;
    } catch (error) {
      console.error('Better-Auth sign out error:', error);
      // Continue with fallback logout approach
    }
    
    // Create response
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
    
    // Delete session cookie
    response.cookies.delete("session");
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
