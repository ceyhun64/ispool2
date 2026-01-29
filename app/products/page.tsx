// app/products/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import ProductsContent from "@/components/modules/products/allProducts";
import { Suspense } from "react";
import ProductSkeleton from "@/components/modules/products/productSkeleton";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const showDiscount = searchParams.get("discount") === "true";

  return <ProductsContent showDiscountOnly={showDiscount} />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}
