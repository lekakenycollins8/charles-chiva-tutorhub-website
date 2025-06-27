import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate request data
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist or password doesn't match
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password with hashed password in database
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Use Better-Auth API to sign in
    try {
      const result = await auth.api.signInEmail({
        body: { email, password },
        asResponse: true,
      });
      
      // Create response with the same status
      const response = NextResponse.json(
        { message: "Login successful" },
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
        const value = parts.join('=').split(';')[0];
        
        // Parse expiration date from cookie if present
        let expires;
        const expiresMatch = cookie.match(/expires=([^;]+)/);
        if (expiresMatch && expiresMatch[1]) {
          expires = new Date(expiresMatch[1]);
        }
        
        response.cookies.set({
          name,
          value,
          httpOnly: cookie.includes('HttpOnly'),
          secure: cookie.includes('Secure'),
          sameSite: cookie.includes('SameSite=Lax') ? 'lax' : 
                   cookie.includes('SameSite=Strict') ? 'strict' : 'none',
          expires,
          path: "/",
        });
      });

      return response;
    } catch (error) {
      console.error('Better-Auth sign in error:', error);
      return NextResponse.json(
        { message: "Authentication failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
