// app/admin/products/edit/[id]/page.tsx
import ProductForm from "@/components/modules/admin/products/productForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditProductPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  // Eğir giriş yoksa veya role ADMIN değilse login sayfasına yönlendir
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin");
  }

  // ✅ DÜZELTME: params'ı await et, sonra id'yi al
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id);

  console.log("app/admin/products/edit/[id]/page.tsx productId", productId);

  return (
    <div>
      <ProductForm productId={productId} />
    </div>
  );
}
