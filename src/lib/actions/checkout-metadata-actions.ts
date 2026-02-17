import { prisma } from "@/lib/db";

export async function storeCheckoutMetadata(checkoutId: string, metadata: any, email: string, amount: number, currency: string) {
  try {
    const checkoutMetadata = await prisma.checkoutMetadata.create({
      data: {
        checkoutId,
        invoiceId: "", // Will be updated when webhook arrives
        metadata,
        email,
        amount,
        currency,
        status: "PENDING",
      },
    });
    return checkoutMetadata;
  } catch (error: any) {
    console.error("Error storing checkout metadata:", error);
    throw error;
  }
}

export async function getCheckoutMetadata(invoiceId: string) {
  try {
    const checkoutMetadata = await prisma.checkoutMetadata.findFirst({
      where: {
        invoiceId: invoiceId,
      },
    });
    return checkoutMetadata?.metadata || null;
  } catch (error: any) {
    console.error("Error retrieving checkout metadata:", error);
    return null;
  }
}

export async function updateCheckoutMetadataByCheckoutId(checkoutId: string, invoiceId: string, status: string = "COMPLETED") {
  try {
    const checkoutMetadata = await prisma.checkoutMetadata.update({
      where: { checkoutId },
      data: { 
        invoiceId,
        status,
        updatedAt: new Date(),
      },
    });
    return checkoutMetadata;
  } catch (error: any) {
    console.error("Error updating checkout metadata:", error);
    throw error;
  }
}

export async function updateCheckoutMetadataByInvoiceId(invoiceId: string, status: string = "COMPLETED") {
  try {
    // First, find the record by invoiceId (if it exists)
    const existingRecord = await prisma.checkoutMetadata.findFirst({
      where: { invoiceId },
    });
    
    if (existingRecord) {
      // Update existing record
      const checkoutMetadata = await prisma.checkoutMetadata.update({
        where: { id: existingRecord.id },
        data: { 
          status,
          updatedAt: new Date(),
        },
      });
      return checkoutMetadata;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error updating checkout metadata by invoice ID:", error);
    throw error;
  }
}

export async function findMetadataByPaymentDetails(email: string, amount: number, currency: string) {
  try {
    // Find pending checkout metadata matching email, amount, and currency
    const checkoutMetadata = await prisma.checkoutMetadata.findFirst({
      where: {
        email: email,
        amount: amount,
        currency: currency,
        status: "PENDING",
        invoiceId: "", // Only find records with empty invoiceId
      },
    });
    
    if (checkoutMetadata) {
      // Update the record with the invoiceId and mark as completed
      const updated = await prisma.checkoutMetadata.update({
        where: { id: checkoutMetadata.id },
        data: {
          invoiceId: "", // We'll set this in the webhook
          status: "COMPLETED",
          updatedAt: new Date(),
        },
      });
      return updated;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error finding metadata by payment details:", error);
    throw error;
  }
}

export async function updateMetadataWithInvoiceId(id: string, invoiceId: string) {
  try {
    const checkoutMetadata = await prisma.checkoutMetadata.update({
      where: { id },
      data: { 
        invoiceId,
        updatedAt: new Date(),
      },
    });
    return checkoutMetadata;
  } catch (error: any) {
    console.error("Error updating metadata with invoice ID:", error);
    throw error;
  }
}
