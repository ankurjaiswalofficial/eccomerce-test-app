"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import type { CheckoutStep, ShippingDetails } from "@/types/checkout";
import { cartStore } from "@/lib/cart-store";

const MOCK_PRODUCTS = {
  "1": "Premium Headphones",
  "2": "Smart Watch",
  "3": "Wireless Speaker",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const cart = cartStore.getCart("user123");
  const items = cart.items.map(item => ({
    ...item,
    name: MOCK_PRODUCTS[item.id as keyof typeof MOCK_PRODUCTS] || `Product #${item.id}`,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const discount = 0; // You can calculate this based on the discount code

  const handleShippingSubmit = async (data: ShippingDetails) => {
    setShippingDetails(data);
    setCompletedSteps([...completedSteps, "shipping"]);
    setCurrentStep("payment");
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123",
          shippingDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      setCompletedSteps([...completedSteps, "payment"]);
      setCurrentStep("confirmation");

      toast({
        title: "Order Confirmed!",
        description: `Order #${data.orderId} has been placed successfully.`,
      });

      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="mb-12">
          <CheckoutSteps
            currentStep={currentStep}
            completedSteps={completedSteps}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <ShippingForm onSubmit={handleShippingSubmit} />
            )}
            
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <p className="text-muted-foreground mb-4">
                    Payment integration would go here in a production environment.
                  </p>
                  <Button
                    onClick={handlePayment}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Order"}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === "confirmation" && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-green-700">
                  Thank you for your order. You will be redirected shortly.
                </p>
              </div>
            )}
          </div>

          <div>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}