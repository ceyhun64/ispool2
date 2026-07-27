import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ProductDetail from "@/components/modules/products/productDetail/productDetail";
import Recommended from "@/components/modules/products/productDetail/recommended";
import { formatPrice } from "@/lib/pricing";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ispool.com.tr";

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      select: {
        title: true,
        description: true,
        mainImage: true,
        price: true,
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    });

    if (!product) {
      return { title: "Ürün Bulunamadı | İşPool" };
    }

    const plainDescription = (product.description ?? "")
      .replace(/<[^>]+>/g, "")
      .slice(0, 155);

    const title = `${product.title} | İşPool`;
    const description =
      plainDescription ||
      `${product.title} - ${product.category.name} - ${formatPrice(product.price)} TL. İşPool'da premium iş güvenliği ekipmanları.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/products/${id}`,
        type: "website",
        images: [
          {
            url: product.mainImage,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ],
        locale: "tr_TR",
        siteName: "İşPool",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [product.mainImage],
      },
    };
  } catch {
    return { title: "Ürün | İşPool" };
  }
}

export default function ProductDetailPage() {
  return (
    <div>
      <ProductDetail />
      <Recommended />
    </div>
  );
}
