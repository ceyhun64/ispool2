// src/types/product.ts

// Product arayüzü, hem Products state'i hem de Update/Add Dialog'ları için temel veri yapısıdır.
export interface ProductType {
  id: number;
  title: string;
  description: string;
  pricePerM2: number;
  rating: number;
  // reviewCount'ın Products.tsx'te optional olması gerekiyordu, bu yüzden burada da öyle kalmalı.
  reviewCount?: number;

  mainImage: string;
  subImage?: string;
  subImage2?: string;
  subImage3?: string;

  category: string;
  subCategory?: string;
  room?: string;

  createdAt: string;
  updatedAt: string;
}

// AddProductDialog'un beklediği form verisi (ID, zaman damgaları vb. içermez, çünkü yeni oluşturulur)
export interface ProductFormData {
  title: string;
  description: string;
  pricePerM2: number;
  rating: number;
  reviewCount?: number;
  category: string;
  subCategory?: string;
  room?: string;
}
