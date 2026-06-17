import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ispool.com.tr";
  const now = new Date();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/products/wholesale`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/products/special_production`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/institutional/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/institutional/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/institutional/why_us`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/institutional/quality`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/institutional/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/institutional/career`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/help/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/help/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/help/kvkk`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/help/returns-help`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/help/printing`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/help/distance-sales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/customer/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/customer/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/customer/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/customer/sales-agreement`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/institutional/cookie_policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    // Dinamik ürün sayfaları
    const products = await prisma.product.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/products/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Dinamik blog sayfaları
    const blogs = await prisma.blog.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
      url: `${baseUrl}/institutional/blog/${b.id}`,
      lastModified: b.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Kategori sayfaları
    const categories = await prisma.category.findMany({
      include: {
        middleCategories: {
          include: {
            subCategories: true,
          },
        },
      },
    });

    const categoryPages: MetadataRoute.Sitemap = [];
    for (const cat of categories) {
      categoryPages.push({
        url: `${baseUrl}/products/category/${cat.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const mid of cat.middleCategories) {
        categoryPages.push({
          url: `${baseUrl}/products/category/${cat.id}/${mid.id}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.65,
        });
        for (const sub of mid.subCategories) {
          categoryPages.push({
            url: `${baseUrl}/products/category/${cat.id}/${mid.id}/${sub.id}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }

    return [...staticPages, ...productPages, ...blogPages, ...categoryPages];
  } catch {
    // DB bağlantısı yoksa sadece statik sayfaları döndür
    return staticPages;
  }
}
