export interface CartItem {
  id: string;
  price: number;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  userId: string;
  item: {
    id: string;
    price: number;
  };
}

export interface CheckoutRequest {
  userId: string;
  discountCode?: string;
}

export interface CheckoutResponse {
  orderId: number;
  totalAmount: number;
  discountCode?: string;
}