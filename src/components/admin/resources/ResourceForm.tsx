"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createResource, updateResource } from "@/lib/actions/resource-actions";
import { AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Define the categories
const RESOURCE_CATEGORIES = [
  "Mathematics",
  "Chemistry",
  "Physics",
  "Biology",
  "Computer Science",
  "Business Studies",
  "Accounting",
  "Economics",
  "Languages",
  "History",
  "Geography",
  "Other"
];

// Define the file types
const FILE_TYPES = [
  "PDF",
  "Video",
  "Audio",
  "Document",
  "Presentation",
  "Spreadsheet",
  "Image",
  "Other"
];

interface ResourceFormProps {
  resource?: {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    isPaid: boolean;
    price?: number | null;
    category: string;
  };
}

export default function ResourceForm({ resource }: ResourceFormProps) {
  const router = useRouter();
  const isEditing = !!resource;
  
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    fileType: resource?.fileType || "PDF",
    isPaid: resource?.isPaid || false,
    price: resource?.price || 0,
    category: resource?.category || "Other",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPaid: checked }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Validate form data
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      
      if (!isEditing && !file) {
        throw new Error("File is required");
      }
      
      if (formData.isPaid && (!formData.price || formData.price <= 0)) {
        throw new Error("Price must be greater than 0 for paid resources");
      }
      
      // If there's a file to upload, upload it first via the API directly
      let fileUrl = resource?.fileUrl || "";
      let fileType = formData.fileType;
      let fileSize = resource?.fileSize || 0;
      
      if (file) {
        setUploadProgress(10);
        toast.info("Uploading file...", {
          description: "Please wait while your file is being uploaded."
        });
        
        // Create FormData for file upload
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        
        // Map the form fileType to the API fileType
        let apiFileType = "document";
        if (["PDF", "Document", "Presentation", "Spreadsheet"].includes(formData.fileType)) {
          apiFileType = "document";
        } else if (["Video", "Audio"].includes(formData.fileType)) {
          apiFileType = "video";
        } else if (["Image"].includes(formData.fileType)) {
          apiFileType = "image";
        }
        
        uploadFormData.append("fileType", apiFileType);
        
        // Upload the file directly to the API
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData
        });
        
        setUploadProgress(70);
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.error || 'Failed to upload file');
        }
        
        const uploadResult = await uploadResponse.json();
        fileUrl = uploadResult.url;
        fileType = uploadResult.type;
        fileSize = uploadResult.size;
        
        setUploadProgress(100);
      }
      
      // Create FormData for resource submission
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("isPaid", formData.isPaid.toString());
      formDataToSend.append("fileType", fileType);
      formDataToSend.append("fileUrl", fileUrl);
      formDataToSend.append("fileSize", fileSize.toString());
      
      if (formData.isPaid) {
        formDataToSend.append("price", formData.price.toString());
      }
      
      // Submit the form without the file (already uploaded)
      if (isEditing && resource) {
        // Update existing resource
        const result = await updateResource(resource.id, formDataToSend);
        
        if (result.success) {
          toast.success("Resource updated", {
            description: "Your resource has been updated successfully.",
            icon: <CheckCircle className="h-4 w-4" />
          });
          router.push("/admin/dashboard/resources");
          router.refresh();
        } else {
          throw new Error(result.message || "Error updating resource");
        }
      } else {
        // Create new resource
        const result = await createResource(formDataToSend);
        
        if (result.success) {
          toast.success("Resource created", {
            description: "Your resource has been created successfully.",
            icon: <CheckCircle className="h-4 w-4" />
          });
          router.push("/admin/dashboard/resources");
          router.refresh();
        } else {
          throw new Error(result.message || "Error creating resource");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast.error("Error", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        icon: <AlertCircle className="h-4 w-4" />
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Introduction to Organic Chemistry"
          required
        />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide a detailed description of the resource..."
          rows={4}
          required
        />
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_CATEGORIES.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file">{isEditing ? "Replace File" : "File *"}</Label>
        <Input
          id="file"
          type="file"
          onChange={handleFileChange}
          className="cursor-pointer"
          required={!isEditing}
        />
        {isEditing && (
          <p className="text-sm text-gray-500">
            Current file: {resource?.fileUrl.split('/').pop()}
          </p>
        )}
      </div>
      
      {/* File Type */}
      <div className="space-y-2">
        <Label htmlFor="fileType">File Type *</Label>
        <Select
          value={formData.fileType}
          onValueChange={(value) => handleSelectChange("fileType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            {FILE_TYPES.map((type: string) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Paid/Free Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="isPaid">Paid Resource</Label>
          <p className="text-sm text-gray-500">
            Toggle to set this as a paid resource
          </p>
        </div>
        <Switch
          id="isPaid"
          checked={formData.isPaid}
          onCheckedChange={handleSwitchChange}
        />
      </div>
      
      {/* Price (only shown if isPaid is true) */}
      {formData.isPaid && (
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }));
            }}
            placeholder="e.g., 19.99"
            required
          />
        </div>
      )}
      
      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/dashboard/resources")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEditing ? "Update Resource" : "Create Resource"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
