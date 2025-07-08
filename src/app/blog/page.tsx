'use client';

import { useState, useEffect } from 'react';
import { getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag, FolderOpen } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use isPublished: true as per the Prisma schema
        const { success, data } = await getBlogPosts({ isPublished: true });
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
            authorId: post.author,
            categories: post.categories || [],
            tags: post.tags || [],
            relatedPosts: post.relatedPosts || [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
          }));
          setPosts(transformedData.filter(post => post.isPublished));
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
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No blog posts available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                {post.coverImage && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image 
                      src={post.coverImage} 
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center mr-1">
                        <Tag className="h-3 w-3 mr-1" />
                      </div>
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="blue" className="text-xs">{tag}</Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                  
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center mr-1">
                        <FolderOpen className="h-3 w-3 mr-1" />
                      </div>
                      {post.categories.slice(0, 2).map((category, index) => (
                        <Badge key={index} variant="green" className="text-xs">{category}</Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <span className="text-xs text-gray-500">+{post.categories.length - 2} more</span>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-sm text-gray-500 border-t pt-3">
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
