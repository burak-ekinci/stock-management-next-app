import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/models/Product";
import Brand from "@/app/models/Brand";
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

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");
    const modelId = searchParams.get("modelId");
    const query: any = {};

    if (brandId) {
      query.brandId = brandId;
    }

    if (modelId) {
      query.modelId = modelId;
    }

    const products = await Product.find(query)
      .populate("brandId", "name") // Marka bilgilerini getir
      .populate("modelId", "name") // Model bilgilerini getir
      .sort({ createdAt: -1 }); // Yeni eklenenler önce

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Ürün listesi hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      brandId,
      modelId,
      price,
      stock,
      image,
      description,
      features,
    } = await request.json();

    // Temel doğrulama kontrolleri
    if (
      !name ||
      !brandId ||
      !modelId ||
      price === undefined ||
      stock === undefined
    ) {
      return NextResponse.json(
        { message: "Tüm zorunlu alanları doldurunuz" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Marka ve model kontrolü
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return NextResponse.json(
        { message: "Belirtilen marka bulunamadı" },
        { status: 404 }
      );
    }

    const model = await Model.findById(modelId);
    if (!model) {
      return NextResponse.json(
        { message: "Belirtilen model bulunamadı" },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Yeni ürün oluştur
    const newProduct = new Product({
      name,
      slug,
      brandId,
      modelId,
      price,
      stock,
      image: image || "",
      description: description || "",
      features: features || {},
    });

    await newProduct.save();

    return NextResponse.json(
      { message: "Ürün başarıyla eklendi", product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
