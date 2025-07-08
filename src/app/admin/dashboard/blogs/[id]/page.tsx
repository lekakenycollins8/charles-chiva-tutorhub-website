"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBlogPostById, updateBlogPost } from "@/lib/actions/blog-actions";
import BlogForm from "@/components/admin/blogs/BlogForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditBlogPage({ params }: Props) {
  // Unwrap the params promise to get the id
  const { id: postId } = use(params);

  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the blog post once we have the postId
    const fetchData = async () => {
      try {
        const { success, data } = await getBlogPostById(postId);
        if (success && data) {
          setInitialData(data);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success } = await updateBlogPost(postId, values);
      if (success) {
        router.push("/admin/dashboard/blogs");
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <BlogForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
