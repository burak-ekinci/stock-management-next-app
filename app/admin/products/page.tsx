"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  _id: string;
  name: string;
  slug: string;
  brandId: {
    _id: string;
    name: string;
  };
  modelId: {
    _id: string;
    name: string;
  };
  price: number;
  stock: number;
  image?: string;
};

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Ürünler yüklenemedi");
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Ürünler yüklenirken hata oluştu:", error);
      setError("Ürünler yüklenemedi. Lütfen sayfayı yenileyin.");
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
      const response = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ürün silinemedi");
      }

      // Başarılı silme işleminden sonra listeyi güncelle
      setProducts((prev) => prev.filter((product) => product._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error);
      setError("Ürün silinirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Para birimini formatla
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Ürünler</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
          >
            &larr; Geri
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300"
          >
            + Yeni Ürün Ekle
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
          <p className="text-[#f1953e]">Ürünler yükleniyor...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#ebcb8b]/10 text-[#d08770] p-4 rounded-md mb-4 border-l-4 border-[#ebcb8b]">
          <p>Henüz ürün eklenmemiş.</p>
          <p className="mt-2">
            Yeni ürün eklemek için "Yeni Ürün Ekle" butonuna tıklayın.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#d8dee9]">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Ürün
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Marka / Model
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Stok
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#d8dee9]">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-[#eceff4]">
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 bg-[#e5e9f0] rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-[#f1953e]">Resim Yok</span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#2e3440]">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2e3440]">
                      {product.brandId.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.modelId.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#f1953e]">
                      {formatCurrency(product.price)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-[#a3be8c]/20 text-[#a3be8c]"
                          : product.stock > 0
                          ? "bg-[#ebcb8b]/20 text-[#d08770]"
                          : "bg-[#bf616a]/20 text-[#bf616a]"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="text-[#f1953e] hover:text-[#f1953e]"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product._id)}
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
                Ürünü Silmek İstediğinize Emin Misiniz?
              </h3>
              <p className="text-[#4c566a] mb-4">Bu işlem geri alınamaz.</p>
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
