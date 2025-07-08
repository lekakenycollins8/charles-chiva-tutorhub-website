import { getBlogPostBySlug, getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Tag, FolderOpen, Link2, Calendar, Clock, Share2, Bookmark, Facebook, Twitter, Linkedin } from 'lucide-react';
import '@/styles/tiptap.css';

// Related Post Card Component
async function RelatedPostCard({ postId }: { postId: string }) {
  const { success, data } = await getBlogPosts();
  
  if (!success || !data) {
    return null;
  }
  
  const relatedPost = data.find((post: any) => post.id === postId);

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

  // Format date in a more readable way
  const formatDate = (dateString: string | Date) => {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Calculate reading time (rough estimate)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime < 1 ? 1 : readingTime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Cover Image */}
      <div className="relative">
        {post.coverImage ? (
          <div className="relative h-[50vh] min-h-[400px] w-full">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            <Image 
              src={post.coverImage} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-white">
                  <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                  </Link>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
                  
                  <div className="flex items-center text-white/80 mt-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="mx-3">•</span>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{calculateReadingTime(post.content)} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 relative">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto text-white">
                <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
                
                <div className="flex items-center text-white/80 mt-6">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(post.createdAt)}</span>
                  <span className="mx-3">•</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{calculateReadingTime(post.content)} min read</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10">
          {/* Tags and Categories at the top */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories && post.categories.length > 0 && post.categories.map((category, index) => (
              <Badge key={`cat-${index}`} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FolderOpen className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
            
            {post.tags && post.tags.length > 0 && post.tags.map((tag, index) => (
              <Badge key={`tag-${index}`} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:my-4 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-hr:my-8">
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
                    <Badge key={index} variant="secondary">{tag}</Badge>
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
                    <Badge key={index} variant="secondary">{category}</Badge>
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
    </div>
  );
}