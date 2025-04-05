import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Brand from "@/app/models/Brand";
import Model from "@/app/models/Model";
import Product from "@/app/models/Product";
import clientPromise from "@/app/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return NextResponse.json(
        { message: "Geçersiz marka ID formatı" },
        { status: 400 }
      );
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return NextResponse.json(
        { message: "Marka bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ brand });
  } catch (error: any) {
    console.error("Marka getirme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;
    const { name, description, logo } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name) {
      return NextResponse.json(
        { message: "Marka adı zorunludur" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return NextResponse.json(
        { message: "Geçersiz marka ID formatı" },
        { status: 400 }
      );
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return NextResponse.json(
        { message: "Marka bulunamadı" },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Marka güncelle
    brand.name = name;
    brand.slug = slug;
    brand.description = description || "";
    if (logo) brand.logo = logo;

    await brand.save();

    return NextResponse.json(
      { message: "Marka başarıyla güncellendi", brand },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Marka güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return NextResponse.json(
        { message: "Geçersiz marka ID formatı" },
        { status: 400 }
      );
    }

    const brand = await Brand.findById(brandId);

    if (!brand) {
      return NextResponse.json(
        { message: "Marka bulunamadı" },
        { status: 404 }
      );
    }

    // İlişkili modelleri ve ürünleri kontrol et
    const relatedModelsCount = await Model.countDocuments({ brandId });

    if (relatedModelsCount > 0) {
      return NextResponse.json(
        {
          message:
            "Bu markaya bağlı modeller bulunmaktadır. Önce modelleri silmelisiniz.",
          relatedModelsCount,
        },
        { status: 409 }
      );
    }

    // Markayı sil
    await Brand.findByIdAndDelete(brandId);

    return NextResponse.json(
      { message: "Marka başarıyla silindi" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Marka silme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
