"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter } from "lucide-react";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export default function SocialShareButtons({ url, title }: SocialShareButtonsProps) {
  // Encode the URL and title for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  // Share handlers
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank');
  };
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-600 mr-2">Share:</span>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={shareOnTwitter}
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={shareOnFacebook}
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        onClick={shareOnLinkedIn}
      >
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
}
