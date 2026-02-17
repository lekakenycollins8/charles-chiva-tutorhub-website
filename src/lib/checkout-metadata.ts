// Temporary storage for checkout metadata (in production, use Redis or database)
const checkoutMetadata = new Map<string, any>();

export function storeCheckoutMetadata(checkoutId: string, metadata: any) {
  checkoutMetadata.set(checkoutId, metadata);
  // Auto-cleanup after 1 hour
  setTimeout(() => {
    checkoutMetadata.delete(checkoutId);
  }, 3600000);
}

export function getCheckoutMetadata(invoiceId: string): any {
  // Try to find metadata by checking all stored checkouts
  for (const [checkoutId, metadata] of checkoutMetadata.entries()) {
    if (metadata.invoiceId === invoiceId) {
      return metadata;
    }
  }
  return null;
}
