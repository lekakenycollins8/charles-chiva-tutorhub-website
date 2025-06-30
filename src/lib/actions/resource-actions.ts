"use server";

import { revalidatePath } from "next/cache";

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
    // Build query string from filters
    let queryString = "";
    
    if (filters) {
      const params = new URLSearchParams();
      
      if (filters.category) {
        params.append("category", filters.category);
      }
      
      if (filters.isPaid !== undefined) {
        params.append("isPaid", filters.isPaid.toString());
      }
      
      queryString = params.toString() ? `?${params.toString()}` : "";
    }
    
    // Fetch resources from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources${queryString}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, resources: data.resources };
  } catch (error) {
    console.error("Error fetching resources:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch resources" };
  }
}

// Function to fetch a single resource
export async function getResource(id: string) {
  try {
    // Fetch resource from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources/${id}`, {
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, resource: data.resource };
  } catch (error) {
    console.error(`Error fetching resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to fetch resource" };
  }
}

// Function to create a new resource
export async function createResource(formData: FormData) {
  try {
    // First upload the file
    const fileFormData = new FormData();
    const file = formData.get("file") as File;
    
    if (file) {
      fileFormData.append("file", file);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/upload`, {
        method: "POST",
        body: fileFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }
      
      const uploadData = await uploadResponse.json();
      
      // Now create the resource with the file URL
      const resourceData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        fileUrl: uploadData.fileUrl,
        fileType: uploadData.fileType,
        fileSize: uploadData.fileSize,
        isPaid: formData.get("isPaid") === "true",
        price: formData.get("isPaid") === "true" ? parseFloat(formData.get("price") as string) : null,
        category: formData.get("category") as string,
      };
      
      const resourceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resourceData),
      });
      
      if (!resourceResponse.ok) {
        throw new Error(`Failed to create resource: ${resourceResponse.status}`);
      }
      
      const resourceResult = await resourceResponse.json();
      
      // Revalidate the resources path to update the UI
      revalidatePath("/admin/dashboard/resources");
      revalidatePath("/resources");
      
      return { success: true, resource: resourceResult.resource };
    } else {
      throw new Error("No file provided");
    }
  } catch (error) {
    console.error("Error creating resource:", error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to create resource" };
  }
}

// Function to update a resource
export async function updateResource(id: string, formData: FormData) {
  try {
    // Check if there's a new file to upload
    const file = formData.get("file") as File;
    let fileData = null;
    
    if (file && file.size > 0) {
      // Upload the new file
      const fileFormData = new FormData();
      fileFormData.append("file", file);
      
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/upload`, {
        method: "POST",
        body: fileFormData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }
      
      fileData = await uploadResponse.json();
    }
    
    // Prepare resource data for update
    const resourceData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      isPaid: formData.get("isPaid") === "true",
      category: formData.get("category") as string,
    };
    
    // Add file data if a new file was uploaded
    if (fileData) {
      resourceData.fileUrl = fileData.fileUrl;
      resourceData.fileType = fileData.fileType;
      resourceData.fileSize = fileData.fileSize;
    }
    
    // Add price if it's a paid resource
    if (resourceData.isPaid) {
      resourceData.price = parseFloat(formData.get("price") as string);
    }
    
    // Update the resource
    const resourceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceData),
    });
    
    if (!resourceResponse.ok) {
      throw new Error(`Failed to update resource: ${resourceResponse.status}`);
    }
    
    const resourceResult = await resourceResponse.json();
    
    // Revalidate the resources path to update the UI
    revalidatePath("/admin/dashboard/resources");
    revalidatePath(`/admin/dashboard/resources/${id}`);
    revalidatePath("/resources");
    revalidatePath(`/resources/${id}`);
    
    return { success: true, resource: resourceResult.resource };
  } catch (error) {
    console.error(`Error updating resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to update resource" };
  }
}

// Function to delete a resource
export async function deleteResource(id: string) {
  try {
    // Delete the resource
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources/${id}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete resource: ${response.status}`);
    }
    
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
    // Get the current resource
    const { success, resource } = await getResource(id);
    
    if (!success || !resource) {
      throw new Error("Resource not found");
    }
    
    // Update the resource with incremented download count
    const resourceData = {
      ...resource,
      downloads: (resource.downloads || 0) + 1,
    };
    
    // Update the resource
    const resourceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/resources/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resourceData),
    });
    
    if (!resourceResponse.ok) {
      throw new Error(`Failed to update download count: ${resourceResponse.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing download count for resource ${id}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Failed to update download count" };
  }
}
