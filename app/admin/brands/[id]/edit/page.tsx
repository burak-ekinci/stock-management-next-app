"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
};

export default function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id: brandId } = React.use(params);
  const [formData, setFormData] = useState<Brand>({
    _id: "",
    name: "",
    slug: "",
    description: "",
    logo: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Marka bilgilerini getir
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brands/${brandId}`);
        if (!response.ok) {
          throw new Error("Marka yüklenemedi");
        }
        const data = await response.json();
        setFormData({
          _id: data.brand._id,
          name: data.brand.name,
          slug: data.brand.slug,
          description: data.brand.description || "",
          logo: data.brand.logo || "",
        });
      } catch (error) {
        console.error("Marka yüklenirken hata oluştu:", error);
        setError("Marka yüklenemedi. Lütfen sayfayı yenileyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [brandId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Marka adı değiştiğinde otomatik slug oluştur
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
    if (!formData.name.trim()) {
      setError("Marka adı boş olamaz");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Marka güncellenemedi");
      }

      setSuccess("Marka başarıyla güncellendi!");

      // Kısa bir süre sonra markalar sayfasına yönlendir
      setTimeout(() => {
        router.push("/admin/brands");
      }, 1500);
    } catch (error: any) {
      console.error("Marka güncellenirken hata oluştu:", error);
      setError(error.message || "Marka güncellenemedi. Lütfen tekrar deneyin.");
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
        <h1 className="text-2xl font-bold text-[#2e3440]">Marka Düzenle</h1>
        <Link
          href="/admin/brands"
          className="px-4 py-2 border border-[#4c566a] text-[#4c566a] rounded-lg hover:bg-[#e5e9f0] transition duration-300"
        >
          &larr; Markalara Dön
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
            Marka Adı
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Marka adını girin"
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
            Marka Açıklaması
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Marka hakkında kısa bilgi"
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-[#4c566a] mb-1"
          >
            Marka Logo URL
          </label>
          <input
            type="text"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="https://example.com/logo.png"
            className="w-full p-2 border border-[#d8dee9] rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] outline-none transition duration-200 bg-[#f8f9fc] text-black"
          />
          <p className="text-xs text-[#4c566a] mt-1">
            Logonun internet adresini girin.
          </p>
        </div>

        {formData.logo && (
          <div>
            <p className="text-sm font-medium text-[#4c566a] mb-1">
              Logo Önizleme
            </p>
            <div className="relative h-24 w-24 border border-[#d8dee9] rounded-md overflow-hidden">
              <Image
                src={formData.logo}
                alt="Logo önizleme"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-[#f1953e] text-white rounded-lg hover:bg-[#f1953e] transition duration-300 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Güncelleniyor..." : "Markayı Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
