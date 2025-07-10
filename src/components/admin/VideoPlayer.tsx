'use client';

import { useState, useEffect, useRef } from 'react';
import { incrementViewCount } from '@/lib/actions/video-actions';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  videoId?: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  trackViews?: boolean;
}

export default function VideoPlayer({
  src,
  poster,
  videoId,
  title,
  autoplay = false,
  muted = false,
  controls = true,
  className = '',
  trackViews = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle play event
  const handlePlay = async () => {
    setIsPlaying(true);
    
    // Track view count if enabled and not already tracked
    if (trackViews && videoId && !hasTrackedView) {
      try {
        await incrementViewCount(videoId);
        setHasTrackedView(true);
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    }
  };

  // Handle pause event
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Clean up event listeners
  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      }
    };
  }, [videoId, hasTrackedView]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      title={title}
      autoPlay={autoplay}
      muted={muted}
      controls={controls}
      className={`w-full rounded-md ${className}`}
      preload="metadata"
    />
  );
}
