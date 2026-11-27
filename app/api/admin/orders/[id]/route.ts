import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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

    // Get and validate order ID
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return NextResponse.json(
        { message: "Invalid order ID." },
        { status: 400 }
      );
    }

    // Check whether the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 }
      );
    }

    // Delete order (related order items are deleted through cascade)
    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({
      message: "Order deleted successfully.",
      orderNumber: existingOrder.orderNumber,
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return NextResponse.json(
      { message: "Failed to delete order." },
      { status: 500 }
    );
  }
}
