"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBrandPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!formData.name.trim()) {
      setError("Marka adı zorunludur");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Marka ekleme başarısız oldu");
      }

      setSuccess(true);
      setFormData({
        name: "",
        logo: "",
        description: "",
      });

      // 2 saniye sonra admin sayfasına yönlendir
      setTimeout(() => {
        router.push("/admin/brands");
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Marka eklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-[#d8dee9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Yeni Marka Ekle</h1>
        <Link
          href="/admin"
          className="text-[#5e81ac] hover:text-[#81a1c1] font-medium"
        >
          &larr; Yönetim Paneline Dön
        </Link>
      </div>

      {error && (
        <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-[#a3be8c]/10 text-[#a3be8c] p-3 rounded mb-4 border-l-4 border-[#a3be8c]">
          Marka başarıyla eklendi! Yönlendiriliyorsunuz...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Marka Adı <span className="text-[#bf616a]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81ac] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="logo"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Logo URL{" "}
            <span className="text-gray-500 text-sm">(İsteğe bağlı)</span>
          </label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81ac] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            placeholder="https://örnek.com/logo.png"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Açıklama{" "}
            <span className="text-gray-500 text-sm">(İsteğe bağlı)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e81ac] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            placeholder="Marka hakkında kısa açıklama"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin"
            className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ekleniyor..." : "Marka Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}
