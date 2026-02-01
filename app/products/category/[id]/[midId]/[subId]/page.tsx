"use client";

import { use } from "react";
import SubCatProducts from "@/components/modules/products/products/subCatProducts";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ id: string; midId: string; subId: string }>;
}) {
  const { id, midId, subId } = use(params);

  return (
    <SubCatProducts
      id={Number(id)}
      midId={Number(midId)}
      subId={Number(subId)}
    />
  );
}
