import { orderStore } from "@/lib/order-store";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = orderStore.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}