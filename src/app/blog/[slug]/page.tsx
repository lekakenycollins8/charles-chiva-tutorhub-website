import { getBlogPostBySlug } from '@/lib/actions/blog-actions';
import { BlogPost } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import '@/styles/tiptap.css';


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
    categories: [],
    tags: [],
    relatedPosts: [],
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
      </article>
    </div>
  );
}
