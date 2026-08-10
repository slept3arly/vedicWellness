export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
};

export type ProductSpecification = {
  id: string;
  label: string;
  value: string;
};

export type ProductFAQ = {
  id: string;
  question: string;
  answer: string;
};

export type ProductReview = {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: Date | string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;

  /* Pricing */
  price: number;
  compareAtPrice?: number | null;
  currency: string;

  /* Inventory */
  sku?: string | null;
  stock: number;

  /* Media */
  imageUrl?: string | null;
  gallery: string[];

  /* Core Descriptions */
  shortDescription?: string | null;
  longDescription?: string | null;

  /* Structured Content */
  highlights: string[];
  benefits: string[];
  whoShouldUse: string[];

  ingredients: string[];
  directionsToUse: string[];
  precautions: string[];
  packaging: string[];

  /* Technical Info */
  manufacturer?: string | null;
  countryOfOrigin?: string | null;
  shelfLife?: string | null;
  netQuantity?: string | null;

  /* Trust Layer */
  trustBadges: string[];
  certifications: string[];

  /* Categorization */
  tag?: string | null;
  medicineForm?: string | null;
  company?: { name: string; slug: string } | null;

  /* System Fields (YOU WERE MISSING THESE) */
  createdAt: Date | string;
  updatedAt: Date | string;

  /* Relations */
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  faqs?: ProductFAQ[];
  reviews?: ProductReview[];
};

export type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string | null;
  shortDescription?: string | null;
  tag?: string | null;
};

export const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const calcAvg = (reviews: ProductReview[]) =>
  reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
