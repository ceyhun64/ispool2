import React from "react";

const TermsOfUse = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 bg-white text-gray-800 font-sans leading-relaxed border shadow-sm my-10">
      {/* Başlık Bölümü */}
      <header className="mb-8 border-b-2 border-gray-100 pb-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 uppercase">
          Kullanım Şartları
        </h1>
      </header>

      <article className="space-y-6 text-sm md:text-base">
        {/* Giriş Uyarısı */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 italic">
          <p>
            Lütfen sitemizi kullanmadan önce bu ‘site kullanım şartları’nı
            dikkatlice okuyunuz.
          </p>
          <p className="mt-2 font-semibold">
            Bu siteyi kullanan ve alışveriş yapan müşterilerimiz aşağıdaki
            şartları kabul etmiş varsayılmaktadır:
          </p>
        </section>

        {/* Giriş Metni */}
        <section>
          <p>
            Sitemizdeki web sayfaları ve ona bağlı tüm sayfalar (‘site’){" "}
            <strong>
              Küçük Çamlıca Mah. Adil Bey Sk. No:4 34696 Üsküdar/ İstanbul
            </strong>{" "}
            adresindeki{" "}
            <strong>İŞPOOL TEKSTİL ÜRETİM PAZ. SAN. VE TİC. A.Ş.</strong>{" "}
            firmasının (Firma) malıdır ve onun tarafından işletilir.
          </p>
          <p className="mt-4">
            Sizler (‘Kullanıcı’) sitede sunulan tüm hizmetleri kullanırken
            aşağıdaki şartlara tabi olduğunuzu, sitedeki hizmetten yararlanmakla
            ve kullanmaya devam etmekle; Bağlı olduğunuz yasalara göre sözleşme
            imzalama hakkına, yetkisine ve hukuki ehliyetine sahip ve 18 yaşın
            üzerinde olduğunuzu, bu sözleşmeyi okuduğunuzu, anladığınızı ve
            sözleşmede yazan şartlarla bağlı olduğunuzu kabul etmiş
            sayılırsınız.
          </p>
          <p className="mt-4">
            İşbu sözleşme taraflara sözleşme konusu site ile ilgili hak ve
            yükümlülükler yükler ve taraflar işbu sözleşmeyi kabul ettiklerinde
            bahsi geçen hak ve yükümlülükleri eksiksiz, doğru, zamanında, işbu
            sözleşmede talep edilen şartlar dâhilinde yerine getireceklerini
            beyan ederler.
          </p>
        </section>

        {/* MADDE 1 */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-blue-900 uppercase">
            1. SORUMLULUKLAR
          </h2>
          <ul className="space-y-3 pl-4 list-none">
            <li>
              <span className="font-bold">A.</span> Firma, fiyatlar ve sunulan
              ürün ve hizmetler üzerinde değişiklik yapma hakkını her zaman
              saklı tutar.
            </li>
            <li>
              <span className="font-bold">B.</span> Firma, üyenin sözleşme
              konusu hizmetlerden, teknik arızalar dışında yararlandırılacağını
              kabul ve taahhüt eder.
            </li>
            <li>
              <span className="font-bold">C.</span> Kullanıcı, sitenin
              kullanımında tersine mühendislik yapmayacağını ya da bunların
              kaynak kodunu bulmak veya elde etmek amacına yönelik herhangi bir
              başka işlemde bulunmayacağını aksi halde ve 3. Kişiler nezdinde
              doğacak zararlardan sorumlu olacağını, hakkında hukuki ve cezai
              işlem yapılacağını peşinen kabul eder.
            </li>
            <li>
              <span className="font-bold">D.</span> Kullanıcı, site içindeki
              faaliyetlerinde, sitenin herhangi bir bölümünde veya
              iletişimlerinde genel ahlaka ve adaba aykırı, kanuna aykırı, 3.
              Kişilerin haklarını zedeleyen, yanıltıcı, saldırgan, müstehcen,
              pornografik, kişilik haklarını zedeleyen, telif haklarına aykırı,
              yasa dışı faaliyetleri teşvik eden içerikler üretmeyeceğini,
              paylaşmayacağını kabul eder. Aksi halde oluşacak zarardan tamamen
              kendisi sorumludur ve bu durumda ‘Site’ yetkilileri, bu tür
              hesapları askıya alabilir, sona erdirebilir, yasal süreç başlatma
              hakkını saklı tutar. Bu sebeple yargı mercilerinden etkinlik veya
              kullanıcı hesapları ile ilgili bilgi talepleri gelirse paylaşma
              hakkını saklı tutar.
            </li>
            <li>
              <span className="font-bold">E.</span> Sitenin üyelerinin
              birbirleri veya üçüncü şahıslarla olan ilişkileri kendi
              sorumluluğundadır.
            </li>
          </ul>
        </section>

        {/* MADDE 2 */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-blue-900 uppercase">
            2. Fikri Mülkiyet Hakları
          </h2>
          <div className="pl-4 space-y-3">
            <p>
              <strong>2.1.</strong> İşbu Site’de yer alan ünvan, işletme adı,
              marka, patent, logo, tasarım, bilgi ve yöntem gibi tescilli veya
              tescilsiz tüm fikri mülkiyet hakları site işleteni ve sahibi
              firmaya veya belirtilen ilgilisine ait olup, ulusal ve
              uluslararası hukukun koruması altındadır. İşbu Site’nin ziyaret
              edilmesi veya bu Site’deki hizmetlerden yararlanılması söz konusu
              fikri mülkiyet hakları konusunda hiçbir hak vermez.
            </p>
            <p>
              <strong>2.2.</strong> Site’de yer alan bilgiler hiçbir şekilde
              çoğaltılamaz, yayınlanamaz, kopyalanamaz, sunulamaz ve/veya
              aktarılamaz. Site’nin bütünü veya bir kısmı diğer bir internet
              sitesinde izinsiz olarak kullanılamaz.
            </p>
          </div>
        </section>

        {/* MADDE 3 */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-blue-900 uppercase">
            3. Gizli Bilgi
          </h2>
          <div className="pl-4 space-y-3">
            <p>
              <strong>3.1.</strong> Firma, site üzerinden kullanıcıların
              ilettiği kişisel bilgileri 3. Kişilere açıklamayacaktır. Bu
              kişisel bilgiler; kişi adı-soyadı, adresi, telefon numarası, cep
              telefonu, e-posta adresi gibi Kullanıcı’yı tanımlamaya yönelik her
              türlü diğer bilgiyi içermekte olup, kısaca ‘Gizli Bilgiler’ olarak
              anılacaktır.
            </p>
            <p>
              <strong>3.2.</strong> Kullanıcı, sadece tanıtım, reklam, kampanya,
              promosyon, duyuru vb. pazarlama faaliyetleri kapsamında
              kullanılması ile sınırlı olmak üzere, Site’nin sahibi olan
              firmanın kendisine ait iletişim, portföy durumu ve demografik
              bilgilerini iştirakleri ya da bağlı bulunduğu grup şirketleri ile
              paylaşmasına muvafakat ettiğini kabul ve beyan eder. Bu kişisel
              bilgiler firma bünyesinde müşteri profili belirlemek, müşteri
              profiline uygun promosyon ve kampanyalar sunmak ve istatistiksel
              çalışmalar yapmak amacıyla kullanılabilecektir.
            </p>
            <p>
              <strong>3.3.</strong> Gizli Bilgiler, ancak resmi makamlarca usulü
              dairesinde bu bilgilerin talep edilmesi halinde ve yürürlükteki
              emredici mevzuat hükümleri gereğince resmi makamlara açıklama
              yapılmasının zorunlu olduğu durumlarda resmi makamlara
              açıklanabilecektir.
            </p>
          </div>
        </section>

        {/* MADDE 4 */}
        <section className="bg-gray-50 p-6 rounded-md border border-gray-200 shadow-inner text-gray-700">
          <h2 className="text-xl font-bold mb-4 uppercase">
            4. Garanti Vermeme
          </h2>
          <p className="text-xs md:text-sm">
            İŞBU SÖZLEŞME MADDESİ UYGULANABİLİR KANUNUN İZİN VERDİĞİ AZAMİ
            ÖLÇÜDE GEÇERLİ OLACAKTIR. FİRMA TARAFINDAN SUNULAN HİZMETLER "OLDUĞU
            GİBİ” VE "MÜMKÜN OLDUĞU” TEMELDE SUNULMAKTA VE PAZARLANABİLİRLİK,
            BELİRLİ BİR AMACA UYGUNLUK VEYA İHLAL ETMEME KONUSUNDA TÜM ZIMNİ
            GARANTİLER DE DÂHİL OLMAK ÜZERE HİZMETLER VEYA UYGULAMA İLE İLGİLİ
            OLARAK (BUNLARDA YER ALAN TÜM BİLGİLER DÂHİL) SARİH VEYA ZIMNİ,
            KANUNİ VEYA BAŞKA BİR NİTELİKTE HİÇBİR GARANTİDE BULUNMAMAKTADIR.
          </p>
        </section>

        {/* MADDE 5-11 */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              5. Kayıt ve Güvenlik
            </h2>
            <p>
              Kullanıcı, doğru, eksiksiz ve güncel kayıt bilgilerini vermek
              zorundadır. Aksi halde bu Sözleşme ihlal edilmiş sayılacak ve
              Kullanıcı bilgilendirilmeksizin hesap kapatılabilecektir.
              Kullanıcı, site ve üçüncü taraf sitelerdeki şifre ve hesap
              güvenliğinden kendisi sorumludur. Aksi halde oluşacak veri
              kayıplarından ve güvenlik ihlallerinden veya donanım ve cihazların
              zarar görmesinden Firma sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              6. Mücbir Sebep
            </h2>
            <p>
              Tarafların kontrolünde olmayan; tabii afetler, yangın, patlamalar,
              iç savaşlar, savaşlar, ayaklanmalar, halk hareketleri, seferberlik
              ilanı, grev, lokavt ve salgın hastalıklar, altyapı ve internet
              arızaları, elektrik kesintisi gibi sebeplerden (aşağıda birlikte
              "Mücbir Sebep” olarak anılacaktır.) dolayı sözleşmeden doğan
              yükümlülükler taraflarca ifa edilemez hale gelirse, taraflar
              bundan sorumlu değildir. Bu sürede Taraflar’ın işbu Sözleşme’den
              doğan hak ve yükümlülükleri askıya alınır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              7. Sözleşmenin Bütünlüğü ve Uygulanabilirlik
            </h2>
            <p>
              İşbu sözleşme şartlarından biri, kısmen veya tamamen geçersiz hale
              gelirse, sözleşmenin geri kalanı geçerliliğini korumaya devam
              eder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              8. Sözleşmede Yapılacak Değişiklikler
            </h2>
            <p>
              Firma, dilediği zaman sitede sunulan hizmetleri ve işbu sözleşme
              şartlarını kısmen veya tamamen değiştirebilir. Değişiklikler
              sitede yayınlandığı tarihten itibaren geçerli olacaktır.
              Değişiklikleri takip etmek Kullanıcı’nın sorumluluğundadır.
              Kullanıcı, sunulan hizmetlerden yararlanmaya devam etmekle bu
              değişiklikleri de kabul etmiş sayılır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              9. Tebligat
            </h2>
            <p>
              İşbu Sözleşme ile ilgili taraflara gönderilecek olan tüm
              bildirimler, Firma’nın bilinen e.posta adresi ve kullanıcının
              üyelik formunda belirttiği e.posta adresi vasıtasıyla
              yapılacaktır. Kullanıcı, üye olurken belirttiği adresin geçerli
              tebligat adresi olduğunu, değişmesi durumunda 5 gün içinde yazılı
              olarak diğer tarafa bildireceğini, aksi halde bu adrese yapılacak
              tebligatların geçerli sayılacağını kabul eder.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              10. Delil Sözleşmesi
            </h2>
            <p>
              Taraflar arasında işbu sözleşme ile ilgili işlemler için
              çıkabilecek her türlü uyuşmazlıklarda Taraflar’ın defter, kayıt ve
              belgeleri ile ve bilgisayar kayıtları ve faks kayıtları 6100
              sayılı Hukuk Muhakemeleri Kanunu uyarınca delil olarak kabul
              edilecek olup, kullanıcı bu kayıtlara itiraz etmeyeceğini kabul
              eder.
            </p>
          </section>

          <section className="border-t pt-4 border-gray-900">
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">
              11. Uyuşmazlıkların Çözümü
            </h2>
            <p>
              İşbu Sözleşme’nin uygulanmasından veya yorumlanmasından doğacak
              her türlü uyuşmazlığın çözümünde{" "}
              <strong>
                İstanbul (Merkez) Adliyesi Mahkemeleri ve İcra Daireleri
              </strong>{" "}
              yetkilidir.
            </p>
          </section>
        </div>
      </article>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        © İŞPOOL TEKSTİL ÜRETİM PAZ. SAN. VE TİC. A.Ş. Tüm hakları saklıdır.
      </footer>
    </div>
  );
};

export default TermsOfUse;
