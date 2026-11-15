import React from "react";
import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_KEP,
  COMPANY_LEGAL_TITLE,
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
  <section className="mb-9">
    <h2 className="text-lg font-semibold text-sax-800 mb-2">{title}</h2>
    <div className="space-y-2 text-gray-700">{children}</div>
  </section>
);

const categories = [
  ["Kimlik ve iletişim", "ad, soyad, e-posta, telefon; adreste isteğe bağlı T.C. kimlik numarası"],
  ["Adres", "teslimat ve fatura adresi bilgileri (il, ilçe, mahalle, açık adres, posta kodu)"],
  ["Müşteri işlemi", "sipariş kalemleri, tutarlar, taksit sayısı, kupon, sipariş durumu, iyzico ödeme numarası"],
  ["İşlem güvenliği", "hash'lenmiş parola, şifre yenileme kodu ve süresi, oturum bilgisi"],
  ["Görsel", "tasarım aracında yüklenen görseller"],
  ["Kullanıcı içeriği", "ürün yorumu (puan, başlık, metin) ve favori ürünler"],
  ["Pazarlama", "bülten için e-posta adresi"],
];

const purposes = [
  "Üyelik hesabının oluşturulması ve girişin sağlanması",
  "Siparişin alınması, ödemenin tahsil edilmesi, gerektiğinde iptal/iade edilmesi",
  "Ürünün teslimatının yapılması ve kargo takibi",
  "Fatura ve teslimat adresinin düzenlenmesi",
  "Müşterinin yüklediği tasarımın ürüne uygulanması",
  "Ürün yorumlarının yayınlanması",
  "Bülten gönderimi",
  "Şifre yenileme ve sipariş e-postalarının gönderilmesi",
  "Müşteri taleplerinin yanıtlanması",
];

const recipients = [
  ["iyzico", "ödeme işlemi"],
  ["Cloudinary", "görsel depolama"],
  ["remove.bg", "görselin arka planının silinmesi"],
  ["Horoz Lojistik", "kargo ve teslimat"],
  ["E-posta hizmet sağlayıcısı", "e-posta gönderimi"],
  ["Vercel", "sitenin barındırılması"],
];

const rights = [
  "Verilerinizin işlenip işlenmediğini öğrenme",
  "İşlenmişse buna ilişkin bilgi talep etme",
  "İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme",
  "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme",
  "Eksik veya yanlış işlenmişse düzeltilmesini isteme",
  "Kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme",
  "Düzeltme ve silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme",
  "Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç çıkmasına itiraz etme",
  "Kanuna aykırı işlenmesi nedeniyle zarara uğrarsanız zararın giderilmesini talep etme",
];

const Kvkk = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      {/* TODO-HUKUK: avukat onayı bekliyor */}
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        KVKK Aydınlatma Metni
      </h1>
      <p className="text-gray-600 mb-10">
        6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi
        uyarınca, kişisel verilerinizin nasıl işlendiği hakkında sizi bu
        metinle bilgilendiriyoruz. Daha geniş bir özet için{" "}
        <Link className="underline" href="/customer/privacy">
          Gizlilik sayfamıza
        </Link>{" "}
        da bakabilirsiniz.
      </p>

      <Clause title="1. Veri sorumlusu">
        <p>
          {COMPANY_LEGAL_TITLE}. Adres: {COMPANY_ADDRESS}. KEP: {COMPANY_KEP}.
          E-posta: {COMPANY_EMAIL}. Telefon: {COMPANY_PHONE}.
        </p>
        <p>
          VERBİS kaydı: <Todo>VERBİS kayıt durumu ve sicil numarası</Todo>
        </p>
      </Clause>

      <Clause title="2. İşlenen veri kategorileri">
        <ul className="space-y-2">
          {categories.map(([name, detail]) => (
            <li key={name}>
              <span className="font-medium text-gray-900">{name}:</span>{" "}
              {detail}
            </li>
          ))}
        </ul>
        <p>
          Kart bilgileriniz ödeme sırasında iyzico'ya iletilir; veritabanımızda
          bu bilgiler için alan bulunmaz.
        </p>
      </Clause>

      <Clause title="3. Verileri hangi amaçlarla ve hangi hukuki sebeplerle işliyoruz?">
        <ul className="list-disc pl-5 space-y-1">
          {purposes.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p>
          Hukuki sebepler:{" "}
          <Todo>
            her amaç için KVKK m.5/2 (ve gerekiyorsa m.5/1 açık rıza)
            kapsamındaki işleme şartı (avukat tarafından belirlenecek)
          </Todo>
        </p>
      </Clause>

      <Clause title="4. Verilerin aktarıldığı taraflar">
        <p>Verileriniz, hizmetin gerektirdiği ölçüde aşağıdaki taraflara aktarılır:</p>
        <ul className="list-disc pl-5 space-y-1">
          {recipients.map(([name, role]) => (
            <li key={name}>
              <span className="font-medium text-gray-900">{name}</span> — {role}
            </li>
          ))}
        </ul>
        <p>
          Yasal yükümlülük gereği yetkili kurum ve kuruluşlarla da paylaşım
          yapılabilir. Yurt dışına aktarım:{" "}
          <Todo>yurt dışı aktarım yapılan sağlayıcılar ve KVKK m.9 dayanağı</Todo>
        </p>
      </Clause>

      <Clause title="5. Verileri nasıl topluyoruz?">
        <p>
          Verilerinizi doğrudan sizden alıyoruz: üyelik formu, adres ve sipariş
          formları, ödeme sayfası, yorum alanı, bülten kaydı ve tasarım aracı
          aracılığıyla. Siteyi kullanırken tarayıcınızda oturum çerezi ve yerel
          depolama (sepet, favoriler, çerez tercihi) de kullanılır; ayrıntı için{" "}
          <Link className="underline" href="/institutional/cookie_policy">
            Çerez Politikası
          </Link>
          'na bakınız.
        </p>
      </Clause>

      <Clause title="6. KVKK madde 11 kapsamındaki haklarınız">
        <ul className="list-disc pl-5 space-y-1">
          {rights.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Clause>

      <Clause title="7. Başvuru yöntemi">
        <p>
          Haklarınıza ilişkin taleplerinizi {COMPANY_EMAIL} adresine e-posta ile
          ya da yukarıdaki KEP adresimiz veya posta adresimiz üzerinden
          iletebilirsiniz.
        </p>
        <p>
          Başvuru şekli, kimlik doğrulama ve yanıt süresi:{" "}
          <Todo>
            başvuru usulü, kimlik doğrulama yöntemi ve yanıt süresi (Veri
            Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun)
          </Todo>
        </p>
      </Clause>
    </div>
  );
};

export default Kvkk;
