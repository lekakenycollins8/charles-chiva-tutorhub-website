"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getContactSubmissions, deleteContactSubmission, updateContactSubmissionStatus } from "@/lib/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MoreHorizontal, Mail, Trash, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ContactSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);

  // Fetch contact submissions
  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      const result = await getContactSubmissions();
      if (result.success && result.data) {
        setSubmissions(result.data);
      } else {
        toast.error("Failed to load contact submissions");
      }
      setLoading(false);
    }

    fetchSubmissions();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (id: string, status: string) => {
    const result = await updateContactSubmissionStatus(id, status);
    if (result.success) {
      // Update the local state
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
      
      toast.success(`Submission status changed to ${status}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!submissionToDelete) return;
    
    const result = await deleteContactSubmission(submissionToDelete);
    if (result.success) {
      setSubmissions(submissions.filter(sub => sub.id !== submissionToDelete));
      toast.success("Contact submission has been deleted");
    } else {
      toast.error("Failed to delete submission");
    }
    
    setDeleteDialogOpen(false);
    setSubmissionToDelete(null);
  };

  // Confirm delete
  const confirmDelete = (id: string) => {
    setSubmissionToDelete(id);
    setDeleteDialogOpen(true);
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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NEW":
        return <AlertCircle className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No contact submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {submission.source === "homepage" ? "Homepage" : "Contact Page"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        {submission.createdAt ? (
                          <span title={new Date(submission.createdAt).toLocaleString()}>
                            {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                          </span>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/contacts/${submission.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`}>
                              <Mail className="mr-2 h-4 w-4" />
                              Reply via Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(submission.id, "NEW")}>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Mark as New
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(submission.id, "IN_PROGRESS")}>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate(submission.id, "RESOLVED")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(submission.id)} className="text-red-600">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
