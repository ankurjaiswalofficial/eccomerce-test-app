"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/components/cart/CartItem";
import { cartStore } from "@/lib/cart-store";

export default function CartPage() {
  const [discountCode, setDiscountCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const cart = cartStore.getCart("user123"); // In a real app, this would use auth

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123",
          discountCode: discountCode || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      toast({
        title: "Order Placed!",
        description: `Order #${data.orderId} confirmed. Total: $${data.totalAmount.toFixed(2)}`,
      });
      
      if (data.discountCode) {
        toast({
          title: "Discount Code",
          description: `Use code ${data.discountCode} on your next order!`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = cart.items.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
    }
  };

  const removeItem = (id: string) => {
    cart.items = cart.items.filter((item) => item.id !== id);
  };

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
        
        {cart.items.length === 0 && (
          <p className="text-center text-muted-foreground">Your cart is empty</p>
        )}
      </div>

      {cart.items.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </p>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button 
              className="w-full"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}