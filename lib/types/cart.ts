export type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    tag: string | null;
  };
};

export type CartType = {
  items: CartItemType[];
};
