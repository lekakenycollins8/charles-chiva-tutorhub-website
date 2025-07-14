"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

// Map ResourceForm fileType to upload API fileType
function mapFileTypeToApiType(fileType: string): string {
  // Map ResourceForm fileType values to API fileType values
  switch (fileType) {
    case "PDF":
    case "Document":
    case "Presentation":
    case "Spreadsheet":
      return "document";
    case "Video":
    case "Audio":
      return "video";
    case "Image":
      return "image";
    default:
      // Default to document for other types
      return "document";
  }
}

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
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isPaid = formData.get('isPaid') === 'true';
    const fileType = formData.get('fileType') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const fileSize = parseInt(formData.get('fileSize') as string, 10);
    const price = isPaid ? parseFloat(formData.get('price') as string) : null;

    // Validate required fields
    if (!title || !description || !category || !fileType || !fileUrl) {
      return {
        success: false,
        message: 'Missing required fields'
      };
    }

    // Create resource in database
    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileType,
        isPaid,
        price,
        category,
        fileUrl,
        fileSize,
      }
    });

    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath("/resources");

    return {
      success: true,
      resource
    };
  } catch (error) {
    console.error("Error creating resource:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create resource" 
    };
  }
}

// Function to update an existing resource
export async function updateResource(id: string, formData: FormData) {
  try {
    // Find existing resource
    const existingResource = await prisma.resource.findUnique({
      where: { id }
    });
    
    if (!existingResource) {
      return {
        success: false,
        message: `Resource with ID ${id} not found`
      };
    }
    
    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const isPaid = formData.get('isPaid') === 'true';
    const fileType = formData.get('fileType') as string;
    const fileUrl = formData.get('fileUrl') as string;
    const price = isPaid ? parseFloat(formData.get('price') as string) : null;

    // Validate required fields
    if (!title || !description || !category || !fileType) {
      return {
        success: false,
        message: 'Missing required fields'
      };
    }
    
    // Prepare update data
    const updateData: any = {
      title,
      description,
      category,
      isPaid,
      price,
      fileType
    };
    
    // Only update file-related fields if a new file was uploaded
    if (fileUrl && fileUrl !== existingResource.fileUrl) {
      updateData.fileUrl = fileUrl;
      updateData.fileSize = parseInt(formData.get('fileSize') as string, 10);
    }
    
    // Update resource in database
    const resource = await prisma.resource.update({
      where: { id },
      data: updateData
    });
    
    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath("/resources");
    revalidatePath(`/resources/${resource.id}`);
    
    return {
      success: true,
      resource
    };
  } catch (error) {
    console.error('Error updating resource:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while updating the resource'
    };
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
