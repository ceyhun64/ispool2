"use client";
import React, { useState } from "react";

const FAQItem = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-5 text-left flex justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-900">{question}</span>
        <span
          className={`ml-6 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] mb-5" : "max-h-0"}`}
      >
        <div className="text-gray-600 leading-relaxed text-base">
          {children}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:py-12 bg-white">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
          Sıkça Sorulan Sorular
        </h1>
        <div className="h-1 w-20 bg-blue-600 mx-auto mt-4"></div>
      </header>

      <div className="space-y-2">
        <FAQItem question="Satın Aldığım Ürünü Hangi Koşullarda Değiştirebilir veya İade Edebilirim?">
          <p>
            ispool.com.tr' den alınmış olan ürünler kullanılmadığı, orijinal
            kutusunda ve içinde bulunan ambalajlara zarar görmediği, faturasının
            ve tüm tamamlayıcı aksesuarlarının hasarsız ve eksiksiz gönderildiği
            takdirde aynı ürünün başka bir bedeni veya rengiyle değiştirilir
            veya iade edilebilir.
          </p>
        </FAQItem>

        <FAQItem question="Değişim ve İade Süreleri Nedir?">
          <p>
            Değiştirme işlemleri müşteri ürünü teslim aldıktan sonraki 30 (otuz)
            gün içerisinde kargoya teslim etmelidir. 30 günü aşan ürünlerin
            değişimi yapılmamaktadır. İade işlemlerinde ise, müşteri ürünü
            teslim aldıktan sonra 14 (on dört) gün içerisinde kargoya teslim
            etmelidir. 14 günü aşan ürünlerin iadesi yapılmamaktadır.
          </p>
        </FAQItem>

        <FAQItem question="Ürünümü Değiştirmek veya İade Etmek için Ne Yapmalıyım?">
          <p>
            Değişim veya İadesi istenen ürün mümkünse orijinal ambalajında
            güvenli bir şekilde paketleyin ve beraberinde gönderilen Değiştirme
            / İade Formu (eksiksiz doldurup imzalanarak) ve faturası ile
            birlikte aşağıda belirtilen iade adresine gönderilmelidir. Kuzuluk
            Mah. Yazakisa Cad. No:34 54400 Akyazı / SAKARYA Tel: 0 264 437 93 28
            / 29
          </p>
        </FAQItem>

        <FAQItem question="İade koşulları nelerdir?">
          <p>
            İşPool'tan satın aldığınız ürünü, kargodan teslim aldığınız günden
            itibaren 14 gün içinde iade koşulları dahilinde kargo bedelini
            ödeyerek iade edebilirsiniz. Eğer ürün iade koşullarını
            karşılamıyorsa ürün adresinize geri gönderilebilir. Ürünlerin cayma
            hakkı dahilinde iade alınabilmesi için satın alınan ürünün orijinal
            kutusunda ve içinde bulunan ambalajlara zarar verilmemiş olması,
            faturasının ve tüm tamamlayıcı aksesuarlarının hasarsız ve eksiksiz
            gönderilmesi gerekir.
          </p>
        </FAQItem>

        <FAQItem question="Değişim ve İade İşlemlerinde Kargoyu Kim Öder?">
          <p>Değişim ve iade işlemlerinde kargo masrafı müşteriye aittir.</p>
        </FAQItem>

        <FAQItem question="Hatalı Ürünlerde Aynı Koşullar Geçerli mi?">
          <p>
            İşPool, hatalı ürünü ücretsiz değiştirmeyi ve kargo masrafını
            karşılamayı taahhüt eder. Paketi ve ambalajı zarar görmemiş ancak
            paket içerisinden hatalı çıkan ürün 14 (on dört) gün içerisinde
            "Değiştirme / İade Formu" eksiksiz doldurulup imzalanarak, faturası
            ile birlikte aşağıda belirtilen iade adresine gönderilmelidir.
          </p>
        </FAQItem>

        <FAQItem question="Firma Adına Yapılan Alışverişlerde İade Faturası Gerekli mi?">
          <p>
            Firma adına yapılan alışverişlerde ürünün iadesi veya farklı bir
            ürünle değişimi için "ürün iade faturası" gönderilmesi
            gerekmektedir. Ürün iade faturası olmayan ürünler teslim alınmaz.
            Ancak aynı ürünün farklı bedeni veya rengi için yapılan değişimlerde
            iade faturası gerekmemektedir.
            <br />
            <br />
            <span className="font-semibold text-blue-600 cursor-pointer underline">
              Ürün İade veya Değişim Talep Formunu İndirmek için tıklayınız...
            </span>
          </p>
        </FAQItem>

        <FAQItem question="Değişim ve İade Adresiniz nedir?">
          <p>
            Kuzuluk Mah. Yazakisa Cad. No:34 34700 Akyazı / SAKARYA Tel: 0 264
            437 93 28 / 29
          </p>
        </FAQItem>

        <FAQItem question="Ürünümü gönderdim. İadem ne zaman yapılır?">
          <p>
            Değiştirme / İade Formunu doldurup geri gönderdiğiniz ürün, iade
            onayı için bazı incelemelerden geçer. Talebiniz kabul olduğunda para
            iadeniz, alışverişinizde kullanmış olduğunuz hesabınızın ait olduğu
            bankaya, iadenizin onaylandığı anda otomatik olarak yapılır. İşPool
            tarafından iade işlemi bankanıza yapıldığı an, hesabınıza tanımlı
            olan e-posta adresinize işlem detaylarını gösteren bir dekont
            gönderilir. Bu dekontu içeren e-posta elinize ulaştıysa, İşPool
            tarafından bankanıza yapılan iade ödemesi tamamlanmış demektir.
            Bankanızın bu tutarı kart veya banka hesabınıza yansıtma süresi ise
            bankanızın işlem sürecine göre değişkenlik gösterir.
          </p>
        </FAQItem>

        <FAQItem question="İade başvurumun durumunu nasıl öğrenebilirim?">
          <p>
            İade talebiniz kabul veya reddedildiğinde e-posta yoluyla
            bilgilendirme yapılır.
          </p>
        </FAQItem>

        <FAQItem question="İade talebim neden reddedildi?">
          <p>
            Eğer taahhüt edilen iade koşulları yerine getirilmediği taktirde
            iade talebiniz reddedilir. Eğer tarafınıza herhangi bir ret nedeni
            belirtilmemişse ya da belirtilen iade koşullarına aykırı bir durum
            olduğunu düşünürseniz <strong>bilgi@ispool.com.tr</strong>{" "}
            adresinden bize ulaşabilirsiniz.
          </p>
        </FAQItem>

        <FAQItem question="Taksitle aldığım ürünün iadesi neden taksitle yapılıyor?">
          <p>
            Taksitlendirilmiş kredi kartı alışverişi iadelerinde, İşPool
            tarafından tutarın tamamı kredi kartınızın ait olduğu bankaya tek
            seferde ödenir. Ancak bankaların iç işleyişleri nedeniyle, bu
            tutarlar banka tarafından kartınıza sipariş sırasında seçtiğiniz ay
            kadar taksitle iade edilir. İade ödemelerinin taksitle yapılmasında
            İşPool'un herhangi bir dahiliyeti olmayıp detaylı bilgi için
            bankanızla iletişime geçmeniz gerekir.
          </p>
        </FAQItem>
      </div>

      <footer className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400 uppercase tracking-widest italic">
          İşPool Tekstil - Bilgi Merkezi
        </p>
      </footer>
    </div>
  );
};

export default FAQ;
