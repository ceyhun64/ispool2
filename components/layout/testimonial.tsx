"use client";
import React from "react";
import { Star, ShieldCheck, Zap, Activity } from "lucide-react";

interface Testimonial {
  name: string;
  company: string;
  message: string;
  avatarLetter: string;
  rating: number;
  tag: string;
}

const workwearTestimonials: Testimonial[] = [
  {
    name: "Murat T.",
    company: "İnşaat Şantiye Şefi",
    message:
      "Yüksek görünürlüklü montlar, gece vardiyasında bile personelin fark edilmesini sağlıyor. Dikiş mukavemeti beklediğimizin çok üzerinde.",
    avatarLetter: "M",
    rating: 5,
    tag: "Dayanıklılık",
  },
  {
    name: "Selin G.",
    company: "Lojistik Müdürü",
    message:
      "S3 sınıfı iş botları hem çok hafif hem de darbe emiciliği harika. Personel yorgunluğu gözle görülür derecede azaldı.",
    avatarLetter: "S",
    rating: 5,
    tag: "Ergonomi",
  },
  {
    name: "Kerem A.",
    company: "İş Güvenliği Uzmanı",
    message:
      "Solunum koruma setleri en zorlu kimyasal ortamlarda bile sızdırmazlık testlerinden başarıyla geçti. Teknik destek ekibi de çok ilgili.",
    avatarLetter: "K",
    rating: 5,
    tag: "Tam Koruma",
  },
  {
    name: "Hakan B.",
    company: "Tekstil Fabrikası Sahibi",
    message:
      "Kurumsal logolu iş elbiselerimiz 50 yıkama sonra bile formunu ve rengini korudu. Kurumsal kimliğimizi çok iyi yansıtıyor.",
    avatarLetter: "H",
    rating: 5,
    tag: "Kurumsal Kalite",
  },
];
const Testimonials: React.FC = () => {
  return (
    <div className="py-20 md:py-24 bg-slate-50 relative overflow-hidden font-sans">
      {/* İnce Üst Çizgi */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-100" />

      {/* Header - Boyutlar Optimize Edildi */}
      <div className="max-w-[1400px] mx-auto px-6 mb-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-[1.5px] bg-orange-600" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-orange-600 uppercase">
                Saha Referansları
              </span>
            </div>
            <h3 className="text-2xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight uppercase">
              PROFESYONELLERİN <br />
              <span className="text-slate-400">GÜVEN REHBERİ</span>
            </h3>
          </div>

          {/* Küçük İstatistikler */}
          <div className="flex items-center gap-8 border-l border-slate-100 pl-8 hidden md:flex">
            <div>
              <p className="text-xl font-bold text-slate-900">500+</p>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                Kurumsal Müşteri
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">10k+</p>
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                Teslimat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Alanı */}
      <div className="relative flex overflow-hidden group py-6 ">
        <div className="flex animate-marquee gap-6 whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              {workwearTestimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="w-[300px] md:w-[380px] flex-shrink-0 bg-white p-8 shadow-sm border border-slate-200 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:border-orange-500/20 group/card"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className="fill-orange-500 text-orange-500"
                          />
                        ))}
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded tracking-wider uppercase">
                        {t.tag}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[13px] md:text-[14px] leading-relaxed font-normal whitespace-normal italic">
                      "{t.message}"
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-50">
                    <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center text-[14px] font-bold">
                      {t.avatarLetter}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-900 tracking-tight uppercase">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-orange-600 font-semibold mt-0.5">
                        {t.company}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sertifika Barı - Daha Zarif */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-8 px-6 opacity-50">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-slate-900" />
          <span className="text-[9px] font-bold tracking-widest text-slate-900 uppercase">
            CE Sertifikalı
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-slate-900" />
          <span className="text-[9px] font-bold tracking-widest text-slate-900 uppercase">
            Antistatik
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-slate-900" />
          <span className="text-[9px] font-bold tracking-widest text-slate-900 uppercase">
            ISO 9001
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
