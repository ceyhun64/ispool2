"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Kategori verilerinin tipini tanımlayalım
interface CategoryData {
  id: number;
  name: string;
  desc: string;
  image: string;
  href: string;
}

const initialCategories: CategoryData[] = [
  {
    id: 1,
    name: "İş Elbiseleri",
    desc: "Konforlu ve kurumsal iş kıyafetleri",
    image: "/categories/10.jpg",
    href: "/products/category/1",
  },
  {
    id: 2,
    name: "İş Ayakkabıları ve Ayak Koruma",
    desc: "S3 standartlarında güvenli adımlar",
    image: "/categories/2.jpg",
    href: "/products/category/2",
  },
  {
    id: 3,
    name: "İş Eldivenleri",
    desc: "Kesilmeye dirençli profesyonel eldivenler",
    image: "/categories/3.jpg",
    href: "/products/category/3",
  },
  {
    id: 5,
    name: "Koruyucu Teknik Kıyafet",
    desc: "Alev almaz ve antistatik koruma",
    image: "/categories/4.webp",
    href: "/products/category/4",
  },
  {
    id: 2,
    name: "İş Güvenlik Ekipmanları",
    desc: "Yüksekte çalışma ve emniyet setleri",
    image: "/categories/50.jpg",
    href: "/products/category/5",
  },
  {
    id: 4,
    name: "Outdoor",
    desc: "Zorlu hava koşullarına dayanıklı ürünler",
    image: "/categories/6.webp",
    href: "/products/category/6",
  },
  {
    id: 7,
    name: "En Yeniler",
    desc: "İSG dünyasındaki son inovasyonlar",
    image: "/categories/7.png",
    href: "/products/",
  },
  {
    id: 8,
    name: "Özel Üretim",
    desc: "Firmanıza özel logo ve tasarım çözümleri",
    image: "/categories/9.jpg",
    href: "/products/special_production",
  },
  {
    id: 9,
    name: "Toplu Satış",
    desc: "Kurumsal ihtiyaçlara avantajlı çözümler",
    image: "/categories/8.jpg",
    href: "/products/wholesale",
  },
  {
    id: 10,
    name: "İndirim",
    desc: "Seçili ürünlerde kaçırılmayacak fırsatlar",
    image: "/categories/10.png",
    href: "/products/discounts",
  },
];

const CategoryCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-slate-100">
    <div className="relative w-full aspect-[5/4]">
      <Skeleton className="w-full h-full" />
    </div>
  </div>
);

export default function CategoriesSection() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategories(initialCategories);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
        setCategories(initialCategories);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const SKELETON_COUNT = 10;
  const skeletons = Array.from({ length: SKELETON_COUNT }).map((_, index) => (
    <CategoryCardSkeleton key={index} />
  ));

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-16 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {skeletons.slice(0, 3)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {skeletons.slice(3, 7)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {skeletons.slice(7, 10)}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fcfcfd] py-20 px-4 md:px-12">
      <div className="container mx-auto max-w-8xl">
        <div className="text-center mb-16 space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-800 font-bold tracking-[0.2em] text-xs uppercase"
          >
            Endüstriyel Güvenlikte Zirve
          </motion.span>

          <h2 className="text-2xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-[1.1] uppercase">
            İş Güvenliğinde{" "}
            <span className="text-slate-500 font-light italic">
              Profesyonel
            </span>{" "}
            Çözümler
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed"
          >
            En zorlu çalışma şartlarına dayanıklı, yüksek standartlı ekipmanlar
            ile iş güvenliğini sanata dönüştürüyoruz.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-24 bg-gradient-to-r from-amber-500 to-amber-700 mx-auto mt-6 rounded-full"
          ></motion.div>
        </div>

        <div className="space-y-8">
          {/* Satır 1 — 3 Kart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((c) => (
              <PremiumCategoryCard key={c.id} category={c} />
            ))}
          </div>

          {/* Satır 2 — 3 Kart (Mevcut mantığa göre slice 3-6) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.slice(3, 6).map((c) => (
              <PremiumCategoryCard key={c.id} category={c} />
            ))}
          </div>

          {/* Satır 3 — 4 Kart (Mevcut mantığa göre slice 6-10) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {categories.slice(6, 10).map((c) => (
              <PremiumCategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumCategoryCard({ category }: { category: CategoryData }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group"
    >
      <Link href={category.href} className="block">
        <Card className="relative aspect-[5/4] sm:aspect-[4/5] md:aspect-[5/4] overflow-hidden rounded-xl border-none shadow-2xl bg-slate-900">
          <CardContent className="p-0 h-full w-full relative">
            {/* Image Wrapper */}
            <div className="absolute inset-0 z-0">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="h-full w-full"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
              </motion.div>
            </div>

            {/* Premium Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent transition-opacity duration-500"></div>

            {/* Content Container */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8">
              <div className="space-y-2">
                <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight leading-tight group-hover:text-amber-400 transition-colors duration-300">
                  {category.name}
                </h3>
                <div className="h-0.5 w-0 group-hover:w-12 bg-amber-500 transition-all duration-500 ease-in-out"></div>
                <p className="text-slate-300 text-xs sm:text-sm font-light opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {category.desc}
                </p>
              </div>
            </div>

            {/* Subtle Border Glow */}
            <div className="absolute inset-0 border border-white/10 rounded-2xl z-30 pointer-events-none group-hover:border-amber-500/50 transition-colors duration-500"></div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
