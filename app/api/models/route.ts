import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Model from "@/app/models/Model";
import clientPromise from "@/app/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const models = await Model.find().sort({ name: 1 });

    return NextResponse.json({ models });
  } catch (error: any) {
    console.error("Model listesi hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, brandId, description } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name || !brandId) {
      return NextResponse.json(
        { message: "Model adı ve marka ID'si zorunludur" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
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
