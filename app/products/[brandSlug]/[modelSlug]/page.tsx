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
    brandSlug: string;
    modelSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { brandSlug, modelSlug } = await params;

  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const brand = await Brand.findOne({ slug: brandSlug });
    if (!brand) {
      return {
        title: "Marka Bulunamadı - Ekinci Elektronik",
      };
    }

    const model = await Model.findOne({
      slug: modelSlug,
      brandId: brand._id,
    });

    if (!model) {
      return {
        title: "Model Bulunamadı - Ekinci Elektronik",
      };
    }

    return {
      title: `${brand.name} ${model.name} Ürünleri - Ekinci Elektronik`,
      description: `${brand.name} ${model.name} modeli için bataryalar ve diğer ürünler - Ekinci Elektronik`,
    };
  } catch (error) {
    console.error("Meta veri hatası:", error);
    return {
      title: "Ürünler - Ekinci Elektronik",
    };
  }
}

export default async function ModelProductsPage({ params }: PageProps) {
  const { brandSlug, modelSlug } = await params;

  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Marka ve model bilgilerini al
    const brand = await Brand.findOne({ slug: brandSlug });
    if (!brand) {
      console.log(`Marka bulunamadı: ${brandSlug}`);
      notFound();
    }

    const model = await Model.findOne({
      slug: modelSlug,
      brandId: brand._id,
    });

    if (!model) {
      console.log(`Model bulunamadı: ${modelSlug} (Marka ID: ${brand._id})`);
      notFound();
    }

    // Bu modele ait ürünleri al
    const products = await Product.find({
      brandId: brand._id,
      modelId: model._id,
    }).sort({ createdAt: -1 });

    console.log("Model için ürünler bulunuyor:", {
      brandId: brand._id,
      modelId: model._id,
      productsFound: products.length,
      firstProduct:
        products.length > 0
          ? {
              id: products[0]._id,
              name: products[0].name,
            }
          : null,
    });

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
        <nav className="flex mb-6 text-sm text-[#5e81ac]">
          <Link href="/products" className="hover:underline">
            Ürünler
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/products/${brand.slug}`} className="hover:underline">
            {brand.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600">{model.name}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2e3440] mb-2">
            {brand.name} {model.name} Ürünleri
          </h1>
          {model.description && (
            <p className="text-[#4c566a] mt-2">{model.description}</p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="bg-[#ebcb8b]/10 text-[#d08770] p-4 rounded-md mb-4 border-l-4 border-[#ebcb8b]">
            <p>Bu modele ait henüz ürün bulunmuyor.</p>
            <p className="mt-2">
              Lütfen daha sonra tekrar kontrol edin veya diğer modellerimize göz
              atın.
            </p>
            <Link
              href={`/products/${brand.slug}`}
              className="mt-4 inline-block text-[#5e81ac] hover:underline"
            >
              &larr; {brand.name} modellerine dön
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                href={`/product/${product._id.toString()}`}
                key={product._id.toString()}
                className="bg-white border border-[#e5e9f0] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-square relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="p-4"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#eceff4] flex items-center justify-center">
                      <span className="text-[#4c566a]">Görsel Yok</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-[#2e3440] mb-2">
                    {product.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#5e81ac]">
                      {formatCurrency(product.price)}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-[#a3be8c]/20 text-[#a3be8c]"
                          : product.stock > 0
                          ? "bg-[#ebcb8b]/20 text-[#d08770]"
                          : "bg-[#bf616a]/20 text-[#bf616a]"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} adet`
                        : "Stokta yok"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Model ürünleri sayfası hatası:", error);
    notFound();
  }
}
