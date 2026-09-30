'use client';

import { Download } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Check for token in URL on component mount
    const reference = searchParams.get('reference');
    
    // Handle Paystack success (reference)
    if (reference) {
      // Verify the Paystack transaction and get download token
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
      
      if (!email || !firstName || !lastName) {
        alert('Please fill in all customer information fields.');
        return;
      }

      // Initiate Paystack checkout for paid resources
      setLoading(true);
      try {
        // Create Paystack transaction for this resource
        const createRes = await fetch('/api/paystack/transaction/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'resource', 
            resourceId, 
            email,
            firstName,
            lastName
          }),
        });

        if (!createRes.ok) {
          throw new Error('Failed to initialize Paystack transaction');
        }

        const { authorizationUrl } = await createRes.json();

        // Redirect to Paystack checkout page
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
          return;
        }
      } catch (error) {
        console.error('Checkout error:', error);
        setLoading(false);
      }
    } else {
      // Handle download for both free and purchased resources
      await performDownload();
    }
  };

  const verifyAndStoreToken = async (reference: string) => {
    setLoading(true);
    try {
      const verifyRes = await fetch('/api/paystack/transaction/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });

      if (!verifyRes.ok) {
        throw new Error('Failed to verify Paystack transaction');
      }

      const { downloadToken } = await verifyRes.json();
      if (downloadToken) {
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
      
      const downloadResponse = await fetch(downloadUrl, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (downloadResponse.ok) {
        // Check if response is JSON (error) or binary (file)
        const contentType = downloadResponse.headers.get('content-type');
        
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
        
        // Get filename from Content-Disposition header or use default
        const contentDisposition = downloadResponse.headers.get('content-disposition');
        let fileName = 'download.pdf';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            fileName = filenameMatch[1];
          }
        }
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
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
            <label className="text-sm font-medium">Email Address</label>
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
      
      <button
        onClick={handleDownload}
        disabled={loading}
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
            {isPaid && !hasValidToken ? (showCustomerForm ? 'Purchase Now' : 'Purchase Now') : 'Download'}
          </>
        )}
      </button>
    </div>
  );
}
