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
