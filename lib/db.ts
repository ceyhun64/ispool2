import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

// Vercel'de (production/preview) Prisma Accelerate'in bağlantı havuzlaması
// üzerinden bağlanılır. Serverless ortamda her fonksiyon örneği kendi ham
// Postgres bağlantısını açtığında (adapter + DATABASE_URL) veritabanının
// bağlantı limiti aşılıp "Too many database connections" (P2037) hatası
// veriyordu. Yerel geliştirmede DATABASE_URL ile doğrudan yerel Postgres'e
// bağlanmaya devam edilir.
const prisma =
  process.env.VERCEL && process.env.PRISMA_DATABASE_URL
    ? new PrismaClient({ accelerateUrl: process.env.PRISMA_DATABASE_URL })
    : new PrismaClient({
        adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
      })

export { prisma }