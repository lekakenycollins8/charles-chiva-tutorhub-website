import { getBlogPosts } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

const POSTS_PER_PAGE = 9;

// Format date helper
const formatDate = (dateString: string | Date) => {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Calculate reading time helper
const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime < 1 ? 1 : readingTime;
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Fetch paginated blog posts server-side
  const { success, data, pagination, error } = await getBlogPosts({ 
    isPublished: true,
    page: currentPage,
    limit: POSTS_PER_PAGE
  });

  // Handle error state
  if (!success || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 opacity-90"></div>
          <div className="container mx-auto px-4 py-28 md:py-36 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                Insights & Resources
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Explore our collection of articles, guides, and resources to enhance your learning journey
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xl text-red-600 mb-4">Unable to load blog posts</p>
            <p className="text-gray-600">{error || 'An error occurred while fetching posts. Please try again later.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Transform posts
  const posts: BlogPost[] = data ? data.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    coverImage: post.coverImage || undefined,
    isPublished: post.isPublished,
    isDraft: post.isDraft,
    authorId: post.authorId,
    categories: post.categories || [],
    tags: post.tags || [],
    relatedPosts: post.relatedPosts || [],
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  })) : [];

  const totalPages = pagination?.totalPages || 1;
  const totalPosts = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background image or pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 opacity-90"></div>
        
        {/* Animated wave pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white opacity-10" 
               style={{
                 maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' viewBox=\'0 0 1200 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z\' fill=\'%23FFFFFF\' fill-opacity=\'1\'/%3E%3C/svg%3E")',
                 maskSize: 'cover',
                 WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' viewBox=\'0 0 1200 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z\' fill=\'%23FFFFFF\' fill-opacity=\'1\'/%3E%3C/svg%3E")',
                 WebkitMaskSize: 'cover'
               }}>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-blue-400 opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-40 h-40 rounded-full bg-purple-400 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-24 h-24 rounded-full bg-indigo-400 opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-28 md:py-36 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Insights & Resources
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Explore our collection of articles, guides, and resources to enhance your learning journey
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <p className="text-xl text-gray-600 mb-4">No blog posts found.</p>
            {false ? (
              <Button>
                Check Back Later
              </Button>
            ) : (
              <p className="text-gray-500">Check back soon for new content!</p>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post (first post) */}
            {posts.length > 0 && currentPage === 1 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="bg-blue-600 w-1 h-8 inline-block mr-3"></span>
                  Featured Article
                </h2>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      {posts[0].coverImage ? (
                        <div className="relative h-64 md:h-full">
                          <Image 
                            src={posts[0].coverImage} 
                            alt={posts[0].title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-64 md:h-full flex items-center justify-center">
                          <h3 className="text-3xl font-bold text-white px-6 text-center">{posts[0].title}</h3>
                        </div>
                      )}
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {posts[0].categories?.map((category, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">{posts[0].title}</h3>
                        <p className="text-gray-600 mb-6 line-clamp-3">{posts[0].excerpt}</p>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(posts[0].createdAt)}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{calculateReadingTime(posts[0].content)} min read</span>
                        </div>
                        <Link href={`/blog/${posts[0].slug}`}>
                          <Button className="w-full md:w-auto">
                            Read Article <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Rest of the posts */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <span className="bg-blue-600 w-1 h-8 inline-block mr-3"></span>
                Latest Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(currentPage === 1 ? posts.slice(1) : posts).map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {post.coverImage && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image 
                          src={post.coverImage} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {post.categories && post.categories.length > 0 && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                              {post.categories[0]}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="flex-grow flex flex-col p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{calculateReadingTime(post.content)} min read</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-6 px-6">
                      <Link href={`/blog/${post.slug}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="mt-12">
                <CardFooter className="flex items-center justify-between px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} • {totalPosts} total posts
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : '#'}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="ml-2">Previous</span>
                      </Button>
                    </Link>
                    <Link href={currentPage < totalPages ? `/blog?page=${currentPage + 1}` : '#'}>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                      >
                        <span className="mr-2">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}