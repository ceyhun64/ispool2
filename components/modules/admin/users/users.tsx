"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DefaultPagination from "@/components/layout/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Search, Trash2, Mail, Phone, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Address {
  id: number;
  title: string;
  address: string;
  city: string;
  district: string;
  zip: string;
  firstName: string;
  lastName: string;
  phone?: string;
  neighborhood?: string;
  tcno?: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  addresses?: Address[];
}

const ITEMS_PER_PAGE = 12;

export default function UsersManagement() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/all");
      if (!res.ok) throw new Error("Veriler alınamadı");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      toast.error("Kullanıcı listesi yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const displayPhone = (user: User) => {
    return user.phone || user.addresses?.[0]?.phone || "Tanımlanmadı";
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.name} ${u.surname} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/user/all/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("Kullanıcı silindi.");
      }
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleBatchDelete = async () => {
    setIsBatchDeleting(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/user/all/${id}`, { method: "DELETE" }),
        ),
      );
      setUsers((prev) => prev.filter((u) => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      toast.success(`${selectedIds.length} kullanıcı silindi.`);
    } catch (error) {
      toast.error("Bazı kullanıcılar silinemedi.");
    } finally {
      setIsBatchDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Spinner className="w-8 h-8 text-slate-400" />
      </div>
    );

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Müşteri Yönetimi
            </h1>
            <p className="text-sm text-slate-600">
              Kayıtlı müşterileri görüntüleyin ve yönetin
            </p>
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
              disabled={isBatchDeleting}
              className="gap-2"
            >
              {isBatchDeleting ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Sil ({selectedIds.length})
                </>
              )}
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="İsim veya e-posta ara..."
            className="pl-10 bg-white border-slate-200 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Kapsayıcı div: overflow-hidden eklendi ki tablonun keskin köşeleri yuvarlatılmış çerçeveyi bozmasın */}
      <div className="hidden md:block bg-white rounded-sm border border-slate-200 overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 w-12 border-b border-slate-200">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300"
                  onChange={(e) =>
                    setSelectedIds(
                      e.target.checked ? paginatedUsers.map((u) => u.id) : [],
                    )
                  }
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Profil
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                İletişim
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 border-b border-slate-200">
                Adres
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 border-b border-slate-200">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(user.id)
                          ? prev.filter((i) => i !== user.id)
                          : [...prev, user.id],
                      )
                    }
                    className="w-4 h-4 rounded border-slate-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-700 font-semibold text-sm">
                      {user.name[0]}
                      {user.surname[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">
                        {user.name} {user.surname}
                      </p>
                      <p className="text-xs text-slate-500">ID: #{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-slate-700">
                      <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      {displayPhone(user)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 hover:bg-slate-50 rounded-full"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1.5" />
                        {user.addresses?.length || 0} Adres
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Kayıtlı Adresler</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 my-4 max-h-96 overflow-y-auto">
                        {user.addresses?.length ? (
                          user.addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className="p-4 bg-slate-50 rounded border border-slate-200"
                            >
                              <p className="text-xs font-semibold text-slate-900 mb-2">
                                {addr.title}
                              </p>
                              <p className="text-sm text-slate-700">
                                {addr.address}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {addr.district} / {addr.city}
                              </p>
                              {addr.tcno && (
                                <p className="text-xs text-slate-500 mt-1">
                                  TC: {addr.tcno}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-8 text-slate-500 text-sm">
                            Kayıtlı adres bulunamadı
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="px-6 py-4 text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
                        <DialogDescription>
                          <strong>
                            {user.name} {user.surname}
                          </strong>{" "}
                          kalıcı olarak silinecektir.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">İptal</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          Evet, Sil
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center">
            <User className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Kullanıcı bulunamadı</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedUsers.map((user) => (
          <Card key={user.id} className="bg-white border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((i) => i !== user.id)
                        : [...prev, user.id],
                    )
                  }
                  className="w-5 h-5 rounded border-slate-300 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {displayPhone(user)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {user.addresses?.length || 0} Adres
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Kayıtlı Adresler</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 my-4 max-h-96 overflow-y-auto">
                      {user.addresses?.length ? (
                        user.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="p-4 bg-slate-50 rounded border border-slate-200"
                          >
                            <p className="text-xs font-semibold text-slate-900 mb-2">
                              {addr.title}
                            </p>
                            <p className="text-sm text-slate-700">
                              {addr.address}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {addr.district} / {addr.city}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-8 text-slate-500 text-sm">
                          Kayıtlı adres bulunamadı
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Sil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Kullanıcıyı Sil</DialogTitle>
                      <DialogDescription>
                        <strong>
                          {user.name} {user.surname}
                        </strong>{" "}
                        kalıcı olarak silinecektir.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">İptal</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(user.id)}
                      >
                        Evet, Sil
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card className="bg-white border-slate-200">
            <CardContent className="py-16 flex flex-col items-center justify-center">
              <User className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">Kullanıcı bulunamadı</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > ITEMS_PER_PAGE && (
        <div className="mt-6 flex justify-center">
          <DefaultPagination
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {filteredUsers.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Toplam <strong>{filteredUsers.length}</strong> kullanıcıdan{" "}
            <strong>{Math.min(filteredUsers.length, ITEMS_PER_PAGE)}</strong>{" "}
            tanesi gösteriliyor
          </p>
        </div>
      )}
    </div>
  );
}
