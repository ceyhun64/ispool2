import dotenv from "dotenv";
dotenv.config();

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
  subImage2?: string | null;
  subImage3?: string | null;
  subImage4?: string | null;
  description: string;
  category: string;
  middleCategory?: string;
  subCategory?: string;
  brand?: string;
  sizeType?: string;
  hasVariants?: boolean;
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

// Tüm bedenler tek bir flat array'de — type field ile gruplanır
const ALL_SIZES: { value: string; type: string; sortOrder: number }[] = [
  // CLOTHING_NUMBER
  ...[
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48",
    "50",
    "52",
    "54",
    "56",
    "58",
    "60",
    "62",
    "64",
  ].map((v, i) => ({
    value: v,
    type: "CLOTHING_NUMBER",
    sortOrder: i,
  })),
  // CLOTHING_TEXT
  ...["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map((v, i) => ({
    value: v,
    type: "CLOTHING_TEXT",
    sortOrder: i,
  })),
  // SHOE
  ...[
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
  ].map((v, i) => ({
    value: v,
    type: "SHOE",
    sortOrder: i,
  })),
  // GLOVE
  ...["6", "7", "8", "9", "10", "11", "Standart"].map((v, i) => ({
    value: v,
    type: "GLOVE",
    sortOrder: i,
  })),
  // STANDARD
  [{ value: "Standart", type: "STANDARD", sortOrder: 0 }][0],
];

// --------------------
// VERİTABANI RESET
// --------------------
async function resetDatabase() {
  console.log("🗑️  Veritabanı temizleniyor ve ID'ler sıfırlanıyor...");

  const tables = [
    "product_stock",
    "product_size",
    "review",
    "orderitem",
    "orderaddress",
    "order",
    "cartitem",
    "favorite",
    "address",
    "product",
    "size",
    "sub_category",
    "middle_category",
    "category",
    "brand",
    "blog",
    "subscribe",
    "Banner",
    "user",
    "coupons",
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    } catch {
      console.warn(`⚠️  Tablo sıfırlanamadı (muhtemelen henüz yok): ${table}`);
    }
  }

  console.log("✨ Veritabanı ve ID sayaçları başarıyla sıfırlandı.");
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
// BEDENLER — Toplu kaydet
// --------------------
async function seedSizes() {
  console.log("📏 Bedenler ekleniyor...");

  // Tüm bedenler tek bir createMany ile yaz
  await prisma.size.createMany({
    data: ALL_SIZES.map((s) => ({
      value: s.value,
      type: s.type,
      sortOrder: s.sortOrder,
      isActive: true,
    })),
  });

  // Türe göre özet log
  const typeCounts = ALL_SIZES.reduce<Record<string, number>>((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});

  console.log(`✅ ${ALL_SIZES.length} beden eklendi.`);
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count} beden`);
  });
}

// --------------------
// MARKALAR
// --------------------
async function seedBrands() {
  console.log("🏷️  Markalar ekleniyor...");

  await prisma.brand.createMany({
    data: BRANDS.map((name, i) => ({
      name,
      image: `/brands/${i + 1}.png`,
    })),
  });

  console.log(`✅ ${BRANDS.length} marka eklendi.`);
}

// --------------------
// KATEGORİ HİYERARŞİSİ
// --------------------
async function seedHierarchy() {
  console.log("📂 Kategori hiyerarşisi oluşturuluyor...");

  const categoryMap = new Map<string, number>();
  const middleCategoryMap = new Map<string, number>();

  // 1. ANA KATEGORİLER
  console.log("  ↳ Ana kategoriler...");
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = categoriesData[i];
    const created = await prisma.category.create({
      data: { name: cat.name },
    });
    categoryMap.set(cat.name, created.id);
    console.log(`    ${i + 1}. ${cat.name}`);
  }

  // 2. ORTA KATEGORİLER
  console.log("  ↳ Orta kategoriler...");
  for (let i = 0; i < middleCategoriesData.length; i++) {
    const mid = middleCategoriesData[i];
    const categoryId = categoryMap.get(mid.categoryName);

    if (!categoryId) {
      console.warn(`    ⚠️  Parent bulunamadı: ${mid.categoryName}`);
      continue;
    }

    const created = await prisma.middleCategory.create({
      data: { name: mid.name, categoryId },
    });
    middleCategoryMap.set(mid.name, created.id);
    console.log(`    ${i + 1}. ${mid.name}`);
  }

  // 3. ALT KATEGORİLER
  console.log("  ↳ Alt kategoriler...");
  for (let i = 0; i < subCategoriesData.length; i++) {
    const sub = subCategoriesData[i];
    const middleCategoryId = middleCategoryMap.get(sub.middleCategoryName);

    if (!middleCategoryId) {
      console.warn(`    ⚠️  Parent bulunamadı: ${sub.middleCategoryName}`);
      continue;
    }

    const middle = await prisma.middleCategory.findUnique({
      where: { id: middleCategoryId },
      select: { categoryId: true },
    });

    if (!middle) {
      console.warn(`    ⚠️  Middle kategori okunamadı`);
      continue;
    }

    await prisma.subCategory.create({
      data: {
        name: sub.name,
        middleCategoryId,
        categoryId: middle.categoryId,
      },
    });
    console.log(`    ${i + 1}. ${sub.name}`);
  }

  console.log("✅ Kategori yapısı tamamlandı.");
}

// --------------------
// ÜRÜNLER — ProductSize üzerinden beden ilişkilendirme
// --------------------
async function seedProducts() {
  console.log("🛒 Ürünler ve stok bilgileri ekleniyor...");

  let success = 0;
  let skipped = 0;
  let totalStockRecords = 0;

  // Size tablosundan tüm aktif bedenler çek, tip bazında grupla
  const allSizes = await prisma.size.findMany({ where: { isActive: true } });
  const sizesByType = new Map<string, typeof allSizes>();
  allSizes.forEach((s) => {
    const arr = sizesByType.get(s.type) || [];
    arr.push(s);
    sizesByType.set(s.type, arr);
  });

  for (const p of productData) {
    // ─── Kategori / Marka lookup ───
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) {
      console.warn(`⚠️  Kategori bulunamadı: ${p.category} (${p.title})`);
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
      // ─── Ürün oluştur ───
      const product = await prisma.product.create({
        data: {
          title: p.title,
          price: p.price,
          oldPrice: p.oldPrice || null,
          discountPercentage: p.discountPercentage || 0,
          rating: Math.round(p.rating),
          reviewCount: p.reviewCount || 0,
          mainImage: p.mainImage,
          subImage: p.subImage || null,
          subImage2: p.subImage2 || null,
          subImage3: p.subImage3 || null,
          subImage4: p.subImage4 || null,
          description: p.description,
          hasVariants: p.hasVariants || false,
          categoryId: category.id,
          middleCategoryId: middle?.id || null,
          subCategoryId: sub?.id || null,
          brandId: brand?.id || null,
        },
      });

      success++;

      // ─── ProductSize + ProductStock ───
      if (p.hasVariants && p.sizeType) {
        // sizeType'a göre ilgili bedenler gelir (SHOE, GLOVE, CLOTHING_TEXT vs.)
        const matchedSizes = sizesByType.get(p.sizeType) || [];

        // ProductSize kayıtları — toplu
        await prisma.productSize.createMany({
          data: matchedSizes.map((s) => ({
            productId: product.id,
            sizeId: s.id,
          })),
        });

        // ProductStock kayıtları — toplu
        await prisma.productStock.createMany({
          data: matchedSizes.map((s) => ({
            productId: product.id,
            sizeId: s.id,
            stock: Math.floor(Math.random() * 50) + 10,
            priceModifier: 0,
          })),
        });

        totalStockRecords += matchedSizes.length;
        console.log(
          `  ✓ ${product.title}: ${matchedSizes.length} beden varyantı`,
        );
      } else {
        // Varyant yok — tek stok kayıtı, sizeId null
        await prisma.productStock.create({
          data: {
            productId: product.id,
            sizeId: null,
            stock: Math.floor(Math.random() * 100) + 50,
            priceModifier: 0,
          },
        });
        totalStockRecords += 1;
        console.log(`  ✓ ${product.title}: Standart ürün (beden yok)`);
      }
    } catch (error) {
      console.error(`  ✗ Hata: ${p.title}`, error);
      skipped++;
    }
  }

  console.log(`✅ ${success} ürün eklendi`);
  console.log(`✅ ${totalStockRecords} stok kaydı oluşturuldu`);
  if (skipped) console.log(`⚠️  ${skipped} ürün atlandı`);
}

// --------------------
// MAIN
// --------------------
async function main() {
  console.log("🚀 Seed işlemi başlatılıyor...\n");

  await resetDatabase();
  await seedAdmin();
  await seedSizes();
  await seedBrands();
  await seedHierarchy();
  await seedProducts();

  console.log("\n✨ TÜM SEED İŞLEMLERİ TAMAMLANDI ✨");
  console.log("📏 Beden sistemi hazır!");
  console.log("📋 Tüm veriler admin panelden yönetilebilir.");
}

main()
  .catch((e) => {
    console.error("🚨 Seed başarısız:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
