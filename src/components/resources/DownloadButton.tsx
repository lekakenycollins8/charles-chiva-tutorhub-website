'use client';

import { Download, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface DownloadButtonProps {
  fileUrl: string;
  className?: string;
  resourceId: string;
  isPaid: boolean;
  price?: number | null;
  userEmail?: string;
}

export default function DownloadButton({
  fileUrl,
  className,
  resourceId,
  isPaid,
  price,
  userEmail
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "sent" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Check for token in URL on component mount
    const reference = searchParams.get('reference');

    // Handle Mpesa success (reference)
    if (reference) {
      // Verify the Mpesa transaction and get download token
      verifyAndStoreToken(reference);
      return;
    }

    // Check for existing token in localStorage
    if (typeof window !== 'undefined' && window.localStorage && localStorage.getItem(`download-token-${resourceId}`)) {
      setHasValidToken(true);
    }
  }, [resourceId, searchParams, router]);

  const handleDownload = async () => {
    if (isPaid && !hasValidToken) {
      // Show customer form for paid resources
      if (!showCustomerForm) {
        setShowCustomerForm(true);
        return;
      }

      if (!phoneNumber || !email || !firstName || !lastName) {
        setErrorMessage('Please fill in all customer information fields.');
        return;
      }

      // Basic phone number validation
      const phoneRegex = /^(07|01|\+2547|2547)\d{7,8}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        setErrorMessage('Please enter a valid Kenyan phone number (e.g., 07XX XXX XXX or 2547XX XXX XXX)');
        return;
      }

      // Initiate Mpesa STK push for paid resources
      setLoading(true);
      setErrorMessage("");
      setPaymentStatus("sent");

      try {
        const createRes = await fetch('/api/mpesa/stkpush/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'resource',
            resourceId,
            phoneNumber,
            email,
            firstName,
            lastName
          }),
        });

        if (!createRes.ok) {
          const errorData = await createRes.json();
          throw new Error(errorData.error || 'Failed to initiate Mpesa payment');
        }

        const data = await createRes.json();
        console.log('Mpesa STK push initiated:', data);

        // Poll for payment status
        pollPaymentStatus(data.checkoutRequestID);
      } catch (error: any) {
        console.error('Checkout error:', error);
        setErrorMessage(error.message || 'Failed to initiate payment. Please try again.');
        setPaymentStatus("error");
        setLoading(false);
      }
    } else {
      // Handle download for both free and purchased resources
      await performDownload();
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus("error");
        setErrorMessage("Payment timed out. Please check your phone and try again.");
        setLoading(false);
        return;
      }

      attempts++;

      try {
        const response = await fetch(`/api/mpesa/status/${checkoutRequestID}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Payment status:', data);

          if (data.paymentRecord?.status === "COMPLETED") {
            setPaymentStatus("success");
            // Generate download token and start download
            await verifyAndStoreToken(checkoutRequestID);
            return;
          }

          if (data.paymentRecord?.status === "FAILED") {
            setPaymentStatus("error");
            setErrorMessage("Payment failed. Please try again.");
            setLoading(false);
            return;
          }

          // Continue polling
          setTimeout(poll, 5000);
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        // Continue polling despite errors
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const verifyAndStoreToken = async (reference: string) => {
    setLoading(true);
    try {
      // Check if payment was successful
      const statusRes = await fetch(`/api/mpesa/status/${reference}`);
      if (statusRes.ok) {
        const data = await statusRes.json();
        if (data.paymentRecord?.status === "COMPLETED") {
          // Generate download token (simplified - in production, you'd call a proper token generation endpoint)
          const downloadToken = `${resourceId}-${Date.now()}`;
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(`download-token-${resourceId}`, downloadToken);
          }
          setHasValidToken(true);

          // Clean up URL params
          const url = new URL(window.location.href);
          url.searchParams.delete('reference');
          window.history.replaceState({}, '', url.toString());

          // Start download
          await performDownload();
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const performDownload = async () => {
    setLoading(true);
    try {
      const token = (typeof window !== 'undefined' && window.localStorage)
        ? localStorage.getItem(`download-token-${resourceId}`)
        : null;
      const downloadUrl = `/api/resources/${resourceId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;

      console.log('Initiating download from:', downloadUrl);

      const downloadResponse = await fetch(downloadUrl, {
        method: 'POST',
        credentials: 'include'
      });

      console.log('Download response status:', downloadResponse.status);
      console.log('Download response ok:', downloadResponse.ok);

      if (downloadResponse.ok) {
        // Check if response is JSON (error) or binary (file)
        const contentType = downloadResponse.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (contentType && contentType.includes('application/json')) {
          // Error response
          const error = await downloadResponse.json();
          console.error('Download error:', error);
          if (error.error?.includes('token') && typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(`download-token-${resourceId}`);
            router.refresh();
          }
          return;
        }

        // File response - create blob and download
        const blob = await downloadResponse.blob();
        console.log('Blob created, size:', blob.size, 'bytes');

        // Get filename from Content-Disposition header or use default
        const contentDisposition = downloadResponse.headers.get('content-disposition');
        let fileName = 'download.pdf';

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            fileName = filenameMatch[1];
          }
        }

        console.log('Filename:', fileName);

        const blobUrl = window.URL.createObjectURL(blob);
        console.log('Blob URL created:', blobUrl);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);

        console.log('Triggering download click');
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
          console.log('Cleanup complete');
        }, 100);
      } else {
        const error = await downloadResponse.json();
        console.error('Download error:', error);
        if (error.error?.includes('token') && typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(`download-token-${resourceId}`);
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showCustomerForm && (
        <div className="flex flex-col space-y-3">
          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 mt-1" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="mt-1 w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number to receive Mpesa prompt</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {errorMessage}
        </div>
      )}

      {paymentStatus === "sent" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
          Check your phone for the Mpesa prompt. Enter your PIN to complete the payment.
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          Payment successful! Starting download...
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={loading || paymentStatus === "success"}
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <Download className="-ml-1 mr-2 h-4 w-4" />
            {isPaid && !hasValidToken ? (showCustomerForm ? `Pay KSh ${price?.toLocaleString() || '0'}` : `Pay KSh ${price?.toLocaleString() || '0'}`) : 'Download'}
          </>
        )}
      </button>
    </div>
  );
}
