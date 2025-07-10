'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Video } from "@/types/video";
import { getFeaturedVideos } from "@/lib/actions/video-actions";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/admin/VideoPlayer";

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getFeaturedVideos();
        
        if (success && data) {
          setVideos(data as Video[]);
        } else {
          setError(error || 'Failed to fetch videos');
        }
      } catch (err) {
        setError('An error occurred while fetching videos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // If there are no videos and we're not loading, don't render the section
  if (!loading && videos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Videos</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video">
                  <VideoPlayer
                    src={video.videoUrl}
                    poster={video.thumbnailUrl || undefined}
                    videoId={video.id}
                    title={video.title}
                    controls={true}
                    className="w-full h-full object-cover"
                    trackViews={true}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
