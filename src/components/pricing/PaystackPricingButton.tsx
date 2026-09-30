'use client';

import { useState } from "react";
import { PricingPlan } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

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
      alert('Please fill in all customer information fields.');
      return;
    }

    setLoading(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to initialize Paystack transaction');
      }

      const { authorizationUrl } = await response.json();
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error('Invalid Paystack response');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      alert(`Error: ${error.message}. Please ensure your Paystack API keys are configured in .env.local`);
    } finally {
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
                First Name
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
                Last Name
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
              Email Address
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

      <Button
        onClick={showQuantity ? handlePayment : () => setShowQuantity(true)}
        disabled={loading}
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
