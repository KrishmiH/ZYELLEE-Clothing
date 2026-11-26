import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      address,
      address2,
      city,
      postalCode,
      paymentMethod,
      items,
    } = body;

    // Validate customer information
    const requiredFields = [
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      postalCode,
    ];

    if (
      requiredFields.some(
        (field) => typeof field !== "string" || !field.trim()
      )
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!["cod", "bank"].includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    // Validate cart item structure
    const productIds: number[] = [];

    for (const item of items) {
      const productId = Number(item?.productId);
      const quantity = Number(item?.quantity);

      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20 ||
        typeof item?.size !== "string" ||
        typeof item?.color !== "string"
      ) {
        return NextResponse.json(
          { message: "One or more cart items are invalid." },
          { status: 400 }
        );
      }

      productIds.push(productId);
    }

    // Retrieve products from PostgreSQL
    const databaseProducts = await prisma.product.findMany({
      where: {
        id: {
          in: [...new Set(productIds)],
        },
      },
    });

    const productMap = new Map(
      databaseProducts.map((product) => [product.id, product])
    );

    // Validate products and calculate prices using database values
    const orderItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const product = productMap.get(productId);

      if (
        !product ||
        !product.sizes.includes(item.size) ||
        !product.colors.includes(item.color)
      ) {
        return NextResponse.json(
          { message: "One or more cart items are invalid." },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity,
        size: item.size,
        color: item.color,
      });
    }

    // Calculate order totals
    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const shippingCost = 0;
    const total = subtotal + shippingCost;

    // Save order and its products in one database operation
    const order = await prisma.order.create({
      data: {
        orderNumber: `ZYL-${randomUUID().slice(0, 8).toUpperCase()}`,
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        address2:
          typeof address2 === "string" && address2.trim()
            ? address2.trim()
            : null,
        city: city.trim(),
        postalCode: postalCode.trim(),
        paymentMethod,
        subtotal,
        shippingCost,
        total,
        items: {
          create: orderItems,
        },
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
      },
    });

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      { message: "Something went wrong while placing your order." },
      { status: 500 }
    );
  }
}
