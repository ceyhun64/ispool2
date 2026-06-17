"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, ShieldCheck, HardHat, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  createdAt: string;
}

const BlogCardSkeleton = memo(() => (
  <div className="space-y-8 grayscale opacity-50">
    <div className="aspect-4/5 w-full bg-slate-200 animate-pulse" />
    <div className="space-y-4">
      <div className="h-2 w-20 bg-slate-200 animate-pulse" />
      <div className="h-8 w-full bg-slate-200 animate-pulse" />
      <div className="h-4 w-2/3 bg-slate-200 animate-pulse" />
    </div>
  </div>
));

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        const mockData =
          data.blogs?.length > 0
            ? data.blogs
            : [
                {
                  id: 1,
                  title: "Performans Odaklı Endüstriyel Tekstil",
                  category: "Teknoloji",
                  excerpt:
                    "Zorlu saha koşullarında nefes alabilirlik ve dayanıklılığı birleştiren yeni nesil kumaş teknolojileri.",
                  image:
                    "/products/1.jpg",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: 2,
                  title: "İş Güvenliğinde Estetik ve Ergonomi",
                  category: "Tasarım",
                  excerpt:
                    "Koruyucu ekipmanların çalışan motivasyonu ve marka prestiji üzerindeki görünmez etkisi.",
                  image:
                    "/products/2.jpg",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: 3,
                  title: "2026 İş Kıyafeti Regülasyonları",
                  category: "Rehber",
                  excerpt:
                    "Yeni Avrupa standartlarına uyum sürecinde şirketlerin dikkat etmesi gereken kritik detaylar.",
                  image:
                    "/products/3.jpg",
                  createdAt: new Date().toISOString(),
                },
              ];
        setBlogs(mockData);
      } catch (err) {
        toast.error("İçerikler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-orange-100/30">
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Premium Header - Industrial Chic */}
        <header className="mb-32 relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center gap-8 mb-8 text-slate-300"
          >
            <ShieldCheck strokeWidth={1} size={32} />
            <div className="w-px h-8 bg-slate-200 self-center" />
            <Briefcase strokeWidth={1} size={32} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] tracking-[0.5em] uppercase text-orange-600 font-bold"
          >
            Profesyonel Standartlar
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-5xl md:text-7xl font-sans font-bold tracking-tighter text-slate-950 uppercase italic"
          >
            İşPool{" "}
            <span className="font-light not-italic text-slate-400">
              Blog
            </span>
          </motion.h1>

          <p className="mt-6 text-slate-500 max-w-lg mx-auto font-light text-lg">
            Sektörel güvenlik analizleri ve yüksek performanslı iş kıyafetleri
            dünyasına derin bir bakış.
          </p>
        </header>

        {/* Blog Grid - Sharp & Edgy */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-32">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.1,
                  }}
                  className="group relative"
                >
                  <Link
                    href={`/institutional/blog/${blog.id}`}
                    className="block"
                  >
                    {/* Image: Narrower and Taller for a 'Fashion' Feel */}
                    <div className="relative aspect-5/3 overflow-hidden bg-slate-900 border border-slate-100">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 opacity-90 group-hover:opacity-100 grayscale-30 group-hover:grayscale-0"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1">
                        <span className="text-[10px] tracking-widest font-black uppercase italic">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div className="mt-8 space-y-4">
                      <h2 className="text-2xl font-bold leading-tight tracking-tight uppercase group-hover:text-orange-600 transition-colors duration-500">
                        {blog.title}
                      </h2>
                      <div className="w-12 h-1 bg-orange-600 transform origin-left transition-all duration-500 group-hover:w-full" />
                      <p className="text-[15px] text-slate-500 font-normal leading-relaxed">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] border-b border-transparent group-hover:border-slate-200 w-fit pb-1 transition-all">
                        Raporu Oku{" "}
                        <ArrowRight className="w-4 h-4 text-orange-600" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
        </div>

        {/* Premium Newsletter Section */}
        <section className="mt-48 bg-slate-950 p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <HardHat size={200} className="text-white rotate-12" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 uppercase italic tracking-tighter">
              Sektörel İstihbarat
            </h3>
            <p className="text-slate-400 text-lg mb-12 font-light">
              İş sağlığı, güvenliği ve kurumsal giyim trendlerinden ilk siz
              haberdar olun.
            </p>
            <form className="flex flex-col md:flex-row gap-6">
              <input
                type="email"
                placeholder="Kurumsal E-posta Adresiniz"
                className="bg-transparent border-b-2 border-slate-700 w-full py-4 text-white outline-none focus:border-orange-600 transition-colors placeholder:text-slate-600 font-medium"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 text-xs font-black uppercase tracking-widest transition-all hover:tracking-[0.3em]">
                Abone Ol
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
