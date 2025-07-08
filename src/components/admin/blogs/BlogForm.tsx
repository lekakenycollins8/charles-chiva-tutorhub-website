"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  excerpt: z.string().min(1, { message: "Excerpt is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  coverImage: z.string().optional(),
  isPublished: z.boolean(),
  isDraft: z.boolean(),
  categories: z.array(z.string()).min(1, { message: "At least one category is required" }),
  tags: z.array(z.string()).optional(),
  relatedPosts: z.array(z.string()).optional(),
});

type BlogFormProps = {
  initialData?: BlogPost;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
};

export default function BlogForm({ initialData, onSubmit }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      console.log("Submitting blog post:", values);
      await onSubmit(values);
      router.push("/admin/dashboard/blogs");
    } catch (error) {
      console.error("Error submitting blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
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
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="blog-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
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
          control={form.control}
          name="content"
          render={({ field }) => (
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
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
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

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
