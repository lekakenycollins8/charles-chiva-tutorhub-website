export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source: string | null; // "homepage" or "contact_page"
  status?: string; // "NEW", "IN_PROGRESS", "RESOLVED"
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactSubmissionResponse {
  success: boolean;
  data?: ContactSubmission | ContactSubmission[] | null;
  error?: string | null;
  formspreeSubmitted?: boolean;
}
