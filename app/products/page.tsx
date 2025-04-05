import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { IBrand } from "../models/Brand";
import clientPromise from "../lib/mongodb";
import mongoose from "mongoose";
import Brand from "../models/Brand";

export const metadata: Metadata = {
  title: "Ürünler - Ekinci Elektronik",
  description: "Ekinci Elektronik'te bilgisayar markaları ve batarya modelleri",
};

async function getBrands(): Promise<IBrand[]> {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const brands = await Brand.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(brands));
  } catch (error) {
    console.error("Markalar alınırken hata oluştu:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const brands = await getBrands();

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-[#4c566a] text-white py-8 px-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Ürünlerimiz</h1>
        <p className="text-center max-w-3xl mx-auto mb-8 text-[#e5e9f0]">
          Aşağıda sunduğumuz marka ve modellere uygun, yüksek kaliteli batarya
          ürünlerini inceleyebilirsiniz. Önce marka seçerek başlayın, ardından
          modelleri görüntüleyebilirsiniz.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-[#2e3440]">Markalar</h2>

        {brands.length === 0 ? (
          <div className="bg-[#ebcb8b]/20 border-l-4 border-[#ebcb8b] p-4 rounded-md">
            <p className="text-[#d08770]">
              Henüz ürün markası eklenmemiş. Lütfen daha sonra tekrar kontrol
              edin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/products/${brand.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-[#f1953e]"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    {brand.logo ? (
                      <div className="relative h-25 w-25">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <div className="h-32 w-32 bg-[#e5e9f0] rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-[#f1953e]">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center text-[#4c566a]">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="mt-2 text-gray-600 text-center">
                      {brand.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#eceff4] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-3 text-[#2e3440]">
          Batarya Seçimi Hakkında
        </h2>
        <p className="text-gray-700">
          Bilgisayar bataryası seçimi yaparken, cihazınızın markasını ve
          modelini doğru belirlemeniz çok önemlidir. Uygun olmayan bir batarya,
          cihazınıza zarar verebilir veya beklenen performansı göstermeyebilir.
        </p>
        <p className="text-gray-700 mt-2">
          Eğer cihazınızın modeli hakkında emin değilseniz veya listede
          göremiyorsanız, lütfen bizimle iletişime geçin. Uzman ekibimiz size en
          uygun bataryayı bulmanızda yardımcı olacaktır.
        </p>
      </section>
    </div>
  );
}
