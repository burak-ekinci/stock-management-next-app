"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
};

export default function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/brands");
      if (!response.ok) {
        throw new Error("Markalar yüklenemedi");
      }
      const data = await response.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Markalar yüklenirken hata oluştu:", error);
      setError("Markalar yüklenemedi. Lütfen sayfayı yenileyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/brands/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Marka silinemedi");
      }

      // Başarılı silme işleminden sonra listeyi güncelle
      setBrands((prev) => prev.filter((brand) => brand._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Marka silinirken hata oluştu:", error);
      setError("Marka silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Markalar</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
          >
            &larr; Geri
          </Link>
          <Link
            href="/admin/brands/new"
            className="px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300"
          >
            + Yeni Marka Ekle
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#f1953e]">Markalar yükleniyor...</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="bg-[#ebcb8b]/10 text-[#d08770] p-4 rounded-md mb-4 border-l-4 border-[#ebcb8b]">
          <p>Henüz marka eklenmemiş.</p>
          <p className="mt-2">
            Yeni marka eklemek için "Yeni Marka Ekle" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#d8dee9]">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Logo
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Marka Adı
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#d8dee9]">
              {brands.map((brand) => (
                <tr key={brand._id} className="hover:bg-[#eceff4]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {brand.logo ? (
                        <div className="relative h-10 w-10">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-[#e5e9f0] rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-[#f1953e]">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2e3440]">
                      {brand.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Slug: {brand.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-700 max-w-xs truncate">
                      {brand.description || "-"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/brands/${brand._id}/edit`}
                        className="text-[#f1953e] hover:text-[#f1953e]"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(brand._id)}
                        className="text-[#bf616a] hover:text-[#d08770]"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Silme Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium text-[#2e3440] mb-4">
                Markayı Silmek İstediğinize Emin Misiniz?
              </h3>
              <p className="text-[#4c566a] mb-4">
                Bu işlem geri alınamaz ve markaya bağlı tüm modeller ve ürünler
                etkilenebilir.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className={`px-4 py-2 bg-[#bf616a] text-white rounded-lg hover:bg-[#d08770] transition duration-300 ${
                    deleteLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {deleteLoading ? "Siliniyor..." : "Evet, Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
