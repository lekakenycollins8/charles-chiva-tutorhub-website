"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
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

// Types for resource filters and pagination
interface ResourceFilters {
  category?: string;
  isPaid?: boolean;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Function to fetch all resources with pagination and filtering
export async function getResources(filters: ResourceFilters = {}) {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Build query conditions
    const where: any = {};
    
    if (filters.category) {
      where.category = filters.category;
    }
    
    if (filters.isPaid !== undefined) {
      where.isPaid = filters.isPaid;
    }
    
    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } },
        { category: { contains: filters.searchQuery, mode: 'insensitive' } }
      ];
    }
    
    // Get total count for pagination
    const total = await prisma.resource.count({ where });
    
    // Fetch paginated resources
    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        isPaid: true,
        price: true,
        category: true,
        downloads: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take: limit
    });
    
    return { 
      success: true, 
      data: resources,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      error: null 
    };
  } catch (error) {
    console.error("Error fetching resources:", error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch resources" 
    };
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
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
        // Create .gitkeep to ensure the directory is tracked by git
        await writeFile(path.join(uploadsDir, '.gitkeep'), '');
      }
    } catch (error) {
      console.error("Error creating uploads directory:", error);
      return { success: false, message: 'Failed to create uploads directory' };
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
    
    if (file) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
          // Create .gitkeep to ensure the directory is tracked by git
          await writeFile(path.join(uploadsDir, '.gitkeep'), '');
        }
      } catch (error) {
        console.error("Error creating uploads directory:", error);
        return { success: false, message: 'Failed to create uploads directory' };
      }
      
      // Generate a unique filename
      const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
      
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
