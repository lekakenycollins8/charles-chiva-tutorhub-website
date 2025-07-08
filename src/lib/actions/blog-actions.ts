"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { BlogPost } from "@/types/blog";
import { getSession } from "@/lib/auth";

export async function createBlogPost(blogPost: BlogPost) {
  try {
    console.log('Creating blog post with data:', blogPost);
    
    // Get the current user session
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }
    
    // Create the blog post with all required fields
    await prisma.blogPost.create({
      data: {
        title: blogPost.title,
        slug: blogPost.slug,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        coverImage: blogPost.coverImage,
        isPublished: blogPost.isPublished || false,
        isDraft: blogPost.isDraft !== false, // Default to true if not provided
        publishedAt: blogPost.isPublished ? new Date() : null,
        // Use the author relation with connect instead of direct authorId
        author: {
          connect: {
            id: session.user.id
          }
        },
        categories: blogPost.categories || [],
        tags: blogPost.tags || [],
        relatedPosts: blogPost.relatedPosts || []
      },
    });
    revalidatePath("/admin/dashboard/blogs");
    return { success: true };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { message: "Database Error: Failed to Create Blog." };
  }
}

export async function getBlogPosts(filters: any = {}) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });
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
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...updateData,
        authorId: updateData.authorId
      }
    });
    revalidatePath("/admin/dashboard/blogs");
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
    const post = await prisma.blogPost.findUnique({
      where: { slug }
    });
    
    if (!post) {
      return { success: false, error: "Blog post not found" };
    }
    
    return { success: true, data: post };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return { success: false, error: "Failed to fetch blog post" };
  }
}
