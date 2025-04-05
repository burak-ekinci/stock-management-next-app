"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Kullanıcıları yükle
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/users?search=${encodeURIComponent(query)}`
        : "/api/users";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Kullanıcılar yüklenemedi");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata oluştu:", error);
      setError("Kullanıcılar yüklenemedi. Lütfen sayfayı yenileyin.");
    } finally {
      setLoading(false);
    }
  };

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  // Silme işlemi
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/users/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Kullanıcı silinemedi");
      }

      // Başarılı silme işleminden sonra listeyi güncelle
      setUsers((prev) => prev.filter((user) => user._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error: any) {
      console.error("Kullanıcı silinirken hata oluştu:", error);
      setError(
        error.message ||
          "Kullanıcı silinirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: tr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Kullanıcılar</h1>
        <div className="flex gap-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
          >
            &larr; Geri
          </Link>
          <Link
            href="/admin/users/new"
            className="px-4 py-2 bg-[#5e81ac] text-white rounded-lg hover:bg-[#81a1c1] transition duration-300"
          >
            + Yeni Kullanıcı Ekle
          </Link>
        </div>
      </div>

      {/* Arama formu */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim veya e-posta ile ara..."
            className="flex-1 p-2 border border-[#d8dee9] rounded-l-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#f1953e] text-white rounded-r-md hover:bg-[#f1953e] transition duration-300"
          >
            Ara
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-[#f1953e]">Kullanıcılar yükleniyor...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#ebcb8b]/10 text-[#d08770] p-4 rounded-md mb-4 border-l-4 border-[#ebcb8b]">
          <p>Hiç kullanıcı bulunamadı.</p>
          {searchQuery && (
            <p className="mt-2">
              Arama kriterlerinize uygun kullanıcı bulunamadı. Lütfen farklı bir
              arama terimi deneyin veya{" "}
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchUsers("");
                }}
                className="text-[#f1953e] hover:underline"
              >
                tüm kullanıcıları görüntüleyin
              </button>
              .
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#d8dee9]">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  İsim
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-4 py-3 bg-[#eceff4] text-left text-xs font-semibold text-[#4c566a] uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#d8dee9]">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-[#eceff4]">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#2e3440]">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#4c566a]">{user.email}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-[#f1953e]/20 text-[#f1953e]"
                          : "bg-[#a3be8c]/20 text-[#a3be8c]"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Kullanıcı"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-[#4c566a]">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="text-[#f1953e] hover:text-[#f1953e]"
                      >
                        Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
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

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <h3 className="text-lg font-medium text-[#2e3440] mb-4">
                Kullanıcıyı Silmek İstediğinize Emin Misiniz?
              </h3>
              <p className="text-[#4c566a] mb-4">
                Bu işlem geri alınamaz. Kullanıcı hesabı ve tüm ilişkili veriler
                silinecektir.
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
