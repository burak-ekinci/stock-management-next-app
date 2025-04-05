import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/models/User";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

// Belirli bir kullanıcının bilgilerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params;

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Geçerli bir MongoDB ObjectId mi kontrol et
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Geçersiz kullanıcı ID formatı" },
        { status: 400 }
      );
    }

    // Kullanıcıyı getir (şifre hariç)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Kullanıcı getirme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Kullanıcı bilgilerini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params;
    const { name, email, password, role } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name || !email) {
      return NextResponse.json(
        { message: "İsim ve e-posta alanları zorunludur" },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi giriniz" },
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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Geçersiz kullanıcı ID formatı" },
        { status: 400 }
      );
    }

    // Kullanıcıyı getir
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // E-posta adresinin benzersiz olup olmadığını kontrol et (kullanıcının kendisi hariç)
    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor",
        },
        { status: 409 }
      );
    }

    // Kullanıcı bilgilerini güncelle
    user.name = name;
    user.email = email;
    user.role = role === "admin" ? "admin" : "user";

    // Eğer şifre değiştirilecekse
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Şifreyi geri döndürmeden kullanıcı bilgilerini gönder
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { message: "Kullanıcı başarıyla güncellendi", user: userResponse },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Kullanıcı güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Kullanıcıyı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params;

    // Kendimizi silmeye çalışıyorsak engelle
    if (session.user.id === userId) {
      return NextResponse.json(
        { message: "Kendi hesabınızı silemezsiniz" },
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
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Geçersiz kullanıcı ID formatı" },
        { status: 400 }
      );
    }

    // Kullanıcıyı sil
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Kullanıcı başarıyla silindi" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Kullanıcı silme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
