"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
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
    
    // Upload file to Cloudinary via our API endpoint
    const fileType = formData.get("fileType") as string || "document";
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("fileType", fileType);
    
    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/upload`, {
      method: "POST",
      body: uploadFormData,
    });
    
    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || "Failed to upload file");
    }
    
    const uploadResult = await uploadResponse.json();
    
    // Prepare resource data
    const isPaid = formData.get("isPaid") === "true";
    const resourceData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      fileUrl: uploadResult.url,
      fileType: uploadResult.type,
      fileSize: uploadResult.size,
      isPaid,
      category: formData.get("category") as string,
    };
    
    // Add price if it's a paid resource
    if (isPaid) {
      resourceData.price = parseFloat(formData.get("price") as string);
    } else {
      resourceData.price = null;
    }
    
    // Create resource in database
    const resource = await prisma.resource.create({
      data: resourceData
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
      // Upload file to Cloudinary via our API endpoint
      const uploadFileType = formData.get("fileType") as string || "document";
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("fileType", uploadFileType);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/upload`, {
        method: "POST",
        body: uploadFormData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload file");
      }
      
      const uploadResult = await uploadResponse.json();
      
      // Update file metadata
      fileUrl = uploadResult.url;
      fileType = uploadResult.type;
      fileSize = uploadResult.size;
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
