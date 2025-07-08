"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlogPost } from "@/lib/actions/blog-actions";
import BlogForm from "@/components/admin/blogs/BlogForm";

const NewBlogPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success } = await createBlogPost(values);
      if (success) {
        router.push("/admin/dashboard/blogs");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewBlogPage;
