'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, Loader2, Edit, Trash2, Eye, Calendar, Tag, Hash } from "lucide-react";
import Link from "next/link";
import { getBlogPosts, deleteBlogPost } from "@/lib/actions/blog-actions";
import { BlogPost } from "@/types/blog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
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
          coverImage: post.coverImage || undefined,
          isPublished: post.isPublished,
          isDraft: post.isDraft,
          authorId: post.author?.id,
          categories: post.categories || [],
          tags: post.tags || [],
          relatedPosts: post.relatedPosts || [],
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
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const { success } = await deleteBlogPost(id);
      if (success) {
        // Refresh the posts list
        fetchPosts();
      } else {
        alert("Failed to delete the blog post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      alert("An error occurred while deleting the blog post.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Link href="/admin/dashboard/blogs/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Create, edit, and manage your blog posts from this dashboard.
        </p>
        <Separator />
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({posts.filter(post => post.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="drafts">
            Drafts ({posts.filter(post => !post.isPublished).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {renderPosts(posts)}
        </TabsContent>
        
        <TabsContent value="published" className="mt-6">
          {renderPosts(posts.filter(post => post.isPublished))}
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-6">
          {renderPosts(posts.filter(post => !post.isPublished))}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderPosts(postsToRender: BlogPost[]) {
    if (postsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No blog posts found in this category</p>
          <Link href="/admin/dashboard/blogs/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Create your first post
            </Button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {postsToRender.map(post => (
          <Card key={post.id} className="overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
              {post.coverImage ? (
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                  <p className="text-muted-foreground">No cover image</p>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={post.isPublished ? "green" : "yellow"}>
                  {post.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'No date'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground mb-4">{post.excerpt}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories && post.categories.length > 0 ? (
                  post.categories.map(category => (
                    <Badge key={category} variant="blue" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {category}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No categories</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.length > 0 ? (
                  post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
              <div className="flex gap-2">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                </Link>
                <Link href={`/admin/dashboard/blogs/${post.id}`}>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </Button>
                </Link>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive" className="gap-1">
                    {deleting === post.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the blog post
                      <strong> "{post.title}"</strong> and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(post.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
}