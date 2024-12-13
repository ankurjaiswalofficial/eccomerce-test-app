import { cartStore } from "@/lib/cart-store";
import { orderStore } from "@/lib/order-store";
import { CheckoutRequest } from "@/types/cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const { userId, discountCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const cart = cartStore.getCart(userId);
    
    if (cart.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    let discount = 0;
    if (discountCode && orderStore.validateDiscountCode(discountCode)) {
      discount = 0.1; // 10% discount
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const finalAmount = totalAmount * (1 - discount);
    const orderId = orderStore.addOrder(cart);
    const newDiscountCode = orderStore.generateDiscountCode();

    cartStore.clearCart(userId);

    return NextResponse.json({
      orderId,
      totalAmount: finalAmount,
      discountCode: newDiscountCode,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}