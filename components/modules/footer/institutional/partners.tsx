import React from "react";
import Image from "next/image";

const BrandPartners = () => {
  const brands = [
    {
      id: 1,
      name: "PORTWEST",
      image: "/brands/4.png",
      description:
        "İŞMONT’un Türkiye Satış Bayisi olduğu Portwest; deneyim ve kalitesini, marka değeri ve hizmet mirasıyla birleştiren, uluslararası kalite standartlarını karşılayan iş elbiseleri üretmektedir. Portwest, konforlu, kaliteli, modern iş elbiseleri tasarımı ve üretiminde dünya lideri markalardan biridir.",
    },
    {
      id: 2,
      name: "3M",
      image: "/brands/1.png",
      description:
        "Dünyanın lider güvenlik ve koruyucu ekipman sağlayıcılarından 3M artık İŞPOOL'ta!",
      list: [
        "Solunum koruyucular",
        "Göz koruyucular",
        "İşitme koruyucular",
        "Baş koruyucular",
      ],
    },
    {
      id: 3,
      name: "YDS",
      image: "/brands/2.png",
      description:
        "Yakupoğlu, askeri ve iş güvenliği alanda, deri, ayakkabı-bot ürünlerini NATO standartlarında üreten ve bunları TSK'nin yanında Avrupa, Orta Doğu, Körfez ve UNICEF gibi uluslararası kuruluşlara satan ve en son teknoloji, malzeme ve laboratuvar imkanlarına sahip olan tek Türk firmasıdır.",
    },
    {
      id: 4,
      name: "CERVA",
      image: "/brands/3.png",
      description:
        "1991 yılından beri iş giyimi ve güvenliği alanında hizmet veren Cerva’nın ürünleri artık İşmont’ta! Birkaç yüz metreden itibaren görülebilir üstün konforlu Cerva ürünlerini en ekonomik fiyatlarla sitemizde ve mağazalarımızda bulabilirsiniz.",
    },
    {
      id: 5,
      name: "MAPA",
      image: "/brands/5.png",
      description:
        "1957 yılında kurulan MAPA, ilk pamuk havı emdirilmiş eldiven imalatı yapmıştır. Aynı yenilikçi vizyonla çalışmalarına devam eden MAPA, son kullanıcıların ihtiyaçlarını karşılayan yüksek teknolojili kaliteli koruyucu eldivenlerini dağıtımı etkinliği ile birleştirerek tüm Dünya’ya satış yapmaktadır.",
    },
    {
      id: 6,
      name: "THERMOFORM",
      image: "/brands/12.png",
      description:
        "Thermoform® ürünlerinde doğal veya teknik iplik/kumaş kullanılır. Vücuttaki teri/nemi emen, nefes alabilir, doğal özelliklerde fonksiyonel ürünler üreten önde gelen termal giyim üreticilerindendir.",
    },
    {
      id: 7,
      name: "DUPONT - NOMEX / PARTNER",
      image: "/brands/6.png",
      description:
        "Ismontpro markamızın alev almaz ürünler kategorisinde DUPONT™ firmasının benzersiz ısı ve alev direncine sahip Nomex® kumaşını kullanıyoruz. Nomex®, kullanıcılarını tehlikelerden üstün bir bariyer sağlayarak koruyan, erimeyen, damlamayan veya yanmayı desteklemeyen ısıya ve aleve dayanıklı bir elyaftır.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 border-b pb-4 uppercase tracking-wider">
        Marka Ortaklarımız
      </h2>

      <div className="flex flex-col gap-10">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex flex-col md:flex-row items-center md:items-start bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 gap-8"
          >
            {/* Marka Logo Alanı */}
            <div className="flex-shrink-0 w-48 h-24 relative flex items-center justify-center bg-gray-50 rounded-lg p-4">
              <img
                src={brand.image}
                alt={`${brand.name} Logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Marka Açıklama Alanı */}
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-blue-900 mb-3 uppercase tracking-tight">
                {brand.name}
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                {brand.description}
              </p>

              {/* 3M için özel liste yapısı */}
              {brand.list && (
                <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {brand.list.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-gray-600 text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandPartners;
