import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/actions/blog-actions';
import { getResources } from '@/lib/actions/resource-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://chivatutorhub.com';

  // Fetch all published blog posts
  const { success: blogSuccess, data: blogPosts } = await getBlogPosts({ 
    isPublished: true 
  });

  // Fetch all resources
  const { success: resourcesSuccess, data: resources } = await getResources({ 
    limit: 1000 
  });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogSuccess && blogPosts
    ? blogPosts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    : [];

  // Resource pages
  const resourcePages: MetadataRoute.Sitemap = resourcesSuccess && resources
    ? resources.map((resource: any) => ({
        url: `${baseUrl}/resources/${resource.id}`,
        lastModified: new Date(resource.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    : [];

  return [...staticPages, ...blogPages, ...resourcePages];
}
