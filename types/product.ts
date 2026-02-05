export interface ProductVariant {
  sizeId: number | null;
  stock: number;
  priceModifier?: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brandId?: number;
  sizes: { sizeId: number }[];
  stock: ProductVariant[];
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;
  subImage4?: string;
  brandId?: number;
  createdAt: string;
  updatedAt: string;
}
