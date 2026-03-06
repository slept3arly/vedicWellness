export type ShippingAddr = {
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type OrderItem = {
  id: string;
  productName: string;
  productId: string | null;
  price: number;
  quantity: number;
};

export type UserOrderListItem = {
  id: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  currency: string;
  items: {
    productName: string;
    quantity: number;
  }[];
};

export type OrderForClient = {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;       // ISO string — safe across server→client boundary
  expiresAt: string | null;
  paidAt: string | null;
  paymentId: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddr: ShippingAddr | null;
  items: OrderItem[];
};