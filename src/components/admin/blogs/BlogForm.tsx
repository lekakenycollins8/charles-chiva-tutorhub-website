"use client";

import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import { BlogPost } from "@/types/blog";
import Tiptap from "@/components/editor/Tiptap";
import { ImageUpload } from "@/components/ui/image-upload";
import { normalizeSlug } from "@/lib/utils/slug-utils";
import { X, Plus, Tag, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/lib/actions/blog-actions";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  excerpt: z.string().min(1, { message: "Excerpt is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  coverImage: z.string().optional().nullable(),
  isPublished: z.boolean(),
  isDraft: z.boolean(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  relatedPosts: z.array(z.string()),
});

// Define the form values type explicitly
type FormValues = z.infer<typeof formSchema>;

type BlogFormProps = {
  initialData?: BlogPost;
  onSubmit: (values: FormValues) => Promise<void>;
};

export default function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      isPublished: false,
      isDraft: true,
      categories: [],
      tags: [],
      relatedPosts: [],
    },
  });

  // Watch the title field to auto-generate slug
  const title = useWatch({
    control: form.control,
    name: "title",
    defaultValue: initialData?.title || ""
  });

  // Auto-generate slug when title changes if autoSlug is enabled
  useEffect(() => {
    if (autoSlug && title) {
      form.setValue("slug", normalizeSlug(title));
    }
  }, [title, autoSlug, form]);

  // Fetch available posts for related posts selection
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const { success, data } = await getBlogPosts({});
        if (success && data) {
          // Filter out the current post if editing
          const filteredPosts = initialData
            ? data.filter((post: any) => post.id !== initialData.id)
            : data;
          
          setAvailablePosts(filteredPosts.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            coverImage: post.coverImage || undefined,
            isPublished: post.isPublished,
            isDraft: post.isDraft,
            authorId: post.author?.id,
            categories: post.categories || [],
            tags: post.tags || [],
            relatedPosts: post.relatedPosts || [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
          })));
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, [initialData]);

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim() === "") return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(newTag.trim())) {
      form.setValue("tags", [...currentTags, newTag.trim()]);
    }
    setNewTag("");
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;
    
    const currentCategories = form.getValues("categories") || [];
    if (!currentCategories.includes(newCategory.trim())) {
      form.setValue("categories", [...currentCategories, newCategory.trim()]);
    }
    setNewCategory("");
  };

  // Handle removing a category
  const handleRemoveCategory = (categoryToRemove: string) => {
    const currentCategories = form.getValues("categories") || [];
    form.setValue("categories", currentCategories.filter(category => category !== categoryToRemove));
  };

  // Handle toggling a related post
  const handleToggleRelatedPost = (postId: string) => {
    const currentRelatedPosts = form.getValues("relatedPosts") || [];
    if (currentRelatedPosts.includes(postId)) {
      form.setValue("relatedPosts", currentRelatedPosts.filter(id => id !== postId));
    } else {
      form.setValue("relatedPosts", [...currentRelatedPosts, postId]);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      // Normalize the slug regardless of how it was entered
      const normalizedSlug = normalizeSlug(values.slug);
      
      // Make sure categories, tags, and relatedPosts are arrays
      const formattedValues = {
        ...values,
        slug: normalizedSlug,
        categories: Array.isArray(values.categories) ? values.categories : [],
        tags: Array.isArray(values.tags) ? values.tags : [],
        relatedPosts: Array.isArray(values.relatedPosts) ? values.relatedPosts : [],
      };
      
      console.log("Submitting blog post with normalized slug:", formattedValues);
      
      await onSubmit(formattedValues);
      router.push("/admin/dashboard/blogs");
    } catch (error) {
      console.error("Error submitting blog post:", error);
      alert("Failed to save blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-8">
        <FormField
          control={form.control as any}
          name="title"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="slug"
          render={({ field }: { field: any }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Slug</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setAutoSlug(!autoSlug);
                    if (!autoSlug && title) {
                      form.setValue("slug", normalizeSlug(title));
                    }
                  }}
                  className="h-8 text-xs"
                >
                  {autoSlug ? "Manual" : "Auto-generate"}
                </Button>
              </div>
              <FormControl>
                <Input 
                  placeholder="blog-slug" 
                  {...field} 
                  onChange={(e) => {
                    // Always normalize slug on input
                    const value = e.target.value;
                    field.onChange(value.replace(/ /g, '-'));
                  }}
                  disabled={autoSlug}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                URL-friendly version of the title (auto-generated or custom)
              </p>
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="excerpt"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="Brief excerpt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="content"
          render={({ field }: { field: any }) => (
            <FormItem className="space-y-2">
              <FormLabel>Content</FormLabel>
              <Tiptap 
                content={field.value} 
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="coverImage"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <ImageUpload
                value={field.value || ""}
                onChange={field.onChange}
                disabled={loading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Input */}
        <FormField
          control={form.control as any}
          name="tags"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value?.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a tag" 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddTag} 
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or click the plus button to add a tag
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Categories Input */}
        <FormField
          control={form.control as any}
          name="categories"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value?.map((category: string) => (
                    <Badge key={category} variant="blue" className="px-3 py-1 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {category}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCategory(category)} 
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a category" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddCategory} 
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Press Enter or click the plus button to add a category
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Related Posts */}
        <FormField
          control={form.control as any}
          name="relatedPosts"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Related Posts</FormLabel>
              <div className="flex flex-col space-y-4">
                {loadingPosts ? (
                  <div className="text-center p-4">Loading posts...</div>
                ) : (
                  <ScrollArea className="h-60 border rounded-md p-2">
                    <div className="space-y-2">
                      {availablePosts.length === 0 ? (
                        <p className="text-center text-muted-foreground p-4">No other posts available</p>
                      ) : (
                        availablePosts.map((post) => {
                          const isSelected = field.value?.includes(post.id);
                          return (
                            <Card 
                              key={post.id} 
                              className={`cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : ''}`}
                              onClick={() => handleToggleRelatedPost(post.id)}
                            >
                              <CardContent className="p-3 flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{post.title}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[300px]">{post.excerpt}</p>
                                </div>
                                <Checkbox checked={isSelected} />
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                )}
                <p className="text-xs text-muted-foreground">
                  Click on a post to select/deselect it as related
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <FormField
          control={form.control as any}
          name="isPublished"
          render={({ field }: { field: any }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/admin/dashboard/blogs")} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={() => {
              // Force form validation
              form.trigger();
            }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
