"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import {
  Mail,
  Trash2,
  Search,
  Users,
  Send,
  CheckSquare,
  Square,
  Loader2,
  Inbox,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Subscriber {
  id: number;
  email: string;
}

export default function Subscribers() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mailSubject, setMailSubject] = useState<string>("");
  const [mailMessage, setMailMessage] = useState<string>("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/subscribe");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Aboneler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 12;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Bu aboneyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/subscribe/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      toast.success("Abone silindi.");
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleDeleteSelected = async () => {
    if (
      !confirm(
        `${selectedIds.length} aboneyi silmek istediğinize emin misiniz?`
      )
    )
      return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/subscribe/${id}`, { method: "DELETE" })
        )
      );
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      toast.success("Seçilen aboneler temizlendi.");
    } catch (err) {
      toast.error("Toplu silme işleminde hata oluştu.");
    }
  };

  const handleSendMail = async () => {
    if (!mailSubject || !mailMessage) {
      toast.warning("Lütfen tüm alanları doldurun.");
      return;
    }
    setSending(true);
    const recipients =
      selectedIds.length > 0
        ? users.filter((u) => selectedIds.includes(u.id)).map((u) => u.email)
        : users.map((u) => u.email);

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: mailSubject,
          message: mailMessage,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Bülten ${recipients.length} kişiye gönderildi.`);
      setMailSubject("");
      setMailMessage("");
    } catch (err) {
      toast.error("E-posta gönderimi başarısız.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] font-sans selection:bg-indigo-100">
      <Sidebar />
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-12 transition-all duration-300 ${
          isMobile ? "mt-14 sm:mt-16" : "md:ml-[240px] lg:ml-[280px]"
        }`}
      >
        {/* Header Section */}
        <header className="flex flex-col gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 sm:w-8 bg-indigo-600 " />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-600">
                Yönetim Paneli
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Abone Yönetimi
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              İşletmenizin performansını gerçek zamanlı izleyin.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Abone ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white border-slate-200  shadow-sm focus:ring-4 focus:ring-blue-50 transition-all h-11 text-sm"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Sol Panel: Mail Gönderimi */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6  shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50  flex items-center justify-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#001e59]" />
                </div>
                <h2 className="font-bold text-sm sm:text-base text-slate-800 tracking-tight">
                  E-Bülten Gönder
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Konu Başlığı
                  </label>
                  <Input
                    placeholder="Örn: Haftalık Teknoloji Özeti"
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                    className="bg-slate-50 border-none  h-10 sm:h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Mesaj İçeriği
                  </label>
                  <Textarea
                    placeholder="Abonelerinize iletmek istediğiniz mesaj..."
                    value={mailMessage}
                    onChange={(e) => setMailMessage(e.target.value)}
                    className="bg-slate-50 border-none  min-h-[140px] sm:min-h-[180px] py-3 resize-none text-sm"
                  />
                </div>

                <div
                  className={`p-3  border flex items-center gap-2 sm:gap-3 transition-colors ${
                    selectedIds.length > 0
                      ? "bg-amber-50 border-amber-100"
                      : "bg-blue-50 border-blue-100"
                  }`}
                >
                  <Inbox
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                      selectedIds.length > 0
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      selectedIds.length > 0
                        ? "text-amber-700"
                        : "text-blue-700"
                    }`}
                  >
                    {selectedIds.length > 0
                      ? `${selectedIds.length} seçili aboneye gidecek`
                      : "Tüm abonelere gönderilecek"}
                  </span>
                </div>

                <Button
                  onClick={handleSendMail}
                  disabled={sending}
                  className="w-full bg-[#001e59] hover:bg-[#003080] text-white  h-11 sm:h-12 font-semibold shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2 text-sm"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? "Gönderiliyor..." : "Bülteni Yayınla"}
                </Button>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Liste */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedIds.length === paginatedUsers.length &&
                    paginatedUsers.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked)
                      setSelectedIds(paginatedUsers.map((u) => u.id));
                    else setSelectedIds([]);
                  }}
                />
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tümünü Seç
                </span>
              </div>

              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="h-7 sm:h-8  text-[10px] sm:text-xs gap-1.5 sm:gap-2 px-2.5 sm:px-3 animate-in fade-in slide-in-from-right-2"
                >
                  <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Seçilenleri Sil ({selectedIds.length})
                </Button>
              )}
            </div>

            {loading ? (
              <div className="h-48 sm:h-64 flex items-center justify-center bg-white  border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {paginatedUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`group p-3 sm:p-4 bg-white border transition-all flex items-center justify-between hover:shadow-md hover:border-blue-200 ${
                      selectedIds.includes(user.id)
                        ? "border-blue-500 bg-blue-50/30"
                        : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1">
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          );
                        }}
                        className="flex-shrink-0"
                      />
                      <div className="truncate min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                          {user.email}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono italic">
                          #{user.id} Subscriber
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 sm:h-8 sm:w-8 text-slate-300 hover:text-red-500 hover:bg-red-50  transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredUsers.length === 0 && (
              <div className="h-48 sm:h-64 flex flex-col items-center justify-center bg-white  border border-dashed border-slate-300">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 mb-2" />
                <p className="text-slate-400 text-xs sm:text-sm italic">
                  Aradığınız kriterde abone bulunamadı.
                </p>
              </div>
            )}

            <div className="pt-3 sm:pt-4 border-t border-slate-100">
              <DefaultPagination
                totalItems={filteredUsers.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
