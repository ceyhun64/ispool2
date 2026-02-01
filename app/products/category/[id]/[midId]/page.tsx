"use client";

import { use } from "react";
import MidCatProducts from "@/components/modules/products/products/midCatProducts";

export default function MidCategoryPage({
  params,
}: {
  params: Promise<{ id: string; midId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <MidCatProducts
      id={Number(resolvedParams.id)}
      midId={Number(resolvedParams.midId)}
    />
  );
}
