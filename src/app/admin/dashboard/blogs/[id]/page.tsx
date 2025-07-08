"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogPostById, updateBlogPost } from "@/lib/actions/blog-actions";
import BlogForm from "@/components/admin/blogs/BlogForm";

const EditBlogPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { success, data } = await getBlogPostById(params.id);
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
  }, [params.id]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const { success } = await updateBlogPost(params.id, values);
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
};

export default EditBlogPage;
