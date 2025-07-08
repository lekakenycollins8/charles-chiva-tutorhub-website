'use client';

import { useState, useEffect } from 'react';
import { getBlogPostBySlug } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import '@/styles/tiptap.css';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { success, data, error } = await getBlogPostBySlug(params.slug);
        if (success && data) {
          // Transform post to match BlogPost interface
          const transformedData = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt || '',
            content: data.content,
            coverImage: data.featuredImage || undefined,
            isPublished: data.published,
            isDraft: !data.published,
            authorId: data.author,
            categories: [],
            tags: [],
            relatedPosts: [],
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
          setPost(transformedData);
        } else {
          setError(error || 'Blog post not found');
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || 'Blog post not found'}</h1>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <Link href="/blog" className="inline-block mb-8">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="text-gray-500 mb-8">
          Published on {new Date(post.createdAt).toLocaleDateString()}
        </div>
        
        {post.coverImage && (
          <div className="relative w-full h-80 mb-8 overflow-hidden rounded-lg">
            <Image 
              src={post.coverImage} 
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none">
          <div 
            className="ProseMirror-wrapper" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </article>
    </div>
  );
}
