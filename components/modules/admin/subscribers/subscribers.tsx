"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultPagination from "@/components/layout/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Mail, Trash2, Search, Loader2, Send } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

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
    u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const itemsPerPage = 12;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
        `${selectedIds.length} aboneyi silmek istediğinize emin misiniz?`,
      )
    )
      return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/subscribe/${id}`, { method: "DELETE" }),
        ),
      );
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      toast.success("Seçilen aboneler silindi.");
    } catch (err) {
      toast.error("Toplu silme başarısız.");
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
      toast.success(`E-posta ${recipients.length} kişiye gönderildi.`);
      setMailSubject("");
      setMailMessage("");
    } catch (err) {
      toast.error("E-posta gönderimi başarısız.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Abone Yönetimi
        </h1>
        <p className="text-sm text-slate-600">
          E-posta abonelerini yönetin ve bülten gönderin
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mail Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200 rounded-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-700" />
                </div>
                <h2 className="font-semibold text-slate-900">
                  E-Bülten Gönder
                </h2>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Konu
                </label>
                <Input
                  placeholder="Örn: Haftalık Kampanyalar"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Mesaj
                </label>
                <Textarea
                  placeholder="Mesajınızı yazın..."
                  value={mailMessage}
                  onChange={(e) => setMailMessage(e.target.value)}
                  className="bg-slate-50 border-slate-200 min-h-[160px] resize-none rounded-xl"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-700">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} seçili aboneye gönderilecek`
                    : "Tüm abonelere gönderilecek"}
                </p>
              </div>

              <Button
                onClick={handleSendMail}
                disabled={sending}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Gönder
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Subscriber List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Abone ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white border-slate-200 rounded-xl"
              />
            </div>

            {selectedIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="ml-3 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Sil ({selectedIds.length})
              </Button>
            )}
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                {paginatedUsers.map((user) => (
                  <Card
                    key={user.id}
                    className={`bg-white border transition-colors ${
                      selectedIds.includes(user.id)
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={() => {
                            setSelectedIds((prev) =>
                              prev.includes(user.id)
                                ? prev.filter((id) => id !== user.id)
                                : [...prev, user.id],
                            );
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {user.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: #{user.id}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="text-slate-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="h-64 flex items-center justify-center bg-white rounded border border-slate-200">
                  <p className="text-sm text-slate-500">Abone bulunamadı</p>
                </div>
              )}

              {filteredUsers.length > itemsPerPage && (
                <div className="pt-4">
                  <DefaultPagination
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
