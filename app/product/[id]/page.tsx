import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import clientPromise from "@/app/lib/mongodb";
import Brand from "@/app/models/Brand";
import Model from "@/app/models/Model";
import Product from "@/app/models/Product";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const product = await Product.findById(id)
      .populate("brandId")
      .populate("modelId");

    if (!product) {
      return {
        title: "Ürün Bulunamadı - Ekinci Elektronik",
      };
    }

    return {
      title: `${product.name} - Ekinci Elektronik`,
      description:
        product.description || `${product.name} - Ekinci Elektronik'te satışta`,
    };
  } catch (error) {
    console.error("Meta veri hatası:", error);
    return {
      title: "Ürün Detayı - Ekinci Elektronik",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const product = await Product.findById(id)
      .populate("brandId")
      .populate("modelId");

    if (!product) {
      console.log(`Ürün bulunamadı: ${id}`);
      notFound();
    }

    // Para birimini formatla
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }).format(amount);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <nav className="flex mb-6 text-sm text-[#f1953e]">
          <Link href="/products" className="hover:underline">
            Ürünler
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/products/${product.brandId.slug}`}
            className="hover:underline"
          >
            {product.brandId.name}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/products/${product.brandId.slug}/${product.modelId.slug}`}
            className="hover:underline"
          >
            {product.modelId.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#f8f9fb] p-4 rounded-lg flex items-center justify-center">
            {product.image ? (
              <div className="relative w-full h-[300px] md:h-[400px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-4"
                />
              </div>
            ) : (
              <div className="w-full h-[300px] md:h-[400px] bg-[#eceff4] flex items-center justify-center">
                <span className="text-[#4c566a]">Görsel Yok</span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#2e3440] mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/products/${product.brandId.slug}`}
                className="text-sm bg-[#e5e9f0] text-[#4c566a] px-3 py-1 rounded-full"
              >
                {product.brandId.name}
              </Link>
              <Link
                href={`/products/${product.brandId.slug}/${product.modelId.slug}`}
                className="text-sm bg-[#e5e9f0] text-[#4c566a] px-3 py-1 rounded-full"
              >
                {product.modelId.name}
              </Link>
            </div>

            {product.description && (
              <div className="text-[#4c566a] mb-6">
                <p>{product.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-[#f1953e]">
                {formatCurrency(product.price)}
              </span>
              <span
                className={`px-3 py-1 rounded-full font-medium ${
                  product.stock > 10
                    ? "bg-[#a3be8c]/20 text-[#a3be8c]"
                    : product.stock > 0
                    ? "bg-[#ebcb8b]/20 text-[#d08770]"
                    : "bg-[#bf616a]/20 text-[#bf616a]"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} adet stokta`
                  : "Stokta yok"}
              </span>
            </div>

            <div className="mt-6 bg-[#eceff4] p-4 rounded-lg">
              <h2 className="font-semibold text-lg mb-3 text-[#2e3440]">
                İletişim Bilgileri
              </h2>
              <p className="text-[#4c566a]">
                Bu ürünü satın almak veya daha fazla bilgi almak için lütfen
                bizimle iletişime geçin.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-[#f1953e]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-[#4c566a]">+90 212 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-[#f1953e]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[#4c566a]">
                    info@ekincielectronic.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Ürün detayı sayfası hatası:", error);
    notFound();
  }
}
