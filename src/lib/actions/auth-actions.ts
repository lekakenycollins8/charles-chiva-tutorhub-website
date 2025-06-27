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
    // First, try to sign up with Better-Auth
    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
        headers: await headers(),
      });
      
      // If Better-Auth signup succeeds, create user in our database
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
        
        return { success: true };
      } catch (dbError: any) {
        console.error("Database user creation error:", dbError);
        
        // If database creation fails, try to delete the Better-Auth user
        try {
          // Note: Better-Auth doesn't have a direct deleteUser API in the core package
          // This would typically be handled through admin APIs
          
          // For now, we'll just return an error
          return { 
            success: false, 
            error: "Failed to create user in database. Please try again or contact support."
          };
        } catch (deleteError) {
          console.error("Failed to clean up Better-Auth user after database error:", deleteError);
          return { 
            success: false, 
            error: "Account partially created. Please contact support."
          };
        }
      }
    } catch (authError: any) {
      console.error("Better-Auth signup error:", authError);
      
      // Check if user already exists in Better-Auth
      if (authError?.status === "UNPROCESSABLE_ENTITY" || 
          authError?.statusCode === 422 || 
          authError?.message?.includes("already exists")) {
        
        // Check if user exists in our database
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (!existingUser) {
          // User exists in Better-Auth but not in our database
          // Create user in our database to sync them
          try {
            const hashedPassword = await hash(password, 10);
            
            await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                name,
                role: "admin",
              },
            });
            
            return { 
              success: true, 
              message: "Your account has been synchronized with our system." 
            };
          } catch (syncError) {
            console.error("Failed to sync existing Better-Auth user with database:", syncError);
          }
        }
        
        return { success: false, error: `User with email ${email} already exists` };
      }
      
      return { success: false, error: "Authentication service error" };
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
