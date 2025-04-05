"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Brand = {
  _id: string;
  name: string;
  slug: string;
};

type Model = {
  _id: string;
  name: string;
  brandId: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    modelId: "",
    price: 0,
    stock: 0,
    image: "",
    description: "",
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        const data = await response.json();
        if (data.brands) {
          setBrands(data.brands);
        }
        setLoading(false);
      } catch (error) {
        console.error("Marka yükleme hatası:", error);
        setError("Markalar yüklenirken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Seçilen markaya ait modelleri getir
  useEffect(() => {
    if (formData.brandId) {
      fetchModels(formData.brandId);
    } else {
      setFilteredModels([]);
    }
  }, [formData.brandId]);

  const fetchModels = async (brandId: string) => {
    if (!brandId) {
      setFilteredModels([]);
      return;
    }

    setError("");
    try {
      console.log(`Modeller getiriliyor: /api/brands/${brandId}/models`);
      const response = await fetch(`/api/brands/${brandId}/models`);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `Sunucu hatası: ${response.status}` }));
        throw new Error(
          errorData.message || `Sunucu hatası: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.models && data.models.length > 0) {
        // Hem genel model listesini hem de filtrelenmiş listeyi güncelle
        const brandModels = data.models;
        setFilteredModels(brandModels);

        // Mevcut modeller listesini güncelle (diğer markalar korunur)
        setModels((prevModels) => {
          // Önce bu markaya ait tüm modelleri kaldır
          const otherBrandModels = prevModels.filter(
            (model) => model.brandId !== brandId
          );
          // Sonra yeni modelleri ekle
          return [...otherBrandModels, ...brandModels];
        });

        console.log("Markaya ait modeller:", brandModels);
      } else {
        console.log("Bu markaya ait model bulunamadı:", data);
        setFilteredModels([]);
      }
    } catch (error) {
      console.error("Model yükleme hatası:", error);
      setError(
        `Modeller yüklenirken bir hata oluştu: ${
          error instanceof Error ? error.message : "Bilinmeyen hata"
        }`
      );
      setFilteredModels([]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    // Temel doğrulama kontrolleri
    if (!formData.name || !formData.brandId || !formData.modelId) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      setSubmitting(false);
      return;
    }

    // Modelin varlığını kontrol et
    const selectedModel = filteredModels.find(
      (model) => model._id === formData.modelId
    );
    if (!selectedModel) {
      setError("Seçilen model bulunamadı. Lütfen geçerli bir model seçin.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Ürün başarıyla eklendi!");
        // Formu sıfırla
        setFormData({
          name: "",
          brandId: "",
          modelId: "",
          price: 0,
          stock: 0,
          image: "",
          description: "",
        });

        // 2 saniye sonra admin sayfasına yönlendir
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        setError(data.message || "Ürün eklenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      setError("Sunucu hatası: Ürün eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Yeni Ürün Ekle</h1>
        <Link
          href="/admin/products"
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ürün Adı *
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
          </div>

          <div>
            <label
              htmlFor="modelId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Model *
            </label>
            <select
              id="modelId"
              name="modelId"
              value={formData.modelId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
              required
              disabled={!formData.brandId}
            >
              <option value="">Model Seçin</option>
              {filteredModels.map((model) => (
                <option key={model._id} value={model._id}>
                  {model.name}
                </option>
              ))}
            </select>
            {!formData.brandId && (
              <p className="text-sm text-gray-500 mt-1">
                Önce marka seçmelisiniz
              </p>
            )}
            {formData.brandId && filteredModels.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Bu markaya ait model bulunmuyor. Önce model eklemelisiniz.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fiyat (TL) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Stok Adedi *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
              required
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ürün Görseli URL (Opsiyonel)
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f1953e] focus:border-[#f1953e] text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ürün Açıklaması (Opsiyonel)
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
            disabled={submitting}
            className={`bg-[#f1953e] hover:bg-[#f1953e] text-white px-6 py-2 rounded-lg transition-colors ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Ekleniyor..." : "Ürün Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
}
