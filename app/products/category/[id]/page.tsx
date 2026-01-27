// /app/products/[categorySlug]/page.tsx
"use client";

import { use } from "react";
import ProductsContent from "@/components/modules/products/allProducts";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);

  return <ProductsContent categorySlug={categorySlug} />;
}
