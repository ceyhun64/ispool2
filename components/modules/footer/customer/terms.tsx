import React from "react";
import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_LEGAL_TITLE,
  COMPANY_NAME,
  COMPANY_PHONE,
} from "@/lib/company";

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
  <section className="mb-8">
    <h2 className="text-lg font-semibold text-sax-800 mb-2">{title}</h2>
    <div className="space-y-2 text-gray-700">{children}</div>
  </section>
);

const TermsOfUse = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      {/* TODO-HUKUK: avukat onayı bekliyor */}
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        Site Kullanım Şartları
      </h1>
      <p className="text-gray-600 mb-10">
        Bu sayfa, {COMPANY_NAME} sitesini kullanırken ve alışveriş yaparken
        geçerli olan kuralları anlatır. Siteyi kullanmaya devam etmeniz, bu
        kuralları okuduğunuz anlamına gelir.
      </p>

      <Clause title="1. Siteyi kim işletiyor?">
        <p>
          Site, {COMPANY_LEGAL_TITLE} adına işletilmektedir. Adres:{" "}
          {COMPANY_ADDRESS}. İletişim: {COMPANY_EMAIL}, {COMPANY_PHONE}.
        </p>
      </Clause>

      <Clause title="2. Ürün bilgileri ve fiyatlar">
        <p>
          Ürün sayfalarındaki görseller, açıklamalar ve fiyatlar bilgi amaçlı
          hazırlanmıştır. Gerçek ürün ile ekranınızdaki görüntü arasında renk
          tonu gibi küçük farklar olabilir.
        </p>
        <p>
          Fiyat veya stok bilgisinin yanlış girilmiş olması halinde izlenecek
          yol: <Todo>fiyat/stok hatası durumunda sipariş iptali ve bilgilendirme usulü</Todo>
        </p>
      </Clause>

      <Clause title="3. Sipariş ve ödeme">
        <p>
          Sipariş vermek için hesabınıza giriş yapmış olmanız gerekir.
          Ödemeler iyzico altyapısıyla alınır. Ödeme sayfasında gördüğünüz
          toplam, sipariş anında tekrar hesaplanır ve ödemeniz bu tutar
          üzerinden alınır.
        </p>
        <p>
          Siparişin onaylanması, ödemenin başarıyla tamamlanması ve ürünlerin
          stokta bulunmasına bağlıdır. Cayma, iade ve değişim konuları{" "}
          <Link className="underline" href="/help/returns-help">
            İade ve Değişim
          </Link>{" "}
          sayfasında ayrıca anlatılmıştır.
        </p>
      </Clause>

      <Clause title="4. Hesabınız ve giriş güvenliği">
        <p>
          Hesabınıza e-posta adresiniz ve parolanızla giriş yaparsınız.
          Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olması sizin
          sorumluluğunuzdadır.
        </p>
        <p>
          Parolanızı başkalarıyla paylaşmamalısınız. Hesabınızdan yapılan
          işlemlerin sorumluluğu, parolanın üçüncü kişilerin eline geçmesinde
          sizin kusurunuz varsa size aittir. Hesabınızın izinsiz kullanıldığını
          fark ederseniz bize yazın: {COMPANY_EMAIL}
        </p>
      </Clause>

      <Clause title="5. Kendi tasarımınızı yüklemeniz">
        <p>
          Sitedeki tasarım aracını kullanarak ürünler için kendi görsellerinizi
          ve tasarımlarınızı yükleyebilirsiniz. Yüklediğiniz içeriğin telif,
          marka ve kişilik haklarını ihlal etmediğinden siz sorumlusunuz.
          Başkasına ait bir logo, marka ya da eseri izinsiz yüklememelisiniz.
        </p>
        <p>
          Tasarımınızın ürüne uygulanması ve hak ihlali iddiaları durumunda
          İşPool'un yaklaşımı:{" "}
          <Todo>
            hak ihlali şüphesi olan tasarımların reddi/iptali ve sorumluluk
            paylaşımı (avukat tarafından yazılacak)
          </Todo>
        </p>
      </Clause>

      <Clause title="6. Ürün yorumları">
        <p>
          Ürün yorumu yazmak için giriş yapmanız gerekir ve her ürün için bir
          yorum bırakabilirsiniz. Yorumlarınız gerçek deneyiminize dayanmalı;
          hakaret, kişisel veri veya yasa dışı içerik barındırmamalıdır.
        </p>
        <p>
          Yorumların yayından kaldırılması:{" "}
          <Todo>yorum denetimi ve kaldırma koşulları</Todo>
        </p>
      </Clause>

      <Clause title="7. Sitedeki içeriklerin hakları">
        <p>
          Sitedeki logo, tasarım, metin ve görseller, aksi belirtilmedikçe
          işletmeciye aittir. Önceden izin almadan çoğaltamaz, dağıtamaz veya
          ticari amaçla kullanamazsınız.
        </p>
      </Clause>

      <Clause title="8. Çerezler">
        <p>
          Sitede çerez kullanılabilir. Hangi çerezlerin kullanıldığını ve
          tercihlerinizi{" "}
          <Link className="underline" href="/institutional/cookie_policy">
            Çerez Politikası
          </Link>{" "}
          sayfasında bulabilirsiniz.
        </p>
      </Clause>

      <Clause title="9. Şartlarda değişiklik">
        <p>
          Bu şartları zaman zaman güncelleyebiliriz. Güncel metin her zaman bu
          sayfada yayımlanır.{" "}
          <Todo>değişikliklerin kullanıcıya duyurulma şekli ve yürürlük tarihi</Todo>
        </p>
      </Clause>

      <Clause title="10. Uygulanacak hukuk ve uyuşmazlıklar">
        <p>
          Bu şartlara Türk hukuku uygulanır. Uyuşmazlıklarda yetkili mahkeme ve
          icra daireleri:{" "}
          <Todo>yetkili mahkeme/icra daireleri</Todo>
        </p>
      </Clause>
    </div>
  );
};

export default TermsOfUse;
