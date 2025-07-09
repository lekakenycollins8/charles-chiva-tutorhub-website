# Chiva TutorHub Contact Section Plan

This document outlines the plan for implementing a comprehensive contact section for the Chiva TutorHub website, allowing potential clients to easily reach out to the tutoring service.

## Overview

The contact system will consist of two main components:
1. A comprehensive contact form accessible from the contact page
2. An admin interface for viewing and managing form submissions

## Technology Stack

- **Frontend**: React with Next.js 15
- **UI Components**: shadcn UI components with Tailwind CSS
- **Form Handling**: React Hook Form with validation
- **Email Service**: SendGrid or similar email delivery service
- **Database**: Prisma with PostgreSQL for storing contact submissions

## Contact Form Implementation

### User Interface Components

The contact form will include the following components:

1. **Contact Information Fields**
   - Name (required)
   - Email address (required)
   - Phone number (optional)
   - Subject dropdown (e.g., General Inquiry, Tutoring Services, Pricing, etc.)

2. **Message Section**
   - Text area for detailed message
   - Character count/limit indicator

3. **Submission Elements**
   - Submit button with loading state

4. **Confirmation Display**
   - Success message after submission
   - Error handling with user-friendly messages

### Additional Contact Information

1. **Business Details**
   - Email address for direct contact

2. **Social Media Links**
   - Links to relevant social media profiles
   - Professional network connections (LinkedIn)

### Form Validation

1. **Client-side Validation**
   - Real-time field validation
   - Format checking for email and phone
   - Required field highlighting
   - Character limit enforcement

2. **Server-side Validation**
   - Double-checking all inputs
   - Spam detection
   - Rate limiting to prevent abuse
   - Security checks (XSS prevention, etc.)

## Admin Contact Management

### Admin Dashboard

The admin dashboard for managing contact form submissions will include:

1. **Submission Management**
   - List of all contact form submissions
   - Sorting by date, subject, status

2. **Submission Details View**
   - Complete submission information display
   - Contact details of the submitter
   - Message content with formatting preserved



## Implementation Code Examples

### Contact Form Component

```jsx
// components/ContactForm.jsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: 'Please select a subject.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: 'You must agree to the privacy policy.',
  }),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      privacyPolicy: false,
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      
      toast({
        title: 'Message sent!',
        description: 'We will get back to you as soon as possible.',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name">Name *</label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Your name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email">Email *</label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            placeholder="your.email@example.com"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="phone">Phone (optional)</label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder="Your phone number"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="subject">Subject *</label>
          <Select onValueChange={(value) => form.setValue('subject', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Inquiry</SelectItem>
              <SelectItem value="tutoring">Tutoring Services</SelectItem>
              <SelectItem value="pricing">Pricing Information</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.subject && (
            <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message">Message *</label>
        <Textarea
          id="message"
          {...form.register('message')}
          placeholder="Your message"
          rows={6}
        />
        {form.formState.errors.message && (
          <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="privacyPolicy"
          onCheckedChange={(checked) => form.setValue('privacyPolicy', checked)}
        />
        <label htmlFor="privacyPolicy" className="text-sm">
          I agree to the privacy policy and consent to being contacted regarding my inquiry.
        </label>
      </div>
      {form.formState.errors.privacyPolicy && (
        <p className="text-sm text-red-500">{form.formState.errors.privacyPolicy.message}</p>
      )}
      
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
```

### API Route for Contact Form

```js
// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    
    // Store in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'NEW',
      },
    });
    
    // Send notification email
    await resend.emails.send({
      from: 'contact@chivatutorhub.com',
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard/contacts/${submission.id}">View in Admin Dashboard</a></p>
      `,
    });
    
    // Send confirmation email to user
    await resend.emails.send({
      from: 'contact@chivatutorhub.com',
      to: email,
      subject: 'We received your message - Chiva TutorHub',
      html: `
        <h2>Thank you for contacting Chiva TutorHub!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>Your reference number is: ${submission.id}</p>
        <p>Best regards,<br>The Chiva TutorHub Team</p>
      `,
    });
    
    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
```

## Testing and Deployment

### Testing Checklist

1. **Functionality Testing**
   - Contact form validation works correctly
   - Form submissions are stored in the database
   - Form handles errors gracefully

2. **UI/UX Testing**
   - Form is responsive on all devices
   - Error messages are clear and helpful
   - Success messages are displayed properly
   - Form fields are accessible and properly labeled
   - Loading states provide feedback during submission

3. **Admin Interface Testing**
   - Admin can view all submissions
   - Filtering and sorting work correctly
   - Admin can respond to submissions
   - Status updates are saved correctly
   - Analytics data is accurate

### Deployment Steps

1. **Development Implementation**
   - Create contact form components
   - Set up API routes and database schema
   - Implement email notification system
   - Build admin interface for submissions

2. **Staging Deployment**
   - Deploy to staging environment
   - Test form submissions end-to-end
   - Verify email delivery
   - Test admin interface functionality

3. **Production Deployment**
   - Deploy to production environment
   - Monitor form submissions
   - Verify email deliverability
   - Train admin users on submission management

## Database Schema

```prisma
model ContactSubmission {
  id            String   @id @default(cuid())
  name          String
  email         String
  phone         String?
  subject       String
  message       String   @db.Text
  status        String   @default("NEW") // NEW, IN_PROGRESS, RESOLVED
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  responses     ContactResponse[]
}

model ContactResponse {
  id            String   @id @default(cuid())
  submissionId  String
  message       String   @db.Text
  sentAt        DateTime @default(now())
  sentBy        String   // admin user ID
  sentByName    String   // admin user name
  
  submission    ContactSubmission @relation(fields: [submissionId], references: [id])
}
```

This schema defines two main models:

1. **ContactSubmission**: Stores all contact form submissions with fields for the submitter's information, message content etc


## Security Considerations

1. **Input Validation and Sanitization**
   - Validate all form inputs on both client and server sides
   - Implement strong validation rules using Zod schema
   - Sanitize message content to prevent XSS attacks
   - Use prepared statements for database queries via Prisma

4. **Data Protection and Privacy**
   - Store only necessary personal information
   - Implement proper data retention and deletion policies
   - Encrypt sensitive data in transit (HTTPS) and at rest
   - Comply with privacy regulations (GDPR, CCPA)

## Testing Plan

1. **Unit Testing**
   - Test form validation logic
   - Test API endpoints for submission handling
   - Test email sending functionality
   - Test database operations for contact submissions

2. **Integration Testing**
   - Test the complete form submission flow
   - Test admin dashboard functionality
   - Test email notification delivery
   - Verify database records match submitted data

3. **User Acceptance Testing**
   - Test form with various input scenarios
   - Verify form accessibility compliance
   - Test on multiple browsers and devices
   - Gather feedback on form usability and clarity
