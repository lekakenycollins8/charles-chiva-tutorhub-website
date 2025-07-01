'use client';

import { Download } from "lucide-react";
import { useState } from "react";
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

  const handleDownload = async () => {
    if (isPaid) {
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
      // Track download for free resources
      try {
        await fetch(`/api/resources/${resourceId}/download`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Download tracking error:', error);
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
          {isPaid ? `Purchase ($${price})` : 'Download Resource'}
        </>
      )}
    </button>
  );
}
