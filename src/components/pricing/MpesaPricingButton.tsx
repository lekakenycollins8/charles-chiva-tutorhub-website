'use client';

import { useState } from "react";
import { PricingPlan } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp, Smartphone } from "lucide-react";

interface MpesaPricingButtonProps {
  plan: PricingPlan;
  className?: string;
}

export default function MpesaPricingButton({ plan, className }: MpesaPricingButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "sent" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalPrice = plan.priceValue * quantity;

  const getUnitLabel = () => {
    switch (plan.priceUnit) {
      case 'hour':
        return quantity === 1 ? 'hour' : 'hours';
      case 'week':
        return quantity === 1 ? 'week' : 'weeks';
      case 'month':
        return quantity === 1 ? 'month' : 'months';
      default:
        return plan.priceUnit;
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (plan.maxQuantity && value > plan.maxQuantity) {
      setQuantity(plan.maxQuantity);
    } else {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (!plan.maxQuantity || quantity < plan.maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const initiatePayment = async () => {
    if (!phoneNumber || !email || !firstName || !lastName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^(07|01|\+2547|2547)\d{7,8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setErrorMessage('Please enter a valid Kenyan phone number (e.g., 07XX XXX XXX or 2547XX XXX XXX)');
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setPaymentStatus("sent");

    try {
      const response = await fetch('/api/mpesa/stkpush/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'plan',
          planId: plan.id,
          quantity,
          phoneNumber,
          email,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to initiate Mpesa payment');
      }

      const data = await response.json();
      console.log('Mpesa STK push initiated:', data);

      setPaymentStatus("success");

      // Poll for payment status
      pollPaymentStatus(data.checkoutRequestID);
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setErrorMessage(error.message || 'Failed to initiate payment. Please try again.');
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus("error");
        setErrorMessage("Payment timed out. Please check your phone and try again.");
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
            // Redirect to success page after a short delay
            setTimeout(() => {
              window.location.href = `/pricing/success?provider=mpesa&reference=${checkoutRequestID}`;
            }, 2000);
            return;
          }

          if (data.paymentRecord?.status === "FAILED") {
            setPaymentStatus("error");
            setErrorMessage("Payment failed. Please try again.");
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

  const handlePayment = () => {
    if (!showCustomerForm) {
      setShowCustomerForm(true);
    } else {
      initiatePayment();
    }
  };

  return (
    <div className="space-y-4">
      {showQuantity && (
        <div className="flex flex-col space-y-2">
          <Label htmlFor={`quantity-${plan.id}`} className="text-sm font-medium">
            Select {plan.priceUnit === 'hour' ? 'hours' : plan.priceUnit === 'week' ? 'weeks' : 'months'}:
          </Label>
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Input
              id={`quantity-${plan.id}`}
              type="number"
              min={1}
              max={plan.maxQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className="h-8 w-16 mx-2 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              disabled={plan.maxQuantity ? quantity >= plan.maxQuantity : false}
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm font-medium">
            Total: {plan.currencySymbol} {totalPrice.toLocaleString()} for {quantity} {getUnitLabel()}
          </div>
        </div>
      )}

      {showCustomerForm && (
        <div className="flex flex-col space-y-3">
          <div>
            <Label htmlFor={`phone-${plan.id}`} className="text-sm font-medium">
              Phone Number *
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id={`phone-${plan.id}`}
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="07XX XXX XXX"
                className="mt-1 pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number to receive Mpesa prompt</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`firstName-${plan.id}`} className="text-sm font-medium">
                First Name *
              </Label>
              <Input
                id={`firstName-${plan.id}`}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`lastName-${plan.id}`} className="text-sm font-medium">
                Last Name *
              </Label>
              <Input
                id={`lastName}-${plan.id}`}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`email-${plan.id}`} className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id={`email-${plan.id}`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
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
          Payment successful! Redirecting...
        </div>
      )}

      <Button
        onClick={showQuantity ? handlePayment : () => setShowQuantity(true)}
        disabled={loading || paymentStatus === "success"}
        className={`w-full py-6 text-white ${plan.buttonColor} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          showCustomerForm ? `Pay ${plan.currencySymbol} ${totalPrice.toLocaleString()}` : showQuantity ? "Continue" : "Get Started"
        )}
      </Button>
    </div>
  );
}
