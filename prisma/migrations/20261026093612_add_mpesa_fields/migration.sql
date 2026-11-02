-- AlterTable
ALTER TABLE "CheckoutMetadata" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'mpesa';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "merchantRequestID" TEXT,
ADD COLUMN     "mpesaReceiptNumber" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'mpesa',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "transactionType" TEXT;
