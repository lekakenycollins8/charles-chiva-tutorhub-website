import axios from 'axios';

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not set');
}

// Create a configured instance of axios for Paystack API calls
export const paystackAPI = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Helper functions for Paystack operations
export const paystack = {
  // Initialize a transaction
  initializeTransaction: async (data: {
    email: string;
    amount: number; // amount in kobo (smallest currency unit)
    reference?: string;
    callback_url?: string;
    metadata?: any;
  }) => {
    const response = await paystackAPI.post('/transaction/initialize', data);
    return response.data;
  },

  // Verify a transaction
  verifyTransaction: async (reference: string) => {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);
    return response.data;
  },

  // Get transaction details
  getTransaction: async (id: number) => {
    const response = await paystackAPI.get(`/transaction/${id}`);
    return response.data;
  },

  // List transactions
  listTransactions: async (params?: {
    perPage?: number;
    page?: number;
    from?: string;
    to?: string;
  }) => {
    const response = await paystackAPI.get('/transaction', { params });
    return response.data;
  }
};
