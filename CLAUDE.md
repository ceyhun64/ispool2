# İşPool — iyzico Ödeme Hatası Kök Neden Analizi (v2)

> Proje root dizininde Claude Code'a tek mesaj olarak ver.

---

## ROL VE HEDEF

Bu Next.js (App Router) + Prisma/PostgreSQL + iyzico projesinde çalışan kıdemli ödeme entegrasyonu mühendisisin. Müşteri ödeme sisteminde hata bildirdi.

Hedef: **kök nedeni kanıtlamak.** Düzeltme, ben açıkça `DÜZELTMEYE BAŞLA` diyene kadar yok.

"Muhtemelen", "büyük ihtimalle", "sanırım" ifadelerini kanıt yerine kullanma. Kanıtlayamadığın her şeye `DOĞRULANAMADI` yaz — bu bir başarısızlık değil, doğru cevaptır.

---

## BÖLÜM 0 — GÜVENLİK KURALLARI

Bu kurallar Bölüm 1–5 boyunca geçerlidir ve tekrar hatırlatılmayacaktır.

**Yazma yasağı:** dosya oluşturma/değiştirme/silme, migration oluşturma veya çalıştırma, schema/config/package değişikliği, `git commit`, `git reset`, `git checkout`. Sadece oku, ara, analiz et.

**Yasaklı komutlar:** `npm run build:fresh` (bu script `prisma migrate reset --force` + `prisma db push --force-reset` içerir, veritabanını komple siler), `prisma migrate reset`, `prisma db push`, `prisma migrate deploy`. Sonuncusu DB silmez, migration uygular — ama teşhis aşamasında hiçbir migration çalıştırılmayacak.

**Veritabanı:** yalnızca READ-ONLY sorgu. INSERT/UPDATE/DELETE/ALTER yok. Sorgu öncesi bağlantının hangi DB'ye gittiğini doğrula; production olmadığı kanıtlanamıyorsa sorgu çalıştırma.

**Secret'lar:** `.env` / `.env.local` içeriğini yazdırma, log'lama, rapora koyma. Yalnızca `DEFINED` / `EMPTY` / `MISSING` durumunu bildir.

**Kart verisi:** kart numarası, CVC, son kullanma tarihi hiçbir koşulda log'lanmaz veya rapora girmez. Gerçek kart kullanılmaz.

---

## BÖLÜM 1 — ORTAM GÜVENLİK KAPISI (önce bunu yap)

Başka hiçbir şeye başlamadan aşağıdakileri tespit et:

| Değişken            | Durum                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `IYZICO_API_KEY`    | DEFINED / EMPTY / MISSING                                                      |
| `IYZICO_SECRET_KEY` | DEFINED / EMPTY / MISSING                                                      |
| `IYZICO_BASE_URL`   | DEFINED / EMPTY / MISSING + **sandbox mı production mı** (değeri ifşa etmeden) |
| `DATABASE_URL`      | DEFINED / EMPTY / MISSING + **dev/staging mi production mu**                   |
| `NEXTAUTH_SECRET`   | DEFINED / EMPTY / MISSING                                                      |
| `NEXTAUTH_URL`      | DEFINED / EMPTY / MISSING + hangi origin'i gösterdiği                          |

Not: `lib/iyzico.ts` `IYZICO_BASE_URL` yoksa sandbox'a düşüyor. Production ortamında bu değişken tanımsızsa ödemeler sessizce sandbox'a gider — **CRITICAL** olarak işaretle.

Bu bölümün sonunda tek satırla karar yaz:

```
TEST İZNİ: VAR   (iyzico=sandbox VE DB=dev/staging kanıtlandı)
TEST İZNİ: YOK   (sebep: ...)
```

`YOK` ise Bölüm 5'teki ödeme testlerini **atla**, statik analizle devam et. Ortamın güvenli olduğunu varsayarak test isteği gönderme.

---

## BÖLÜM 2 — GIT ZAMAN ÇİZELGESİ

Müşteri "bozuldu" diyorsa ilk soru "ne zaman ve neyle birlikte bozuldu".

```
git status
git log --oneline -30
git log --follow --oneline -- lib/iyzico.ts
git log --follow --oneline -- lib/pricing.ts
git log --follow --oneline -- app/api/order/route.ts
git log --follow --oneline -- components/modules/checkout/stepPayment.tsx
git log --follow --oneline -- proxy.ts
git log --follow --oneline -- next.config.ts
git log --follow --oneline -- prisma/schema.prisma
```

Ödeme akışına dokunan son 3 commit'in `git show` çıktısını incele. Çıktı:

```
Ödeme akışına son dokunan değişiklikler:
1. <commit> | <tarih> | <dosya> | <ne değişti> | <hatayla olası ilişkisi>
```

Commit-hata korelasyonu kuramıyorsan `KORELASYON KURULAMADI` yaz.

---

## BÖLÜM 3 — AKIŞ HARİTASI

Aşağıdaki dosyaları oku ve uçtan uca akışı **gerçek koddan** çıkar:

`lib/iyzico.ts` · `lib/pricing.ts` · `lib/internalAuth.ts` · `lib/auth.ts` · `lib/session.ts` · `app/api/order/route.ts` · `app/api/order/user/route.ts` · `app/api/coupon/validate/route.ts` · `app/api/cart/route.ts` · `app/api/cart/[id]/route.ts` · `app/api/send-mail/route.ts` · `app/checkout/**` · `components/modules/checkout/*` (checkout, paymentStepper, stepAddress, stepPayment, billingForm, cartSummary, success, unsuccess) · `proxy.ts` · `next.config.ts` · `prisma/schema.prisma` · `utils/cart.ts` · `utils/mergeGuestData.ts` · `types/order.ts` · `types/iyzipay.d.ts`

Ayrıca tüm projede şu terimleri ara: `iyzico`, `iyzipay`, `IYZWS`, `x-iyzi`, `paidPrice`, `paymentId`, `conversationId`, `basketId`, `callbackUrl`, `mdStatus`, `3ds`, `retrieve`.

Her adım için: **Adım | Dosya:fonksiyon | Input | Output | Sonraki adıma geçen veri | Hata ihtimali**

Zincir: sepet → DB'den fiyat → varyant/adet → kupon → kargo → toplam → iyzico isteği → 3DS → callback → doğrulama → Order → OrderItem → stok → kupon usage → mail → sepet temizleme → success sayfası.

---

## BÖLÜM 4 — HİPOTEZ TARAMASI

Her maddeyi `SORUN VAR` / `TEMİZ` / `DOĞRULANAMADI` olarak işaretle.

### A. Tutar tutarlılığı

- [ ] `sum(basketItems.price × quantity)` = iyzico `price` — birebir eşit mi? Değilse CRITICAL. Gerçek sayılarla örnek hesap çıkar.
- [ ] `paidPrice` vs `price` ayrımı: taksitli işlemde `paidPrice` iyzico'nun döndürdüğü taksitli tutar mı, yoksa ham sepet tutarı mı?
- [ ] Kargo (`lib/pricing.ts`) `basketItems`'a ayrı kalem olarak mı giriyor, yoksa yalnızca `paidPrice`'a mı biniyor?
- [ ] Kupon indirimi kalemlere nasıl dağıtılıyor? `PERCENTAGE` ve `FIXED` ayrı ayrı. Min sepet tutarı, max indirim, negatif toplam ihtimali.
- [ ] **Kuruş yuvarlaması:** 10.01 + 10.01 + 10.01 üzerinden %13 indirim gibi somut bir örnekle hesapla. Kalem kalem yuvarlayıp toplamak ile toplayıp yuvarlamak arasında fark oluşuyor mu?
- [ ] **Sayı formatı:** tutarlar iyzico'ya nokta ayraçlı (`"1234.56"`) mı gidiyor? Kodda `toLocaleString`, `Intl.NumberFormat` veya `tr-TR` geçen bir dönüşüm varsa virgül üretiyor olabilir — isteği tamamen bozar, özellikle ara.
- [ ] `ProductStock` varyant fiyat farkı (price modifier) hesaba katılıyor mu? base 100 + modifier 20 × adet 2 = 240 doğru çıkıyor mu?

### B. Fiyat güvenliği

- [ ] İstemciden gelen `price` / `discount` / `total` / `shipping` / `coupon` değerleri DB'den yeniden doğrulanmadan iyzico'ya gidiyor mu? Gidiyorsa **CRITICAL SECURITY** — kullanıcı kendi fiyatını belirleyebilir.
- [ ] Kupon, `validate` çağrısından bağımsız olarak sipariş anında server'da tekrar doğrulanıyor mu?

### C. IYZWSv2 imzası

- [ ] `x-iyzi-rnd` header'ındaki değer ile imzada kullanılan `randomString` **aynı** mı?
- [ ] İmzalanan payload ile gövdedeki JSON birebir aynı string mi? (`JSON.stringify` kaç kez çağrılıyor — iki ayrı çağrı anahtar sırası/boşluk farkı yaratıp imzayı bozar.)
- [ ] İmzadaki URI path, çağrılan endpoint ile aynı mı (query string dahil)?
- [ ] HMAC-SHA256 → hex → base64 `authorization` zinciri doğru sırada mı?

### D. 3D Secure ve oturum (bu projede en yüksek riskli alan)

- [ ] `callbackUrl` hangi route'u gösteriyor? Bu route `proxy.ts` matcher'ındaki `/checkout/:path*` altında mı kalıyor? Öyleyse bankadan gelen POST NextAuth tarafından `/auth/login`'e yönlendirilir, ödeme sonucu hiç işlenmez. **Özellikle doğrula.**
- [ ] Callback route'u `POST` kabul ediyor mu? Banka form POST atar; yalnızca `GET` handler varsa 405.
- [ ] **Ödeme sonucu server tarafında iyzico'ya `retrieve`/`auth` çağrısıyla mı doğrulanıyor**, yoksa callback'ten gelen `status`/`mdStatus` alanlarına doğrudan mı güveniliyor? İkincisi ise **CRITICAL SECURITY** — sahte ödeme onayı mümkün olur.
- [ ] `mdStatus` kontrolü var mı, hangi değerler başarılı sayılıyor?
- [ ] Cookie ayarları (`lib/auth.ts`): `SameSite`, `Secure`, `domain`, `path`. 3DS dönüşü cross-site POST olduğu için `SameSite=Lax/Strict` session'ı düşürebilir. Bu maddede tarayıcı davranışına dair iddianı `KODDAN DOĞRULANDI` veya `DOĞRULANAMADI` olarak ayır — varsayım yapma.
- [ ] `next.config.ts` CSP: `frame-src`, `form-action`, `script-src`, `connect-src` iyzico domainlerini kapsıyor mu? **`form-action` eksikse 3DS formu sessizce bloklanır** — sık atlanan madde.

### E. Sipariş, transaction ve idempotency

- [ ] Order ödeme **öncesi** mi **sonrası** mı oluşuyor? Her iki senaryonun hata modunu ayrı yaz.
- [ ] "Ödeme başarılı ama Order oluşmadı" senaryosu mümkün mü? Mümkünse CRITICAL.
- [ ] Order + OrderItem + stok + kupon usage tek Prisma transaction içinde mi? Ara adım patlarsa geri alınıyor mu?
- [ ] Çift submit: buton disabled/loading state var mı, server tarafında `conversationId`/`basketId` üzerinden duplicate koruması veya unique constraint var mı? Aynı ödeme iki kez çekilebilir mi?
- [ ] `lib/internalAuth.ts` — `x-internal-secret` (`NEXTAUTH_SECRET` türevi) production'da doğru üretiliyor mu? Yanlışsa route→route çağrısı 401 döner ve akış ortadan kopar.
- [ ] `send-mail` çağrısı `await` ediliyor ve `try/catch` dışında mı? SMTP hatası başarılı ödemeyi başarısız gösterebilir mi?
- [ ] Sepet ne zaman temizleniyor? "ödeme başarısız → sepet boşaldı" ve "ödeme başarılı → sepet temizlenmedi" senaryolarını ayrı kontrol et.

### F. Hata görünürlüğü

- [ ] iyzico yanıtındaki `errorCode` / `errorMessage` / `errorGroup` / `status` log'lanıyor mu, yoksa `catch` içinde yutulup generic 500 mü dönüyor? Yutuluyorsa gerçek hatayı göremediğimizi ayrıca raporla — "hata var ama ne olduğu bilinmiyor" tablosunun tek başına sebebi olabilir.
- [ ] Mevcut log'larda secret, API key veya kart verisi sızıyor mu? Varsa CRITICAL SECURITY.

### G. Dokümantasyon doğrulaması

- [ ] iyzico API davranışına dair **emin olmadığın** her noktayı resmi iyzico dokümantasyonundan doğrula (IYZWSv2 imza şeması, 3DS akışı ve callback sözleşmesi, `price`/`paidPrice` semantiği, `basketItems` kuralları, hata kodları). Eski blog yazısı, StackOverflow veya hafızandan tahmin kullanma. Kod ile dokümantasyon arasında fark varsa ayrı bir bulgu olarak yaz.

---

## BÖLÜM 5 — KANIT TOPLAMA

**5.1 DB sorguları** (yalnızca dev/staging kanıtlandıysa, READ-ONLY):

- Son 30 günün `status` dağılımı
- `status = 'pending'` ama `paymentId`/`transactionId` dolu kayıtlar
- `Order` toplamı ile `OrderItem` toplamının uyuşmadığı kayıtlar
- Aynı `conversationId`/`basketId` için duplicate kayıtlar
- Kupon `usageCount` ile gerçek sipariş sayısının tutmadığı durumlar

**5.2 Sandbox testleri** — yalnızca Bölüm 1'de `TEST İZNİ: VAR` ise. Değilse `TEST ÇALIŞTIRILAMADI — ORTAM GÜVENLİ DEĞİL` yazıp geç.

Senaryolar: kuponsuz tek çekim · `PERCENTAGE` kupon · `FIXED` kupon + taksit · kargo eşiği altı/üstü · kuruşlu fiyatlar (10.01 × 3) · varyant fiyat farkı · çift submit.

Her test için: Input | Beklenen | Gerçekleşen | iyzico yanıtı (kart verisi maskeli) | Order sonucu | Stok sonucu | Sepet sonucu.

---

## BÖLÜM 6 — RAPOR

**Önem seviyeleri:** `CRITICAL` (para kaybı, çift çekim, sahte ödeme onayı, prod ödeme kırılması, güvenlik açığı) · `HIGH` (ödemelerin önemli kısmını bozar) · `MEDIUM` (belirli koşullarda bozar) · `LOW` (UX/bakım) · `INFO`.

**Bulgu formatı** (her bulgu için):

```
[PAY-001] CRITICAL — <tek cümle başlık>
Dosya:      lib/iyzico.ts:123 — createPayment()
Mekanizma:  <ne oluyor>
Kanıt:      <kod alıntısı / DB sonucu / iyzico yanıtı / doküman referansı>
Etki:       <kimi, ne kadar etkiliyor>
Çözüm:      <minimum değişiklik>
```

**Rapor sırası:**

1. Özet (3 cümle: kök neden, etkilenen akış, kaç CRITICAL bulgu)
2. Ortam tespiti + TEST İZNİ kararı
3. Git zaman çizelgesi ve korelasyon
4. Akış haritası
5. Kök neden (dosya + satır + fonksiyon + mekanizma + kanıt)
6. Bulgu tablosu: `ID | Severity | Dosya:satır | Problem | Kanıt`
7. Tutar analizi — gerçek sayılarla
8. 3DS analizi — callback → doğrulama → Order zinciri
9. DB bulguları
10. **DOĞRULANAMAYANLAR** — kanıtlayamadığın her şey ve bunun için neye ihtiyacın olduğu
11. Önerilen minimum düzeltme: dosya | değişiklik | neden | risk
12. Test planı

---

## BÖLÜM 7 — DUR

Raporu tamamla ve dur. `DÜZELTMEYE BAŞLA` onayı gelmeden kod, migration, config, package veya git durumuna dokunma.

---

## BÖLÜM 8 — ONAY SONRASI

En küçük hedefli değişiklik. Refactor yok, kütüphane değişimi yok, ödeme mimarisi yeniden yazılmıyor.

Tutar hesabı değişiyorsa birim test ekle: kuponlu/kuponsuz, taksitli/tek çekim, kargo eşiği altı/üstü, kuruş yuvarlama, varyant modifier.

Sonra: Bölüm 5.2 senaryolarını tekrar çalıştır · regresyon kontrolü (sepet, kupon, stok, sipariş listeleme) · `git diff` özeti.

Kapanış raporu: değiştirilen dosyalar | değişiklik nedeni | önceki davranış | yeni davranış | test sonucu | kalan riskler.

---

## SON KURAL

Para hareketi içeren hiçbir işlemi kanıtsız başarılı sayma. Başarılı ödemenin kanıtı **iyzico server-side doğrulaması + Order kaydı + payment bilgisi** zinciridir. Callback parametrelerine tek başına güvenme.

Tahmini kök nedeni gerçek kök neden olarak sunma.
