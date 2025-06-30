'use client';

import { Download } from "lucide-react";

interface DownloadButtonProps {
  fileUrl: string;
  className?: string;
}

export default function DownloadButton({ fileUrl, className }: DownloadButtonProps) {
  return (
    <a 
      href={fileUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        // This will be called client-side
        // The server action form will handle the actual increment
      }}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Resource
    </a>
  );
}
