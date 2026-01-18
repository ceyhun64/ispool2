import React from "react";

const QualityPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 p-8 md:p-16 bg-white shadow-xl border border-gray-100 rounded-xl font-sans text-gray-800">
      {/* BAŞLIK VE GİRİŞ */}
      <header className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-6 tracking-tight uppercase">
          Kalite Politikamız
        </h1>
        <p className="text-lg leading-relaxed text-gray-700 italic">
          İŞPOOL A.Ş. olarak kalite politikamız; sahip olduğumuz yüksek bilgi
          birikimi, üretim tecrübesi, deneyimli ve nitelikli iş gücümüz,
          kullandığımız güncel teknoloji ile sektörün öncü firması olarak örnek
          ve rekabetçi yapımızın sürekliliğini sağlayan aşağıdaki unsurlardan
          oluşmaktadır:
        </p>
      </header>

      {/* POLİTİKA MADDELERİ */}
      <section className="mb-16">
        <ul className="space-y-6">
          {[
            "Tüm faaliyet alanlarımızda, Kalite Yönetim Sistemimizin gereklerini tam olarak gerçekleştirmek ve etkinliğinin sürekli iyileşmesini sağlamak,",
            "Müşterilerimizin talep ve beklentilerini karşılayacak nitelikte kaliteli ürünler üretmek, satış öncesi ve sonrası destek sağlayarak müşteri memnuniyetini arttırmak,",
            "Ürünlerimizin, müşteri taleplerine, ulusal ve uluslararası standartlara ve yasal mevzuata uygunluğunu sağlamak ve sürekliliğini temin etmek,",
            "Çalışanlarımızın iş sağlığı ve güvenliğini ön planda tutarak, mesleki ve sosyal gelişimine destek vermek, kalite bilincini geliştirmek,",
            "Faaliyetlerimizi sürdürürken, çevreyi ve doğal kaynakları korumak,",
            "Başarılarımızın sürdürülebilir olmasını, daha yüksek seviyelere taşınmasını hedeflemek ve marka bilincimizin geliştirilmesini çalışanlarımızın ortak ve asli hedefleri içinde görmesini sağlamak.",
          ].map((item, index) => (
            <li key={index} className="flex items-start group">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 text-white text-sm font-bold mr-4 group-hover:bg-blue-700 transition-colors">
                {index + 1}
              </span>
              <p className="pt-1 text-gray-700 font-medium">{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* VİZYON VE MİSYON ALANI */}
      <div className="grid md:grid-cols-2 gap-8 border-t-2 border-gray-100 pt-12">
        {/* VİZYON */}
        <div className="bg-blue-50 p-8 rounded-2xl border-b-4 border-blue-900">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-black text-blue-900 uppercase tracking-wider">
              Vizyon
            </h2>
          </div>
          <p className="text-gray-800 leading-relaxed font-semibold">
            Kalitesi ve tasarımlarıyla Dünya çalışanlarını giydiren lider marka
            olmak.
          </p>
        </div>

        {/* MİSYON */}
        <div className="bg-gray-50 p-8 rounded-2xl border-b-4 border-gray-400">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wider">
              Misyon
            </h2>
          </div>
          <p className="text-gray-800 leading-relaxed font-medium">
            Her zaman daha iyiyi hedefleyerek, sektörde kaliteyi arttıran,
            çalışanlarına işlerini sevdiren, müşterilerinin güven duyduğu,
            ürünleriyle sağlıklı ve güvenli çalışma ortamlarına katkıda bulunan
            örnek bir kuruluş olmaktır.
          </p>
        </div>
      </div>

      {/* ALT BİLGİ */}
      <footer className="mt-12 text-center">
        <div className="inline-block px-6 py-2 bg-blue-900 text-white rounded-full text-xs font-bold uppercase tracking-widest">
          İşPool A.Ş. Kalite Standartları
        </div>
      </footer>
    </div>
  );
};

export default QualityPolicy;
