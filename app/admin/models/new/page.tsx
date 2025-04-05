"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Brand = {
  _id: string;
  name: string;
};

export default function NewModelPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    description: "",
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Markaları yükle
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        const data = await response.json();
        if (data.brands) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error("Markalar yüklenirken hata oluştu:", error);
        setError("Markalar yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Validation
    if (!formData.name.trim()) {
      setError("Model adı boş olamaz");
      setSubmitting(false);
      return;
    }

    if (!formData.brandId) {
      setError("Lütfen bir marka seçin");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/brands/${formData.brandId}/models`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Model başarıyla eklendi!");
        // Reset form
        setFormData({
          name: "",
          brandId: "",
          description: "",
        });

        // Admin sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/models");
        }, 2000);
      } else {
        setError(data.message || "Model eklenirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Model ekleme hatası:", error);
      setError("Sunucu hatası: Model eklenemedi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Model Ekle</h1>
        <Link
          href="/admin/models"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          Geri Dön
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 border border-green-200">
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Markalar yükleniyor...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Model Adı *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
                required
              />
            </div>

            <div>
              <label
                htmlFor="brandId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marka *
              </label>
              <select
                id="brandId"
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
                required
              >
                <option value="">Marka Seçin</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {brands.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Sistemde marka bulunamadı. Önce marka eklemelisiniz.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Açıklama (Opsiyonel)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
              ></textarea>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting || brands.length === 0}
              className={`bg-[#f1953e] hover:bg-[#f1953e] text-white px-6 py-2 rounded-lg transition-colors ${
                submitting || brands.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submitting ? "Ekleniyor..." : "Model Ekle"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
