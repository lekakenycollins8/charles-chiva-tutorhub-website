import PaymentSuccess from '@/components/pricing/PaymentSuccess';
import { Suspense } from 'react';

export default function PricingPaymentSuccessPage() {
  return (
    <div className="container mx-auto py-12">
      <Suspense fallback={<div className="text-center py-12">Loading payment details...</div>}>
        <PaymentSuccess redirectPath="/pricing" />
      </Suspense>
    </div>
  );
}
