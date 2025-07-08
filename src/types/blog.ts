export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  isDraft: boolean;
  publishedAt?: Date;
  authorId: string;
  categories: string[];
  tags: string[];
  relatedPosts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostResponse {
  success: boolean;
  data: BlogPost | BlogPost[] | null;
  error: string | null;
}
