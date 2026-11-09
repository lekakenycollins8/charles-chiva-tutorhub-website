import { prisma } from "@/lib/db";
import type { PaymentProvider } from "@/lib/payment-config";

export interface PaymentCheckoutMetadata {
  type: "plan" | "resource";
  planId?: string;
  resourceId?: string;
  quantity?: number;
  unitPrice?: number;
  priceUnit?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

interface PaymentFulfillmentParams {
  provider: PaymentProvider;
  reference: string;
  amount: number;
  currency: string;
  metadata: PaymentCheckoutMetadata;
  transactionDetails?: Record<string, unknown>;
}

function toJsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? null));
}

function amountsMatch(actual: number, expected: number) {
  return Math.abs(actual - expected) < 0.01;
}

export async function processSuccessfulPayment({
  provider,
  reference,
  amount,
  currency,
  metadata,
  transactionDetails,
}: PaymentFulfillmentParams) {
  if (!metadata?.type) {
    throw new Error("Payment metadata is missing type");
  }

  const email = metadata.email || "";
  let resourceId: string | undefined;

  if (metadata.type === "resource") {
    if (!metadata.resourceId) {
      throw new Error("Resource payment metadata is missing resourceId");
    }

    const resource = await prisma.resource.findUnique({
      where: { id: metadata.resourceId },
      select: { id: true, isPaid: true, price: true },
    });

    if (!resource?.isPaid || resource.price == null) {
      throw new Error("Resource is not payable");
    }

    const expectedAmount = typeof metadata.amount === "number" ? metadata.amount : resource.price;
    if (!amountsMatch(amount, expectedAmount)) {
      throw new Error("Payment amount does not match resource price");
    }

    resourceId = resource.id;
  } else if (metadata.type === "plan") {
    if (metadata.unitPrice != null && metadata.quantity != null) {
      const expectedAmount = Number(metadata.unitPrice) * Number(metadata.quantity);
      if (!amountsMatch(amount, expectedAmount)) {
        throw new Error("Payment amount does not match plan total");
      }
    }
  } else {
    throw new Error("Unsupported payment metadata type");
  }

  const paymentMetadata = toJsonValue({
    checkout: metadata,
    provider,
    currency,
    transaction: transactionDetails ?? null,
  });

  const transactionType =
    provider === "paystack"
      ? typeof transactionDetails?.channel === "string"
        ? transactionDetails.channel
        : null
      : typeof transactionDetails?.transactionType === "string"
        ? transactionDetails.transactionType
        : null;

  return prisma.payment.upsert({
    where: { reference },
    create: {
      reference,
      email,
      amount,
      status: "COMPLETED",
      resourceId,
      metadata: paymentMetadata,
      paymentMethod: provider,
      transactionType,
    },
    update: {
      email,
      amount,
      status: "COMPLETED",
      resourceId,
      metadata: paymentMetadata,
      paymentMethod: provider,
      transactionType,
    },
  });
}

export async function recordFailedPayment({
  provider,
  reference,
  amount,
  currency,
  metadata,
  transactionDetails,
}: PaymentFulfillmentParams) {
  const paymentMetadata = toJsonValue({
    checkout: metadata,
    provider,
    currency,
    transaction: transactionDetails ?? null,
  });

  return prisma.payment.upsert({
    where: { reference },
    create: {
      reference,
      email: metadata.email || "",
      amount,
      status: "FAILED",
      resourceId: metadata.type === "resource" ? metadata.resourceId : undefined,
      metadata: paymentMetadata,
      paymentMethod: provider,
      transactionType:
        provider === "paystack"
          ? typeof transactionDetails?.channel === "string"
            ? transactionDetails.channel
            : null
          : typeof transactionDetails?.transactionType === "string"
            ? transactionDetails.transactionType
            : null,
    },
    update: {
      email: metadata.email || "",
      amount,
      status: "FAILED",
      resourceId: metadata.type === "resource" ? metadata.resourceId : undefined,
      metadata: paymentMetadata,
      paymentMethod: provider,
      transactionType:
        provider === "paystack"
          ? typeof transactionDetails?.channel === "string"
            ? transactionDetails.channel
            : null
          : typeof transactionDetails?.transactionType === "string"
            ? transactionDetails.transactionType
            : null,
    },
  });
}
