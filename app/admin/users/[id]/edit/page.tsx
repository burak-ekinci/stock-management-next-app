"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type PageParams = {
  params: { id: string };
};

export default function EditUserPage({ params }: PageParams) {
  const router = useRouter();
  const userId = params.id;
  const [formData, setFormData] = useState<User & { password: string }>({
    _id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Kullanıcı bilgileri yüklenemedi");
        }
        const data = await response.json();
        setFormData({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          password: "", // Şifre gösterilmez, boş bırakılır
          role: data.user.role,
        });
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenirken hata oluştu:", error);
        setError("Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      setError("İsim ve e-posta alanları zorunludur.");
      setSubmitting(false);
      return;
    }

    // E-posta formatı doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      setSubmitting(false);
      return;
    }

    // Şifre kontrolü - eğer şifre varsa en az 6 karakter olmalı
    if (formData.password && formData.password.length < 6) {
      setError("Şifre en az 6 karakter uzunluğunda olmalıdır.");
      setSubmitting(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      };

      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Kullanıcı bilgileri başarıyla güncellendi!");
        // Şifre alanını temizle
        setFormData((prev) => ({ ...prev, password: "" }));

        // 2 saniye sonra kullanıcılar sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/users");
        }, 2000);
      } else {
        setError(data.message || "Kullanıcı güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kullanıcı güncelleme hatası:", error);
      setError("Sunucu hatası: Kullanıcı güncellenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
        <p className="text-center text-[#5e81ac]">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Kullanıcı Düzenle</h1>
        <Link
          href="/admin/users"
          className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
        >
          &larr; Kullanıcılara Dön
        </Link>
      </div>

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
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#5e81ac] focus:border-[#5e81ac] outline-none transition duration-200 bg-[#f8f9fc] text-black"
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
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#5e81ac] focus:border-[#5e81ac] outline-none transition duration-200 bg-[#f8f9fc] text-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Şifre (Değiştirmek için doldurun)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#5e81ac] focus:border-[#5e81ac] outline-none transition duration-200 bg-[#f8f9fc] text-black"
          />
          <p className="text-xs text-[#4c566a] mt-1">
            Boş bırakırsanız, mevcut şifre değişmeyecektir. Değiştirmek
            istiyorsanız, en az 6 karakter uzunluğunda yeni bir şifre girin.
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Rol
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#5e81ac] focus:border-[#5e81ac] outline-none transition duration-200 bg-[#f8f9fc] text-black"
          >
            <option value="user">Kullanıcı</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-[#5e81ac] text-white rounded-lg hover:bg-[#81a1c1] transition duration-300 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Güncelleniyor..." : "Kullanıcıyı Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
