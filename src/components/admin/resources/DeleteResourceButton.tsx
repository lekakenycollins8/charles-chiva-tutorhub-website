"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteResource } from "@/lib/actions/resource-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteResourceButtonProps {
  id: string;
}

export default function DeleteResourceButton({ id }: DeleteResourceButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  
  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    
    try {
      const result = await deleteResource(id);
      
      if (result.success) {
        router.push("/admin/dashboard/resources");
        router.refresh();
      } else {
        setError(result.message || "Failed to delete resource");
        setIsOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2"
      >
        <Trash className="h-4 w-4" />
        <span>Delete</span>
      </Button>
      
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              resource and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </>
  );
}
