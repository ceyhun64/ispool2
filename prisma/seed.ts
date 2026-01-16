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
}

const productData = productDataRaw as ProductInput[];

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// --- SEED FONKSİYONLARI ---

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@isguvenligi.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "Admin123!",
      10
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
    console.log("👑 Admin kullanıcısı oluşturuldu.");
  }
}

async function seedHiearchy() {
  console.log("📂 Kategori hiyerarşisi oluşturuluyor...");

  for (const cat of CATEGORIES) {
    // 1. Ana Kategori (Category)
    const category = await prisma.category.upsert({
      where: { name: cat.label },
      update: {},
      create: { name: cat.label },
    });

    // megaMenu var mı ve içinde columns bir dizi mi kontrol et (Tip güvenliği için)
    const megaMenu = cat.megaMenu;
    if (megaMenu && "columns" in megaMenu && Array.isArray(megaMenu.columns)) {
      for (const col of megaMenu.columns) {
        // 2. Orta Kategori (MiddleCategory)
        const middleCategory = await prisma.middleCategory.upsert({
          where: {
            name_categoryId: { name: col.title, categoryId: category.id },
          },
          update: {},
          create: { name: col.title, categoryId: category.id },
        });

        // 3. Alt Kategori (SubCategory)
        if (
          col.subItems &&
          Array.isArray(col.subItems) &&
          col.subItems.length > 0
        ) {
          for (const subItemName of col.subItems) {
            await prisma.subCategory.upsert({
              where: {
                name_middleCategoryId: {
                  name: subItemName,
                  middleCategoryId: middleCategory.id,
                },
              },
              update: {},
              create: {
                name: subItemName,
                middleCategoryId: middleCategory.id,
              },
            });
          }
        }
      }
    } else {
      console.log(
        `ℹ️  '${cat.label}' için alt sütun bulunamadı, sadece ana kategori işlendi.`
      );
    }
  }
  console.log("✅ Kategori ağacı başarıyla oluşturuldu.");
}

async function seedProducts() {
  console.log("🛒 Ürünler aktarılıyor...");

  for (const p of productData) {
    // 1. Ana Kategoriyi bul (Zorunlu)
    const category = await prisma.category.findUnique({
      where: { name: p.category },
    });

    if (!category) {
      console.warn(
        `⚠️  Kategori bulunamadı: ${p.category}. Ürün atlanıyor: ${p.title}`
      );
      continue;
    }

    // 2. Orta kategoriyi bul (Opsiyonel)
    let midId: number | null = null;
    if (p.middleCategory) {
      const mid = await prisma.middleCategory.findFirst({
        where: { name: p.middleCategory, categoryId: category.id },
      });
      midId = mid?.id || null;
    }

    // 3. Alt kategoriyi bul (Opsiyonel)
    let subId: number | null = null;
    if (p.subCategory && midId) {
      const sub = await prisma.subCategory.findFirst({
        where: { name: p.subCategory, middleCategoryId: midId },
      });
      subId = sub?.id || null;
    }

    // 4. Veritabanına Yaz (Upsert)
    // ID yoksa 0 veriyoruz, bu durumda Prisma yeni kayıt oluşturur.
    await prisma.product.upsert({
      where: { id: p.id || 0 },
      update: {},
      create: {
        title: p.title,
        price: p.price,
        oldPrice: p.oldPrice || null,
        discountPercentage: p.discountPercentage || 0,
        rating: Math.round(p.rating), // Int tipine uygun yuvarlama
        reviewCount: p.reviewCount || 0,
        mainImage: p.mainImage,
        subImage: p.subImage || null,
        description: p.description,
        categoryId: category.id,
        middleCategoryId: midId,
        subCategoryId: subId,
      },
    });
  }
  console.log("🎉 Tüm ürünler başarıyla eklendi.");
}

// --- ANA ÇALIŞTIRICI ---

async function main() {
  console.log("🧹 Eski veriler temizleniyor...");
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.middleCategory.deleteMany();
  await prisma.category.deleteMany();

  await seedAdmin();
  await seedHiearchy();
  await seedProducts();
}

main()
  .then(() => {
    console.log("🚀 Seed işlemi hatasız tamamlandı.");
  })
  .catch((e) => {
    console.error("🚨 Seed sırasında hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
