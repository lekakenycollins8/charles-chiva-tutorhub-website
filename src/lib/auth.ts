import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Better Auth instance
export const auth = betterAuth({
  // Use the secret from environment variables
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this-in-production",
  
  // Set the base URL for your application
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  
  // Use Prisma adapter for database operations
  database: prismaAdapter(prisma, {
    provider: "mongodb", // Using MongoDB as specified in project requirements
  }),
  
  // Enable email and password authentication for admin
  emailAndPassword: {
    enabled: true,
  },
  
  // Configure session settings
  session: {
    // Set session expiration to 7 days
    expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
  },
  
  // Configure user settings
  user: {
    // We'll handle admin role in our application logic
  },
});

// Export auth instance for use in other files
export default auth;
