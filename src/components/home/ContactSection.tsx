'use client';

import { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simpleContactFormSchema, SimpleContactFormValues } from '@/lib/schemas/contact-schema';
import { createContactSubmission } from '@/lib/actions/contact-actions';
import { useForm as useFormspree } from '@formspree/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Check, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  const [formState, formspreeSubmit] = useFormspree("xqaklozp"); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useReactHookForm<SimpleContactFormValues>({
    resolver: zodResolver(simpleContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      privacyPolicy: false,
    },
  });

  async function onSubmit(data: SimpleContactFormValues) {
    try {
      // First submit to our backend
      const result = await createContactSubmission({
        name: data.name,
        email: data.email,
        subject: 'Homepage Inquiry', // Default subject for homepage form
        message: data.message,
        source: 'homepage'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit form');
      }
      
      // Then submit to Formspree
      await formspreeSubmit({
        name: data.name,
        email: data.email,
        subject: 'Homepage Inquiry',
        message: data.message
      });
      
      // Reset form if everything is successful
      if (formState.succeeded) {
        form.reset();
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  }

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our tutoring services? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              {formState.succeeded && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Your message has been sent successfully! We'll get back to you soon.</span>
                </div>
              )}
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {errorMessage}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2 flex flex-col justify-center">
                  <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <MessageSquare className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-center mb-4">Contact Us</h3>
                    <p className="mb-6 text-blue-100">
                      Need more information? Visit our full contact page for additional ways to reach us.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      onClick={() => window.location.href = '/contact'}
                    >
                      Visit Contact Page
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="privacyPolicy"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the privacy policy and consent to being contacted.
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto"
                        disabled={formState.submitting}
                      >
                        {formState.submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
