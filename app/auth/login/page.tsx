"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Giriş yapılırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-[#d8dee9]">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#2e3440]">
        Giriş Yap
      </h1>

      {error && (
        <div className="bg-[#bf616a]/10 text-[#bf616a] p-3 rounded mb-4 border-l-4 border-[#bf616a]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <div className="mb-6">
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
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#f1953e] text-white py-2 rounded-lg hover:bg-[#f1953e] transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Hesabınız yok mu?{" "}
          <Link
            href="/auth/register"
            className="text-[#f1953e] hover:text-[#f1953e] font-medium"
          >
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
}
