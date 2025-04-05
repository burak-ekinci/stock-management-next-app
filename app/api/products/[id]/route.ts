import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/app/models/Product";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Ürün detayını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const product = await Product.findById(params.id)
      .populate("brandId")
      .populate("modelId");

    if (!product) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("Ürün detayı hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Ürün güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Yetki kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const { name, brandId, modelId, price, stock, image, description } =
      await request.json();

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

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        slug,
        brandId,
        modelId,
        price,
        stock,
        image,
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ürün başarıyla güncellendi",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Ürün silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Yetki kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Ürün bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Ürün başarıyla silindi",
      deletedId: params.id,
    });
  } catch (error: any) {
    console.error("Ürün silme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
