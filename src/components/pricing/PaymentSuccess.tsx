'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PaymentSuccessProps {
  redirectPath?: string;
}

export default function PaymentSuccess({ redirectPath = '/' }: PaymentSuccessProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  
  const payment = searchParams.get('payment');
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (payment === 'success' && reference) {
        try {
          // Optional: Verify the payment on the client side
          // This is not strictly necessary as the webhook will handle the actual verification
          // But it provides immediate feedback to the user
          
          setStatus('success');
          setMessage('Your payment was successful! Thank you for your purchase.');
        } catch (error) {
          console.error('Error verifying payment:', error);
          setStatus('error');
          setMessage('There was an issue verifying your payment. Please contact support.');
        }
      } else {
        setStatus('error');
        setMessage('Invalid payment information. Please try again or contact support.');
      }
    };

    verifyPayment();
  }, [payment, reference]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Processing Payment
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href={redirectPath}>
                  Continue
                </Link>
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
              Payment Error
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/pricing">
                  Return to Pricing
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
