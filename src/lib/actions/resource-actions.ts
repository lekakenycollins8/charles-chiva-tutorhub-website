"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface ResourceData {
  id?: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPaid: boolean;
  price?: number | null;
  category: string;
}

// Function to fetch all resources
export async function getResources(filters?: { category?: string; isPaid?: boolean }) {
  try {
    // Build query conditions
    const where: any = {};
    
    if (filters) {
      if (filters.category) {
        where.category = filters.category;
      }
      
      if (filters.isPaid !== undefined) {
        where.isPaid = filters.isPaid;
      }
    }
    
    // Fetch resources directly from database
    const resources = await prisma.resource.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return { success: true, resources };
  } catch (error) {
    console.error("Error fetching resources:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch resources" };
  }
}

// Function to fetch a single resource
export async function getResource(id: string) {
  try {
    // Fetch resource directly from database
    const resource = await prisma.resource.findUnique({
      where: { id }
    });
    
    if (!resource) {
      throw new Error(`Resource with ID ${id} not found`);
    }
    
    return { success: true, resource };
  } catch (error) {
    console.error(`Error fetching resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch resource" };
  }
}

// Function to create a new resource
export async function createResource(formData: FormData) {
  try {
    // Handle file upload
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(path.join(uploadsDir, '.gitkeep'), '');
    } catch (error) {
      // Directory already exists or cannot be created
      console.error("Error creating uploads directory:", error);
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // File metadata
    const fileUrl = `/uploads/${fileName}`;
    const fileType = file.type;
    const fileSize = file.size;
    
    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        fileUrl,
        fileType,
        fileSize,
        isPaid: formData.get("isPaid") === "true",
        price: formData.get("isPaid") === "true" ? parseFloat(formData.get("price") as string) : null,
        category: formData.get("category") as string,
        downloads: 0
      }
    });
    
    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath("/resources");
    
    return { success: true, resource };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to create resource" };
  }
}

// Function to update a resource
export async function updateResource(id: string, formData: FormData) {
  try {
    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    
    if (!existingResource) {
      throw new Error(`Resource with ID ${id} not found`);
    }
    
    // Check if a new file is being uploaded
    const file = formData.get("file") as File;
    let fileUrl = existingResource.fileUrl;
    let fileType = existingResource.fileType;
    let fileSize = existingResource.fileSize;
    
    if (file && file.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await writeFile(path.join(uploadsDir, '.gitkeep'), '');
      } catch (error) {
        // Directory already exists or cannot be created
        console.error("Error creating uploads directory:", error);
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Convert file to buffer and save it
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      // Update file metadata
      fileUrl = `/uploads/${fileName}`;
      fileType = file.type;
      fileSize = file.size;
    }
    
    // Prepare resource data for update
    const isPaid = formData.get("isPaid") === "true";
    const updateData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      fileUrl,
      fileType,
      fileSize,
      isPaid,
      category: formData.get("category") as string,
    };
    
    // Add price if it's a paid resource
    if (isPaid) {
      updateData.price = parseFloat(formData.get("price") as string);
    } else {
      updateData.price = null;
    }
    
    // Update the resource in database
    const resource = await prisma.resource.update({
      where: { id },
      data: updateData
    });
    
    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath(`/admin/dashboard/resources/${id}`);
    revalidatePath("/resources");
    revalidatePath(`/resources/${id}`);
    
    return { success: true, resource };
  } catch (error) {
    console.error(`Error updating resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to update resource" };
  }
}

// Function to delete a resource
export async function deleteResource(id: string) {
  try {
    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    
    if (!existingResource) {
      throw new Error(`Resource with ID ${id} not found`);
    }
    
    // Delete the resource from database
    await prisma.resource.delete({
      where: { id }
    });
    
    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath("/resources");
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to delete resource" };
  }
}

// Function to increment download count
export async function incrementDownloadCount(id: string) {
  try {
    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    
    if (!existingResource) {
      throw new Error(`Resource with ID ${id} not found`);
    }
    
    // Increment download count in database
    await prisma.resource.update({
      where: { id },
      data: {
        downloads: { increment: 1 }
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing download count for resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to increment download count" };
  }
}
