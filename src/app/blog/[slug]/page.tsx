import { getBlogPostBySlug, getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Tag, FolderOpen, Link2 } from 'lucide-react';
import '@/styles/tiptap.css';


// Related Post Card Component
async function RelatedPostCard({ postId }: { postId: string }) {
  const { success, data } = await getBlogPosts();
  
  if (!success || !data) {
    return null;
  }
  
  const relatedPost = data.find((post: any) => post.id === postId)

  if (!relatedPost) {
    return null;
  }
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <Link href={`/blog/${relatedPost.slug}`} className="no-underline">
          {relatedPost.coverImage && (
            <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
              <Image 
                src={relatedPost.coverImage} 
                alt={relatedPost.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <h4 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">{relatedPost.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{relatedPost.excerpt}</p>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Get the slug from params
  const { slug } = params;
  
  // Normalize the slug: decode URL-encoded characters and ensure dashes instead of spaces
  const normalizedSlug = decodeURIComponent(slug).replace(/ /g, '-');
  
  console.log('Fetching blog post with normalized slug:', normalizedSlug);
  
  // Fetch blog post data server-side with normalized slug
  const { success, data, error: fetchError } = await getBlogPostBySlug(normalizedSlug);
  
  // Handle error case
  if (!success || !data) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{fetchError || 'Blog post not found'}</h1>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    );
  }
  
  // Transform post to match BlogPost interface
  const post: BlogPost = {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || '',
    content: data.content,
    coverImage: data.coverImage || undefined,
    isPublished: data.isPublished,
    isDraft: data.isDraft,
    authorId: data.authorId,
    categories: data.categories || [],
    tags: data.tags || [],
    relatedPosts: data.relatedPosts || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };

  // No need for loading state in server component

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
        
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:my-4 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:underline prose-img:rounded-lg">
          <div 
            className="ProseMirror" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
        
        {/* Tags and Categories Section */}
        <div className="mt-12">
          <Separator className="my-8" />
          
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="blue">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {post.categories && post.categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="h-4 w-4" />
                <h3 className="text-lg font-semibold">Categories</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category, index) => (
                  <Badge key={index} variant="green">{category}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Related Posts Section */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="mt-12">
            <Separator className="my-8" />
            <div className="flex items-center gap-2 mb-6">
              <Link2 className="h-4 w-4" />
              <h3 className="text-xl font-semibold">Related Posts</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.relatedPosts.map((relatedPostId) => (
                <RelatedPostCard key={relatedPostId} postId={relatedPostId} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
