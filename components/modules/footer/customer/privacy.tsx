import React from "react";

const PrivacyAndSecurity = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white text-gray-900 font-sans leading-relaxed">
      {/* Başlık Bölümü */}
      <header className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-bold text-center uppercase tracking-tight">
          Gizlilik ve Güvenlik
        </h1>
      </header>

      <article className="space-y-8 text-sm md:text-base">
        {/* Giriş */}
        <section>
          <p className="mb-4">
            Bu gizlilik bildirimi, <strong>ispool.com.tr</strong> web sitesinin
            veri toplama ve kullanma uygulamalarını açıklamaktadır. Bu Siteye
            erişmeniz bu gizlilik bildiriminde tanımlanan, bilgi toplama ve
            kullanma uygulamalarını kabul ediyor olduğunuzu gösterir.
          </p>
        </section>

        {/* Kişisel Bilgilerin Toplanması */}
        <section>
          <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-600 pl-3">
            Kişisel Bilgilerinizin Toplanması
          </h2>
          <p className="mb-3">
            Sitemizde istenen kişisel bilgileriniz hizmetlerimizin
            sunulabilmesi, bilgilendirme, iletişim vb. durumlar için kayıt
            altında tutulmaktadır. Site, ziyaretleriniz hakkında, siteye erişmek
            için kullandığınız internet servis sağlayıcısının adı ve internet
            protokol (IP) adresi, siteye erişme tarihi ve saatiniz, sitede
            bulunduğunuz sırada eriştiğiniz sayfalar ve sitemize doğrudan
            bağlanmanızı sağlayan web sitesinin internet adresi gibi birtakım
            bilgiler toplayabilir.
          </p>
          <p>
            Bu bilgiler sitenin iyileştirilmesi, eğilimlerin analiz edilmesi ve
            sitenin yönetilmesi için kullanılır. Toplanan kişisel verilerin 3.
            Kişilere aktarımı kural olarak müşterilerimizin onayı olmaksızın
            yapılmamaktadır. Bununla birlikte 6698 sayılı Kişisel Verilerin
            Korunması Kanunu madde 8/2-a ve b uyarınca aktarımı
            yapılabilmektedir.
          </p>
        </section>

        {/* Kişisel Bilgilerin Kullanımı */}
        <section>
          <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-600 pl-3">
            Kişisel Bilgilerinizin Kullanımı
          </h2>
          <p className="mb-3">
            Sitede toplanan kişisel bilgiler, 6698 Sayılı Kişisel Verilerin
            Korunması Kanunu, Bir sözleşmenin kurulması veya ifasıyla doğrudan
            doğruya ilgili olması kaydıyla sözleşmenin taraflarına ait kişisel
            verilerin işlenmesinin gerekli olması(5/2-c), Veri sorumlusunun
            hukuki yükümlülüğünü yerine getirebilmesi için zorunlu
            olması(5/2-ç), Bir hakkın tesisi, kullanılması veya korunması için
            veri işlemenin zorunlu olması(5/2-e), sitenin işletilmesi ve
            istediğiniz veya yetkilendirdiğiniz hizmetlerin sağlanması ya da
            işlemlerin yerine getirilmesi için kullanılır. Kişisel
            bilgilerinizi, bildirimleri de içerecek şekilde, kullanmakta
            olduğunuz ürün veya hizmetler hakkında bilgiler sağlamak için
            kullanabiliriz.
          </p>
          <p className="mb-3">
            Ayrıca, size diğer İşPool ürünleri ve hizmetleri hakkında bilgiler
            SMS veya e-posta aracılığı ile gönderebiliriz. Araştırma amacıyla,
            site ziyaretleriyle ilgili verileri anonim demografik bilgilerle
            birleştiririz ve bu bilgileri daha yararlı içerik sağlamak üzere
            toplu bir şekilde kullanabiliriz.
          </p>
          <p className="mb-3">
            Bir haber bültenine kaydolduğunuzda veya tanıtım e-postaları almayı
            kabul ettiğinizde ispool.com.tr, tıklattığınız e-postaları izlemek
            için özelleştirilmiş bağlantılar veya benzeri teknolojiler
            kullanabilir. Her e-posta, bu tür iletilerin gelmesini durdurmanıza
            olanak veren, abonelik iptal bağlantıları içerir.
          </p>
          <p>
            İşPool, kişisel bilgilerinizi yasal bir zorunluluk olarak
            istendiğinde veya (a) yasal gereklere uygun hareket etmek veya
            tebliğ edilen yasal işlemlere uymak; (b) İşPool haklarını ve
            mülkiyetini korumak ve savunmak; (c) İşPool çalışanlarının veya
            aracılarının, İşPool ürünü kullananların veya kamu güvenliği
            açısından acil durumlarda harekete geçmek için gerekli olduğuna iyi
            niyetle kanaat getirdiği hallerde açıklayabilir.
          </p>
        </section>

        {/* Kişisel Bilgilerin Güvenliği */}
        <section>
          <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-600 pl-3">
            Kişisel Bilgilerinizin Güvenliği
          </h2>
          <p className="mb-3">
            İşPool, kişisel bilgilerinizi yetkisiz erişime, kullanıma veya açığa
            çıkmaya karşı korumak için çok çeşitli güvenlik teknolojileri ve
            yordamları kullanır. Örneğin, sağladığınız bilgileri kontrol
            altındaki tesislerde bulunan ve sınırlı erişimi olan bilgisayar
            sunucularında depolarız.
          </p>
          <p>
            Ayrıca, kredi kartı numarası gibi hassas kişisel bilgileri İnternet
            üzerinden ilettiğimizde, bunları{" "}
            <strong>Güvenli Yuva Katmanı (SSL)</strong> protokolü gibi şifreleme
            yöntemleriyle koruruz. Ayrıca Kredi kartı bilgilerinizi herhangi bir
            şekilde sistemlerimizde saklamayız. Kullanılan Kredi kartları özel
            crypto yöntemleri ile şifrelenerek ilgili bankaya iletilir.
          </p>
        </section>

        {/* Değişiklikler */}
        <section>
          <h2 className="text-xl font-bold mb-3 border-l-4 border-blue-600 pl-3">
            Bu Gizlilik Bildiriminde Yapılabilecek Değişiklikler
          </h2>
          <p>
            Bu gizlilik bildirimini her zaman güncelleştirebiliriz. Yapılan
            değişiklikler Gizlilik ve Güvenlik sözleşmesinin internet sitesinde
            yayımlandığı anda geçerlilik kazanır. Topladığımız kişisel bilgileri
            korumak için hangi yöntemlerden yararlandığımız konusunda bilgi
            sahibi olmak için bu gizlilik bildirimini düzenli aralıklarla gözden
            geçirmenizi öneririz. Hizmeti sürekli şekilde kullanmanız bu
            gizlilik bildirimini ve yapılabilecek güncelleştirmeleri kabul
            ettiğiniz anlamına gelir.
          </p>
        </section>

        {/* Güvenlik Bildirimi Detayları */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 uppercase">
            Güvenlik Bildirimi
          </h2>
          <p className="mb-4">
            İşPool, erişim şifresi gibi bilgilerin sizin tarafınızdan
            belirlenmesine olanak sağlar. Erişim şifresinin unutulması durumunda
            kayıt olurken vermiş olduğunuz e-posta adresine yeni şifre oluşturma
            bağlantısı gönderilir.
          </p>
          <p className="mb-4">
            Gizli bilgilerin istendiği bölümlerde SSL (Secure Socket Layer)
            yöntemini kullanarak bilgilerinizin üçüncü şahısların eline
            geçmesini engeller. Sitemizde kredi kartı işlemi için haberleşmede
            her aşama güvenlik altına alınmıştır.
          </p>

          <h3 className="font-bold mt-6 mb-2">
            Site-Ziyaretçi Haberleşme Güvenliği
          </h3>
          <p className="mb-4">
            Sitemizin sipariş sayfalarında site ile ziyaretçi arasındaki
            haberleşme SSL standartında gerçekleşmektedir. Söz konusu haberleşme
            standardı çok sayıda işlem gören sitelerde dahi güvenle kullanılan
            bir niteliktedir. Kredi kartı bilgilerinin verileceği sayfada bu
            haberleşme biçiminin bulunup bulunmadığını, sayfaya erişildiğinde
            adres çubuğunda yazan ifadenin http://.. biçiminde değil, https://..
            biçiminde oluşu ifade etmektedir. Bu nitelikteki sayfalara
            eriştiğinizde tarayıcının sağ alt köşesinde kilit işareti de yer
            almaktadır.
          </p>

          <h3 className="font-bold mt-6 mb-2">
            Site-Banka Haberleşme Güvenliği
          </h3>
          <p className="mb-4">
            Kredi kartı bilgilerinin siteden bankaya aktarılması ile ilgili
            güvenlik, banka’nın sunduğu maksimum güvenlik ile gerçekleşmektedir.
            Söz konusu güvenliğin çok sayıda bileşenin yanında, CVV2/CVC2 kodu
            da çalıntı kart veya kart bilgileri ile alışverişe karşı önlem
            olarak sitemizde kullanılmaktadır.
          </p>

          <h3 className="font-bold mt-6 mb-2">Site içi Veri Güvenliği</h3>
          <p>
            Güvenli ortamda yapacağınız işlemlerde siz ve kredi kartını size
            tahsis eden banka haricinde hiçbir kişi, kurum ve kuruluş tarafından
            bilgilerinize ulaşamamaktadır. Kredi kartı işlem sayfası kart
            bilgilerini doğrudan banka POS sistemine iletmekte ve işlem sonucunu
            müşteriye bildirmektedir. Kredi kartı bilgileri e-posta veya benzeri
            yöntemlerle aktarılmamaktadır. Online işlemin bir sonucu olarak
            aktarılan kredi kart bilgilerine tarafımızdan dahi erişilmesi mümkün
            değildir.
          </p>
        </section>

        {/* Çerez Politikası */}
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
            Çerez Politikası
          </h2>
          <p className="mb-4 italic">
            Web sitelerini ziyaret ettiğiniz "Çerez (Cookie) Kullanımı
            ilkelerini onayla ve kapat" gibi uyarılar görürsünüz. Bu uyarılar ve
            onaylar ne içindir? Çerezler nedir? Ne için kullanılır? Biz hangi
            Çerezleri kullanıyoruz? Sizleri bu konuda aşağıda bilgilendiriyor
            olacağız.
          </p>

          <h3 className="font-bold text-lg mb-2">Çerez (cookie) nedir?</h3>
          <p className="mb-4">
            Çerez (cookie) Web sitesinin ziyaretinizi hatırlamasını sağlaması
            amacıyla web sitesi tarafından tarayıcınıza gönderilen ve kaydedilen
            küçük metin dosyalarıdır.
          </p>

          <h3 className="font-bold text-lg mb-2">
            Çerezleri Ne İçin Kullanıyoruz?
          </h3>
          <p className="mb-4">
            Çerezler genelde web sitesi kullanıcı deneyiminizi kolaylaştırmak,
            kişiselleştirmek ve geliştirmek için kullanılır. Mesela bir siteye
            kullanıcı girişi yaptığınızda "beni hatırla" seçeneğini
            işaretlerseniz çerezler bu bilgileri kaydeder ve bir sonraki site
            ziyaretinizde üye girişi yapmanıza gerek kalmadan sizi hatırlar.
            Aynı zamanda o sitede kullanacağınız dil seçimi, Ülke seçimi, yapmış
            olduğunuz kişisel seçimler gibi bir sonraki ziyaretinizi sizin için
            kolaylaştırabilir.
          </p>

          <h3 className="font-bold text-lg mb-2">Çerez Türleri Nelerdir?</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>
              <strong>Birinci ve Üçüncü Taraf Çerezleri:</strong>{" "}
              Hizmetlerimizde hem birinci taraf hem de üçüncü taraf tanımlama
              çerezleri bulunabilmektedir.
            </li>
            <li>
              <strong>Kalıcı Çerezler:</strong> Bu çerezler, çerezde belirtilen
              süre boyunca kullanıcının cihazında kalır. Kullanıcı söz konusu
              çerezi oluşturan web sitesini her ziyaret ettiğinde
              etkinleştirilirler.
            </li>
            <li>
              <strong>Oturum Çerezleri:</strong> Bu çerezler, web sitesi
              operatörlerinin bir tarayıcı oturumu sırasında bir kullanıcının
              eylemlerini bağlamasına izin verir. Bir tarayıcı oturumu, bir
              kullanıcı tarayıcı penceresini açtığında başlar ve tarayıcı
              penceresini kapattığında biter. Oturum çerezleri geçici olarak
              oluşturulur. Tarayıcıyı kapattığınızda, tüm oturum çerezleri
              silinir.
            </li>
            <li>
              <strong>Sosyal Medya:</strong> Bu çerezler, içeriğimizi
              arkadaşlarınız ve ağlarınızla paylaşmanıza, hizmetlerimizde oturum
              açmanıza, ilgili reklamlar ve bu üçüncü taraftaki içeriklerle size
              daha iyi ulaşmanıza olanak sağlamak için web sitesine eklediğimiz
              bir dizi sosyal medya hizmeti tarafından ayarlanır.
            </li>
          </ul>
        </section>

        {/* Teknik Çerez Tablosu */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            Hangi Çerezleri Kullanıyoruz, Neden Kullanıyoruz?
          </h2>
          <p className="mb-4">
            http://www.ispool.com.tr sitemizde kullanabileceğimiz farklı çerez
            tiplerini aşağıda listeledik. Gerekli, İşlevsel, Uygulama ve Diğer
            Performans, Hedefleme ve Sosyal Medya çerezlerini kullanıyoruz.
            Aşağıda kullanılan değişkenlere ait bilgilendirmeler yer almaktadır.
            Yazılım tarafından kullanılanlar her site için geçerliyken, diğer
            çerezler siteye göre farklılık gösterebilir. Çerezler aracığıyla
            edindiğimiz bilgilerin, kişisel bilgi niteliğinde olması halinde, bu
            Çerez Politikasını tamamlar nitelikteki Gizlilik Politikası
            uygulanacaktır.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-4 rounded shadow-sm">
              <h4 className="font-bold text-blue-800 mb-2 underline">
                İşlevsel Çerezler
              </h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>psid:</strong> Site kullanıcısı için oturum değişkeni
                </li>
                <li>
                  <strong>l:</strong> Müşteri giriş yaptı / yapmadı değişkeni
                </li>
                <li>
                  <strong>abh:</strong> Yönetici paneli için giriş yapıldı /
                  yapılmadı değişkeni
                </li>
                <li>
                  <strong>dc2u:</strong> Site Dili, para birimi alanlarının
                  önbelleklemesi için gerekli değişken
                </li>
              </ul>
            </div>
            <div className="border p-4 rounded shadow-sm">
              <h4 className="font-bold text-blue-800 mb-2 underline">
                Uygulama Çerezleri
              </h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>popup:</strong> Popup bannerın daha önce gösterilip
                  gösterilmediğinin tutulduğu değişken
                </li>
                <li>
                  <strong>Cerez Mesaji:</strong> Çerez mesajının müşteriye daha
                  önce gösterilip gösterilmediğinin tutulduğu değişken
                </li>
                <li>
                  <strong>viewStyle:</strong> Ürün listeleme ekranında ürünlerin
                  hangi şekilde gösterileceğinin tutulduğu değişken
                </li>
              </ul>
            </div>
            <div className="border p-4 rounded shadow-sm md:col-span-2">
              <h4 className="font-bold text-blue-800 mb-2 underline">
                Diğer Çerezler
              </h4>
              <ul className="text-sm grid md:grid-cols-2 gap-2">
                <li>
                  <strong>__zlcmid:</strong> Zopim Canlı Destek Değişkeni
                </li>
                <li>
                  <strong>_ga:</strong> Analytics cihaz bilgisi – Google Tag
                  Manager
                </li>
                <li>
                  <strong>_gid:</strong> Kullanıcı tanımlama için
                </li>
                <li>
                  <strong>_gat:</strong> Anaytics istek oranını düşürmek için
                </li>
                <li>
                  <strong>__tawkuuid:</strong> Tawk Canlı Destek Değişkeni
                </li>
                <li>
                  <strong>TawkConnectionTime:</strong> Tawk Bağlantı değişkeni
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tarayıcı Ayarları */}
        <section className="border-t pt-8">
          <h2 className="text-xl font-bold mb-4">
            Çerez Tercihlerinizi Nasıl Değiştirebilirsiniz?
          </h2>
          <p className="mb-4">
            Çerez tanımlama bilgilerine izin vermemeyi tercih edebilirsiniz,
            çoğu tarayıcı tanımlama bilgilerini size en uygun şekilde yönetme
            olanağı sağlar. Bazı tarayıcılarda, çerezleri site bazında yönetmek
            için gizliliğiniz konusunda daha detaylı bir kontrol
            sağlayabilirsiniz. Güvendiğiniz siteler dışındaki tüm sitelerden
            gelen çerezlere izin vermeyebilirsiniz.
          </p>
          <h3 className="font-bold mb-3">
            Çerez Ayarlarınızı Aşağıdaki Şekilde Yönetebilirsiniz
          </h3>
          <p className="mb-4">
            Hangi tarayıcıları kullanıyorsanız aşağıdaki linklere tıklayarak
            ilgili çerez ayarlarına ulaşabilirsiniz.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-blue-600 underline text-sm">
            <li>Google Chrome</li>
            <li>Internet Explorer</li>
            <li>Mozilla Firefox</li>
            <li>Safari (Masaüstü)</li>
            <li>Safari (Mobil)</li>
            <li>Android Tarayıcı</li>
            <li>Opera</li>
            <li>Opera Mobile</li>
          </ul>
          <p className="mt-6 text-sm text-gray-500 italic">
            Diğer tarayıcılar için, lütfen tarayıcı üreticinizin sağladığı
            belgelere bakın.
          </p>
        </section>
      </article>
    </div>
  );
};

export default PrivacyAndSecurity;
