import dotenv from "dotenv";
dotenv.config();
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import productDataRaw from "@/data/products.json" assert { type: "json" };
import categoriesDataRaw from "@/data/categories.json" assert { type: "json" };
import middleCategoriesDataRaw from "@/data/middleCategories.json" assert { type: "json" };
import subCategoriesDataRaw from "@/data/subCategories.json" assert { type: "json" };

// --- TİP TANIMLAMALARI ---
interface ProductInput {
  id?: number;
  title: string;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount?: number;
  mainImage: string;
  subImage?: string;
  description: string;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brand?: string;
}

interface CategoryInput {
  name: string;
}

interface MiddleCategoryInput {
  name: string;
  categoryName: string;
}

interface SubCategoryInput {
  name: string;
  middleCategoryName: string;
}

const productData = productDataRaw as ProductInput[];
const categoriesData = categoriesDataRaw as CategoryInput[];
const middleCategoriesData = middleCategoriesDataRaw as MiddleCategoryInput[];
const subCategoriesData = subCategoriesDataRaw as SubCategoryInput[];

const BRANDS = [
  "3M",
  "YDS",
  "CERVA",
  "PORTWEST",
  "MAPA",
  "NOMEX",
  "RELAXIA",
  "PANDA",
  "GVS",
  "POLYBOOT",
  "THERMOFORM",
];

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// --- VERİTABANI SIFIRLAMA ---
async function resetDatabase() {
  console.log(
    "\x1b[31m%s\x1b[0m",
    "🗑️  Tüm veritabanı tabloları temizleniyor...",
  );

  const tableNames = [
    "product",
    "sub_category",
    "middle_category",
    "category",
    "brand",
    "user",
    "address",
    "favorite",
    "cartitem",
    "order",
    "orderitem",
    "orderaddress",
    "review",
    "blog",
    "subscribe",
    "Banner",
    "coupons",
  ];

  const tables = tableNames.map((name) => `"${name}"`).join(", ");

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE;`,
    );
    console.log(
      "\x1b[32m%s\x1b[0m",
      "✨ Veritabanı fabrikasyon ayarlarına döndürüldü.",
    );
  } catch (error) {
    console.error("🚨 SQL Sıfırlama hatası:", error);
    process.exit(1);
  }
}

// --- SEED FONKSİYONLARI ---

async function seedAdmin() {
  console.log("👑 Admin oluşturuluyor...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@isguvenligi.com";
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin123!",
    10,
  );

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "Admin",
      surname: process.env.ADMIN_SURNAME || "User",
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log("✅ Admin başarıyla oluşturuldu.");
}

async function seedBrands() {
  console.log("🏷️  Markalar oluşturuluyor...");

  const brandsWithImages = BRANDS.map((name, index) => ({
    name,
    image: `/brands/${index + 1}.png`,
  }));

  await prisma.brand.createMany({
    data: brandsWithImages,
    skipDuplicates: true,
  });
  console.log(`✅ ${BRANDS.length} marka başarıyla oluşturuldu.`);
}

async function seedHierarchy() {
  console.log("📂 Kategori hiyerarşisi oluşturuluyor...");

  // 1. Ana Kategorileri Oluştur
  console.log("  📌 Ana kategoriler oluşturuluyor...");
  const categoryMap = new Map<string, number>();

  for (const cat of categoriesData) {
    const category = await prisma.category.create({
      data: { name: cat.name },
    });
    categoryMap.set(cat.name, category.id);
  }
  console.log(`  ✅ ${categoriesData.length} ana kategori oluşturuldu.`);

  // 2. Orta Kategorileri Oluştur
  console.log("  📌 Orta kategoriler oluşturuluyor...");
  const middleCategoryMap = new Map<string, number>();

  for (const mid of middleCategoriesData) {
    const categoryId = categoryMap.get(mid.categoryName);
    if (!categoryId) {
      console.warn(
        `  ⚠️  Kategori bulunamadı: ${mid.categoryName} (${mid.name} için)`,
      );
      continue;
    }

    const middleCategory = await prisma.middleCategory.create({
      data: {
        name: mid.name,
        categoryId: categoryId,
      },
    });
    middleCategoryMap.set(mid.name, middleCategory.id);
  }
  console.log(`  ✅ ${middleCategoriesData.length} orta kategori oluşturuldu.`);

  // 3. Alt Kategorileri Oluştur
  console.log("  📌 Alt kategoriler oluşturuluyor...");
  let subCategoryCount = 0;

  for (const sub of subCategoriesData) {
    const middleCategoryId = middleCategoryMap.get(sub.middleCategoryName);
    if (!middleCategoryId) {
      console.warn(
        `  ⚠️  Orta kategori bulunamadı: ${sub.middleCategoryName} (${sub.name} için)`,
      );
      continue;
    }

    // Orta kategorinin categoryId'sini bul
    const middleCategory = await prisma.middleCategory.findUnique({
      where: { id: middleCategoryId },
      select: { categoryId: true },
    });

    if (!middleCategory) {
      console.warn(
        `  ⚠️  Orta kategori verisi alınamadı: ${sub.middleCategoryName}`,
      );
      continue;
    }

    await prisma.subCategory.create({
      data: {
        name: sub.name,
        middleCategoryId: middleCategoryId,
        categoryId: middleCategory.categoryId, // Ana kategori ID'si eklendi
      },
    });
    subCategoryCount++;
  }
  console.log(`  ✅ ${subCategoryCount} alt kategori oluşturuldu.`);
  console.log("✅ Kategori hiyerarşisi tamamlandı.");
}

async function seedProducts() {
  console.log("🛒 Ürünler aktarılıyor...");
  let successCount = 0;
  let skipCount = 0;

  for (const p of productData) {
    // 1. Kategori Kontrolü
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) {
      console.warn(`  ⚠️  Kategori bulunamadı: ${p.category} (${p.title})`);
      skipCount++;
      continue;
    }

    // 2. Orta Kategori Kontrolü
    let midId: number | null = null;
    if (p.middleCategory) {
      const mid = await prisma.middleCategory.findFirst({
        where: { name: p.middleCategory, categoryId: category.id },
      });
      midId = mid?.id || null;
      if (!mid) {
        console.warn(
          `  ⚠️  Orta kategori bulunamadı: ${p.middleCategory} (${p.title})`,
        );
      }
    }

    // 3. Alt Kategori Kontrolü
    let subId: number | null = null;
    if (p.subCategory && midId) {
      const sub = await prisma.subCategory.findFirst({
        where: { name: p.subCategory, middleCategoryId: midId },
      });
      subId = sub?.id || null;
      if (!sub) {
        console.warn(
          `  ⚠️  Alt kategori bulunamadı: ${p.subCategory} (${p.title})`,
        );
      }
    }

    // 4. Marka Kontrolü
    let brandId: number | null = null;
    if (p.brand) {
      const brand = await prisma.brand.findUnique({
        where: { name: p.brand },
      });
      brandId = brand?.id || null;
      if (!brand) {
        console.warn(`  ⚠️  Marka bulunamadı: ${p.brand} (${p.title})`);
      }
    }

    // 5. Ürün Oluştur
    try {
      await prisma.product.create({
        data: {
          title: p.title,
          price: p.price,
          oldPrice: p.oldPrice || null,
          discountPercentage: p.discountPercentage || 0,
          rating: Math.round(p.rating),
          reviewCount: p.reviewCount || 0,
          mainImage: p.mainImage,
          subImage: p.subImage || null,
          description: p.description,
          categoryId: category.id,
          middleCategoryId: midId,
          subCategoryId: subId,
          brandId: brandId,
        },
      });
      successCount++;
    } catch (error) {
      console.error(`  ❌ Ürün oluşturulamadı: ${p.title}`, error);
      skipCount++;
    }
  }

  console.log(`✅ ${successCount} ürün başarıyla oluşturuldu.`);
  if (skipCount > 0) {
    console.log(`⚠️  ${skipCount} ürün atlandı.`);
  }
}

// --- ANA ÇALIŞTIRICI ---
async function main() {
  console.log("\x1b[36m%s\x1b[0m", "🚀 Seed işlemi başlatılıyor...\n");

  await resetDatabase();
  await seedAdmin();
  await seedBrands();
  await seedHierarchy();
  await seedProducts();

  console.log("\n" + "=".repeat(50));
  console.log(
    "\x1b[35m%s\x1b[0m",
    "✨ Tüm seed işlemleri başarıyla tamamlandı!",
  );
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("\n" + "=".repeat(50));
    console.error("\x1b[31m%s\x1b[0m", "🚨 Seed işlemi başarısız oldu!");
    console.error("=".repeat(50));
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
