import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    title: "Toplu Alım",
    desc: "Seçili ürünlerde belirlenen adet ve üzeri alımlarda toplu alım indirimi uygulanır. Kurumsal siparişler için teklif formunu doldurabilirsiniz.",
    href: "/products/wholesale",
  },
  {
    title: "Özel Tasarım",
    desc: "Markanızın DNA'sını kumaşa işliyor, tamamen size özel teknik çözümler üretiyoruz.",
    href: "/products/special_production",
  },
];

export default function CorporateCards() {
  return (
    <section className="bg-slate-100 py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((card, i) => (
            <article
              key={card.href}
              className="group relative overflow-hidden rounded-xl bg-sax-950 border border-white/10 shadow-2xl p-8 sm:p-10 md:p-14 flex flex-col gap-6 transition-colors duration-300 hover:border-orange-500/50"
            >
              {/* Köşe detayı (designPaths ana kartıyla aynı) */}
              <div
                className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-orange-500"
                aria-hidden="true"
              />

              <span
                className="text-orange-400 font-mono text-[10px] font-black tracking-widest"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-[0.95] text-white">
                {card.title}
              </h2>

              <p className="text-sax-100/80 text-sm md:text-base leading-relaxed max-w-xl">
                {card.desc}
              </p>

              <Link
                href={card.href}
                aria-label={`${card.title} sayfasına git`}
                className="mt-auto self-start flex items-center gap-3 min-h-11 px-6 py-3 bg-orange-700 hover:bg-orange-600 text-white rounded transition-all duration-300 text-[11px] md:text-xs font-black tracking-[0.2em] uppercase group/cta"
              >
                İncele
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover/cta:translate-x-1"
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
