/**
 * Test script for Paystack pricing payment flow
 * 
 * This script simulates the Paystack payment flow for pricing plans
 * It can be used to test the payment initialization and webhook handling
 * 
 * Usage:
 * 1. Run the development server: npm run dev
 * 2. In a separate terminal, run: node src/scripts/test-paystack-pricing.js
 */

const axios = require('axios');
const crypto = require('crypto');

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PLAN_ID = 'basic-hourly';
const TEST_QUANTITY = 3;

// Simulate a payment initialization request
async function testPaymentInitialization() {
  console.log('Testing Paystack pricing payment initialization...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/paystack/pricing/initialize`, {
      planId: TEST_PLAN_ID,
      quantity: TEST_QUANTITY,
      email: TEST_EMAIL
    });
    
    console.log('Payment initialization successful!');
    console.log('Authorization URL:', response.data.authorization_url);
    console.log('Reference:', response.data.reference);
    
    return response.data.reference;
  } catch (error) {
    console.error('Payment initialization failed:', error.response?.data || error.message);
    return null;
  }
}

// Simulate a webhook event for a successful payment
async function testWebhookEvent(reference) {
  if (!reference) {
    console.error('Cannot test webhook without a reference');
    return;
  }
  
  console.log('\nTesting webhook event for successful payment...');
  
  // Create a mock webhook event payload
  const eventPayload = {
    event: 'charge.success',
    data: {
      reference,
      status: 'success',
      amount: 3000, // $30 (3 hours at $10/hour)
      customer: {
        email: TEST_EMAIL
      },
      metadata: {
        planId: TEST_PLAN_ID,
        planName: 'Basic',
        quantity: TEST_QUANTITY,
        priceUnit: 'hour',
        unitPrice: 10,
        totalAmount: 30
      }
    }
  };
  
  // Create a mock signature (this won't pass the actual verification)
  // In a real scenario, the signature would be created using the Paystack secret key
  const mockSignature = crypto.createHmac('sha512', 'test_secret')
    .update(JSON.stringify(eventPayload))
    .digest('hex');
  
  try {
    // Note: This will fail in a real environment due to signature verification
    // This is just for demonstration purposes
    console.log('Note: Webhook test will fail signature verification in a real environment');
    console.log('This is expected and just for demonstration purposes');
    
    const response = await axios.post(`${BASE_URL}/api/paystack/webhook`, eventPayload, {
      headers: {
        'x-paystack-signature': mockSignature
      }
    });
    
    console.log('Webhook event processed successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Webhook event processing failed:', error.response?.data || error.message);
    console.log('This is expected due to signature verification');
  }
}

// Run the tests
async function runTests() {
  console.log('=== PAYSTACK PRICING PAYMENT FLOW TEST ===\n');
  
  const reference = await testPaymentInitialization();
  await testWebhookEvent(reference);
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('To complete the test:');
  console.log('1. Visit the authorization URL in a browser');
  console.log('2. Complete the payment using Paystack test cards');
  console.log('3. Verify the success page and database records');
}

runTests();
