import { Cart, CartItem } from "@/types/cart";

// In-memory store for demo purposes
// In a real app, this would be a database
class CartStore {
  private carts: Map<string, Cart> = new Map();

  getCart(userId: string): Cart {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, { userId, items: [] });
    }
    return this.carts.get(userId)!;
  }

  addItem(userId: string, item: CartItem): void {
    const cart = this.getCart(userId);
    const existingItem = cart.items.find((i) => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }
  }

  clearCart(userId: string): void {
    this.carts.delete(userId);
  }
}

export const cartStore = new CartStore();