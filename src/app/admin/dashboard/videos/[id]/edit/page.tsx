'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import VideoForm from "@/components/admin/VideoForm";
import { getVideo } from "@/lib/actions/video-actions";
import { Video } from "@/types/video";
import { Skeleton } from "@/components/ui/skeleton";

interface EditVideoPageProps {
  params: Promise<{ id: string }>;
}

export default function EditVideoPage({ params }: EditVideoPageProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getVideo((await params).id);
        
        if (success && data) {
          setVideo(data as Video);
        } else {
          setError(error || 'Failed to fetch video');
        }
      } catch (err) {
        setError('An error occurred while fetching the video');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard/videos">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {loading ? 'Loading...' : `Edit Video: ${video?.title}`}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Update video details or replace the video file.
        </p>
      </div>

      {/* Video Form or Loading State */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
          <Link href="/admin/dashboard/videos">
            <Button variant="outline" className="mt-4">
              Back to Videos
            </Button>
          </Link>
        </div>
      ) : video ? (
        <VideoForm video={video} isEditing={true} />
      ) : null}
    </div>
  );
}
