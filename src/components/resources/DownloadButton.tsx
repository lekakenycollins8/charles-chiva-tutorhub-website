'use client';

import { Download, Smartphone, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { PaymentProvider } from "@/lib/payment-config";

interface DownloadButtonProps {
  fileUrl: string;
  className?: string;
  resourceId: string;
  isPaid: boolean;
  price?: number | null;
  userEmail?: string;
  activeProvider: PaymentProvider;
}

export default function DownloadButton({
  className,
  resourceId,
  isPaid,
  price,
  userEmail,
  activeProvider
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "sent" | "redirecting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

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
        const contentType = downloadResponse.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const error = await downloadResponse.json();
          console.error('Download error:', error);
          if (error.error?.includes('token') && typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(`download-token-${resourceId}`);
            router.refresh();
          }
          return;
        }

        const blob = await downloadResponse.blob();
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

  const issueDownloadToken = async (reference: string, provider: PaymentProvider) => {
    const tokenResponse = await fetch(`/api/resources/${resourceId}/download-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, provider }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to authorize download');
    }

    const { token } = await tokenResponse.json();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(`download-token-${resourceId}`, token);
    }
    setHasValidToken(true);
  };

  const completePaidDownload = async (reference: string, provider: PaymentProvider) => {
    setLoading(true);
    setErrorMessage("");
    setPaymentStatus("success");

    try {
      let completed = false;

      if (provider === "paystack") {
        const verifyResponse = await fetch(`/api/paystack/transaction/verify?reference=${encodeURIComponent(reference)}`);
        const verifyData = await verifyResponse.json().catch(() => ({}));
        completed = verifyResponse.ok && verifyData.status === "success";
        if (!completed) {
          throw new Error(verifyData.message || "Payment was not successful");
        }
      } else {
        const statusResponse = await fetch(`/api/mpesa/status/${encodeURIComponent(reference)}`);
        const statusData = await statusResponse.json().catch(() => ({}));
        completed = statusResponse.ok && statusData.paymentRecord?.status === "COMPLETED";
        if (!completed) {
          throw new Error("Payment is not complete yet");
        }
      }

      await issueDownloadToken(reference, provider);

      const url = new URL(window.location.href);
      url.searchParams.delete('reference');
      url.searchParams.delete('provider');
      window.history.replaceState({}, '', url.toString());

      await performDownload();
    } catch (error) {
      console.error('Payment completion error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to authorize download. Please try again.');
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const pollMpesaPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60;
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

          if (data.paymentRecord?.status === "COMPLETED") {
            await completePaidDownload(checkoutRequestID, "mpesa");
            return;
          }

          if (data.paymentRecord?.status === "FAILED") {
            setPaymentStatus("error");
            setErrorMessage("Payment failed. Please try again.");
            setLoading(false);
            return;
          }

          setTimeout(poll, 5000);
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  const initiateMpesaPayment = async () => {
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
      pollMpesaPaymentStatus(data.checkoutRequestID);
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  const initiatePaystackPayment = async () => {
    setLoading(true);
    setErrorMessage("");
    setPaymentStatus("redirecting");

    try {
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

      const data = await createRes.json();
      if (!createRes.ok) {
        throw new Error(data.error || 'Failed to initialize Paystack payment');
      }
      if (!data.authorizationUrl) {
        throw new Error('Paystack did not return a checkout URL');
      }

      window.location.href = data.authorizationUrl;
    } catch (error) {
      console.error('Paystack checkout error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reference = searchParams.get('reference');
    if (reference) {
      const providerParam = searchParams.get('provider');
      const provider = providerParam === 'mpesa' || providerParam === 'paystack' ? providerParam : activeProvider;
      completePaidDownload(reference, provider);
      return;
    }

    if (window.localStorage && localStorage.getItem(`download-token-${resourceId}`)) {
      setHasValidToken(true);
    }
  }, [resourceId, searchParams, activeProvider]);

  const handleDownload = async () => {
    if (isPaid && !hasValidToken) {
      if (!showCustomerForm) {
        setShowCustomerForm(true);
        return;
      }

      if (!email || !firstName || !lastName || (activeProvider === 'mpesa' && !phoneNumber)) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      if (activeProvider === 'mpesa') {
        const phoneRegex = /^(07|01|\+2547|2547)\d{7,8}$/;
        if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
          setErrorMessage('Please enter a valid Kenyan phone number (e.g., 07XX XXX XXX or 2547XX XXX XXX)');
          return;
        }
        await initiateMpesaPayment();
      } else {
        await initiatePaystackPayment();
      }
    } else {
      await performDownload();
    }
  };

  return (
    <div className="space-y-4">
      {showCustomerForm && (
        <div className="flex flex-col space-y-3">
          {activeProvider === 'mpesa' && (
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
          )}
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
            <div className="relative">
              {activeProvider === 'paystack' && (
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 mt-1" />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeProvider === 'paystack' ? 'pl-10' : ''}`}
              />
            </div>
            {activeProvider === 'paystack' && (
              <p className="text-xs text-gray-500 mt-1">You will be redirected to Paystack to complete payment</p>
            )}
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

      {paymentStatus === "redirecting" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
          Redirecting to Paystack. Please complete your payment there.
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          Payment successful! Starting download...
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={loading || paymentStatus === "success" || paymentStatus === "redirecting"}
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
            {isPaid && !hasValidToken ? `Pay KSh ${price?.toLocaleString() || '0'}` : 'Download'}
          </>
        )}
      </button>
    </div>
  );
}
