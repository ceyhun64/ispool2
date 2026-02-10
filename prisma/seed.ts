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
interface StockInput {
  size: string;
  stock: number;
  priceModifier: number;
}

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
  sizes: string[];
  stock: StockInput[];
  bulkDiscountQty?: number;
  bulkDiscountRate?: number;
  color?: string;
  productGroupId?: string;
}

// Data casting
const productData = productDataRaw as ProductInput[];
const categoriesData = categoriesDataRaw as any[];
const middleCategoriesData = middleCategoriesDataRaw as any[];
const subCategoriesData = subCategoriesDataRaw as any[];

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

const COLORS = [
  { name: "Siyah", hex: "#000000" },
  { name: "Lacivert", hex: "#1a237e" },
  { name: "Gri", hex: "#424242" },
  { name: "Haki", hex: "#4b5320" },
  { name: "Fosforlu Turuncu", hex: "#ff6d00" }, // EN ISO 20471 İkaz
  { name: "Fosforlu Sarı", hex: "#ccff00" }, // EN ISO 20471 İkaz
  { name: "Kırmızı", hex: "#b71c1c" },
  { name: "Beyaz", hex: "#ffffff" },
  { name: "Kraliyet Mavisi", hex: "#0d47a1" },
  { name: "Antrasit", hex: "#263238" },
];

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

const ALL_SIZES: { value: string; sortOrder: number }[] = [
  // SHOE
  { value: "35", sortOrder: 0 },
  { value: "36", sortOrder: 1 },
  { value: "37", sortOrder: 2 },
  { value: "38", sortOrder: 3 },
  { value: "39", sortOrder: 4 },
  { value: "40", sortOrder: 5 },
  { value: "41", sortOrder: 6 },
  { value: "42", sortOrder: 7 },
  { value: "43", sortOrder: 8 },
  { value: "44", sortOrder: 9 },
  { value: "45", sortOrder: 10 },
  { value: "46", sortOrder: 11 },
  { value: "47", sortOrder: 12 },
  { value: "48", sortOrder: 13 },
  { value: "50", sortOrder: 14 },
  { value: "52", sortOrder: 15 },
  { value: "54", sortOrder: 16 },
  { value: "56", sortOrder: 17 },
  { value: "58", sortOrder: 18 },
  { value: "60", sortOrder: 19 },
  { value: "62", sortOrder: 20 },
  { value: "64", sortOrder: 21 },
  // CLOTHING_TEXT
  { value: "XS", sortOrder: 22 },
  { value: "S", sortOrder: 23 },
  { value: "M", sortOrder: 24 },
  { value: "L", sortOrder: 25 },
  { value: "XL", sortOrder: 26 },
  { value: "XXL", sortOrder: 27 },
  { value: "3XL", sortOrder: 28 },
  { value: "4XL", sortOrder: 29 },
  // GLOVE / STANDARD
  { value: "6", sortOrder: 30 },
  { value: "7", sortOrder: 31 },
  { value: "8", sortOrder: 32 },
  { value: "9", sortOrder: 33 },
  { value: "10", sortOrder: 34 },
  { value: "11", sortOrder: 35 },
  { value: "Standart", sortOrder: 36 },
];

// --------------------
// VERİTABANI RESET
// --------------------
async function resetDatabase() {
  console.log("🗑️  Veritabanı temizleniyor...");
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
    "color",
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
      console.warn(`⚠️  Tablo sıfırlanamadı: ${table}`);
    }
  }
}

// --------------------
// SEED FUNCTIONS
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
}

async function seedSizes() {
  console.log("📏 Bedenler ekleniyor...");
  await prisma.size.createMany({
    data: ALL_SIZES.map((s) => ({
      value: s.value,
      sortOrder: s.sortOrder,
      isActive: true,
    })),
  });
}

async function seedBrands() {
  console.log("🏷️  Markalar ekleniyor...");
  await prisma.brand.createMany({
    data: BRANDS.map((name, i) => ({
      name,
      image: `/brands/${i + 1}.png`,
    })),
  });
}

async function seedColors() {
  console.log("🎨 Renkler ekleniyor...");
  await prisma.color.createMany({
    data: COLORS.map((c) => ({
      name: c.name,
      hexCode: c.hex,
    })),
  });
}

async function seedHierarchy() {
  console.log("📂 Kategori hiyerarşisi oluşturuluyor...");
  const categoryMap = new Map<string, number>();
  const middleCategoryMap = new Map<string, number>();

  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: { name: cat.name } });
    categoryMap.set(cat.name, created.id);
  }

  for (const mid of middleCategoriesData) {
    const categoryId = categoryMap.get(mid.categoryName);
    if (categoryId) {
      const created = await prisma.middleCategory.create({
        data: { name: mid.name, categoryId },
      });
      middleCategoryMap.set(mid.name, created.id);
    }
  }

  for (const sub of subCategoriesData) {
    const middleCategoryId = middleCategoryMap.get(sub.middleCategoryName);
    if (middleCategoryId) {
      const middle = await prisma.middleCategory.findUnique({
        where: { id: middleCategoryId },
      });
      if (middle) {
        await prisma.subCategory.create({
          data: {
            name: sub.name,
            middleCategoryId,
            categoryId: middle.categoryId,
          },
        });
      }
    }
  }
}

async function seedProducts() {
  console.log("🛒 Ürünler ve stoklar ekleniyor...");
  const allSizes = await prisma.size.findMany({ where: { isActive: true } });

  // Beden value'ya göre sizeId bulma map'i oluştur
  const sizeMap = new Map<string, number>();
  allSizes.forEach((size) => {
    sizeMap.set(size.value, size.id);
  });

  let success = 0;

  for (const p of productData) {
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) {
      console.warn(`⚠️  Kategori bulunamadı: ${p.category} - Ürün: ${p.title}`);
      continue;
    }
    const color = p.color
      ? await prisma.color.findUnique({ where: { name: p.color } })
      : null;
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
          categoryId: category.id,
          middleCategoryId: middle?.id || null,
          subCategoryId: sub?.id || null,
          brandId: brand?.id || null,
          bulkDiscountQty: p.bulkDiscountQty || 0,
          bulkDiscountRate: p.bulkDiscountRate || 0,
          colorId: color?.id || null,
          productGroupId: p.productGroupId || null,
        },
      });

      // Ürüne ait bedenleri ekle (ProductSize)
      const productSizesData: { productId: number; sizeId: number }[] = [];
      for (const sizeValue of p.sizes) {
        const sizeId = sizeMap.get(sizeValue);
        if (sizeId) {
          productSizesData.push({
            productId: product.id,
            sizeId: sizeId,
          });
        } else {
          console.warn(`⚠️  Beden bulunamadı: ${sizeValue} - Ürün: ${p.title}`);
        }
      }

      if (productSizesData.length > 0) {
        await prisma.productSize.createMany({
          data: productSizesData,
        });
      }

      // Stok verilerini ekle (ProductStock)
      const productStockData: {
        productId: number;
        sizeId: number | null;
        stock: number;
        priceModifier: number;
      }[] = [];

      for (const stockItem of p.stock) {
        const sizeId = sizeMap.get(stockItem.size);
        if (sizeId) {
          productStockData.push({
            productId: product.id,
            sizeId: sizeId,
            stock: stockItem.stock,
            priceModifier: stockItem.priceModifier,
          });
        } else {
          console.warn(
            `⚠️  Stok için beden bulunamadı: ${stockItem.size} - Ürün: ${p.title}`,
          );
        }
      }

      if (productStockData.length > 0) {
        await prisma.productStock.createMany({
          data: productStockData,
        });
      }

      success++;
      console.log(
        `✅ Eklendi: ${p.title} - ${p.sizes.length} beden, ${p.stock.length} stok kaydı`,
      );
    } catch (error) {
      console.error(`✗ Hata: ${p.title}`, error);
    }
  }
  console.log(`\n✅ ${success} ürün ve ilgili stok kayıtları tamamlandı.`);
}

async function main() {
  console.log("🚀 Seed işlemi başlatılıyor...");
  await resetDatabase();
  await seedAdmin();
  await seedSizes();
  await seedBrands();
  await seedColors();
  await seedHierarchy();
  await seedProducts();
  console.log("\n✨ TÜM İŞLEMLER BAŞARIYLA TAMAMLANDI ✨");
}

main()
  .catch((e) => {
    console.error("🚨 Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
