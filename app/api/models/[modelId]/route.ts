import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Model from "@/app/models/Model";
import Product from "@/app/models/Product";
import clientPromise from "@/app/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const { modelId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return NextResponse.json(
        { message: "Geçersiz model ID formatı" },
        { status: 400 }
      );
    }

    const model = await Model.findById(modelId);

    if (!model) {
      return NextResponse.json(
        { message: "Model bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ model });
  } catch (error: any) {
    console.error("Model getirme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const { modelId } = params;
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

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return NextResponse.json(
        { message: "Geçersiz model ID formatı" },
        { status: 400 }
      );
    }

    const model = await Model.findById(modelId);

    if (!model) {
      return NextResponse.json(
        { message: "Model bulunamadı" },
        { status: 404 }
      );
    }

    // Slug oluştur
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Model adının ve markasının benzersiz olduğunu kontrol et (kendisi hariç)
    const existingModel = await Model.findOne({
      name,
      brandId,
      _id: { $ne: modelId },
    });

    if (existingModel) {
      return NextResponse.json(
        { message: "Bu markada aynı isimli model zaten kayıtlı" },
        { status: 409 }
      );
    }

    // Model güncelle
    model.name = name;
    model.slug = slug;
    model.brandId = brandId;
    model.description = description || "";

    await model.save();

    return NextResponse.json(
      { message: "Model başarıyla güncellendi", model },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Model güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const { modelId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      return NextResponse.json(
        { message: "Geçersiz model ID formatı" },
        { status: 400 }
      );
    }

    const model = await Model.findById(modelId);

    if (!model) {
      return NextResponse.json(
        { message: "Model bulunamadı" },
        { status: 404 }
      );
    }

    // İlişkili ürünleri kontrol et
    const relatedProductsCount = await Product.countDocuments({ modelId });

    if (relatedProductsCount > 0) {
      return NextResponse.json(
        {
          message:
            "Bu modele bağlı ürünler bulunmaktadır. Önce ürünleri silmelisiniz.",
          relatedProductsCount,
        },
        { status: 409 }
      );
    }

    // Modeli sil
    await Model.findByIdAndDelete(modelId);

    return NextResponse.json(
      { message: "Model başarıyla silindi" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Model silme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
