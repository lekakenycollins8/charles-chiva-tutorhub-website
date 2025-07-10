export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: string;
  videoSize: number;
  thumbnailUrl?: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoResponse {
  success: boolean;
  data: Video | Video[] | null;
  error: string | null;
}

export interface SingleVideoResponse {
  success: boolean;
  data: Video | null;
  error: string | null;
}
