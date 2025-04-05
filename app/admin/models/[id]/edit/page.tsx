"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Model tipi tanımlaması
type Brand = {
  _id: string;
  name: string;
  slug: string;
};

type Model = {
  _id: string;
  name: string;
  slug: string;
  brandId: string;
  description: string;
};

export default function EditModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: modelId } = React.use(params);
  const [formData, setFormData] = useState<Model>({
    _id: "",
    name: "",
    slug: "",
    brandId: "",
    description: "",
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Markaları getir
        const brandsResponse = await fetch("/api/brands");
        if (!brandsResponse.ok) {
          throw new Error("Markalar yüklenemedi");
        }
        const brandsData = await brandsResponse.json();
        setBrands(brandsData.brands || []);

        // Model bilgilerini getir
        const modelResponse = await fetch(`/api/models/${modelId}`);
        if (!modelResponse.ok) {
          throw new Error("Model yüklenemedi");
        }
        const modelData = await modelResponse.json();
        setFormData({
          _id: modelData.model._id,
          name: modelData.model.name,
          slug: modelData.model.slug,
          brandId: modelData.model.brandId,
          description: modelData.model.description || "",
        });
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        setError("Veriler yüklenemedi. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [modelId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Model adı değiştiğinde otomatik slug oluştur
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData({
        ...formData,
        name: value,
        slug: slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validasyonu
    if (!formData.name.trim() || !formData.brandId) {
      setError("Model adı ve marka seçimi zorunludur");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/models/${modelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Model başarıyla güncellendi!");

        // Kısa bir süre sonra modeller sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/models");
        }, 1500);
      } else {
        setError(data.message || "Model güncellenemedi");
      }
    } catch (error: any) {
      console.error("Model güncellenirken hata oluştu:", error);
      setError(error.message || "Model güncellenemedi. Lütfen tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-lg shadow-md border border-[#d8dee9] bg-white">
        <p className="text-center text-[#5e81ac]">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md border border-[#d8dee9] bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#2e3440]">Model Düzenle</h1>
        <Link
          href="/admin/models"
          className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
        >
          &larr; Modellere Dön
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
            htmlFor="brandId"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Marka
          </label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleInputChange}
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
            required
          >
            <option value="">Marka Seçin</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Model Adı
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Model adını girin"
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Slug (Otomatik oluşturulur)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="slug-ornegi"
            className="w-full p-2 border border-[#d8dee9] bg-[#eceff4] rounded-md text-black"
            readOnly
          />
          <p className="text-xs text-[#4c566a] mt-1">
            Bu, URL'lerde kullanılacak olan benzersiz tanımlayıcıdır.
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Model Açıklaması
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Model hakkında kısa bilgi"
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Güncelleniyor..." : "Modeli Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
