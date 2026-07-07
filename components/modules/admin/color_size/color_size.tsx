"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Edit2,
  Plus,
  Save,
  X,
  Palette,
  Maximize,
  Loader2,
  Tag,
  Upload,
} from "lucide-react";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerEyeDropper,
  ColorPickerOutput,
  ColorPickerFormat,
} from "@/components/ui/color-picker";
import Color from "color";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

type EntityType = "color" | "size" | "brand";

interface ColorItem {
  id: number;
  name: string;
  hexCode: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface Brand {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

interface Size {
  id: number;
  value: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
    CartItem: number;
    OrderItem: number;
  };
}

interface FormData {
  name: string;
  hexCode: string;
  value: string;
  sortOrder: number;
  isActive: boolean;
  image: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  stats?: {
    total: number;
    active: number;
    inactive?: number;
  };
}

export default function VariantManagement() {
  const [activeTab, setActiveTab] = useState<EntityType>("color");
  const [items, setItems] = useState<(ColorItem | Size | Brand)[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    hexCode: "#000000",
    value: "",
    sortOrder: 0,
    isActive: true,
    image: "",
  });

  // Verileri getir
  const fetchItems = async () => {
    setLoading(true);
    try {
      const url =
        activeTab === "size"
          ? "/api/size?includeInactive=true"
          : `/api/${activeTab}`;
      const res = await fetch(url);
      const result: ApiResponse = await res.json();

      if (result.success) {
        setItems(result.data || []);
      } else {
        toast.error(result.error || "Veriler yüklenemedi");
      }
    } catch (error) {
      toast.error("Sunucu ile bağlantı kurulamadı");
      console.error("[FETCH_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setEditingId(null);
    resetForm();
  }, [activeTab]);

  const resetForm = () => {
    setFormData({
      name: "",
      hexCode: "#000000",
      value: "",
      sortOrder: 0,
      isActive: true,
      image: "",
    });
  };

  // Marka logosu yükleme
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folderName", "brands");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = await res.json();

      if (res.ok && result.path) {
        setFormData((prev) => ({ ...prev, image: result.path }));
        toast.success("Logo yüklendi");
      } else {
        toast.error(result.error || "Logo yüklenemedi");
      }
    } catch (error) {
      toast.error("Logo yüklenirken bir hata oluştu");
      console.error("[BRAND_IMAGE_UPLOAD_ERROR]", error);
    } finally {
      setUploading(false);
    }
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `/api/${activeTab}/${editingId}`
      : `/api/${activeTab}`;

    const payload =
      activeTab === "color"
        ? { name: formData.name, hexCode: formData.hexCode }
        : activeTab === "brand"
          ? { name: formData.name, image: formData.image || null }
          : {
              value: formData.value,
              sortOrder: formData.sortOrder,
              isActive: formData.isActive,
            };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse = await res.json();

      if (result.success) {
        toast.success(
          result.message || `${editingId ? "Güncelleme" : "Ekleme"} başarılı`,
        );
        fetchItems();
        resetForm();
        setEditingId(null);
      } else {
        toast.error(result.error || "İşlem başarısız");
      }
    } catch (error) {
      toast.error("Sunucu hatası oluştu");
      console.error("[SUBMIT_ERROR]", error);
    }
  };

  // Silme işlemi
  const handleDelete = async (id: number) => {
    if (!confirm("Bu kaydı silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch(`/api/${activeTab}/${id}`, { method: "DELETE" });
      const result: ApiResponse = await res.json();

      if (result.success) {
        toast.success("Kayıt başarıyla silindi");
        fetchItems();
      } else {
        toast.error(result.error || "Silme işlemi başarısız");
      }
    } catch (error) {
      toast.error("Silme sırasında bir hata oluştu");
      console.error("[DELETE_ERROR]", error);
    }
  };

  // Düzenleme modu
  const handleEdit = (item: ColorItem | Size | Brand) => {
    setEditingId(item.id);
    if (activeTab === "color") {
      const colorItem = item as ColorItem;
      setFormData({
        ...formData,
        name: colorItem.name,
        hexCode: colorItem.hexCode,
      });
    } else if (activeTab === "brand") {
      const brandItem = item as Brand;
      setFormData({
        ...formData,
        name: brandItem.name,
        image: brandItem.image || "",
      });
    } else {
      const sizeItem = item as Size;
      setFormData({
        ...formData,
        value: sizeItem.value,
        sortOrder: sizeItem.sortOrder,
        isActive: sizeItem.isActive,
      });
    }
  };

  // Düzenleme iptal
  const handleCancel = () => {
    setEditingId(null);
    resetForm();
  };

  // Kullanım sayısı hesapla
  const getUsageCount = (item: ColorItem | Size | Brand): number => {
    if (activeTab === "color" || activeTab === "brand") {
      return (item as ColorItem | Brand)._count?.products || 0;
    } else {
      const sizeItem = item as Size;
      return (
        (sizeItem._count?.products || 0) +
        (sizeItem._count?.CartItem || 0) +
        (sizeItem._count?.OrderItem || 0)
      );
    }
  };

  // ColorPicker onChange handler - memoized
  const handleColorChange = useCallback((rgba: any) => {
    try {
      const color = Color.rgb(rgba);
      setFormData((prev) => ({
        ...prev,
        hexCode: color.hex().toUpperCase(),
      }));
    } catch (error) {
      console.error("Color conversion error:", error);
    }
  }, []);

  return (
    <div
      className={`flex-1 bg-slate-50 min-h-screen p-6 sm:p-8 ${isMobile ? "mt-14" : ""}`}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Renk, Beden & Marka Yönetimi{" "}
        </h1>
        <p className="text-sm text-slate-600">
          Renkleri, bedenleri ve markaları yönetmek için kullanılır.
        </p>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-1 mb-6">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab("color")}
            className={`flex items-center justify-center py-2 px-4 rounded-md transition-all text-sm font-medium ${
              activeTab === "color"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Palette className="w-4 h-4 mr-2" />
            Renkler
          </button>
          <button
            onClick={() => setActiveTab("size")}
            className={`flex items-center justify-center py-2 px-4 rounded-md transition-all text-sm font-medium ${
              activeTab === "size"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Maximize className="w-4 h-4 mr-2" />
            Bedenler
          </button>
          <button
            onClick={() => setActiveTab("brand")}
            className={`flex items-center justify-center py-2 px-4 rounded-md transition-all text-sm font-medium ${
              activeTab === "brand"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Tag className="w-4 h-4 mr-2" />
            Markalar
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
          {editingId ? (
            <>
              <Edit2 className="w-4 h-4 mr-2 text-gray-700" />
              Düzenle
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2 text-gray-700" />
              Yeni Ekle
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "color" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Renk Adı
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Koyu Mavi"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Renk Önizlemesi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Seçilen Renk
                  </label>
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-20 h-20 rounded-lg border-2 border-gray-200 shadow-sm transition-all"
                        style={{ backgroundColor: formData.hexCode }}
                      />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          HEX Kodu
                        </div>
                        <div className="font-mono text-sm font-semibold text-gray-900">
                          {formData.hexCode}
                        </div>
                        {formData.name && (
                          <div className="text-xs text-gray-600 mt-2">
                            {formData.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Renk Seçici
                </label>
                <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                  <ColorPicker
                    value={formData.hexCode}
                    onChange={handleColorChange}
                    className="h-auto w-full"
                  >
                    <div className="space-y-3">
                      <ColorPickerSelection className="h-28 rounded-md" />
                      <div className="space-y-2">
                        <ColorPickerHue />
                      </div>
                      <div className="flex items-center gap-2">
                        <ColorPickerEyeDropper />
                        <ColorPickerOutput />
                        <ColorPickerFormat />
                      </div>
                    </div>
                  </ColorPicker>
                </div>
              </div>
            </div>
          ) : activeTab === "brand" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Marka Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Bmes, Pars, İş Pool"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />

                <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-4">
                  Marka Logosu (opsiyonel)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Logo Yükle
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Logoyu Kaldır
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Önizleme
                </label>
                <div className="border border-gray-200 rounded-md p-4 bg-white flex items-center justify-center h-37">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image}
                      alt={formData.name || "Marka logosu"}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <Tag className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-xs">Logo yok</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Beden Değeri
                </label>
                <input
                  type="text"
                  placeholder="Örn: XL, 42"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition uppercase"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sıralama
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent transition
    [appearance:textfield]
    [&::-webkit-outer-spin-button]:appearance-auto
    [&::-webkit-inner-spin-button]:appearance-auto
    [&::-webkit-outer-spin-button]:opacity-100
    [&::-webkit-inner-spin-button]:opacity-100
    [&::-webkit-outer-spin-button]:cursor-pointer
    [&::-webkit-inner-spin-button]:cursor-pointer"
                  value={formData.sortOrder === 0 ? "" : formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Durum
                </label>
                <div className="flex items-center h-9">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {formData.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              {editingId ? (
                <>
                  <Save className="w-3.5 h-3.5 inline mr-1.5" />
                  Güncelle
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5 inline mr-1.5" />
                  Ekle
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5 inline mr-1.5" />
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {activeTab === "color"
                    ? "Renk"
                    : activeTab === "brand"
                      ? "Marka"
                      : "Beden"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  {activeTab === "color"
                    ? "Görünüm"
                    : activeTab === "brand"
                      ? "Logo"
                      : "Sıra / Durum"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Kullanım
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 text-sm mt-2">Yükleniyor...</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <div className="text-gray-400">
                      {activeTab === "color" ? (
                        <Palette className="w-10 h-10 mx-auto mb-2" />
                      ) : activeTab === "brand" ? (
                        <Tag className="w-10 h-10 mx-auto mb-2" />
                      ) : (
                        <Maximize className="w-10 h-10 mx-auto mb-2" />
                      )}
                      <p className="text-gray-500 text-sm">
                        Henüz{" "}
                        {activeTab === "color"
                          ? "renk"
                          : activeTab === "brand"
                            ? "marka"
                            : "beden"}{" "}
                        eklenmemiş
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">
                        {activeTab === "color"
                          ? (item as ColorItem).name
                          : activeTab === "brand"
                            ? (item as Brand).name
                            : (item as Size).value}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {activeTab === "color" ? (
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-md border border-gray-200"
                            style={{
                              backgroundColor: (item as ColorItem).hexCode,
                            }}
                          />
                          <span className="text-xs text-gray-600 font-mono">
                            {(item as ColorItem).hexCode}
                          </span>
                        </div>
                      ) : activeTab === "brand" ? (
                        (item as Brand).image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={(item as Brand).image as string}
                            alt={(item as Brand).name}
                            className="w-10 h-10 object-contain rounded border border-gray-200 bg-white"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">Logo yok</span>
                        )
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-600">
                            Sıra: {(item as Size).sortOrder}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              (item as Size).isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {(item as Size).isActive ? "Aktif" : "Pasif"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {getUsageCount(item)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600"
                          title="Sil"
                          disabled={getUsageCount(item) > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
