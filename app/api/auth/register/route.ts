import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "@/app/models/User";
import clientPromise from "@/app/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Temel doğrulama kontrolleri
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    // E-posta geçerlilik kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi giriniz" },
        { status: 400 }
      );
    }

    // Şifre uzunluk kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // E-posta adresi kayıtlı mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kullanımda" },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // Varsayılan olarak standart kullanıcı rolü
    });

    await newUser.save();

    // Şifreyi kaldırarak kullanıcı bilgilerini döndür
    const createdUser = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: "Kayıt başarılı", user: createdUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
