import { getBlogPostBySlug, getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Tag, FolderOpen, Link2, Calendar, Clock } from 'lucide-react';
import ScrollToTopButton from '@/components/blog/ScrollToTopButton';
import SocialShareButtons from '@/components/blog/SocialShareButtons';
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
    <Card className="group h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/blog/${relatedPost.slug}`} className="block">
          {relatedPost.coverImage && (
            <div className="relative w-full h-48 overflow-hidden">
              <Image 
                src={relatedPost.coverImage} 
                alt={relatedPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          <div className="p-6">
            <h4 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {relatedPost.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {relatedPost.excerpt}
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Get the slug from params
  const { slug } = await params;
  
  // Normalize the slug: decode URL-encoded characters and ensure dashes instead of spaces
  const normalizedSlug = decodeURIComponent(slug).replace(/ /g, '-');
  
  console.log('Fetching blog post with normalized slug:', normalizedSlug);
  
  // Fetch blog post data server-side with normalized slug
  const { success, data, error: fetchError } = await getBlogPostBySlug(normalizedSlug);
  
  // Handle error case
  if (!success || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">!</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">{fetchError || 'The blog post you\'re looking for doesn\'t exist or has been moved.'}</p>
          <Link href="/blog">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/blog">
            <Button 
              variant="outline" 
              className="border-gray-200 hover:bg-gray-50 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
          
          <SocialShareButtons url={`https://chivatutorhub.com/blog/${post.slug}`} title={post.title} />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-10">
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category, index) => (
                  <Badge key={`cat-${index}`} className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                    <FolderOpen className="h-3 w-3 mr-1" />
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{calculateReadingTime(post.content)} min read</span>
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={`tag-${index}`} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Featured Image */}
          {post.coverImage && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <div className="relative aspect-[16/9] w-full">
                <Image 
                  src={post.coverImage} 
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          )}
          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            {/* Social Share Bar */}
            <div className="flex items-center justify-end mb-8 p-4 bg-gray-50 rounded-xl">
              <SocialShareButtons url={`${process.env.NEXT_PUBLIC_APP_URL || 'https://tutorhub.com'}/blog/${post.slug}`} title={post.title} />
            </div>
            
            {/* Article Content */}
            <div className="prose prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-hr:my-12 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:rounded-xl">
              <div 
                className="ProseMirror" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
            
            {/* Tags Section */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 px-3 py-1 cursor-pointer">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Related Posts Section */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Related Articles</h3>
                  <p className="text-gray-600">Continue your reading journey</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {post.relatedPosts.map((relatedPostId) => (
                  <RelatedPostCard key={relatedPostId} postId={relatedPostId} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}