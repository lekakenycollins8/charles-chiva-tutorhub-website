import PaymentSuccess from '@/components/pricing/PaymentSuccess';

export default function PricingPaymentSuccessPage() {
  return (
    <div className="container mx-auto py-12">
      <PaymentSuccess redirectPath="/pricing" />
    </div>
  );
}
