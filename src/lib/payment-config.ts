export type PaymentProvider = "mpesa" | "paystack";

export function getActivePaymentProvider(): PaymentProvider {
  return process.env.ACTIVE_PAYMENT_PROVIDER === "paystack" ? "paystack" : "mpesa";
}
