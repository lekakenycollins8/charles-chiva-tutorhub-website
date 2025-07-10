'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video as VideoIcon, Plus, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getVideos } from "@/lib/actions/video-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "@/types/video";

const ITEMS_PER_PAGE = 10;

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch videos with filters
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const filters = {
        searchQuery: searchQuery || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };

      const { success, data, pagination, error } = await getVideos(filters);
      
      if (success && data) {
        setVideos(data as Video[]);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.total || 0);
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

  // Initial fetch
  useEffect(() => {
    fetchVideos();
  }, [currentPage]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchVideos();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Videos</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading videos...' : `Showing ${videos.length} of ${totalItems} videos`}
          </p>
        </div>
        <Link href="/admin/dashboard/videos/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Video</span>
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search videos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        {/* Videos List */}
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-60 mt-2" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
              <Button variant="outline" onClick={fetchVideos} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : videos.length > 0 ? (
            <ul className="divide-y">
              {videos.map((video) => (
                <li key={video.id} className="py-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <VideoIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {video.description || 'No description'}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                          <span>•</span>
                          <span>{(video.videoSize / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>{video.views} views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/dashboard/videos/${video.id}`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/dashboard/videos/${video.id}/edit`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p>No videos found. Try adjusting your search or create a new video.</p>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                <span className="mr-2">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
