"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Premium Headphones",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: "3",
    name: "Wireless Speaker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80"
  }
];

export default function ProductGrid() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const addToCart = async (productId: string, price: number) => {
    setLoading(productId);
    try {
      const response = await fetch("/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user123", // In a real app, this would come from auth
          item: {
            id: productId,
            price
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_PRODUCTS.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardHeader className="p-0">
            <Image
              src={product.image}
              alt={product.name}
              width={1920}
              height={1080}
              className="w-full h-48 object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <p className="text-2xl font-bold mt-2">${product.price}</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => addToCart(product.id, product.price)}
              disabled={loading === product.id}
            >
              {loading === product.id ? "Adding..." : "Add to Cart"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
