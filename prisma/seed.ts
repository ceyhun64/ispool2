import dotenv from "dotenv";
dotenv.config();
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import productDataRaw from "@/data/products.json" assert { type: "json" };
import { CATEGORIES } from "@/data/categories";

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
  brand?: string; // JSON'dan gelecek marka adı
}

const productData = productDataRaw as ProductInput[];

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
}

async function seedBrands() {
  console.log("🏷️  Markalar oluşturuluyor...");

  // Sırasıyla 1.png, 2.png ... 11.png ataması yapıyoruz
  const brandsWithImages = BRANDS.map((name, index) => ({
    name,
    image: `/brands/${index + 1}.png`, // index 0'dan başladığı için +1
  }));

  await prisma.brand.createMany({
    data: brandsWithImages,
    skipDuplicates: true,
  });
}

async function seedHiearchy() {
  console.log("📂 Kategori hiyerarşisi oluşturuluyor...");

  for (const cat of CATEGORIES) {
    // 1. Güvenlik Kontrolü: megaMenu var mı ve içinde columns dizisi var mı?
    if (
      cat.megaMenu &&
      "columns" in cat.megaMenu &&
      Array.isArray(cat.megaMenu.columns)
    ) {
      const category = await prisma.category.create({
        data: { name: cat.label },
      });

      for (const col of cat.megaMenu.columns) {
        const middleCategory = await prisma.middleCategory.create({
          data: {
            name: col.title,
            categoryId: category.id,
          },
        });

        if (col.subItems && col.subItems.length > 0) {
          await prisma.subCategory.createMany({
            data: col.subItems.map((subName) => ({
              name: subName,
              middleCategoryId: middleCategory.id,
            })),
          });
        }
      }
    }
  }
}

async function seedProducts() {
  console.log("🛒 Ürünler aktarılıyor...");

  for (const p of productData) {
    // 1. Kategori Kontrolü
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });
    if (!category) continue;

    // 2. Orta Kategori Kontrolü
    let midId: number | null = null;
    if (p.middleCategory) {
      const mid = await prisma.middleCategory.findFirst({
        where: { name: p.middleCategory, categoryId: category.id },
      });
      midId = mid?.id || null;
    }

    // 3. Alt Kategori Kontrolü
    let subId: number | null = null;
    if (p.subCategory && midId) {
      const sub = await prisma.subCategory.findFirst({
        where: { name: p.subCategory, middleCategoryId: midId },
      });
      subId = sub?.id || null;
    }

    // 4. Marka Kontrolü (İlişkisel)
    let brandId: number | null = null;
    if (p.brand) {
      const brand = await prisma.brand.findUnique({
        where: { name: p.brand },
      });
      brandId = brand?.id || null;
    }

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
  }
}

// --- ANA ÇALIŞTIRICI ---
async function main() {
  await resetDatabase();
  await seedAdmin();
  await seedBrands(); // Markalar hiyerarşiden ve ürünlerden önce gelmeli
  await seedHiearchy();
  await seedProducts();
}

main()
  .then(() =>
    console.log("\x1b[35m%s\x1b[0m", "🚀 Tüm süreç başarıyla tamamlandı."),
  )
  .catch((e) => {
    console.error("🚨 İşlem başarısız:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
