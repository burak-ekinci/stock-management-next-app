import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Model from "@/app/models/Model";
import Brand from "@/app/models/Brand";
import clientPromise from "@/app/lib/mongodb";

interface Params {
  params: {
    brandId: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { brandId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Marka kontrolü
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json(
        { message: "Belirtilen marka bulunamadı" },
        { status: 404 }
      );
    }

    const models = await Model.find({ brandId }).sort({ name: 1 });

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("Model listesi hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { brandId } = params;
    const { name, description } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name) {
      return NextResponse.json(
        { message: "Model adı zorunludur" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Marka kontrolü
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json(
        { message: "Belirtilen marka bulunamadı" },
        { status: 404 }
      );
    }

    // Model adının ve markasının benzersiz olduğunu kontrol et
    const existingModel = await Model.findOne({ name, brandId });
    if (existingModel) {
      return NextResponse.json(
        { message: "Bu markada aynı isimli model zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Yeni model oluştur
    const newModel = new Model({
      name,
      slug,
      brandId,
      description: description || "",
    });

    await newModel.save();

    return NextResponse.json(
      { message: "Model başarıyla eklendi", model: newModel },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Model ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
