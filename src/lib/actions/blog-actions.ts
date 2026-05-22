"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { BlogPost } from "@/types/blog";
import { getSession } from "@/lib/auth";
import { normalizeSlug } from "@/lib/utils/slug-utils";

export async function createBlogPost(blogPost: BlogPost) {
  try {
    // Normalize the slug to ensure consistent format
    const normalizedSlug = normalizeSlug(blogPost.slug);
    console.log('Creating blog post with normalized slug:', normalizedSlug);
    console.log('Original blog post data:', blogPost);
    
    // Get the current user session
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    // Ensure isPublished and isDraft are consistent
    const isPublished = blogPost.isPublished || false;
    const isDraft = !isPublished; // isDraft is opposite of isPublished
    
    // Create the blog post with all required fields
    await prisma.blogPost.create({
      data: {
        title: blogPost.title,
        slug: normalizedSlug, // Use normalized slug
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        coverImage: blogPost.coverImage,
        isPublished: isPublished,
        isDraft: isDraft,
        publishedAt: isPublished ? new Date() : null,
        // Use the author relation with connect instead of direct authorId
        author: {
          connect: {
            id: session.user.id
          }
        },
        categories: blogPost.categories || [],
        tags: blogPost.tags || []
      },
    });
    revalidatePath("/admin/dashboard/blogs");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { message: "Database Error: Failed to Create Blog." };
  }
}

export async function getBlogPosts(filters: any = {}) {
  try {
    const { page, limit, ...whereFilters } = filters;
    
    const query: any = {
      where: whereFilters,
      orderBy: { createdAt: 'desc' }
    };
    
    if (page && limit) {
      const skip = (page - 1) * limit;
      query.skip = skip;
      query.take = limit;
    }
    
    const posts = await prisma.blogPost.findMany(query);
    
    if (page && limit) {
      const total = await prisma.blogPost.count({ where: whereFilters });
      return { 
        success: true, 
        data: posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    }
    
    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { success: false, error: "Failed to fetch blog posts" };
  }
}

export async function getBlogPostById(id: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id }
    });
    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching blog post by id:", error);
    return { success: false, error: "Failed to fetch blog post" };
  }
}

export async function updateBlogPost(id: string, updateData: Partial<BlogPost>) {
  try {
    // If slug is being updated, normalize it
    let dataToUpdate: any = {...updateData};
    
    if (updateData.slug) {
      const normalizedSlug = normalizeSlug(updateData.slug);
      console.log('Updating blog post with normalized slug:', normalizedSlug);
      dataToUpdate.slug = normalizedSlug;
    }
    
    // Ensure isPublished and isDraft are consistent
    if ('isPublished' in updateData) {
      const isPublished = updateData.isPublished || false;
      dataToUpdate.isPublished = isPublished;
      dataToUpdate.isDraft = !isPublished;
      // Update publishedAt when publishing
      if (isPublished && !dataToUpdate.publishedAt) {
        dataToUpdate.publishedAt = new Date();
      } else if (!isPublished) {
        dataToUpdate.publishedAt = null;
      }
    }
    
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: dataToUpdate
    });
    revalidatePath("/admin/dashboard/blogs");
    revalidatePath("/blog");
    revalidatePath(`/blog/${updatedPost.slug}`);
    return { success: true, data: updatedPost };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/dashboard/blogs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    // Normalize the slug to ensure consistent format (replace spaces with dashes)
    const normalizedSlug = slug.replace(/ /g, '-');
    console.log('Looking for blog post with normalized slug:', normalizedSlug);
    
    // First try: exact match with normalized slug
    const post = await prisma.blogPost.findUnique({
      where: { slug: normalizedSlug }
    });
    
    if (post) {
      console.log('Found blog post with exact slug match:', post.title);
      return { success: true, data: post };
    }
    
    console.log('No exact match found, trying case-insensitive search');
    
    // Second try: case-insensitive search
    const caseInsensitivePosts = await prisma.blogPost.findMany({
      where: {
        slug: {
          mode: 'insensitive',
          equals: normalizedSlug
        }
      },
      take: 1
    });
    
    if (caseInsensitivePosts.length > 0) {
      console.log('Found blog post with case-insensitive match:', caseInsensitivePosts[0].title);
      return { success: true, data: caseInsensitivePosts[0] };
    }
    
    console.log('No case-insensitive match found, trying contains search');
    
    // Third try: contains search without dashes
    const cleanSlug = normalizedSlug.replace(/-/g, '').toLowerCase();
    console.log('Searching with cleaned slug:', cleanSlug);
    
    const similarPosts = await prisma.blogPost.findMany({
      where: {
        slug: {
          contains: cleanSlug,
          mode: 'insensitive'
        }
      },
      take: 1
    });
    
    if (similarPosts.length > 0) {
      console.log('Found blog post with contains search:', similarPosts[0].title);
      return { success: true, data: similarPosts[0] };
    }
    
    // Last attempt: get all posts and log them for debugging
    const allPosts = await prisma.blogPost.findMany({
      select: { id: true, title: true, slug: true }
    });
    
    console.log('No blog post found. Available posts:', JSON.stringify(allPosts));
    return { success: false, error: "Blog post not found" };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return { success: false, error: "Failed to fetch blog post" };
  }
}
