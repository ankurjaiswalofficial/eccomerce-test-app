import { Cart } from "@/types/cart";

class OrderStore {
  private orders: Cart[] = [];
  private currentOrderId = 1000;
  private discountCodes = new Set(["WELCOME10", "SUMMER20"]);

  addOrder(cart: Cart): number {
    const orderId = this.currentOrderId++;
    this.orders.push(cart);
    return orderId;
  }

  generateDiscountCode(): string {
    const code = `SAVE${Math.floor(Math.random() * 50)}`;
    this.discountCodes.add(code);
    return code;
  }

  validateDiscountCode(code: string): boolean {
    return this.discountCodes.has(code);
  }

  getStats() {
    const totalItems = this.orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.quantity, 0),
      0
    );

    const totalAmount = this.orders.reduce(
      (sum, order) => sum + order.items.reduce((s, item) => s + item.price * item.quantity, 0),
      0
    );

    return {
      totalItems,
      totalAmount,
      discountCodes: Array.from(this.discountCodes),
      totalDiscountAmount: totalAmount * 0.1, // Example: 10% of total amount
    };
  }
}

export const orderStore = new OrderStore();