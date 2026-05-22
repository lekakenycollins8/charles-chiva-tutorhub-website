import { prisma } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare, hash } from "bcrypt";
import type { DefaultSession, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * NextAuth configuration options
 */
export const authOptions = {
  // Use Prisma adapter for database operations
  adapter: PrismaAdapter(prisma),
  
  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
  
  // JWT configuration
  jwt: {
    // A secret to use for key generation. Defaults to the top-level `secret`.
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
  },
  
  // Configure session settings
  session: {
    strategy: "jwt" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        // Ensure credentials are properly typed
        if (!credentials?.email || !credentials?.password || typeof credentials.password !== 'string') {
          return null;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { 
            email: credentials.email as string 
          },
        });

        // If user doesn't exist or password doesn't match
        if (!user || !user.password) {
          return null;
        }

        // Compare password with hashed password in database
        const passwordMatch = await compare(credentials.password, user.password as string);
        if (!passwordMatch) {
          return null;
        }

        // Return user data for session
        return {
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role,
          // emailVerified is DateTime? — truthy means verified, null means not verified
          emailVerified: !!user.emailVerified
        };
      }
    })
  ],
  
  // Customize JWT callbacks
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      // Add role and other custom fields to JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  
  // Configure pages for custom auth flows
  pages: {
    signIn: "/admin/login",
    signOut: "/admin/signout",
    error: "/admin/login",
  },
  
  // Add debug mode in development
  debug: process.env.NODE_ENV !== "production",
};

/**
 * Create and export the auth function
 * In NextAuth.js v5, this is the correct way to export the auth function
 */
export const auth = NextAuth(authOptions);

/**
 * Helper function to get the current session
 * This can be used in server components and server actions
 */
export async function getSession() {
  try {
    // In NextAuth.js, we use getServerSession for server-side session retrieval
    const session = await getServerSession(authOptions);
    
    // Debug session information
    if (process.env.NODE_ENV !== "production" && session) {
      console.log("Session retrieved:", {
        hasUser: !!session?.user,
        email: session?.user?.email,
        expires: session?.expires,
      });
    }
    
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
  return !!session?.user && session.user.role === "admin";
}
/**
 * Helper function to hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

// Export types for NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    emailVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      emailVerified?: boolean;
    };
  }
}
