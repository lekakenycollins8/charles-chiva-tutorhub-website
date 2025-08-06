"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({
  value,
  onChange,
  disabled
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Update preview when value changes (for editing existing posts)
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create a temporary local preview while uploading
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      
      // Update preview to use the uploaded URL and update form
      setPreview(data.url);
      onChange(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Reset preview on error
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
      <div 
        onClick={handleClick}
        className="border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:border-gray-400 transition flex flex-col items-center justify-center"
        style={{ height: "200px" }}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Cover image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500 mb-2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="text-sm text-gray-500">
              Click to upload an image
            </p>
          </div>
        )}
      </div>
      {isUploading && (
        <div className="text-sm text-center text-gray-500">
          Uploading...
        </div>
      )}
      {preview && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setPreview(null);
            onChange("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          className="w-full"
        >
          Remove Image
        </Button>
      )}
    </div>
  );
};
