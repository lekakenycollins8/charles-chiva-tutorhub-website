"use server";

import { PrismaClient } from "@prisma/client";
import { cookies, headers } from "next/headers";
import { compare, hash } from "bcrypt";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

const prisma = new PrismaClient();

/**
 * Server action to handle admin signup
 */
export async function signupAdmin(email: string, password: string, name: string) {
  try {
    // First check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: `User with email ${email} already exists` };
    }

    // Create user in our database first
    try {
      // Hash password for database storage
      const hashedPassword = await hash(password, 10);
      
      // Create user in database
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: "admin", // Set role to admin
        },
      });
      
      // Now try to sign up with Better-Auth
      // Note: We're not using Better-Auth for actual authentication anymore
      // We're just using our own database for authentication
      // This is a workaround for the ObjectID format issue
      
      // Log the user in automatically after signup
      // We'll use our own login function instead of Better-Auth
      return { success: true, redirect: true };
    } catch (dbError: any) {
      console.error("Database user creation error:", dbError);
      return { 
        success: false, 
        error: "Failed to create user in database. Please try again or contact support."
      };
    }
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An error occurred during signup" };
  }
}

/**
 * Server action to handle admin login
 */
export async function loginAdmin(email: string, password: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist or password doesn't match
    if (!user || !user.password) {
      return { success: false, error: "Invalid email or password" };
    }

    // Compare password with hashed password in database
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return { success: false, error: "Unauthorized access" };
    }

    // Sign in using Better-Auth API
    try {
      // Create session using Better-Auth API
      await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: await headers(),
      });

      return { success: true };
    } catch (apiError) {
      if (apiError instanceof APIError) {
        console.error("Better-Auth API error:", apiError.message, apiError.status);
        return { success: false, error: apiError.message };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

/**
 * Server action to handle admin logout
 */
export async function logoutAdmin() {
  try {
    // Sign out using Better-Auth API
    try {
      await auth.api.signOut({
        headers: await headers(),
      });
      
      return { success: true };
    } catch (apiError) {
      if (apiError instanceof APIError) {
        console.error("Better-Auth API error:", apiError.message, apiError.status);
        return { success: false, error: apiError.message };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An error occurred during logout" };
  }
}

/**
 * Server action to create a new admin user
 */
export async function createAdmin(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new admin user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Create admin error:", error);
    return { success: false, error: "An error occurred while creating admin" };
  }
}

/**
 * Server action to check if user is authenticated and has admin role
 */
export async function checkAdminAuth() {
  try {
    // Get session using Better-Auth API
    try {
      const sessionData = await auth.api.getSession({
        headers: await headers(),
      });
      
      if (!sessionData || !sessionData.session || !sessionData.user) {
        return { authenticated: false };
      }

      // Get user from database to verify role
      const user = await prisma.user.findUnique({
        where: { id: sessionData.user.id },
      });

      if (!user || user.role !== "admin") {
        return { authenticated: false };
      }

      return { authenticated: true, user: { id: user.id, name: user.name, email: user.email } };
    } catch (apiError) {
      if (apiError instanceof APIError) {
        console.error("Better-Auth API error:", apiError.message, apiError.status);
        return { authenticated: false };
      }
      throw apiError;
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return { authenticated: false };
  }
}
