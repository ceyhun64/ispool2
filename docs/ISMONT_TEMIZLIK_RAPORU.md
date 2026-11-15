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


## Stil ayrıştırma (S0–S9c)

Dal: `style/saks-mavisi`. Yalnızca görünüm değişti; URL, API rotası, veri akışı ve işlevlere dokunulmadı. Commit/push yapılmadı.

### Değişen dosyalar (gruplar)
- **Tema:** `app/globals.css`. `@theme inline` içine `--color-sax-950/900/800/700/600/100` eklendi, mevcut değişkenlere dokunulmadı.
- **Menü çubuğu, üst şerit, başlık:** `components/modules/navbar/categoryBar.tsx` (yeniden tasarım, mega menü), `components/layout/topbar.tsx` (sadeleştirme), `components/layout/Navbar.tsx` (arama odağı, logo etiketi, rozet, sticky çizgisi), `components/modules/navbar/cartDropdown.tsx` (sepet rozeti).
- **Ana sayfa:** `app/page.tsx`, yeni `components/modules/home/corporateCards.tsx` (Toplu Alım / Özel Tasarım kartları), yeni `components/modules/home/trustStrip.tsx` (güven şeridi), `heroSlider.tsx`, `designPaths.tsx`, `products.tsx` (zeminler).
- **Footer:** `components/layout/Footer.tsx` (üç sütun, bülten şeridi, alt çubuk).
- **Ürün listeleme:** `productTopbar.tsx`, `filter.tsx`, `mobileFilter.tsx`, `productCard.tsx`, `products/{all,cat,midCat,subCat}Products.tsx`.
- **Ürün detay:** `productInfo.tsx`, `productTabs.tsx`, `productActions.tsx`, `productVariantSelector.tsx`, `productImageGallery.tsx`.
- **Yasal ve kurumsal sayfalar:** `footer/customer/{terms,privacy,returns}.tsx`, `footer/help/{distance-sales,kvkk,faq,printing}.tsx`, `footer/institutional/{about,career,security_cookie}.tsx`, `production_sales/{wholesale,special_production}.tsx` (yalnızca başlık rengi ve koyu zeminler).
- **Giriş/kayıt, 404:** `components/modules/auth/{login,register}.tsx`, `app/not-found.tsx`.
- **Sepet/ödeme:** `checkout/stepPayment.tsx` ve `cart/cartSummary.tsx` (ana butonlar), `checkout/cartSummary.tsx` (kupon butonu ve toplam kutusu).
- **Profil:** `profile/sideBar.tsx` (zemin, seçili öğe), profil sayfası başlıkları (`addresses`, `cargoTracking`, `myPersonalInformation`, `orders`).
- **İçerik düzeltmeleri:** `wholesale.tsx` ve `corporateCards.tsx` içindeki doğrulanamayan üretim cümlesi, doğrulanabilir toplu alım indirimi ve teklif cümlesiyle değiştirildi. Ürün detayında serbest kargo cümlesi eşik sabitinden üretiliyor (eşik değeri değişmedi). Liste sayfalarında doğrulanamayan "%100 güvenlik" ve "EN/ISO" kutuları kaldırıldı, "Anlık Stok" etiketi "Ürün Sayısı" yapıldı.

### Bilerek dokunulmayanlar
- Tasarım aracı (`productDetail/design/*`), admin paneli, `components/ui/*` ve shadcn değişkenleri (`--primary`, `--ring`, `--chart-*`).
- Sipariş durum rozetleri (`orders.tsx`), kargo takibi durum renkleri, adres formları.
- Birincil turuncu butonlar ve küçük turuncu vurgular (Sepete Ekle, Teklif butonları, ikon ve süsler).
- Sepet/ödeme ve profilde form alanları, odak halkaları, hata/onay renkleri, kart önizlemesinin koyu görseli.
- Mobil menü içeriği (`categoryBar.tsx` içindeki Sheet) ve mobil akordeon davranışı.

### Bekleyen kararlar
- **Facebook/Instagram adresleri:** üst şeritte Facebook `#`, Instagram `instagram.com/ispool_is_kyafetleri`; footer'da `facebook.com/ispool`, `instagram.com/ispool`. Doğru adresler belirlenip eşitlenmeli.
- **Taksit oranları:** `productTabs.tsx` içindeki oranlar (2 taksit %3,5 … 12 taksit %17) kodda sabit yazılı. iyzico'daki gerçek oranlarla doğrulanmalı.
- **"Karışık" sekmesi:** liste sayfalarındaki bu sekme ürünleri rastgele karıştırıyor; gerçek satış verisi yok. Gerçek bir "çok satanlar" sıralaması kurulacak mı, sekme kaldırılacak mı karar bekliyor.
- **S10 sayfa adları:** sekme ve menü adlarında yapılan yeniden adlandırmaların (ör. "Açıklama", "Taksit", "Tasarım Önerisi", "Karışık") son hali onaylanmalı.
- **Yer tutucular:** 19 satırda `⚠ DOLDURULACAK`, 35 `<Todo>` çağrısı; dağılım: `privacy.tsx`, `returns.tsx`, `distance-sales.tsx`, `terms.tsx`, `kvkk.tsx`, `faq.tsx`, `printing.tsx`, `partners.tsx`, `quality.tsx`, `wholesale.tsx`, `lib/company.ts`. Yayından önce doldurulmalı.
- **Görsel doğrulama:** bu çalışma boyunca ekran görüntüsü alınamadı; tüm değişiklikler tarayıcıda gözle kontrol edilmeli (özellikle 1440 px ve 375 px).
