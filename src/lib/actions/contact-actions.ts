"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import type { ContactSubmission } from "@/types/contact";
import { Prisma } from "@prisma/client";

export async function createContactSubmission(submission: ContactSubmission) {
  try {
    // Create the contact submission
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const newSubmission = await prisma.contactSubmission.create({
      data: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone || null,
        subject: submission.subject,
        message: submission.message,
        source: submission.source || "contact_page",
        status: "NEW"
      },
    });
    
    // Revalidate admin dashboard path
    revalidatePath("/admin/dashboard/contacts");
    
    return { 
      success: true, 
      data: newSubmission,
      formspreeSubmitted: false // Will be updated by client after Formspree submission
    };
  } catch (error) {
    console.error("Error creating contact submission:", error);
    return { 
      success: false, 
      error: "Failed to submit contact form. Please try again." 
    };
  }
}

export async function getContactSubmissions(filters: any = {}) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const submissions = await prisma.contactSubmission.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: submissions };
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return { success: false, error: "Failed to fetch contact submissions" };
  }
}

export async function getContactSubmissionById(id: string) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const submission = await prisma.contactSubmission.findUnique({
      where: { id }
    });
    return { success: true, data: submission };
  } catch (error) {
    console.error("Error fetching contact submission by id:", error);
    return { success: false, error: "Failed to fetch contact submission" };
  }
}

export async function updateContactSubmissionStatus(id: string, status: string) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const updatedSubmission = await prisma.contactSubmission.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/dashboard/contacts");
    revalidatePath(`/admin/dashboard/contacts/${id}`);
    return { success: true, data: updatedSubmission };
  } catch (error) {
    console.error("Error updating contact submission status:", error);
    return { success: false, error: "Failed to update submission status" };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    // Delete the submission
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    await prisma.contactSubmission.delete({
      where: { id }
    });
    
    revalidatePath("/admin/dashboard/contacts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact submission:", error);
    return { success: false, error: "Failed to delete contact submission" };
  }
}
