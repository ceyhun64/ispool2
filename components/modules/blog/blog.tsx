"use client";

import React, { useEffect, useState, memo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
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
  <div className="space-y-8">
    <div className="aspect-[16/10] w-full bg-slate-50 animate-pulse" />
    <div className="space-y-4">
      <div className="h-2 w-20 bg-slate-100 animate-pulse" />
      <div className="h-8 w-full bg-slate-100 animate-pulse" />
      <div className="h-4 w-2/3 bg-slate-50 animate-pulse" />
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
                  title: "Minimalist Dış Mekan Kurguları",
                  category: "Tasarım",
                  excerpt:
                    "Az eşya ile balkonunuzda nasıl ferah bir kaçış noktası yaratabilirsiniz?",
                  image:
                    "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1200",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: 2,
                  title: "Teak Mobilyaların Mevsimsel Bakımı",
                  category: "Rehber",
                  excerpt:
                    "Doğal dokuyu korumak için uygulamanız gereken altın kurallar.",
                  image:
                    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200",
                  createdAt: new Date().toISOString(),
                },
                {
                  id: 3,
                  title: "2026'da Yükselen Organik Formlar",
                  category: "Trendler",
                  excerpt:
                    "Keskin hatlar yerini doğadan ilham alan kavisli tasarımlara bırakıyor.",
                  image:
                    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1200",
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-100">
      <main className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        {/* Minimal Header */}
        <header className="mb-24 text-center space-y-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] tracking-[0.4em] uppercase text-slate-400 font-medium"
          >
            İşPool Journal
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-light tracking-tight"
          >
            Yaşam Alanınıza <span className="italic">İlham</span>
          </motion.h1>
          <div className="w-10 h-[1px] bg-slate-200 mx-auto mt-8" />
        </header>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => <BlogCardSkeleton key={i} />)
            : blogs.map((blog, index) => (
                <motion.article
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/blog/${blog.id}`} className="space-y-6">
                    {/* Image: No rounded corners, sharp and architectural */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-slate-50">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>

                    {/* Meta & Title */}
                    <div className="space-y-3">
                      <span className="text-[9px] tracking-[0.2em] uppercase text-slate-400 font-semibold">
                        {blog.category}
                      </span>
                      <h2 className="text-xl font-serif font-light leading-snug group-hover:text-slate-600 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold group-hover:gap-4 transition-all duration-300">
                        İncele <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
        </div>

        {/* Newsletter: Super Minimal */}
        <section className="mt-40 border-t border-slate-100 pt-24 text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-serif font-light mb-4">
            E-Bültene Katılın
          </h3>
          <p className="text-slate-400 text-sm font-light mb-10">
            Aylık dekorasyon önerileri ve özel koleksiyon haberlerini doğrudan
            kutunuzda bulun.
          </p>
          <form className="flex gap-4 border-b border-slate-200 pb-2 transition-focus-within focus-within:border-slate-900">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="bg-transparent border-none w-full text-sm outline-none placeholder:text-slate-300 font-light"
            />
            <button className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap hover:text-slate-500 transition-colors">
              Kayıt Ol
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
