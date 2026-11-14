import React from "react";
import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_KEP,
  COMPANY_LEGAL_TITLE,
  COMPANY_MERSIS_NO,
  COMPANY_PHONE,
  COMPANY_TAX_NO,
  COMPANY_TAX_OFFICE,
} from "@/lib/company";
import {
  FREE_SHIPPING_THRESHOLD,
  KDV_RATE,
  SHIPPING_FEE,
  formatPrice,
} from "@/lib/pricing";

const Todo = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-amber-700">⚠ DOLDURULACAK: {children}</span>
);

const Clause = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-9">
    <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
    <div className="space-y-2 text-gray-700">{children}</div>
  </section>
);

const DistanceSales = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      {/* TODO-HUKUK: avukat onayı bekliyor */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Mesafeli Satış Sözleşmesi
      </h1>
      <p className="text-gray-600 mb-10">
        Bu sözleşme, internet sitemiz üzerinden verdiğiniz siparişe uygulanır.
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği çerçevesinde hazırlanmıştır.
      </p>

      <Clause title="A. Sözleşmenin tarafları">
        <p className="font-medium text-gray-900">Satıcı</p>
        <ul className="space-y-1">
          <li>Unvan: {COMPANY_LEGAL_TITLE}</li>
          <li>Adres: {COMPANY_ADDRESS}</li>
          <li>Vergi dairesi / no: {COMPANY_TAX_OFFICE} / {COMPANY_TAX_NO}</li>
          <li>MERSİS no: {COMPANY_MERSIS_NO}</li>
          <li>KEP: {COMPANY_KEP}</li>
          <li>E-posta: {COMPANY_EMAIL}</li>
          <li>Telefon: {COMPANY_PHONE}</li>
        </ul>
        <p className="font-medium text-gray-900 pt-2">Alıcı</p>
        <p>
          Sipariş sırasında hesabına giriş yapıp ad, adres ve iletişim
          bilgilerini girerek sipariş veren kişidir. Alıcının bilgileri
          sipariş kaydında tutulur.
        </p>
      </Clause>

      <Clause title="B. Sözleşmenin amacı">
        <p>
          Alıcının, sitedeki ürün sayfasında nitelikleri ve fiyatı gösterilen
          ürünleri satın alması; Satıcının da bu ürünleri teslim etmesi için
          iki tarafın hak ve yükümlülüklerini düzenlemektir.
        </p>
      </Clause>

      <Clause title="C. Ürün ve fiyat">
        <p>
          Ürünün temel nitelikleri (cinsi, ölçüsü, rengi vb.) ilgili ürün
          sayfasında ve sipariş özetinde yer alır. Alıcı, siparişi tamamlamadan
          önce bu bilgileri inceleyip kabul etmiş sayılır.{" "}
          <Todo>
            sözleşmenin onaylanma ve yürürlüğe girme şekli (ödeme sayfasında
            şu an ayrı bir sözleşme onayı alınmıyor)
          </Todo>
        </p>
        <p>
          Sitede gösterilen fiyatlar KDV dahildir; KDV oranı %
          {Math.round(KDV_RATE * 100)}'dur. Ödenecek toplam tutar; ürün
          bedeli, varsa kargo ücreti, kupon indirimi ve seçilen taksite göre
          vade farkı ile birlikte ödeme sayfasında gösterilir.
        </p>
        <p>
          Fiyat veya stok hatası olması halinde izlenecek yol:{" "}
          <Todo>fiyat/stok hatasında sipariş iptali ve bilgilendirme usulü</Todo>
        </p>
      </Clause>

      <Clause title="D. Ödeme">
        <p>
          Ödeme, iyzico altyapısıyla kredi veya banka kartından alınır. Tek
          çekim ya da taksitli ödeme seçilebilir; taksit seçildiğinde vade
          farkı ve toplam tutar ödeme sayfasında ayrıca gösterilir.
        </p>
        <p>
          İade durumunda bedelin geri ödenme yöntemi ve süresi:{" "}
          <Todo>geri ödeme yöntemi ve süresi</Todo>
        </p>
      </Clause>

      <Clause title="E. Teslimat ve kargo">
        <p>
          Ürünler Horoz Lojistik ile Alıcının sipariş sırasında belirttiği
          teslimat adresine gönderilir. KDV dahil sepet tutarı{" "}
          {formatPrice(FREE_SHIPPING_THRESHOLD)} ve üzerindeyse kargo
          ücretsizdir; bunun altındaki siparişlerde {formatPrice(SHIPPING_FEE)}{" "}
          kargo ücreti eklenir.
        </p>
        <p>
          Teslim süresi: <Todo>siparişlerin teslim/kargoya verilme süresi</Todo>
        </p>
        <p>
          Teslim sırasında paketin hasarlı olduğunu fark eden Alıcı, durumu
          kargo görevlisiyle birlikte tutanak altına almalı ve Satıcıya
          bildirmelidir.{" "}
          <Todo>hasarlı teslimat bildirim usulü</Todo>
        </p>
      </Clause>

      <Clause title="F. Cayma hakkı">
        <p>
          Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde herhangi
          bir gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir.
          Cayma isteğini yukarıdaki iletişim bilgilerinden Satıcıya yazılı
          olarak bildirmesi yeterlidir.
        </p>
        <p>
          İade edilecek ürünün durumu, iade kargo masrafı ve iade adresi için{" "}
          <Link className="underline" href="/help/returns-help">
            İade ve Değişim
          </Link>{" "}
          sayfasına bakınız.{" "}
          <Todo>iade kargo masrafı sorumlusu ve iade adresi</Todo>
        </p>
      </Clause>

      <Clause title="G. Cayma hakkının kullanılamadığı durumlar">
        <p>
          Yönetmelikte sayılan istisnalarda cayma hakkı kullanılamaz. Alıcının
          istek ve ihtiyaçlarına göre hazırlanan ya da kendi tasarımının
          uygulandığı ürünler bu kapsamda olabilir.{" "}
          <Todo>
            kişiye özel/baskılı ürünlerde cayma hakkının durumu ve diğer
            istisnaların hangi ürünler için geçerli olduğu (avukat tarafından
            netleştirilecek)
          </Todo>
        </p>
      </Clause>

      <Clause title="H. Ayıplı ürün">
        <p>
          Ürün ayıplı çıkarsa Alıcı, Kanunun tanıdığı seçimlik haklara (ücretsiz
          onarım, ürün değişimi, bedel indirimi veya sözleşmeden dönme)
          sahiptir.{" "}
          <Todo>ayıplı ürün bildirim usulü, istenen belgeler ve işlem süresi</Todo>
        </p>
      </Clause>

      <Clause title="İ. Uyuşmazlıkların çözümü">
        <p>
          Bu sözleşmeden doğan uyuşmazlıklarda Alıcı, Kanunda belirlenen parasal
          sınırlara göre tüketici hakem heyetine ya da tüketici mahkemesine
          başvurabilir.
        </p>
        <p>
          <Todo>
            tüketici hakem heyeti ve tüketici mahkemesi parasal sınırları
            (güncel değerleriyle) ve yetkili birimler
          </Todo>
        </p>
      </Clause>
    </div>
  );
};

export default DistanceSales;
