//app/products/category/[id]/page.tsx
"use client";

import { use } from "react";
import ProductsContent from "@/components/modules/products/allProducts";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>; // Klasör ismine uygun olarak 'id'
}) {
  const { id } = use(params);

  // ID'yi sayıya çevirerek alt bileşene gönderiyoruz
  return <ProductsContent id={Number(id)} />;
}
