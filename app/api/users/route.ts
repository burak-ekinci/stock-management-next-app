import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/models/User";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

// Tüm kullanıcıları getir
export async function GET(request: NextRequest) {
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

    // URL'den arama parametrelerini al
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("search") || "";

    // Arama sorgusu oluştur
    let query = {};
    if (searchQuery) {
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // Kullanıcıları getir (şifre hariç)
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error("Kullanıcılar listesi hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Bu işlem için yetkiniz bulunmamaktadır" },
        { status: 403 }
      );
    }

    const { name, email, password, role } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "İsim, e-posta ve şifre alanları zorunludur" },
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

    // E-posta adresi kullanılabilir mi kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 409 }
      );
    }

    // Şifre hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    await user.save();

    // Şifreyi geri döndürmeden kullanıcı bilgilerini gönder
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      { message: "Kullanıcı başarıyla oluşturuldu", user: userResponse },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Kullanıcı oluşturma hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
