// app/admin/products/new/page.tsx
import React from "react";
import ProductForm from "@/components/modules/admin/products/productForm";
import Sidebar from "@/components/modules/admin/sideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminNewProductsPage() {
  const session = await getServerSession(authOptions);

  // Eğer giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
     <div>
         <ProductForm />
       </div>
  );
}