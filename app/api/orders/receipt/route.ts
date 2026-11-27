import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const orderNumber = formData.get("orderNumber");
    const email = formData.get("email");
    const file = formData.get("receipt");

    if (
      typeof orderNumber !== "string" ||
      typeof email !== "string" ||
      !orderNumber.trim() ||
      !email.trim()
    ) {
      return NextResponse.json(
        { message: "Order number and email are required." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Please select a payment receipt." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG, WEBP and PDF files are allowed." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "The receipt must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber.trim(),
      },
      select: {
        id: true,
        email: true,
        paymentMethod: true,
        paymentStatus: true,
      },
    });

    if (
      !order ||
      order.email.toLowerCase() !== email.trim().toLowerCase()
    ) {
      return NextResponse.json(
        { message: "Order not found. Please check your details." },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== "bank") {
      return NextResponse.json(
        { message: "This order does not use bank transfer." },
        { status: 400 }
      );
    }

    if (order.paymentStatus !== "PENDING") {
      return NextResponse.json(
        { message: "This order is not awaiting payment." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedReceipt = await new Promise<{
      secure_url: string;
    }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "zyellee/payment-receipts",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Receipt upload failed."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
          });
        }
      ).end(buffer);
    });

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentReceipt: uploadedReceipt.secure_url,
      },
    });

    return NextResponse.json(
      {
        message: "Payment receipt uploaded successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment receipt upload error:", error);

    return NextResponse.json(
      { message: "Unable to upload the receipt. Please try again." },
      { status: 500 }
    );
  }
}
