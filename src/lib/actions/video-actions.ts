"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { Video } from "@/types/video";

// Types for video filters and pagination
interface VideoFilters {
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// Function to fetch all videos with pagination
export async function getVideos(filters: VideoFilters = {}) {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;
    
    // Build query conditions
    const where: any = {};
    
    if (filters.searchQuery) {
      where.OR = [
        { title: { contains: filters.searchQuery, mode: 'insensitive' } },
        { description: { contains: filters.searchQuery, mode: 'insensitive' } }
      ];
    }
    
    // Get total count for pagination
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const total = await prisma.video.count({ where });
    
    // Fetch paginated videos
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    
    return { 
      success: true, 
      data: videos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      error: null 
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch videos" 
    };
  }
}

// Function to fetch a single video
export async function getVideo(id: string) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const video = await prisma.video.findUnique({
      where: { id }
    });
    
    if (!video) {
      throw new Error(`Video with ID ${id} not found`);
    }
    
    return { success: true, data: video, error: null };
  } catch (error) {
    console.error(`Error fetching video ${id}:`, error);
    return { 
      success: false, 
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch video" 
    };
  }
}

// Function to create a new video
export async function createVideo(data: {
  title: string;
  description: string;
  videoUrl: string;
  videoType: string;
  videoSize: number;
  thumbnailUrl?: string;
}) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const video = await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        videoUrl: data.videoUrl,
        videoType: data.videoType,
        videoSize: data.videoSize,
        thumbnailUrl: data.thumbnailUrl,
        views: 0
      }
    });
    
    // Revalidate paths to update the UI
    revalidatePath("/admin/dashboard/videos");
    revalidatePath("/");
    
    return { success: true, data: video, error: null };
  } catch (error) {
    console.error("Error creating video:", error);
    return { 
      success: false, 
      data: null,
      error: error instanceof Error ? error.message : "Failed to create video" 
    };
  }
}

// Function to update a video
export async function updateVideo(id: string, data: {
  title?: string;
  description?: string;
  videoUrl?: string;
  videoType?: string;
  videoSize?: number;
  thumbnailUrl?: string;
}) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });
    
    if (!existingVideo) {
      throw new Error(`Video with ID ${id} not found`);
    }
    
    // Update the video in database
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const video = await prisma.video.update({
      where: { id },
      data
    });
    
    // Revalidate paths to update the UI
    revalidatePath("/admin/dashboard/videos");
    revalidatePath(`/admin/dashboard/videos/${id}`);
    revalidatePath("/");
    
    return { success: true, data: video, error: null };
  } catch (error) {
    console.error(`Error updating video ${id}:`, error);
    return { 
      success: false, 
      data: null,
      error: error instanceof Error ? error.message : "Failed to update video" 
    };
  }
}

// Function to delete a video
export async function deleteVideo(id: string) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });
    
    if (!existingVideo) {
      throw new Error(`Video with ID ${id} not found`);
    }
    
    // Delete the video from database
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    await prisma.video.delete({
      where: { id }
    });
    
    // Revalidate paths to update the UI
    revalidatePath("/admin/dashboard/videos");
    revalidatePath("/");
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting video ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete video" 
    };
  }
}

// Function to increment view count
export async function incrementViewCount(id: string) {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    // Check if video exists
    const existingVideo = await prisma.video.findUnique({
      where: { id }
    });
    
    if (!existingVideo) {
      throw new Error(`Video with ID ${id} not found`);
    }
    
    // Increment view count in database
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    await prisma.video.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error(`Error incrementing view count for video ${id}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to increment view count" 
    };
  }
}

// Function to get featured videos (most recent 4)
export async function getFeaturedVideos() {
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4
    });
    
    return { success: true, data: videos, error: null };
  } catch (error) {
    console.error("Error fetching featured videos:", error);
    return { 
      success: false, 
      data: [],
      error: error instanceof Error ? error.message : "Failed to fetch featured videos" 
    };
  }
}
