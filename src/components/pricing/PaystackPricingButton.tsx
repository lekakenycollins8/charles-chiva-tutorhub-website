'use client';

import { useState } from "react";
import { PricingPlan } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PaystackPricingButtonProps {
  plan: PricingPlan;
  className?: string;
}

export default function PaystackPricingButton({
  plan,
  className
}: PaystackPricingButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Calculate total price based on quantity
  const totalPrice = plan.priceValue * quantity;
  
  // Format the unit label (hour/hours, week/weeks, month/months)
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setShowEmailDialog(false);
    initiatePayment(email);
  };

  const initiatePayment = async (customerEmail: string) => {
    setLoading(true);
    try {      
      const response = await fetch('/api/paystack/pricing/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          quantity,
          email: customerEmail
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }
      
      const { authorization_url } = await response.json();
      
      // Redirect to Paystack payment page
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('There was an error initializing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayment = () => {
    setShowEmailDialog(true);
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
            Total: ${totalPrice.toFixed(2)} for {quantity} {getUnitLabel()}
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
          showQuantity ? `Pay $${totalPrice.toFixed(2)}` : "Get Started"
        )}
      </Button>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your email address</DialogTitle>
            <DialogDescription>
              We need your email address to send you payment confirmation and receipt.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEmailDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
