import { ShieldCheck, Truck, CreditCard } from "lucide-react";

const ITEMS = [
  { Icon: ShieldCheck, text: "iyzico ile güvenli ödeme" },
  { Icon: Truck, text: "Horoz Lojistik ile Kargo" },
  { Icon: CreditCard, text: "12 Taksit Seçeneği" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Ödeme ve kargo bilgileri"
      className="bg-sax-900 border-y border-white/10"
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
        <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sax-800">
          {ITEMS.map(({ Icon, text }) => (
            <li
              key={text}
              className="flex items-center justify-center gap-3 py-5 px-4"
            >
              <Icon
                className="text-orange-500 shrink-0"
                size={22}
                aria-hidden="true"
              />
              <span className="text-[12px] md:text-[13px] font-semibold tracking-wider uppercase text-white">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
