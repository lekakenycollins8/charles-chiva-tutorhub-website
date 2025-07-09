export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  source?: string; // "homepage" or "contact_page"
  status?: string; // "NEW", "IN_PROGRESS", "RESOLVED"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactResponse {
  id?: string;
  submissionId: string;
  message: string;
  sentAt?: Date;
  sentById: string;
  sentByName: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  data?: ContactSubmission | ContactSubmission[] | null;
  error?: string | null;
}
