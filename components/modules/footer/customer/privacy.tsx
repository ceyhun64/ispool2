import React from "react";
import Link from "next/link";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_KEP,
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
  <section className="mb-10">
    <h2 className="text-xl font-semibold text-sax-800 mb-3">{title}</h2>
    <div className="space-y-3 text-gray-700">{children}</div>
  </section>
);

const dataRows = [
  {
    group: "Hesap",
    data: "Ad, soyad, e-posta, telefon (isteğe bağlı), parola (yalnızca hash'lenmiş hâliyle)",
    why: "Hesabınızı oluşturmak, giriş yapmanızı sağlamak ve sizinle iletişim kurmak",
  },
  {
    group: "Adres",
    data: "Adres başlığı, ad-soyad, adres, il/ilçe/mahalle, posta kodu, telefon, ülke; isteğe bağlı olarak T.C. kimlik numarası",
    why: "Siparişin teslim ve fatura bilgilerini oluşturmak",
  },
  {
    group: "Sipariş",
    data: "Sipariş kalemleri, tutarlar, taksit sayısı, kupon kodu ve indirim, iyzico ödeme numarası, sipariş durumu; sipariş anındaki teslimat/fatura adresinin kopyası",
    why: "Siparişi işlemek, ödemeyi iptal/iade edebilmek ve sipariş geçmişinizi göstermek",
  },
  {
    group: "Özel tasarım",
    data: "Tasarım aracında yüklediğiniz görseller ve sepet/sipariş kaleminde bu görsele ait bağlantı",
    why: "Tasarımınızı ürüne uygulamak",
  },
  {
    group: "Yorum ve favoriler",
    data: "Yorum puanı, başlığı ve metni; favori ürün listeniz",
    why: "Yorumlarınızı ürün sayfasında göstermek ve favorilerinizi saklamak",
  },
  {
    group: "Bülten",
    data: "E-posta adresi",
    why: "Bülten aboneliğini yürütmek",
  },
  {
    group: "Şifre yenileme",
    data: "Süreli şifre yenileme kodu",
    why: "Parolanızı unuttuğunuzda yenileyebilmeniz",
  },
];

const processors = [
  {
    name: "iyzico",
    role: "Ödeme",
    what: "Kart bilgileri, sepet kalemleri, alıcı ve adres bilgileri",
  },
  {
    name: "Cloudinary",
    role: "Görsel depolama",
    what: "Yüklediğiniz tasarım ve görseller",
  },
  {
    name: "remove.bg",
    role: "Arka plan silme",
    what: "Tasarım aracında arka planını sildirmek için seçtiğiniz görsel",
  },
  {
    name: "Horoz Lojistik",
    role: "Kargo",
    what: "Gönderi takibi ve teslimat; iletilen alanlar: ",
    todo: "Horoz Lojistik'e hangi kişisel alanların iletildiği",
  },
  {
    name: "SMTP e-posta hizmeti",
    role: "E-posta gönderimi",
    what: "Şifre yenileme ve sipariş e-postaları için e-posta adresiniz ve ileti içeriği",
    todo: "kullanılan e-posta hizmet sağlayıcısının adı",
  },
  {
    name: "api.turkiyeapi.dev",
    role: "İl/ilçe/mahalle listesi",
    what: "Yalnızca seçtiğiniz il ve ilçenin kodu gönderilir; ad, adres gibi kişisel bilgi gönderilmez",
  },
  {
    name: "Vercel",
    role: "Barındırma",
    what: "Sitenin çalıştığı altyapı; istekleriniz bu altyapı üzerinden geçer",
  },
];

const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      {/* TODO-HUKUK: avukat onayı bekliyor */}
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        Gizlilik ve Kişisel Verilerin Korunması
      </h1>
      <p className="text-gray-600 mb-10">
        {COMPANY_NAME} sitesinde hangi kişisel verilerinizin işlendiğini, bu
        verilerin kimlerle paylaşıldığını ve 6698 sayılı Kişisel Verilerin
        Korunması Kanunu kapsamındaki haklarınızı bu sayfada anlatıyoruz.
      </p>

      <Clause title="1. Veri sorumlusu">
        <p>
          Kişisel verileriniz bakımından veri sorumlusu {COMPANY_LEGAL_TITLE}
          'dur. Adres: {COMPANY_ADDRESS}. KEP: {COMPANY_KEP}. E-posta:{" "}
          {COMPANY_EMAIL}. Telefon: {COMPANY_PHONE}.
        </p>
      </Clause>

      <Clause title="2. Hangi veriyi, ne için topluyoruz?">
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 font-semibold">Alan</th>
                <th className="p-3 font-semibold">Veri</th>
                <th className="p-3 font-semibold">Amaç</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((r) => (
                <tr key={r.group} className="border-t border-gray-200 align-top">
                  <th scope="row" className="p-3 font-semibold text-gray-900">
                    {r.group}
                  </th>
                  <td className="p-3">{r.data}</td>
                  <td className="p-3">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Kart bilgileriniz (kart sahibi adı, numara, son kullanma tarihi ve
          güvenlik kodu) ödeme sırasında sitemiz üzerinden iyzico'ya iletilir.
          Veritabanımızda bu bilgiler için bir alan bulunmaz.
        </p>
        <p>
          Verilerin işlenmesinin hukuki dayanakları:{" "}
          <Todo>
            her veri grubu için KVKK m.5 kapsamındaki işleme şartı (avukat
            tarafından belirlenecek)
          </Todo>
        </p>
      </Clause>

      <Clause title="3. Verileri kimlerle paylaşıyoruz?">
        <p>
          Siteyi çalıştırmak için aşağıdaki hizmet sağlayıcıları kullanıyoruz.
          Her birine yalnızca ilgili hizmetin gerektirdiği bilgiler gider.
        </p>
        <ul className="space-y-3">
          {processors.map((p) => (
            <li key={p.name} className="border-l-4 border-gray-300 pl-4">
              <span className="font-semibold text-gray-900">{p.name}</span>{" "}
              <span className="text-gray-500">({p.role})</span>
              <br />
              {p.what}
              {p.todo ? <Todo>{p.todo}</Todo> : null}
            </li>
          ))}
        </ul>
        <p>
          Yurt dışında bulunan hizmet sağlayıcılara aktarım:{" "}
          <Todo>
            yurt dışına aktarım yapılan sağlayıcılar ve KVKK m.9 kapsamındaki
            dayanak
          </Todo>
        </p>
        <p>
          Yasal bir yükümlülük gerektirdiğinde yetkili kurumlarla da bilgi
          paylaşılabilir.
        </p>
      </Clause>

      <Clause title="4. Ne kadar süre saklıyoruz?">
        <p>
          Saklama süreleri: <Todo>her veri grubu için saklama süresi</Todo>
        </p>
        <p>
          Hesabınızı sildirmek istediğinizde izlenecek yol:{" "}
          <Todo>hesap silme usulü ve yasal saklama yükümlülüğü olan kayıtlar</Todo>
        </p>
      </Clause>

      <Clause title="5. Verilerinizi nasıl koruyoruz?">
        <p>
          Parolalar düz metin olarak değil, geri döndürülemeyecek şekilde
          hash'lenerek saklanır. Oturumunuz imzalı bir oturum çerezi ile
          yönetilir ve 24 saat sonra sona erer. Şifre yenileme kodları süreli
          olarak üretilir.
        </p>
        <p>
          Sunucu konumu ve veri merkezi bilgisi:{" "}
          <Todo>verilerin barındırıldığı bölge/veri merkezi</Todo>
        </p>
        <p>
          Teknik ve idari tedbirlerin diğer ayrıntıları:{" "}
          <Todo>uygulanan güvenlik önlemleri (avukat/BT sorumlusu onayıyla)</Todo>
        </p>
      </Clause>

      <Clause title="6. Çerezler ve tarayıcıda saklanan bilgiler">
        <p>
          Giriş yaptığınızda tarayıcınıza bir oturum çerezi bırakılır; çıkış
          yaptığınızda bu çerez silinir. Giriş yapmadan eklediğiniz sepet ve favoriler ile çerez tercihiniz tarayıcınızın yerel
          depolamasında tutulur. Ayrıntılar için{" "}
          <Link className="underline" href="/institutional/cookie_policy">
            Çerez Politikası
          </Link>{" "}
          sayfasına bakın.
        </p>
      </Clause>

      <Clause title="7. Haklarınız ve başvuru">
        <p>
          KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini
          öğrenme, işlenmişse bilgi isteme, düzeltilmesini veya silinmesini
          isteme, aktarıldığı kişileri öğrenme ve işlemeye itiraz etme haklarına
          sahipsiniz.
        </p>
        <p>
          Başvurularınızı {COMPANY_EMAIL} adresine e-posta ile iletebilirsiniz.
          Başvurunun yanıtlanma süresi ve kimlik doğrulama usulü:{" "}
          <Todo>başvuru yanıt süresi ve kimlik doğrulama yöntemi</Todo>
        </p>
        <p>
          Aydınlatma metninin tamamı için{" "}
          <Link className="underline" href="/help/kvkk">
            KVKK sayfasına
          </Link>{" "}
          bakabilirsiniz.
        </p>
      </Clause>
    </div>
  );
};

export default Privacy;
