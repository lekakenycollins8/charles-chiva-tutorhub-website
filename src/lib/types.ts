export interface CheckoutMetadata {
  type: 'resource' | 'plan';
  resourceId?: string;
  email?: string;
  totalAmount?: number;
  [key: string]: any;
}

export function isCheckoutMetadata(obj: any): obj is CheckoutMetadata {
  return obj && typeof obj === 'object' && 'type' in obj && 
         (obj.type === 'resource' || obj.type === 'plan');
}
