'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Video as VideoIcon, Upload } from 'lucide-react';
import { Video } from '@/types/video';
import { createVideo, updateVideo } from '@/lib/actions/video-actions';
import { toast } from 'sonner';

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  videoUrl: z.string().optional(),
  videoFile: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface VideoFormProps {
  video?: Video;
  isEditing?: boolean;
}

export default function VideoForm({ video, isEditing = false }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(video?.videoUrl || null);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video?.title || '',
      description: video?.description || '',
      videoUrl: video?.videoUrl || '',
      videoFile: undefined
    }
  });
  
  // Handle video file change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('videoFile', file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check if we have a new video file to upload
      if (values.videoFile) {
        setUploadProgress(10);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', values.videoFile);
        formData.append('fileType', 'video');
        
        // Upload the file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        setUploadProgress(70);
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || 'Failed to upload video');
        }
        
        const uploadData = await uploadResponse.json();
        values.videoUrl = uploadData.url;
        
        setUploadProgress(100);
      }
      
      // Create or update the video
      if (isEditing && video) {
        const result = await updateVideo(video.id, {
          title: values.title,
          description: values.description,
          ...(values.videoUrl && { videoUrl: values.videoUrl }),
          ...(values.videoFile && { 
            videoType: values.videoFile.type,
            videoSize: values.videoFile.size
          })
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to update video');
        }
        
        toast('Video updated successfully');
      } else {
        if (!values.videoUrl) {
          throw new Error('Video file is required');
        }
        
        const result = await createVideo({
          title: values.title,
          description: values.description,
          videoUrl: values.videoUrl,
          videoType: values.videoFile.type,
          videoSize: values.videoFile.size,
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to create video');
        }
        
        toast('Video created successfully');
      }
      
      // Redirect back to videos list
      router.push('/admin/dashboard/videos');
      router.refresh();
    } catch (error) {
      console.error('Error submitting video:', error);
      toast(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter video description" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Video Upload Field */}
              <div className="space-y-2">
                <FormLabel>Video File</FormLabel>
                <div className="border rounded-md p-4">
                  {videoPreview ? (
                    <div className="space-y-4">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="w-full max-h-[300px] rounded-md"
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setVideoPreview(null);
                            form.setValue('videoFile', undefined);
                          }}
                        >
                          Change Video
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                      <VideoIcon className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        {isEditing ? 'Upload a new video or keep the existing one' : 'Upload a video file'}
                      </p>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="max-w-xs"
                      />
                    </div>
                  )}
                </div>
                {form.formState.errors.videoFile && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.videoFile.message as string}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            className="mr-2"
            onClick={() => router.push('/admin/dashboard/videos')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
              </>
            ) : (
              <>{isEditing ? 'Update' : 'Create'} Video</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
