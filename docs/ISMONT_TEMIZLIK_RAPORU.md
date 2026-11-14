# İşmont temizliği – değişiklik raporu

Dal: `ismont-temizlik`. Henüz commit atılmadı. Satır sayıları `HEAD` (eski) ile çalışma ağacı (yeni) arasındadır.

| Durum | Dosya | Eski satır | Yeni satır |
|---|---|---:|---:|
| Değişti | `app/customer/returns/page.tsx` | 9 | 7 |
| Değişti | `app/customer/sales-agreement/page.tsx` | 9 | 7 |
| Silindi | `app/help/bank-info/page.tsx` | 9 | — |
| Değişti | `app/sitemap.ts` | 102 | 100 |
| Değişti | `components/layout/Footer.tsx` | 285 | 282 |
| Değişti | `components/layout/topbar.tsx` | 191 | 191 |
| Değişti | `components/modules/cart/cartSummary.tsx` | 152 | 152 |
| Değişti | `components/modules/checkout/checkout.tsx` | 700 | 700 |
| Değişti | `components/modules/checkout/stepPayment.tsx` | 379 | 379 |
| Değişti | `components/modules/footer/customer/privacy.tsx` | 382 | 257 |
| Değişti | `components/modules/footer/customer/returns.tsx` | 203 | 155 |
| Silindi | `components/modules/footer/customer/sales-agreement.tsx` | 162 | — |
| Değişti | `components/modules/footer/customer/terms.tsx` | 286 | 158 |
| Silindi | `components/modules/footer/help/bank-info.tsx` | 0 | — |
| Değişti | `components/modules/footer/help/contact.tsx` | 244 | 244 |
| Değişti | `components/modules/footer/help/distance-sales.tsx` | 262 | 186 |
| Değişti | `components/modules/footer/help/faq.tsx` | 193 | 200 |
| Değişti | `components/modules/footer/help/kvkk.tsx` | 325 | 183 |
| Değişti | `components/modules/footer/help/printing.tsx` | 93 | 102 |
| Değişti | `components/modules/footer/institutional/partners.tsx` | 107 | 60 |
| Değişti | `components/modules/footer/institutional/quality.tsx` | 82 | 71 |
| Değişti | `components/modules/footer/institutional/why_us.tsx` | 235 | 70 |
| Değişti | `components/modules/home/categories.tsx` | 253 | 253 |
| Değişti | `components/modules/home/products.tsx` | 178 | 178 |
| Değişti | `components/modules/navbar/categoryBar.tsx` | 660 | 660 |
| Değişti | `components/modules/products/filter.tsx` | 516 | 503 |
| Değişti | `components/modules/products/mobileFilter.tsx` | 602 | 589 |
| Değişti | `components/modules/products/productDetail/productInfo.tsx` | 234 | 224 |
| Değişti | `components/modules/products/productDetail/productTabs.tsx` | 500 | 499 |
| Değişti | `components/modules/products/production_sales/showcase_gallery.tsx` | 151 | 151 |
| Değişti | `components/modules/products/production_sales/special_production.tsx` | 341 | 341 |
| Değişti | `components/modules/products/production_sales/wholesale.tsx` | 374 | 374 |
| Yeni | `lib/company.ts` | — | 21 |
| Değişti | `next.config.ts` | 68 | 87 |
| Değişti | `prisma/seed.ts` | 425 | 420 |
| Silindi | `public/brands/1.png` | 18 | — |
| Silindi | `public/brands/10.png` | 14 | — |
| Silindi | `public/brands/11.png` | 18 | — |
| Silindi | `public/brands/2.png` | 6 | — |
| Silindi | `public/brands/3.png` | 20 | — |
| Silindi | `public/brands/4.png` | 19 | — |
| Silindi | `public/brands/5.png` | 19 | — |
| Silindi | `public/brands/6.png` | 38 | — |
| Silindi | `public/brands/7.png` | 24 | — |
| Silindi | `public/brands/8.png` | 17 | — |
| Silindi | `public/brands/9.png` | 9 | — |
| Silindi | `public/why_us/1.webp` | 1021 | — |
| Silindi | `public/why_us/2.webp` | 1350 | — |
| Silindi | `public/why_us/3.webp` | 646 | — |
| Silindi | `public/why_us/4.webp` | 350 | — |
| Yeni | `docs/ISMONT_TEMIZLIK_KURALLARI.md` | — | 18 |

## Doğrulama
- `npm test`: 26 test, 26 geçti.
- `tsc --noEmit`: kaynak kodda hata yok.
- `npm run build`: çalıştırılmadı. `app/sitemap.ts` Prisma ile veritabanına bağlanıyor ve `.env`/`.env.local` içinde veritabanı bağlantısı tanımlı.
- İşmont kalıntı taraması: eşleşme yok.
