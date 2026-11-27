-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentReceipt" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING';
