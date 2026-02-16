"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  Loader2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (!params.id) return;

      try {
        const res = await fetch(`/api/blog/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("İçerik bulunamadı.");
          throw new Error("Bir hata oluştu.");
        }
        const data = await res.json();
        setBlog(data);
      } catch (err: any) {
        toast.error(err.message);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-slate-400">
            Yükleniyor
          </span>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-600 selection:text-white">
      {/* --- HERO SECTION: Architectural & Bold --- */}
      <header className="relative w-full pt-16 pb-16 md:pt-48 md:pb-24 px-6 border-b border-slate-100">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />{" "}
              Geri Dön
            </Link>
            <div className="h-[1px] w-12 bg-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic">
              Analiz Raporu
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-sans font-bold tracking-tighter leading-[0.9] text-slate-950 uppercase italic"
          >
            {blog.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-8 border-t border-slate-100 pt-8"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-300" />
              <span className="text-xs font-bold uppercase tracking-tight text-slate-500">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold uppercase tracking-tight text-slate-500">
                {blog.category}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- FEATURE IMAGE: High-Contrast Industrial --- */}
      <section className="w-full bg-slate-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative w-full aspect-[21/9] grayscale-[20%] contrast-125 hover:grayscale-0 transition-all duration-1000"
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
        </motion.div>
      </section>

      {/* --- ARTICLE CONTENT: Clean & Professional --- */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 py-12">
        {/* Left Sidebar - Article Specs */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="sticky top-32 space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
                Yayıncı
              </p>
              <p className="text-sm font-bold tracking-tight text-slate-900 uppercase italic">
                İşPool Technical
                <br />
                Industries
              </p>
            </div>
            <div className="w-full h-px bg-slate-100" />
           
          </div>
        </aside>

        {/* Content Body */}
        <article className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="prose prose-slate prose-lg max-w-none"
          >
            {blog.content.split("\n").map((line, i) =>
              line.trim() === "" ? (
                <div key={i} className="h-8" />
              ) : (
                <p
                  key={i}
                  className="text-slate-600 font-normal leading-relaxed mb-8 text-lg"
                >
                  {line}
                </p>
              ),
            )}
          </motion.div>

          {/* FOOTER CTA */}
          <div className="mt-32 p-12 bg-slate-950 flex flex-col md:flex-row justify-between items-center gap-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

            <div className="flex flex-col gap-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-orange-600 font-black">
                Daha Fazlası
              </span>
              <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">
                Profesyonel Ekipman Rehberi
              </h4>
            </div>

            <Link
              href="/blog"
              className="relative z-10 bg-white text-slate-950 px-8 py-4 text-[10px] tracking-[0.3em] uppercase font-black hover:bg-orange-600 hover:text-white transition-all duration-300 flex items-center gap-3"
            >
              TÜMÜNÜ İNCELE <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
