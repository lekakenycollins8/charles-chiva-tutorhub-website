import * as z from "zod";

// Full contact form schema for the dedicated contact page
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy.",
  }),
});

// Simplified contact form schema for the homepage
export const simpleContactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy.",
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type SimpleContactFormValues = z.infer<typeof simpleContactFormSchema>;
