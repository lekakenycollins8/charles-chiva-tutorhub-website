'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import VideoForm from "@/components/admin/VideoForm";

export default function NewVideoPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Add New Video</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload a new video to display on the homepage.
        </p>
      </div>

      {/* Video Form */}
      <VideoForm />
    </div>
  );
}
