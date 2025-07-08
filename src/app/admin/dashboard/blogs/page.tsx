'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/actions/blog-actions";
import { BlogPost } from "@/types/blog";

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { success, data } = await getBlogPosts({});
        if (success && data) {
          // Transform each post to match BlogPost interface
          const transformedData = data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            coverImage: post.featuredImage || undefined,
            isPublished: post.published,
            isDraft: !post.published,
            authorId: post.author,
            categories: [],
            tags: [],
            relatedPosts: [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
          }));
          setPosts(transformedData);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/dashboard/blogs/new">
          <Button>
            <Plus className="mr-2" /> New Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.excerpt}</p>
              <div className="mt-2 text-sm text-gray-500">
                {post.isPublished ? 'Published' : 'Draft'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
