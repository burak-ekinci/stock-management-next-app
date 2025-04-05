import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Brand from "@/app/models/Brand";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const brands = await Brand.find().sort({ name: 1 }); // İsme göre sırala

    return NextResponse.json({ brands });
  } catch (error: any) {
    console.error("Marka listesi hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, logo, description } = await request.json();

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

    // Marka adının benzersiz olduğunu kontrol et
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return NextResponse.json(
        { message: "Bu marka adı zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Yeni marka oluştur
    const newBrand = new Brand({
      name,
      slug,
      logo: logo || "",
      description: description || "",
    });

    await newBrand.save();

    return NextResponse.json(
      { message: "Marka başarıyla eklendi", brand: newBrand },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Marka ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
