"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "@/components/modules/admin/sideBar";
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
import {
  Search,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Users as UsersIcon,
} from "lucide-react";

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

  console.log("users", users);

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
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/user/all/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("Kullanıcı başarıyla silindi.");
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
          fetch(`/api/user/all/${id}`, { method: "DELETE" })
        )
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
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <Spinner className="w-8 h-8 text-indigo-600" />
      </div>
    );

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
              Müşteri Yönetimi
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
              İşletmenizin performansını gerçek zamanlı izleyin.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="relative group flex-1 sm:flex-initial">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="İsim veya e-posta ile ara..."
                className="pl-9 sm:pl-11 h-11 sm:h-12 w-full sm:w-80 bg-white border-slate-200  shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all border-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {selectedIds.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-11 sm:h-12 px-4 sm:px-6  bg-red-50 text-red-600 hover:bg-red-100 border-none shadow-none font-bold animate-in fade-in zoom-in duration-200 text-sm w-full sm:w-auto">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Sil ({selectedIds.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className=" border-none max-w-[90vw] sm:max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">
                      Seçilenleri Sil
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      {selectedIds.length} kullanıcıyı sistemden kalıcı olarak
                      silmek istediğinize emin misiniz?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4 flex-col sm:flex-row gap-2">
                    <Button
                      variant="ghost"
                      className=" w-full sm:w-auto"
                    >
                      Vazgeç
                    </Button>
                    <Button
                      onClick={handleBatchDelete}
                      disabled={isBatchDeleting}
                      className="bg-red-600 hover:bg-red-700  px-8 w-full sm:w-auto"
                    >
                      {isBatchDeleting ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        "Evet, Hepsini Sil"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </header>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[768px]">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-6 sm:px-8 py-4 sm:py-5 w-12">
                    <input
                      type="checkbox"
                      className="w-4 h-4 sm:w-5 sm:h-5  border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? paginatedUsers.map((u) => u.id)
                            : []
                        )
                      }
                    />
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    Profil
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    İletişim
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    Adres Bilgisi
                  </th>
                  <th className="px-4 sm:px-6 py-4 sm:py-5 text-right text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                    Yönet
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-indigo-50/20 transition-all group"
                  >
                    <td className="px-6 sm:px-8 py-4 sm:py-5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((i) => i !== user.id)
                              : [...prev, user.id]
                          )
                        }
                        className="w-4 h-4 sm:w-5 sm:h-5  border-slate-300 text-indigo-600"
                      />
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-xs sm:text-sm shadow-inner group-hover:from-indigo-100 group-hover:to-indigo-200 group-hover:text-indigo-600 transition-all">
                          {user.name[0]}
                          {user.surname[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {user.name} {user.surname}
                          </p>
                          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-tighter uppercase">
                            ID: #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs sm:text-sm font-medium text-slate-600 truncate max-w-[200px]">
                          <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-slate-300 flex-shrink-0" />{" "}
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center text-[10px] sm:text-xs text-slate-400">
                          <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2 text-slate-300 flex-shrink-0" />{" "}
                          {displayPhone(user)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-8 sm:h-9  text-[10px] sm:text-xs font-bold border-slate-200 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                          >
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5" />
                            {user.addresses?.length || 0} Adres
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[95vw] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]  border-none">
                          {" "}
                          <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl font-black">
                              Adres Detayları
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 sm:space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2">
                            {user.addresses?.length ? (
                              user.addresses.map((addr) => (
                                <div
                                  key={addr.id}
                                  className="p-4 sm:p-5 bg-slate-50  border border-slate-100 hover:border-indigo-200 transition-colors"
                                >
                                  <div className="flex justify-between mb-2">
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-600">
                                      {addr.title}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold">
                                      #{addr.id}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                                    {addr.address}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                                    {addr.district} / {addr.city}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">
                                    {addr.tcno}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-10 text-slate-400 font-medium text-sm">
                                Kayıtlı adres bulunamadı.
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 sm:h-10 sm:w-10 text-slate-300 hover:text-red-500 hover:bg-red-50  transition-all"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className=" max-w-[90vw] sm:max-w-md mx-4">
                          <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg">
                              Kullanıcıyı Sil
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm">
                              <b>
                                {user.name} {user.surname}
                              </b>{" "}
                              isimli kullanıcıyı silmek üzeresiniz. Bu işlem
                              geri alınamaz.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
                            <Button
                              variant="ghost"
                              className=" w-full sm:w-auto"
                            >
                              Vazgeç
                            </Button>
                            <Button
                              onClick={() => handleDelete(user.id)}
                              className="bg-red-600 hover:bg-red-700  px-8 w-full sm:w-auto"
                            >
                              Kullanıcıyı Sil
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50  flex items-center justify-center">
                <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-semibold text-base sm:text-lg">
                Eşleşen kullanıcı bulunamadı.
              </p>
              <Button
                variant="link"
                onClick={() => setSearch("")}
                className="text-indigo-600 font-bold text-sm"
              >
                Aramayı Temizle
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white  p-4 shadow-sm border border-slate-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(user.id)
                        ? prev.filter((i) => i !== user.id)
                        : [...prev, user.id]
                    )
                  }
                  className="w-5 h-5  border-slate-300 text-indigo-600 mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3" /> {displayPhone(user)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs "
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      {user.addresses?.length || 0} Adres
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[95vw] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]  border-none">
                    {" "}
                    <DialogHeader>
                      <DialogTitle className="text-lg">
                        Adres Detayları
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 my-4 max-h-[50vh] overflow-y-auto">
                      {user.addresses?.length ? (
                        user.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="p-4 bg-slate-50  border border-slate-100"
                          >
                            <p className="text-xs font-black uppercase text-indigo-600 mb-2">
                              {addr.title}
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              {addr.address}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {addr.district} / {addr.city}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-8 text-slate-400 text-sm">
                          Kayıtlı adres bulunamadı.
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
                      className="h-8 px-3 text-red-500 hover:bg-red-50 text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Sil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className=" max-w-[90vw] mx-4">
                    <DialogHeader>
                      <DialogTitle>Kullanıcıyı Sil</DialogTitle>
                      <DialogDescription className="text-sm">
                        <b>
                          {user.name} {user.surname}
                        </b>{" "}
                        isimli kullanıcıyı silmek üzeresiniz.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2">
                      <Button variant="ghost" className=" w-full">
                        Vazgeç
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700  w-full"
                      >
                        Kullanıcıyı Sil
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="bg-white  p-8 text-center border border-slate-200">
              <UsersIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">
                Eşleşen kullanıcı bulunamadı.
              </p>
              <Button
                variant="link"
                onClick={() => setSearch("")}
                className="text-indigo-600 font-bold text-sm mt-2"
              >
                Aramayı Temizle
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 sm:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 px-2 sm:px-4">
          <p className="text-xs sm:text-sm font-bold text-slate-400 text-center md:text-left">
            {filteredUsers.length} sonuçtan{" "}
            <span className="text-slate-900">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
            </span>{" "}
            arası gösteriliyor
          </p>
          <div className="bg-white p-1.5  shadow-xl shadow-slate-200/50">
            <DefaultPagination
              totalItems={filteredUsers.length}
              itemsPerPage={ITEMS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
