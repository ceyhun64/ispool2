import React from "react";
import Link from "next/link";
import { COMPANY_NAME } from "@/lib/company";

const brands = [
  {
    name: "İş Pool",
    note: "⚠ DOLDURULACAK: İş Pool markasının hangi ürün gruplarını kapsadığı",
  },
  {
    name: "Bmes",
    note: "⚠ DOLDURULACAK: Bmes markasının hangi ürün gruplarını kapsadığı",
  },
  {
    name: "Pars",
    note: "⚠ DOLDURULACAK: Pars markasının hangi ürün gruplarını kapsadığı",
  },
];

const Brands = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Markalarımız</h1>
      <p className="text-gray-600 mb-10">
        {COMPANY_NAME} mağazasında satılan ürünler aşağıdaki markalar altında
        sunulur.
      </p>

      <ul className="space-y-6 mb-12">
        {brands.map((b) => (
          <li key={b.name} className="border-l-4 border-blue-900 pl-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {b.name}
            </h2>
            <p className="text-gray-700">{b.note}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Toplu alım ve özel tasarım
        </h2>
        <p className="text-gray-700">
          Çok adetli alımlar ve firmaya özel tasarım talepleri için{" "}
          <Link className="underline" href="/products/wholesale">
            toplu alım
          </Link>{" "}
          ve{" "}
          <Link className="underline" href="/products/special_production">
            özel tasarım
          </Link>{" "}
          sayfalarına bakabilirsiniz.
        </p>
      </section>
    </div>
  );
};

export default Brands;
