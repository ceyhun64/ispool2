import dotenv from "dotenv";
dotenv.config();

// Seed için direkt bağlantı kullan
process.env.DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

import productDataRaw from "@/data/products.json" assert { type: "json" };
import categoriesDataRaw from "@/data/categories.json" assert { type: "json" };
import middleCategoriesDataRaw from "@/data/middleCategories.json" assert { type: "json" };
import subCategoriesDataRaw from "@/data/subCategories.json" assert { type: "json" };

// --------------------
// TİP TANIMLARI
// --------------------
interface ProductInput {
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
  icon?: string;
}

interface SubCategoryInput {
  name: string;
  middleCategoryName: string;
}

const productData = productDataRaw as ProductInput[];
const categoriesData = categoriesDataRaw as CategoryInput[];
const middleCategoriesData = middleCategoriesDataRaw as MiddleCategoryInput[];
const subCategoriesData = subCategoriesDataRaw as SubCategoryInput[];

// --------------------
// SABİTLER
// --------------------
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

// --------------------
// VERİTABANI RESET
// --------------------
async function resetDatabase() {
  console.log("🗑️  Veritabanı temizleniyor...");

  try {
    // Child → Parent sırası (ÇOK ÖNEMLİ)
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderAddress.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.address.deleteMany();

    await prisma.product.deleteMany();
    await prisma.subCategory.deleteMany();
    await prisma.middleCategory.deleteMany();
    await prisma.category.deleteMany();
    await prisma.brand.deleteMany();

    await prisma.blog.deleteMany();
    await prisma.subscribe.deleteMany();
    await prisma.banner.deleteMany();

    await prisma.user.deleteMany();

    console.log("✨ Veritabanı başarıyla temizlendi.");
  } catch (error) {
    console.error("🚨 Veritabanı sıfırlama hatası:", error);
    process.exit(1);
  }
}

// --------------------
// ADMIN
// --------------------
async function seedAdmin() {
  console.log("👑 Admin oluşturuluyor...");

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "Admin123!",
    10,
  );

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME || "Admin",
      surname: process.env.ADMIN_SURNAME || "User",
      email: process.env.ADMIN_EMAIL || "admin@isguvenligi.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✅ Admin oluşturuldu.");
}

// --------------------
// MARKALAR
// --------------------
async function seedBrands() {
  console.log("🏷️  Markalar ekleniyor...");

  // Sıralı ekleme için for döngüsü kullan
  for (let i = 0; i < BRANDS.length; i++) {
    await prisma.brand.create({
      data: {
        name: BRANDS[i],
        image: `/brands/${i + 1}.png`,
      },
    });
  }

  console.log(`✅ ${BRANDS.length} marka sıralı şekilde eklendi.`);
}

// --------------------
// KATEGORİ HİYERARŞİSİ (SIRALI)
// --------------------
async function seedHierarchy() {
  console.log("📂 Kategori hiyerarşisi sıralı olarak oluşturuluyor...");

  const categoryMap = new Map<string, number>();
  const middleCategoryMap = new Map<string, number>();

  // 1. ANA KATEGORİLER - JSON sırasına göre
  console.log("  ↳ Ana kategoriler ekleniyor...");
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const created = await prisma.category.create({
      data: { name: cat.name },
    });
    categoryMap.set(cat.name, created.id);
    console.log(`    ${i + 1}. ${cat.name} (ID: ${created.id})`);
  }

  // 2. ORTA KATEGORİLER - JSON sırasına göre
  console.log("  ↳ Orta kategoriler ekleniyor...");
  for (let i = 0; i < middleCategoriesData.length; i++) {
    const mid = middleCategoriesData[i];
    const categoryId = categoryMap.get(mid.categoryName);
    
    if (!categoryId) {
      console.warn(`    ⚠️  ${mid.name} için parent kategori bulunamadı: ${mid.categoryName}`);
      continue;
    }

    const created = await prisma.middleCategory.create({
      data: {
        name: mid.name,
        categoryId,
      },
    });
    middleCategoryMap.set(mid.name, created.id);
    console.log(`    ${i + 1}. ${mid.name} → ${mid.categoryName} (ID: ${created.id})`);
  }

  // 3. ALT KATEGORİLER - JSON sırasına göre
  console.log("  ↳ Alt kategoriler ekleniyor...");
  for (let i = 0; i < subCategoriesData.length; i++) {
    const sub = subCategoriesData[i];
    const middleCategoryId = middleCategoryMap.get(sub.middleCategoryName);
    
    if (!middleCategoryId) {
      console.warn(`    ⚠️  ${sub.name} için parent orta kategori bulunamadı: ${sub.middleCategoryName}`);
      continue;
    }

    const middle = await prisma.middleCategory.findUnique({
      where: { id: middleCategoryId },
      select: { categoryId: true },
    });

    if (!middle) {
      console.warn(`    ⚠️  ${sub.name} için middle kategori ID'si okunamadı`);
      continue;
    }

    const created = await prisma.subCategory.create({
      data: {
        name: sub.name,
        middleCategoryId,
        categoryId: middle.categoryId,
      },
    });
    console.log(`    ${i + 1}. ${sub.name} → ${sub.middleCategoryName} (ID: ${created.id})`);
  }

  console.log("✅ Kategori yapısı sıralı şekilde tamamlandı.");
}

// --------------------
// ÜRÜNLER
// --------------------
async function seedProducts() {
  console.log("🛒 Ürünler ekleniyor...");

  let success = 0;
  let skipped = 0;

  for (const p of productData) {
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) {
      skipped++;
      continue;
    }

    const middle = p.middleCategory
      ? await prisma.middleCategory.findFirst({
          where: { name: p.middleCategory, categoryId: category.id },
        })
      : null;

    const sub =
      p.subCategory && middle
        ? await prisma.subCategory.findFirst({
            where: { name: p.subCategory, middleCategoryId: middle.id },
          })
        : null;

    const brand = p.brand
      ? await prisma.brand.findUnique({ where: { name: p.brand } })
      : null;

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
          middleCategoryId: middle?.id || null,
          subCategoryId: sub?.id || null,
          brandId: brand?.id || null,
        },
      });
      success++;
    } catch {
      skipped++;
    }
  }

  console.log(`✅ ${success} ürün eklendi`);
  if (skipped) console.log(`⚠️  ${skipped} ürün atlandı`);
}

// --------------------
// MAIN
// --------------------
async function main() {
  console.log("🚀 Seed işlemi başlatılıyor...\n");

  await resetDatabase();
  await seedAdmin();
  await seedBrands();
  await seedHierarchy();
  await seedProducts();

  console.log("\n✨ TÜM SEED İŞLEMLERİ TAMAMLANDI ✨");
  console.log("\n📋 Kategori sıralaması JSON dosyalarındaki sıraya göre oluşturuldu.");
}

main()
  .catch((e) => {
    console.error("🚨 Seed başarısız:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });