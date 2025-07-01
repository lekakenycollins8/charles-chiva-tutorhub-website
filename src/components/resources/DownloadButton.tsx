'use client';

import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface DownloadButtonProps {
  fileUrl: string;
  className?: string;
  resourceId: string;
  isPaid: boolean;
  price?: number | null;
}

export default function DownloadButton({ 
  fileUrl, 
  className,
  resourceId,
  isPaid,
  price
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    if (isPaid) {
      checkPurchaseStatus();
    }
  }, [isPaid, resourceId]);

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/purchase-status`, {
        credentials: 'include'
      });
      const { purchased } = await response.json();
      setHasPurchased(purchased);
    } catch (error) {
      console.error('Purchase status check error:', error);
    }
  };

  const handleDownload = async () => {
    if (isPaid && !hasPurchased) {
      // Initiate Stripe checkout for paid resources
      setLoading(true);
      try {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceId,
            price
          }),
        });
        
        const { sessionId } = await response.json();
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        await stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error('Checkout error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle download for both free and purchased resources
      setLoading(true);
      try {
        const downloadResponse = await fetch(`/api/resources/${resourceId}/download`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (downloadResponse.ok) {
          const { fileUrl } = await downloadResponse.json();
          
          // Create a temporary anchor element to trigger download
          const a = document.createElement('a');
          a.href = fileUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Refresh purchase status if this was a paid resource
          if (isPaid) {
            await checkPurchaseStatus();
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
      className={className}
    >
      {loading ? (
        'Processing...'
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {isPaid ? 
            (hasPurchased ? 'Download Resource' : `Purchase ($${price})`) 
            : 'Download Resource'}
        </>
      )}
    </button>
  );
}
