import React from "react";
import Image from "next/image";

const BrandPartners = () => {
  // Yalnızca katalogda ürünü bulunan markalar. Açıklamalar bilerek nötr
  // tutuldu: resmi bayilik/yetkili satıcılık iddiası içermez.
  const brands = [
    {
      id: 1,
      name: "PORTWEST",
      image: "/brands/4.png",
      description:
        "Ürün yelpazemizde Portwest markasının iş elbiseleri yer almaktadır.",
    },
    {
      id: 2,
      name: "3M",
      image: "/brands/1.png",
      description:
        "Ürün yelpazemizde 3M markasının kişisel koruyucu ekipmanları yer almaktadır.",
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
        "Ürün yelpazemizde YDS markasının iş ayakkabısı ve bot ürünleri yer almaktadır.",
    },
    {
      id: 4,
      name: "CERVA",
      image: "/brands/3.png",
      description:
        "Ürün yelpazemizde Cerva markasının iş giyimi ürünleri yer almaktadır.",
    },
    {
      id: 5,
      name: "MAPA",
      image: "/brands/5.png",
      description:
        "Ürün yelpazemizde Mapa markasının koruyucu eldivenleri yer almaktadır.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 border-b pb-4 uppercase tracking-wider">
        Ürün Yelpazemizdeki Markalar
      </h2>

      <p className="text-center text-xs text-gray-500 -mt-8 mb-10">
        Marka adları ve logoları ilgili sahiplerinin tescilli markalarıdır.
      </p>

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
