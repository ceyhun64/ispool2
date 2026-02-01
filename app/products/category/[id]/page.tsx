//app/products/category/[id]/page.tsx
"use client";

import { use } from "react";
import CatProducts from "@/components/modules/products/products/catProducts";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>; // Klasör ismine uygun olarak 'id'
}) {
  const { id } = use(params);

  // ID'yi sayıya çevirerek alt bileşene gönderiyoruz
  return <CatProducts id={Number(id)} />;
}
