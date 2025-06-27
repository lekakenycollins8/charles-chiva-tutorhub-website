"use server";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession, isAdmin, hashPassword } from "../auth";
import { ObjectId } from "mongodb";
import { signIn, signOut } from "next-auth/react";
import { authOptions } from "../auth";

const prisma = new PrismaClient();

type LoginData = {
  email: string;
  password: string;
};

type SignupData = {
  name: string;
  email: string;
  password: string;
};

/**
 * Server action to handle admin signup
 */
export async function signupAdmin(data: SignupData) {
  try {
    // Check if user already exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Generate a proper MongoDB ObjectId
    const objectId = new ObjectId().toString();
    
    // Hash the password
    const hashedPassword = await hashPassword(data.password);
    
    // Create the user in our database with hashed password
    const newUser = await prisma.user.create({
      data: {
        id: objectId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "admin",
        emailVerified: true, // Auto-verify for admin signup
      },
    });
    
    console.log("Admin user created successfully:", {
      userId: objectId,
      email: data.email,
    });

    return {
      success: true,
      message: "Admin user created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Error signing up admin:", error);
    return {
      success: false,
      message: `Failed to create admin: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Server action to handle admin login
 */
export async function loginAdmin(data: LoginData) {
  try {
    // First check if the user exists in our database and is an admin
    const dbUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    // If user doesn't exist in our database or is not an admin, deny access immediately
    if (!dbUser || dbUser.role !== "admin") {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
    
    // Use NextAuth's getServerSession to create a session
    // The actual authentication happens in the NextAuth handler through the credentials provider
    // This server action just returns the result to the client
    
    // Since we can't directly call signIn from a server action,
    // we'll redirect to the NextAuth sign-in page with callbackUrl
    
    return {
      success: true,
      message: "Redirecting to login...",
      redirectToSignIn: true,
    };
  } catch (error) {
    console.error("Database error during login:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

/**
 * Server action to handle admin logout
 */
export async function logoutAdmin() {
  try {
    // With NextAuth, we need to redirect to the signOut endpoint
    // This will clear the session and redirect to the login page
    redirect("/api/auth/signout");
  } catch (error) {
    console.error("Error logging out:", error);
    return {
      success: false,
      message: "An error occurred during logout",
    };
  }
}

/**
 * Server action to get admin session
 */
export async function getAdminSession() {
  try {
    // Get session from NextAuth using the helper function
    const session = await getSession();
    
    if (!session?.user) {
      console.log("No user in NextAuth session");
      return null;
    }
    
    // Since we're using NextAuth with our database, we don't need to fetch additional user data
    // The session already contains all the information we need including the role
    
    // Verify that the user is an admin
    if (session.user.role === "admin") {
      return {
        user: {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role,
        },
        expires: session.expires || new Date(),
      };
    } else {
      console.log("User is not an admin:", {
        email: session.user.email,
        role: session.user.role,
      });
      return null;
    }
  } catch (error) {
    console.error("Error getting admin session:", error);
    return null;
  }
}

/**
 * Server action to check if user is authenticated and has admin role
 */
export async function checkAdminAuth() {
  try {
    // Get session using getAdminSession which now uses NextAuth
    const session = await getAdminSession();
    
    if (!session || !session.user) {
      return { authenticated: false };
    }
    
    return { 
      authenticated: true, 
      user: { 
        id: session.user.id, 
        name: session.user.name, 
        email: session.user.email,
        role: session.user.role, 
      } 
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return { authenticated: false };
  }
}
