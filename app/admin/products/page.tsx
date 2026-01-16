import React from "react";
import AdminProducts from "@/components/modules/admin/products/products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      <AdminProducts />
    </div>
  );
}
