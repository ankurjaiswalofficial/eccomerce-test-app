export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderSummaryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type CheckoutStep = 'shipping' | 'payment' | 'confirmation';