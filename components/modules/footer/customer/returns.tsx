import React from "react";
import { COMPANY_EMAIL, COMPANY_PHONE } from "@/lib/company";

const Todo = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium text-amber-700">⚠ DOLDURULACAK: {children}</span>
);

const Returns = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800 leading-relaxed">
      {/* TODO-HUKUK: avukat onayı bekliyor */}
      <h1 className="text-3xl font-bold text-sax-800 mb-2">
        İade ve Değişim
      </h1>
      <p className="text-gray-600 mb-10">
        Siparişinizden vazgeçmek ya da ürünü değiştirmek istediğinizde
        izlemeniz gereken adımları ve bu konudaki haklarınızı burada
        bulabilirsiniz.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Yasal cayma hakkı
        </h2>
        <p>
          Mesafeli Sözleşmeler Yönetmeliği uyarınca, internetten yapılan
          alışverişlerde tüketici, ürünü teslim aldığı tarihten itibaren 14 gün
          içinde herhangi bir gerekçe göstermeden ve cezai şart ödemeden
          sözleşmeden cayabilir. Cayma bildirimini aşağıdaki iletişim
          bilgilerinden yapabilirsiniz.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          İade süreci
        </h2>
        <p className="mb-2">
          İade süresi (yasal 14 günün üzerinde ek bir süre tanınıyorsa):{" "}
          <Todo>İşPool'un tanıdığı iade süresi ve süre başlangıcı</Todo>
        </p>
        <p className="mb-2">
          İade edilecek ürünün durumuna ilişkin koşullar:{" "}
          <Todo>
            iade kabul şartları (kullanılmamış olma, etiket, ambalaj, fatura
            vb.)
          </Todo>
        </p>
        <p>
          İade adresi: <Todo>iade adresi</Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Değişim
        </h2>
        <p>
          Değişim süresi ve kuralları:{" "}
          <Todo>değişim süresi, beden/renk değişim koşulları, fiyat farkı</Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Kargo masrafı
        </h2>
        <p>
          İade ve değişim gönderilerinde kargo ücretini kimin karşıladığı:{" "}
          <Todo>
            kargo masrafı sorumlusu (cayma, değişim ve hatalı ürün için ayrı
            ayrı)
          </Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Hatalı veya ayıplı ürün
        </h2>
        <p>
          Ürün size ayıplı ya da sipariş ettiğinizden farklı ulaştıysa,
          Tüketicinin Korunması Hakkında Kanun kapsamındaki seçimlik haklarınız
          saklıdır. Süreçte izlenecek adımlar:{" "}
          <Todo>
            ayıplı ürün bildirim yöntemi, istenen belgeler/fotoğraflar ve
            işlem süresi
          </Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Fatura kesilen kurumsal siparişler
        </h2>
        <p>
          Şirket adına fatura düzenlenmiş siparişlerde iade usulü:{" "}
          <Todo>
            kurumsal faturalı siparişlerde iade faturası/iade usulü
          </Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Kişiye özel baskılı ürünler
        </h2>
        <p>
          Kendi tasarımınızı yüklediğiniz ya da isteğinize göre hazırlanan
          ürünlerde cayma hakkının geçerli olup olmadığı mevzuattaki istisnalara
          göre değerlendirilir.{" "}
          <Todo>
            kişiye özel/baskılı ürünlerde iade durumu (avukat tarafından
            netleştirilecek)
          </Todo>
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-sax-800 mb-2">
          Ödemenin geri yapılması
        </h2>
        <p>
          İade bedelinin geri ödenme yöntemi ve süresi:{" "}
          <Todo>geri ödeme yöntemi ve süresi</Todo>
        </p>
      </section>

      <section className="rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-sax-800 mb-2">
          Bize ulaşın
        </h2>
        <ul className="space-y-1">
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

export default Returns;
