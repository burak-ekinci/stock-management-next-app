"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchUserProfile();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Profil bilgileri yüklenemedi");
      }
      const data = await response.json();
      setUser(data.user);
      setFormData((prev) => ({
        ...prev,
        name: data.user.name,
        email: data.user.email,
      }));
    } catch (error) {
      console.error("Profil bilgileri yüklenirken hata oluştu:", error);
      setError("Profil bilgileri yüklenemedi. Lütfen sayfayı yenileyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Temel doğrulama kontrolleri
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("İsim ve e-posta alanları zorunludur");
      setSubmitting(false);
      return;
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      setSubmitting(false);
      return;
    }

    // Şifre kontrolü
    if (
      (formData.currentPassword ||
        formData.newPassword ||
        formData.confirmPassword) &&
      (!formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword)
    ) {
      setError(
        "Şifre değiştirmek için tüm şifre alanlarını doldurmanız gerekmektedir"
      );
      setSubmitting(false);
      return;
    }

    // Yeni şifre ve onay kontrolü
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("Yeni şifre ve şifre onayı eşleşmiyor");
      setSubmitting(false);
      return;
    }

    // Şifre uzunluğu kontrolü
    if (formData.newPassword && formData.newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter uzunluğunda olmalıdır");
      setSubmitting(false);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.currentPassword && formData.newPassword
          ? {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }
          : {}),
      };

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profil bilgileriniz başarıyla güncellendi");
        // Şifre alanlarını temizle
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));

        // Kullanıcı bilgilerini güncelle
        if (data.user) {
          setUser(data.user);
        }
      } else {
        setError(data.message || "Profil güncellenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      setError("Sunucu hatası: Profil güncellenemedi");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-[#f1953e]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2e3440] mb-4">
            Profil Bilgilerim
          </h1>

          {user && (
            <div className="grid md:grid-cols-2 gap-4 mb-6 bg-[#eceff4] p-4 rounded-md">
              <div>
                <p className="text-sm text-[#4c566a]">İsim:</p>
                <p className="font-medium text-[#2e3440]">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#4c566a]">E-posta:</p>
                <p className="font-medium text-[#2e3440]">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#4c566a]">Rol:</p>
                <p className="font-medium text-[#2e3440]">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-[#f1953e]/20 text-[#f1953e]"
                        : "bg-[#a3be8c]/20 text-[#a3be8c]"
                    }`}
                  >
                    {user.role === "admin" ? "Admin" : "Kullanıcı"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-[#4c566a]">Üyelik Tarihi:</p>
                <p className="font-medium text-[#2e3440]">
                  {user.createdAt ? formatDate(user.createdAt) : "-"}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#a3be8c]/10 text-[#a3be8c] p-3 rounded mb-4 border-l-4 border-[#a3be8c]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-[#2e3440] border-b border-[#d8dee9] pb-2 mt-6 mb-4">
              Profil Bilgilerimi Güncelle
            </h2>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#4c566a] mb-1"
              >
                İsim *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#4c566a] mb-1"
              >
                E-posta *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
                required
              />
            </div>

            <h2 className="text-xl font-semibold text-[#2e3440] border-b border-[#d8dee9] pb-2 mt-6 mb-4">
              Şifre Değiştir
            </h2>

            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-[#4c566a] mb-1"
              >
                Mevcut Şifre
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-[#4c566a] mb-1"
              >
                Yeni Şifre
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
              />
              <p className="text-xs text-[#4c566a] mt-1">
                Şifre en az 6 karakter uzunluğunda olmalıdır.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#4c566a] mb-1"
              >
                Yeni Şifre (Tekrar)
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Güncelleniyor..." : "Bilgilerimi Güncelle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
