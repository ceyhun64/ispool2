import React from "react";

const ReturnAndExchange = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white text-gray-800 font-sans leading-relaxed border shadow-sm my-10">
      {/* Başlık Bölümü */}
      <header className="mb-8 border-b-2 border-gray-100 pb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase">
          İade ve Değişim Şartları
        </h1>
      </header>

      <article className="space-y-8 text-sm md:text-base">
        {/* Giriş Sorusu */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-blue-900">
            Satın Aldığım Ürünü Hangi Koşullarda Değiştirebilir veya İade
            Edebilirim?
          </h2>
          <p>
            ispool.com.tr' den alınmış olan ürünler kullanılmadığı, orijinal
            kutusunda ve içinde bulunan ambalajlara zarar görmediği, faturasının
            ve tüm tamamlayıcı aksesuarlarının hasarsız ve eksiksiz gönderildiği
            takdirde aynı ürünün başka bir bedeni veya rengiyle değiştirilir
            veya iade edilebilir.
          </p>
        </section>

        {/* Süreler Kartı */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-bold text-lg mb-2 text-blue-800">
              Değişim Süresi
            </h3>
            <p>
              Değiştirme işlemleri müşteri ürünü teslim aldıktan sonraki{" "}
              <strong>30 (otuz) gün</strong> içerisinde kargoya teslim
              etmelidir. 30 günü aşan ürünlerin değişimi yapılmamaktadır.
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h3 className="font-bold text-lg mb-2 text-red-800">İade Süresi</h3>
            <p>
              İade işlemlerinde ise, müşteri ürünü teslim aldıktan sonra{" "}
              <strong>14 (on dört) gün</strong> içerisinde kargoya teslim
              etmelidir. 14 günü aşan ürünlerin iadesi yapılmamaktadır.
            </p>
          </div>
        </section>

        {/* Adımlar */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-gray-900 pl-3">
            Ürünümü Değiştirmek veya İade Etmek için Ne Yapmalıyım?
          </h2>
          <p className="mb-4">
            Değişim veya İadesi istenen ürün mümkünse orijinal ambalajında
            güvenli bir şekilde paketleyin ve beraberinde gönderilen{" "}
            <strong>Değiştirme / İade Formu</strong> (eksiksiz doldurup
            imzalanarak) ve faturası ile birlikte aşağıda belirtilen iade
            adresine gönderilmelidir.
          </p>
          <div className="bg-gray-100 p-4 rounded text-center font-mono text-sm">
            Kuzuluk Mah. Yazakisa Cad. No:34 54400 Akyazı / SAKARYA <br />
            Tel: 0 264 437 93 28 / 29
          </div>
        </section>

        {/* İade Koşulları ve Kargo */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">İade koşulları nelerdir?</h2>
            <p>
              İşPool'tan satın aldığınız ürünü, kargodan teslim aldığınız günden
              itibaren 14 gün içinde iade koşulları dahilinde kargo bedelini
              ödeyerek iade edebilirsiniz. Eğer ürün iade koşullarını
              karşılamıyorsa ürün adresinize geri gönderilebilir. Ürünlerin
              cayma hakkı dahilinde iade alınabilmesi için satın alınan ürünün
              orijinal kutusunda ve içinde bulunan ambalajlara zarar verilmemiş
              olması, faturasının ve tüm tamamlayıcı aksesuarlarının hasarsız ve
              eksiksiz gönderilmesi gerekir.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded border border-orange-200">
            <h2 className="text-lg font-bold mb-1">
              Değişim ve İade İşlemlerinde Kargoyu Kim Öder?
            </h2>
            <p>Değişim ve iade işlemlerinde kargo masrafı müşteriye aittir.</p>
          </div>
        </section>

        {/* Hatalı Ürün ve Firma Faturaları */}
        <section className="grid md:grid-cols-2 gap-8 border-t pt-8">
          <div>
            <h2 className="font-bold text-lg mb-2">
              Hatalı Ürünlerde Aynı Koşullar Geçerli mi?
            </h2>
            <p className="text-sm">
              İşPool, hatalı ürünü ücretsiz değiştirmeyi ve kargo masrafını
              karşılamayı taahhüt eder. Paketi ve ambalajı zarar görmemiş ancak
              paket içerisinden hatalı çıkan ürün 14 (on dört) gün içerisinde
              "Değiştirme / İade Formu" eksiksiz doldurulup imzalanarak,
              faturası ile birlikte yukarıda belirtilen iade adresine
              gönderilmelidir.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-lg mb-2">
              Firma Adına Yapılan Alışverişlerde İade Faturası Gerekli mi?
            </h2>
            <p className="text-sm">
              Firma adına yapılan alışverişlerde ürünün iadesi veya farklı bir
              ürünle değişimi için <strong>"ürün iade faturası"</strong>{" "}
              gönderilmesi gerekmektedir. Ürün iade faturası olmayan ürünler
              teslim alınmaz. Ancak aynı ürünün farklı bedeni veya rengi için
              yapılan değişimlerde iade faturası gerekmemektedir.
            </p>
          </div>
        </section>

        {/* İndirme Linki */}
        <section className="text-center py-4 bg-gray-900 text-white rounded-lg">
          <p className="font-bold cursor-pointer hover:underline">
            Ürün İade veya Değişim Talep Formunu İndirmek için tıklayınız...
          </p>
        </section>

        {/* İade Durumu Başlığı */}
        <div className="pt-8 border-t-2 border-gray-200">
          <h2 className="text-2xl font-black text-center uppercase mb-8">
            İade Durumu
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2 italic">
                Ürünümü gönderdim. İadem ne zaman yapılır?
              </h3>
              <p>
                Değiştirme / İade Formunu doldurup geri gönderdiğiniz ürün, iade
                onayı için bazı incelemelerden geçer. Talebiniz kabul olduğunda
                para iadeniz, alışverişinizde kullanmış olduğunuz hesabınızın
                ait olduğu bankaya, iadenizin onaylandığı anda otomatik olarak
                yapılır. İşPool tarafından iade işlemi bankanıza yapıldığı an,
                hesabınıza tanımlı olan e-posta adresinize işlem detaylarını
                gösteren bir dekont gönderilir. Bu dekontu içeren e-posta
                elinize ulaştıysa, İşPool tarafından bankanıza yapılan iade
                ödemesi tamamlanmış demektir. Bankanızın bu tutarı kart veya
                banka hesabınıza yansıtma süresi ise bankanızın işlem sürecine
                göre değişkenlik gösterir.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border p-4 rounded shadow-sm">
                <h3 className="font-bold mb-2">
                  İade başvurumun durumunu nasıl öğrenebilirim?
                </h3>
                <p className="text-sm text-gray-600">
                  İade talebiniz kabul veya reddedildiğinde e-posta yoluyla
                  bilgilendirme yapılır.
                </p>
              </div>
              <div className="border p-4 rounded shadow-sm">
                <h3 className="font-bold mb-2">
                  İade talebim neden reddedildi?
                </h3>
                <p className="text-sm text-gray-600">
                  Eğer taahhüt edilen iade koşulları yerine getirilmediği
                  taktirde iade talebiniz reddedilir. Ret nedeni belirtilmemişse{" "}
                  <strong>bilgi@ispool.com.tr</strong> adresinden bize
                  ulaşabilirsiniz.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg italic text-gray-700 border-l-4 border-gray-400">
              <h3 className="font-bold not-italic text-black mb-2">
                Taksitle aldığım ürünün iadesi neden taksitle yapılıyor?
              </h3>
              <p className="text-sm">
                Taksitlendirilmiş kredi kartı alışverişi iadelerinde, İşPool
                tarafından tutarın tamamı kredi kartınızın ait olduğu bankaya
                tek seferde ödenir. Ancak bankaların iç işleyişleri nedeniyle,
                bu tutarlar banka tarafından kartınıza sipariş sırasında
                seçtiğiniz ay kadar taksitle iade edilir. İade ödemelerinin
                taksitle yapılmasında İşPool'un herhangi bir dahiliyeti olmayıp
                detaylı bilgi için bankanızla iletişime geçmeniz gerekir.
              </p>
            </div>
          </div>
        </div>
      </article>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 uppercase">
        İşPool - Değişim ve İade Merkezi - Sakarya
      </footer>
    </div>
  );
};

export default ReturnAndExchange;
