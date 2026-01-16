"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
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
          if (res.status === 404) throw new Error("Blog bulunamadı.");
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
      <div className="min-h-screen flex items-center justify-center bg-[#FCFBFA]">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
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
    <div className="min-h-screen bg-[#FCFBFA] text-slate-800 selection:bg-slate-100">
      {/* --- HERO SECTION --- */}
      <header className="relative h-[70dvh] w-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl z-10 space-y-8"
        >
          <div className="space-y-4">
            <span className="text-[10px] tracking-[0.5em] uppercase text-slate-400 font-medium">
              {formattedDate} — {blog.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif font-light tracking-tight leading-[1.1] text-slate-900">
              {blog.title}
            </h1>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 w-[1px] h-16 bg-slate-200" />
      </header>

      {/* --- FEATURE IMAGE --- */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="relative aspect-[21/9] overflow-hidden bg-slate-100"
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-all duration-1000"
          />
        </motion.div>
      </section>

      {/* --- ARTICLE CONTENT --- */}
      <article className="max-w-2xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="prose prose-slate prose-lg max-w-none"
        >
          {blog.content.split("\n").map((line, i) =>
            line.trim() === "" ? (
              <div key={i} className="h-6" />
            ) : (
              <p
                key={i}
                className="text-slate-600 font-light leading-relaxed mb-6"
              >
                {line}
              </p>
            )
          )}
        </motion.div>

        {/* FOOTER */}
        <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Yayıncı
            </span>
            <span className="text-sm font-serif italic text-slate-900">
              İşPool Tasarım Atölyesi
            </span>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-slate-900"
          >
            Tüm Yazıları Gör{" "}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    </div>
  );
}
