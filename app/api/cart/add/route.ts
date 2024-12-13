import { cartStore } from "@/lib/cart-store";
import { AddToCartRequest } from "@/types/cart";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: AddToCartRequest = await request.json();
    const { userId, item } = body;

    if (!userId || !item?.id || typeof item.price !== "number") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    cartStore.addItem(userId, { id: item.id, price: item.price, quantity: 1 });

    return NextResponse.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
