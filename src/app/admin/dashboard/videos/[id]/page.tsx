'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { getVideo, deleteVideo } from "@/lib/actions/video-actions";
import { Video } from "@/types/video";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/admin/VideoPlayer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

export default function VideoPage({ params }: VideoPageProps) {
  // Unwrap params Promise using React.use
  const { id } = use(params);
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await getVideo(id);
        
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
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { success, error } = await deleteVideo(id);
      
      if (success) {
        toast('Video deleted successfully');
        router.push('/admin/dashboard/videos');
      } else {
        throw new Error(error || 'Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

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
            {loading ? 'Loading...' : video?.title}
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Link href={`/admin/dashboard/videos/${id}/edit`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </Link>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the video.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Video Details */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-24 w-full" />
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
        <div className="space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-6">
              <VideoPlayer
                src={video.videoUrl}
                poster={video.thumbnailUrl || undefined}
                videoId={video.id}
                title={video.title}
                controls={true}
                className="w-full rounded-md"
                trackViews={false}
              />
            </CardContent>
          </Card>

          {/* Video Information */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{video.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Video Details</h3>
                  <ul className="mt-1 space-y-1">
                    <li className="text-sm">
                      <span className="font-medium">Type:</span> {video.videoType}
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Size:</span> {(video.videoSize / (1024 * 1024)).toFixed(2)} MB
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Views:</span> {video.views}
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
                  <ul className="mt-1 space-y-1">
                    <li className="text-sm">
                      <span className="font-medium">Created:</span> {format(new Date(video.createdAt), 'PPP')} ({formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })})
                    </li>
                    <li className="text-sm">
                      <span className="font-medium">Last Updated:</span> {format(new Date(video.updatedAt), 'PPP')} ({formatDistanceToNow(new Date(video.updatedAt), { addSuffix: true })})
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
