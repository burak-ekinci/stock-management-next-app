"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Brand = {
  _id: string;
  name: string;
};

type Model = {
  _id: string;
  name: string;
  slug: string;
  brandId: Brand;
};

export default function ModelsListPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/models");
      if (!response.ok) {
        throw new Error("Modeller yüklenemedi");
      }
      const data = await response.json();
      setModels(data.models || []);
    } catch (error) {
      console.error("Modeller yüklenirken hata oluştu:", error);
      setError("Modeller yüklenemedi. Lütfen sayfayı yenileyin.");
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
      const response = await fetch(`/api/models/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Model silinemedi");
      }

      // Başarılı silme işleminden sonra listeyi güncelle
      setModels((prev) => prev.filter((model) => model._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Model silinirken hata oluştu:", error);
      setError("Model silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Modeller</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
          >
            &larr; Geri
          </Link>
          <Link
            href="/admin/models/new"
            className="px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300"
          >
            + Yeni Model Ekle
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
          <p className="text-[#f1953e]">Modeller yükleniyor...</p>
        </div>
      ) : models.length === 0 ? (
        <div className="bg-[#ebcb8b]/10 text-[#d08770] p-4 rounded-md mb-4 border-l-4 border-[#ebcb8b]">
          <p>Henüz model eklenmemiş.</p>
          <p className="mt-2">
            Yeni model eklemek için "Yeni Model Ekle" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#d8dee9]">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Model Adı
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Marka
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#d8dee9]">
              {models.map((model) => (
                <tr key={model._id} className="hover:bg-[#eceff4]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2e3440]">
                      {model.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#3b4252]">
                      {model.brandId.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#434c5e]">{model.slug}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/models/${model._id}/edit`}
                        className="text-[#f1953e] hover:text-[#f1953e]"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(model._id)}
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
                Modeli Silmek İstediğinize Emin Misiniz?
              </h3>
              <p className="text-[#4c566a] mb-4">
                Bu işlem geri alınamaz. Bu modeli kullanan ürünler de
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
