export interface ProductSizeVariantInput {
  size: string;
  price: number;
  specialPrice?: number;
  stock?: number;
  sku: string;
}

export interface ProductColorVariantInput {
  color: string;
  image?: string;
  sizes: ProductSizeVariantInput[];
}

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;

  // Basic Information
  brand?: string;
  category: string;
  tags?: string[];

  // Media
  thumbnail: string;
  images: string[];
  videoUrl?: string;

  // Specification
  model?: string;
  material?: string;

  // Pricing
  price: number;
  specialPrice?: number;
  discount?: number;

  // Stock
  stock?: number;

  // Variants
  colorVariants?: ProductColorVariantInput[];

  // Highlights
  highlights?: string[];

  // Shipping
  weight?: number;
  dimensions?: ProductDimensions;

  dangerousGoods?: boolean;

  // Warranty
  warrantyType?: string;
  warrantyPeriod?: string;

  // Status
  rating?: number;
  reviewCount?: number;
  viewCount?: number;

  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface ProductQuery {
  search?: string;

  categoryId?: string;

  brand?: string;

  minPrice?: string;

  maxPrice?: string;

  sortBy?: string;

  sortOrder?: 'asc' | 'desc';

  page?: string;

  limit?: string;

  isFeatured?: string;

  isPublished?: string;
}
