import { getBlogPostBySlug, getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Tag, FolderOpen, Link2, Calendar, Clock, Share2, Bookmark, Facebook, Twitter, Linkedin, Eye, User, Heart, MessageCircle } from 'lucide-react';
import ScrollToTopButton from '@/components/blog/ScrollToTopButton';
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
      {/* Floating Navigation */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/blog">
          <Button 
            variant="outline" 
            className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-full px-4 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {post.coverImage ? (
          <div className="relative h-[70vh] min-h-[500px] w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
            <Image 
              src={post.coverImage} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-end">
              <div className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto text-white">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories && post.categories.slice(0, 2).map((category, index) => (
                      <Badge key={`cat-${index}`} className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <FolderOpen className="h-3 w-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                    {post.title}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-white/80 gap-6">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="font-medium">{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="font-medium">{calculateReadingTime(post.content)} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 py-24 px-4 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-20 w-20 h-20 bg-white/10 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
              <div className="max-w-4xl mx-auto text-white text-center">
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {post.categories && post.categories.slice(0, 2).map((category, index) => (
                    <Badge key={`cat-${index}`} className="bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition-colors">
                      <FolderOpen className="h-3 w-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                  {post.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-white/80 gap-6 justify-center">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">{calculateReadingTime(post.content)} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12 border border-gray-100">
            {/* Social Share Bar */}
            <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">2.3k views</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">156 likes</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 mr-2">Share:</span>
                <Button variant="outline" size="sm" className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
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