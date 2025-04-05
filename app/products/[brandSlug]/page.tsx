import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IBrand } from "@/app/models/Brand";
import { IModel } from "@/app/models/Model";
import clientPromise from "@/app/lib/mongodb";
import mongoose from "mongoose";
import Brand from "@/app/models/Brand";
import Model from "@/app/models/Model";
import Product from "@/app/models/Product";

interface Props {
  params: Promise<{
    brandSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  if (!brand) {
    return {
      title: "Marka Bulunamadı - Ekinci Elektronik",
      description: "Aradığınız marka bulunamadı.",
    };
  }

  return {
    title: `${brand.name} Modelleri - Ekinci Elektronik`,
    description: `Ekinci Elektronik'te ${brand.name} marka bilgisayarlar için batarya modelleri.`,
  };
}

async function getBrandBySlug(slug: string): Promise<IBrand | null> {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const brand = await Brand.findOne({ slug });
    if (!brand) return null;

    return JSON.parse(JSON.stringify(brand));
  } catch (error) {
    console.error("Marka alınırken hata oluştu:", error);
    return null;
  }
}

async function getModelsByBrandId(brandId: string): Promise<IModel[]> {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const models = await Model.find({ brandId }).sort({ name: 1 });
    return JSON.parse(JSON.stringify(models));
  } catch (error) {
    console.error("Modeller alınırken hata oluştu:", error);
    return [];
  }
}

async function getProductsByBrandId(brandId: string): Promise<any[]> {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const products = await Product.find({ brandId })
      .populate("modelId")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Ürünler alınırken hata oluştu:", error);
    return [];
  }
}

export default async function BrandPage({ params }: Props) {
  const { brandSlug } = await params;
  const brand = await getBrandBySlug(brandSlug);

  if (!brand) {
    notFound();
  }

  const models = await getModelsByBrandId(brand._id as string);
  const products = await getProductsByBrandId(brand._id as string);

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-gray-100 py-8 px-4 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-6 max-w-4xl mx-auto">
          <div className="flex-shrink-0">
            {brand.logo ? (
              <div className="relative h-32 w-32">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : (
              <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-500">
                  {brand.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl text-black font-bold mb-3">{brand.name}</h1>
            {brand.description && (
              <p className="text-gray-700 mb-4">{brand.description}</p>
            )}
            <div className="flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <span>Tüm Markalar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold text-black mb-6">
          {brand.name} Modelleri
          <hr />
        </h2>

        {models.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-yellow-700">
              Bu markaya ait henüz model eklenmemiş. Lütfen daha sonra tekrar
              kontrol edin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <Link
                key={model._id as string}
                href={`/products/${brand.slug}/${model.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-black">
                    {model.name}
                  </h3>
                  {model.description && (
                    <p className="mt-2 text-gray-600 text-center">
                      {model.description}
                    </p>
                  )}
                  <div className="mt-4 text-center">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Ürünleri Gör
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {products.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-black mb-6">
            {brand.name} Ürünleri
            <hr />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id.toString()}
                href={`/product/${product._id.toString()}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-square relative">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Görsel Yok</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Model: {product.modelId.name}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(product.price)}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-100 text-green-800"
                          : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
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
        </section>
      )}

      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-3">
          {brand.name} Bataryaları Hakkında
        </h2>
        <p className="text-gray-700">
          {brand.name} marka bilgisayarlar için batarya seçimi, cihazınızın
          modeline göre farklılık göstermektedir. Doğru ürünü seçmek için,
          bilgisayarınızın tam modelini belirlemelisiniz.
        </p>
        <p className="text-gray-700 mt-2">
          Ekinci Elektronik olarak, tüm {brand.name} modelleri için yüksek
          kaliteli, uzun ömürlü ve güvenilir batarya seçenekleri sunuyoruz.
        </p>
      </section>
    </div>
  );
}
