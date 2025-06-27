import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { cookies, headers } from "next/headers";

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Better Auth instance
export const auth = betterAuth({
  // Use the secret from environment variables
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this-in-production",
  
  // Set the base URL for your application
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Use Prisma adapter for database operations
  database: prismaAdapter(prisma, { provider: "mongodb" }),
  
  // Enable email and password authentication for admin
  emailAndPassword: {
    enabled: true,
    // Add validation rules
    minPasswordLength: 8,
    maxPasswordLength: 100,
  },
  
  // Configure session settings
  session: {
    // Set session expiration to 7 days
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  },
  
  // Add debug mode in development
  debug: process.env.NODE_ENV !== "production",
});

/**
 * Helper function to get the current session
 * This can be used in server components and server actions
 */
export async function getSession() {
  try {
    const cookieHeader = cookies().toString();
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

/**
 * Helper function to check if the current user is authenticated
 * This can be used in server components and server actions
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Helper function to check if the current user is an admin
 * This can be used in server components and server actions
 */
export async function isAdmin() {
  const session = await getSession();
  // Check if user exists and has custom data with role field
  return !!session?.user && (session.user as any).role === "admin";
}

// Export auth instance for use in other files
export default auth;
