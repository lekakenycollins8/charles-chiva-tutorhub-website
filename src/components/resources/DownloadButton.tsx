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
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check for token in URL on component mount
    const token = searchParams.get('token');
    const paymentStatus = searchParams.get('payment');
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    if (token && paymentStatus === 'success') {
      // Store the token in localStorage for future use
      localStorage.setItem(`download-token-${resourceId}`, token);
      setHasValidToken(true);
      
      // Clean up the URL but ensure the page is fully loaded first
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        url.searchParams.delete('payment');
        url.searchParams.delete('reference');
        url.searchParams.delete('trxref');
        window.history.replaceState({}, '', url.toString());
        // Force a refresh to ensure the component re-renders properly
        router.refresh();
      }, 500);
    } else if (localStorage.getItem(`download-token-${resourceId}`)) {
      setHasValidToken(true);
    }
  }, [resourceId, searchParams, router]);

  const handleDownload = async () => {
    if (isPaid && !hasValidToken) {
      // Initiate Paystack checkout for paid resources
      setLoading(true);
      try {
        // Check if user email is available
        const email = userEmail || prompt('Please enter your email address to continue with payment:');
        
        if (!email) {
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/paystack/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            price,
            email
          }),
        });
        
        const { authorization_url } = await response.json();
        
        // Redirect to Paystack payment page
        window.location.href = authorization_url;
      } catch (error) {
        console.error('Checkout error:', error);
        setLoading(false);
      }
    } else {
      // Handle download for both free and purchased resources
      setLoading(true);
      try {
        const token = localStorage.getItem(`download-token-${resourceId}`);
        const downloadUrl = `/api/resources/${resourceId}/download${token ? `?token=${encodeURIComponent(token)}` : ''}`;
        
        const downloadResponse = await fetch(downloadUrl, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (downloadResponse.ok) {
          const { fileUrl } = await downloadResponse.json();
          
          // Extract filename from URL or use a default
          const urlParts = fileUrl.split('/');
          const fileName = urlParts[urlParts.length - 1] || 'download.pdf';
          
          // Fetch the file and create a blob for proper download
          try {
            const fileResponse = await fetch(fileUrl);
            const blob = await fileResponse.blob();
            
            // Create a blob URL and trigger download
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName; // Force download instead of opening
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(blobUrl);
            }, 100);
          } catch (fetchError) {
            console.error('Error fetching file:', fetchError);
            // Fallback: open in new tab if blob download fails
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
          }
        } else {
          const error = await downloadResponse.json();
          console.error('Download error:', error);
          // If token is invalid, clear it and reload the page
          if (error.error?.includes('token')) {
            localStorage.removeItem(`download-token-${resourceId}`);
            router.refresh();
          }
        }
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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
          {isPaid && !hasValidToken ? 'Purchase Now' : 'Download'}
        </>
      )}
    </button>
  );
}
