export type CartProductType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
  tag?: string | null;
};

export type CartItemType = {
  id: string;
  productId: string;
  quantity: number;
  product: CartProductType;
};

export type CartType = {
  id?: string;
  items: CartItemType[];
};
