'use client';

import { useState } from "react";
import { PricingPlan } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp, CreditCard } from "lucide-react";

interface PaystackPricingButtonProps {
  plan: PricingPlan;
  className?: string;
}

export default function PaystackPricingButton({ plan, className }: PaystackPricingButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "sending" | "redirecting" | "error">("idle");
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
    if (!email || !firstName || !lastName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setPaymentStatus("sending");

    try {
      const response = await fetch('/api/paystack/transaction/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'plan',
          planId: plan.id,
          quantity,
          email,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize Paystack payment');
      }

      if (!data.authorizationUrl) {
        throw new Error('Paystack did not return a checkout URL');
      }

      setPaymentStatus("redirecting");
      window.location.href = data.authorizationUrl;
    } catch (error) {
      console.error('Paystack initialization error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
      setPaymentStatus("error");
      setLoading(false);
    }
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
                id={`lastName-${plan.id}`}
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
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id={`email-${plan.id}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="mt-1 pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">You will be redirected to Paystack to complete payment</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {errorMessage}
        </div>
      )}

      {paymentStatus === "sending" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
          Preparing secure Paystack checkout...
        </div>
      )}

      {paymentStatus === "redirecting" && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
          Redirecting to Paystack. Please complete your payment there.
        </div>
      )}

      <Button
        onClick={showQuantity ? handlePayment : () => setShowQuantity(true)}
        disabled={loading || paymentStatus === "redirecting"}
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
