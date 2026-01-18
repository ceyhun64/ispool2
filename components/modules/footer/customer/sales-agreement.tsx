import React from "react";

const SalesAgreement = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-white text-gray-800 leading-relaxed border shadow-sm my-10">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase border-b pb-4">
        Mesafeli Satış Sözleşmesi
      </h1>

      <section className="mb-8 italic text-sm text-gray-600">
        <p>
          İşbu sözleşme,{" "}
          <a
            href="https://www.ispool.com.tr"
            className="text-blue-600 underline"
          >
            www.ispool.com.tr
          </a>{" "}
          adlı web sitesinden gerçekleştirilen alışverişlerin hukuki statüsünü,
          tarafların hak ve yükümlülüklerini düzenlemektedir. Buna göre,{" "}
          <strong>SATICI</strong> İşPool Tekstil Üretim Paz. San. Tic. A.Ş.,{" "}
          <strong>ALICI</strong> ise işbu siteye üye olup alışveriş yapma
          iradesini ortaya koyan ve alışveriş yapmak için işbu sözleşmeyi
          onaylayan kişi-kuruluştur.
        </p>
      </section>

      {/* Madde 1 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3">
          MADDE 1 – TARAFLAR
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2 italic underline">1.1 ALICI</h3>
            <p className="text-sm">
              İş bu siteye üye olup alışveriş yapma iradesini ortaya koyan ve
              alışveriş yapmak için işbu sözleşmeyi onaylayan kişi-kuruluştur.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2 italic underline">1.2 SATICI</h3>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Ünvan:</strong> İşPool Tekstil Üretim Paz. San. Tic.
                A.Ş.
              </li>
              <li>
                <strong>Adres:</strong> Küçük Çamlıca Mah. Adil Bey Sk. No:4
                Üsküdar/ İstanbul
              </li>
              <li>
                <strong>E-Posta:</strong> bilgi@ispool.com.tr
              </li>
              <li>
                <strong>Telefon:</strong> 0216 472 73 00
              </li>
              <li>
                <strong>Fax:</strong> 0216 472 73 11-12
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Madde 2 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3">
          MADDE 2 - KONU
        </h2>
        <p className="text-sm">
          İş bu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.ispool.com.tr
          alan adlı internet sitesinden elektronik ortamda siparişini yaptığı
          aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve
          teslimi ile ilgili olarak 4077 sayılı Tüketicilerin Korunması
          Hakkındaki Kanun ve Mesafeli Sözleşmeleri Uygulama Esas ve Usulleri
          Hakkında Yönetmelik hükümleri gereğince tarafların hak ve
          yükümlülüklerinin saptanmasıdır.
        </p>
      </section>

      {/* Madde 3 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3">
          MADDE 3 - GENEL HÜKÜMLER
        </h2>
        <div className="space-y-3 text-sm">
          {[
            "ALICI, SATICI 'ya ait www.ispool.com.tr alan adlı internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu beyan eder.",
            "ALICI; bu sözleşmeyi elektronik ortamda teyit etmekle, Satıcı tarafından tüketiciye verilmesi gereken adres, ürün temel özellikleri ve vergiler dahil fiyat bilgilerini doğru edindiğini teyit eder.",
            "Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile ALICI'nın yerleşim yerinin uzaklığına bağlı olarak kargo şirketi aracılığıyla teslim edilir.",
            "SATICI kendi ürettiği ve/veya dışarıdan satın aldığı bilgi, belge, yazılım, tasarım, grafik vb. eserlerin mülkiyet ve telif haklarına sahiptir.",
            "SATICI sanal mağazadaki satışları kendi stokları ile sınırlıdır. Stokta bulunmayan ürünler için siparişi iptal edip ücret iadesi yapabilir.",
            "SATICI sanal mağazasında satışa sunulan ürünlerin fiyat ve özellik bilgilerini değiştirme hakkını saklı tutar.",
            "Hata oluştuğu takdirde SATICI hatayı düzelterek teslimat yapabilir veya siparişi iptal edebilir.",
            "Teslimat esnasında kimlik ibrazı zorunludur. Kimlik ibraz edilmediği takdirde teslimat yapılmayacaktır.",
            "Kargo firmasının teslimat aşamasında karşılaşacağı sorunlardan SATICI sorumlu tutulamaz.",
            "SATICI, ürünün sağlam, eksiksiz, garanti belgesi ve kullanım kılavuzu ile teslim edilmesinden sorumludur.",
            "Mücbir sebepler (yangın, deprem vb.) durumunda SATICI durumu ALICI'ya bildirmekle yükümlüdür.",
            "Kredi kartı iadelerinde banka süreçleri nedeniyle yansıma süresi 2-3 haftayı bulabilir, SATICI bu gecikmeden sorumlu tutulamaz.",
          ].map((item, index) => (
            <p key={index}>
              <span className="font-bold">3.{index + 1}</span> {item}
            </p>
          ))}
        </div>
      </section>

      {/* Madde 4 & 5 */}
      <div className="grid md:grid-cols-2 gap-8 mb-6">
        <section>
          <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3 uppercase text-red-700">
            MADDE 4 - Cayma Hakkı
          </h2>
          <p className="text-sm">
            ALICI, teslimattan itibaren <strong>14 gün</strong> içinde cayma
            hakkına sahiptir. İade formu doldurulmalı, ürünün orijinalliği ve
            tekrar satılabilirliği bozulmamış olmalıdır. Kargo bedeli ALICI
            tarafından karşılanır. İadeler <strong>UPS Kargo</strong> ile
            yapılmalıdır.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3 uppercase text-red-700">
            MADDE 5 - Kapsam Dışı
          </h2>
          <p className="text-sm">
            Kişiye özel üretilen, üzerinde değişiklik yapılan veya niteliği
            itibariyle hızla bozulma ihtimali olan ürünlerde cayma hakkı
            kullanılamaz.
          </p>
        </section>
      </div>

      {/* Madde 6 & 7 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3">
          MADDE 6 - BORÇLUNUN TEMERRÜDÜ
        </h2>
        <p className="text-sm mb-4">
          ALICI'nın temerrüde düşmesi halinde, borcun gecikmeli ifasından doğan
          zararı ödemeyi kabul eder. Temerrüt halinde TCMB gecelik borç alma
          faiz oranı uygulanacaktır.
        </p>
        <h2 className="text-lg font-bold border-l-4 border-black pl-3 mb-3">
          MADDE 7 - YETKİLİ MAHKEME
        </h2>
        <p className="text-sm italic">
          Uyuşmazlıklarda Tüketici Hakem Heyetleri ve SATICI'nın yerleşim
          yerindeki Tüketici Mahkemeleri yetkilidir. Ayrıca Kadıköy Mahkemeleri
          ve İcra Müdürlükleri yetkili kılınmıştır.
        </p>
      </section>

      <footer className="mt-10 pt-6 border-t text-center text-xs text-gray-500 uppercase">
        Siparişin onaylanması durumunda ALICI işbu sözleşmenin tüm koşullarını
        kabul etmiş sayılacaktır.
      </footer>
    </div>
  );
};

export default SalesAgreement;
