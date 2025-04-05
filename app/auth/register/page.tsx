"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Şifre doğrulama kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    // E-posta geçerlilik kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Geçerli bir e-posta adresi giriniz");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Kayıt işlemi başarısız oldu");
      }

      // Başarılı kayıt sonrası giriş sayfasına yönlendir
      router.push("/auth/login?success=true");
    } catch (error: any) {
      setError(error.message || "Kayıt sırasında bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-[#d8dee9]">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#2e3440]">
        Kayıt Ol
      </h1>

      {error && (
        <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Ad Soyad
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1953e] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            E-posta
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1953e] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Şifre
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1953e] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            required
            minLength={6}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-[#4c566a] mb-2 font-medium"
          >
            Şifre Tekrar
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#d8dee9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f1953e] focus:border-[#88c0d0] bg-[#f8f9fc] text-black font-medium"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#a3be8c] text-white py-2 rounded-lg hover:bg-[#8fbcbb] transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/auth/login"
            className="text-[#f1953e] hover:text-[#f1953e] font-medium"
          >
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}
