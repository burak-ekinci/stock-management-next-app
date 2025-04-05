import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Yönetim Paneli - Ekinci Elektronik",
  description: "Ekinci Elektronik yönetim paneli",
};

export default async function AdminPage() {
  // Sadece admin kullanıcıların erişimine izin ver
  const user = await requireAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-[#4c566a] text-white py-8 px-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Yönetim Paneli</h1>
        <p className="text-center max-w-3xl mx-auto text-[#e5e9f0]">
          Bu panelden ürünleri, markaları ve modelleri yönetebilirsiniz.
          Aşağıdaki bölümlerden istediğiniz işlemi gerçekleştirebilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#f1953e]">
          <h2 className="text-xl font-bold mb-4 text-[#4c566a]">Markalar</h2>
          <p className="text-gray-700 mb-4">
            Bilgisayar markalarını ekleyin, düzenleyin veya silin.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/brands"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Markaları Listele
            </Link>
            <Link
              href="/admin/brands/new"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Yeni Marka Ekle
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#f1953e]">
          <h2 className="text-xl font-bold mb-4 text-[#4c566a]">Modeller</h2>
          <p className="text-gray-700 mb-4">
            Bilgisayar modellerini marka bazlı olarak yönetin.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/models"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Modelleri Listele
            </Link>
            <Link
              href="/admin/models/new"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Yeni Model Ekle
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#f1953e]">
          <h2 className="text-xl font-bold mb-4 text-[#4c566a]">Ürünler</h2>
          <p className="text-gray-700 mb-4">
            Batarya ürünlerini ekleyin, düzenleyin veya silin.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/products"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Ürünleri Listele
            </Link>
            <Link
              href="/admin/products/new"
              className="text-[#f1953e] hover:text-[#f1953e] font-medium"
            >
              Yeni Ürün Ekle
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#f1953e]">
        <h2 className="text-xl font-bold mb-4 text-[#4c566a]">Kullanıcılar</h2>
        <p className="text-gray-700 mb-4">
          Sisteme kayıtlı kullanıcıları yönetin ve yeni admin kullanıcılar
          ekleyin.
        </p>
        <div className="flex gap-4">
          <Link
            href="/admin/users"
            className="text-[#f1953e] hover:text-[#f1953e] font-medium"
          >
            Kullanıcıları Yönet
          </Link>
        </div>
      </div>

      <div className="bg-[#ebcb8b]/20 border-l-4 border-[#ebcb8b] p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3 text-[#d08770]">
          Yönetici Bilgilendirmesi
        </h2>
        <p className="text-[#d08770]">
          <strong>Önemli Not:</strong> Bu panel sadece yetkili yöneticiler
          tarafından kullanılmalıdır. Yapılan tüm işlemler kayıt altına
          alınmaktadır.
        </p>
        <p className="text-[#d08770] mt-2">
          Ürün ekleme, düzenleme veya silme işlemlerinde dikkatli olunuz. Yanlış
          işlemler müşteri deneyimini etkileyebilir.
        </p>
      </div>
    </div>
  );
}
