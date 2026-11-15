"use client";
import React, { useState } from "react";
import Link from "next/link";
import { COMPANY_EMAIL, COMPANY_PHONE } from "@/lib/company";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  formatPrice,
} from "@/lib/pricing";

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
        type="button"
        aria-expanded={isOpen}
        className="w-full py-4 text-left flex justify-between items-center gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <span
          aria-hidden
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600 leading-relaxed">{children}</div>
      )}
    </div>
  );
};

const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-10">
    <h2 className="text-lg font-semibold text-sax-800 mb-1">{title}</h2>
    {children}
  </section>
);

const FAQ = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        Sık Karşılaşılan Konular
      </h1>
      <p className="text-gray-600 mb-10">
        Alışverişle ilgili merak edilenleri konulara göre topladık.
      </p>

      <Group title="Üyelik ve hesap">
        <FAQItem question="Alışveriş için üye olmam gerekiyor mu?">
          <p>
            Ödeme sayfasına geçmek ve siparişi tamamlamak için hesabınıza giriş
            yapmış olmanız gerekir. Hesabınızın profil bölümünde adreslerinizi
            ve siparişlerinizi görüntüleyebilirsiniz.
          </p>
        </FAQItem>
        <FAQItem question="Şifremi unuttum, ne yapmalıyım?">
          <p>
            Giriş sayfasındaki şifre yenileme bağlantısını kullanarak yeni bir
            şifre belirleyebilirsiniz.{" "}
            <Link className="underline" href="/auth/forgot-password">
              Şifremi yenile
            </Link>
          </p>
        </FAQItem>
      </Group>

      <Group title="Sipariş ve ödeme">
        <FAQItem question="Hangi yöntemlerle ödeme yapabilirim?">
          <p>
            Ödemeler iyzico altyapısıyla alınır. Kartınızla tek çekim ya da
            taksitli ödeme yapabilirsiniz.
          </p>
        </FAQItem>
        <FAQItem question="Taksit seçenekleri nelerdir?">
          <p>
            Ödeme sayfasında 1, 2, 3, 6, 9 ve 12 taksit seçenekleri sunulur.
            Birden fazla taksit seçtiğinizde vade farkı ve toplam tutar ekranda
            gösterilir.
          </p>
        </FAQItem>
        <FAQItem question="İndirim kuponunu nerede kullanırım?">
          <p>
            Kupon kodunuzu ödeme sayfasındaki sepet özetinde girebilirsiniz.
            Bazı kuponlar yalnızca belirli bir tutarın üzerindeki sepetlerde
            geçerlidir.
          </p>
        </FAQItem>
        <FAQItem question="Verdiğim siparişi iptal edebilir miyim?">
          <p>
            ⚠ DOLDURULACAK: sipariş iptal süreci
          </p>
        </FAQItem>
      </Group>

      <Group title="Kargo ve teslimat">
        <FAQItem question="Kargo ücreti ne kadar?">
          <p>
            Sepet tutarı (KDV dahil) {formatPrice(FREE_SHIPPING_THRESHOLD)} ve
            üzerindeyse kargo ücretsizdir. Bu tutarın altındaki siparişlerde{" "}
            {formatPrice(SHIPPING_FEE)} kargo bedeli eklenir.
          </p>
        </FAQItem>
        <FAQItem question="Siparişimi hangi firma taşıyor?">
          <p>Gönderiler Horoz Lojistik ile yapılır.</p>
        </FAQItem>
        <FAQItem question="Kargomun nerede olduğunu nasıl görürüm?">
          <p>
            Profilinizdeki kargo takip bölümünde takip numaranızı girerek
            gönderinizin durumunu sorgulayabilirsiniz.
          </p>
        </FAQItem>
      </Group>

      <Group title="Toplu alım ve özel tasarım">
        <FAQItem question="Çok adetli sipariş vermek istiyorum.">
          <p>
            Toplu alımlar için{" "}
            <Link className="underline" href="/products/wholesale">
              toplu alım sayfasını
            </Link>{" "}
            inceleyebilir, talebinizi bize iletebilirsiniz.
          </p>
        </FAQItem>
        <FAQItem question="Ürüne logo ya da isim işletebilir miyim?">
          <p>
            Evet, endüstriyel nakış ve baskı seçeneklerimiz var. Yöntemlerin
            karşılaştırması için{" "}
            <Link className="underline" href="/help/printing">
              baskı ve nakış sayfasına
            </Link>{" "}
            bakabilirsiniz.
          </p>
        </FAQItem>
        <FAQItem question="Kendi tasarımımla ürün yaptırabilir miyim?">
          <p>
            Özel tasarım talepleri için{" "}
            <Link className="underline" href="/products/special_production">
              özel tasarım sayfasını
            </Link>{" "}
            kullanabilirsiniz.
          </p>
        </FAQItem>
      </Group>

      <Group title="İade ve değişim">
        <FAQItem question="Aldığım üründen vazgeçersem ne olur?">
          <p>
            İade ve değişim koşulları ayrı bir sayfada anlatılmıştır.{" "}
            <Link className="underline" href="/help/returns-help">
              İade ve değişim sayfası
            </Link>
          </p>
        </FAQItem>
      </Group>

      <section className="mt-12 rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-sax-800 mb-2">
          Aradığınızı bulamadınız mı?
        </h2>
        <ul className="space-y-1 text-gray-800">
          <li>
            E-posta:{" "}
            <a className="underline" href={`mailto:${COMPANY_EMAIL}`}>
              {COMPANY_EMAIL}
            </a>
          </li>
          <li>
            Telefon:{" "}
            <a
              className="underline"
              href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}
            >
              {COMPANY_PHONE}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default FAQ;
