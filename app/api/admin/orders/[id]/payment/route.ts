import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

const allowedPaymentStatuses = ["PAID", "REJECTED"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated();

    if (!isAuthenticated) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Validate order ID
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 }
      );
    }

    // Validate requested payment status
    const body = await request.json();
    const { paymentStatus } = body;

    if (
      typeof paymentStatus !== "string" ||
      !allowedPaymentStatuses.includes(paymentStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid payment status." },
        { status: 400 }
      );
    }

    // Find the order
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        paymentMethod: true,
        paymentStatus: true,
        paymentReceipt: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Only bank transfer orders can be verified here
    if (existingOrder.paymentMethod !== "bank") {
      return NextResponse.json(
        { message: "This order does not use bank transfer." },
        { status: 400 }
      );
    }

    // A receipt must be uploaded first
    if (!existingOrder.paymentReceipt) {
      return NextResponse.json(
        { message: "No payment receipt has been uploaded." },
        { status: 400 }
      );
    }

    // Only pending payments can be updated
    if (existingOrder.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { message: "This payment has already been reviewed." },
        { status: 400 }
      );
    }

    // Update payment status without changing order status
    const result = await prisma.order.updateMany({
      where: {
        id: orderId,
        paymentMethod: "bank",
        paymentStatus: "PENDING",
        paymentReceipt: { not: null },
      },
      data: {
        paymentStatus,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { message: "Payment could not be updated. Please refresh and try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      message: `Payment marked as ${paymentStatus} successfully.`,
      paymentStatus,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return NextResponse.json(
      { message: "Unable to update payment status." },
      { status: 500 }
    );
  }
}
