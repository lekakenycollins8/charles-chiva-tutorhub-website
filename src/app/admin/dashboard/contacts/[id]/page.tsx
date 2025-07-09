"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getContactSubmissionById, updateContactSubmissionStatus, deleteContactSubmission } from "@/lib/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Mail, Trash, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ContactSubmission } from "@/types/contact";

type ContactDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ContactSubmissionDetailPage({ params }: ContactDetailPageProps) {
  const router = useRouter();
  const { id } = await params;
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch contact submission
  useEffect(() => {
    async function fetchSubmission() {
      setLoading(true);
      const result = await getContactSubmissionById(id);
      if (result.success && result.data) {
        setSubmission(result.data);
      } else {
        toast.error("Failed to load contact submission");
        router.push("/admin/dashboard/contacts");
      }
      setLoading(false);
    }

    fetchSubmission();
  }, [id, router]);

  // Handle status update
  const handleStatusUpdate = async (status: string) => {
    const result = await updateContactSubmissionStatus(id, status);
    if (result.success) {
      if (submission) {
        setSubmission({ ...submission, status });
      }
      toast.success(`Submission status changed to ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    const result = await deleteContactSubmission(id);
    if (result.success) {
      toast.success("Contact submission has been deleted");
      router.push("/admin/dashboard/contacts");
    } else {
      toast.error("Failed to delete submission");
    }
    setDeleteDialogOpen(false);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="outline" className="bg-yellow-500 text-white">In Progress</Badge>;
      case "RESOLVED":
        return <Badge variant="outline" className="bg-green-500 text-white">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10">
          <p className="text-gray-500">Submission not found</p>
          <Button onClick={() => router.push("/admin/dashboard/contacts")} className="mt-4">
            Back to Submissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/admin/dashboard/contacts")} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Submissions
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Submission Details</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Reply via Email
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main submission details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Message</CardTitle>
              {getStatusBadge(submission.status || 'NEW')}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{submission.subject}</h3>
                <p className="text-sm text-gray-500">
                  From {submission.source === "homepage" ? "Homepage Form" : "Contact Page Form"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {submission.message}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact information and status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>{submission.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{submission.email}</p>
                </div>
                {submission.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{submission.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p>{submission.createdAt ? format(new Date(submission.createdAt), "PPpp") : "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant={submission.status === "NEW" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("NEW")}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  New
                </Button>
                <Button 
                  variant={submission.status === "IN_PROGRESS" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("IN_PROGRESS")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  In Progress
                </Button>
                <Button 
                  variant={submission.status === "RESOLVED" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate("RESOLVED")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contact submission. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
