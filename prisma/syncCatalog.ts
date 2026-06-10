// Mevcut veritabanına yeni bedenleri ve markaları güvenli (idempotent) şekilde ekler.
// resetDatabase() ÇALIŞTIRMAZ - sadece eksik kayıtları ekler.
// Çalıştırmak için: npx tsx prisma/syncCatalog.ts
import dotenv from "dotenv";
dotenv.config();

process.env.DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL;

import { prisma } from "@/lib/db";

const NEW_SIZES: { value: string; sortOrder: number }[] = [
  // BÜYÜK BEDENLER (T-SHIRT / GİYİM)
  { value: "5XL", sortOrder: 37 },
  { value: "6XL", sortOrder: 38 },
  { value: "7XL", sortOrder: 39 },
  { value: "8XL", sortOrder: 40 },
  // BÜYÜK BEDENLER (PANTOLON)
  { value: "66", sortOrder: 41 },
  { value: "68", sortOrder: 42 },
  { value: "70", sortOrder: 43 },
  { value: "72", sortOrder: 44 },
];

const NEW_BRANDS = ["Bmes", "Pars", "İş Pool"];

async function syncSizes() {
  console.log("📏 Yeni bedenler kontrol ediliyor...");
  const now = new Date();
  const result = await prisma.size.createMany({
    data: NEW_SIZES.map((s) => ({
      value: s.value,
      sortOrder: s.sortOrder,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })),
    skipDuplicates: true,
  });
  console.log(`   -> ${result.count} yeni beden eklendi.`);
}

async function syncBrands() {
  console.log("🏷️  Yeni markalar kontrol ediliyor...");
  const result = await prisma.brand.createMany({
    data: NEW_BRANDS.map((name) => ({ name })),
    skipDuplicates: true,
  });
  console.log(`   -> ${result.count} yeni marka eklendi.`);
}

async function main() {
  await syncSizes();
  await syncBrands();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
