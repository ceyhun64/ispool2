# İşmont temizliği – kurallar
- Hiçbir metni, başlığı, cümleyi, maddelemeyi ya da sayfa düzenini ismont.com.tr sitesinden alma, kopyalama, çevirme ya da yakın bir şekilde yeniden ifade etme. Bu siteyi ziyaret etme, fetch etme, arama yapma.
- Yeni metinleri sıfırdan, İşPool'un gerçek iş modeline göre yaz. Kaynak olarak yalnızca README.md'deki gerçek bilgileri (iyzico ödeme, 12 taksit, kargo eşiği, kargo firması vb.), mevcut kod davranışını ve benim sana verdiğim bilgileri kullan.
- Doğrulayamadığın hiçbir şirket bilgisini, belge, sertifika, tarih, kapasite, iade süresi, rakam ya da hukuki iddiayı uydurma. Bilmediğin yere `⚠ DOLDURULACAK: <ne gerektiği>` yaz.
- Yasal metinlerde (Tüketici Kanunu 6502, Mesafeli Sözleşmeler Yönetmeliği, KVKK 6698) kanun maddelerine atıf yapabilirsin, ama anlatımı kendi cümlelerinle kur. Metnin sonuna "Bu metin yayından önce hukuk danışmanı tarafından gözden geçirilmelidir" gibi bir not EKLEME (bu not sitede görünmemeli), bunun yerine her yasal sayfanın en üstüne bir `{/* TODO-HUKUK: avukat onayı bekliyor */}` yorumu koy.
- Sayfaların başlık sırası, madde sıralaması ve cümle yapısı eski sürümden belirgin biçimde farklı olsun. Eski metni "biraz değiştirerek" yeniden yazma.
- Veritabanına bağlanma, `npm run build:fresh`, `prisma migrate reset`, `prisma db push --force-reset` ya da veri silen herhangi bir komutu ÇALIŞTIRMA. `npm run seed` de çalıştırma.
- Commit atma. Her adımın sonunda `git diff --stat` göster ve ne değiştiğini kısaca özetle.

## Bulunan kalıntılar
Aranan kalıplar: `0216 472`, `472 73 00`, `472 73 11`, `216) 472`, `+90 216` (app/, components/, lib/, data/, prisma/, public/, tests/, README.md)

- components/modules/footer/customer/sales-agreement.tsx:55 — Telefon `0216 472 73 00` → `+90 534 352 94 20` ile değiştirildi
- components/modules/footer/customer/sales-agreement.tsx:58 — Fax `0216 472 73 11-12` → satır silindi

Başka eşleşme bulunmadı.

Not: Satış sözleşmesinin tamamı sonraki adımlarda sıfırdan yeniden yazılacak; Satıcı bölümündeki diğer alanlar şimdilik değiştirilmedi.
