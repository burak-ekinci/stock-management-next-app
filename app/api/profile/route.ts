import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/app/models/User";
import clientPromise from "@/app/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

// Kullanıcı kendi profilini görüntüleme
export async function GET(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekmektedir" },
        { status: 401 }
      );
    }

    // MongoDB bağlantısını sağla
    await clientPromise;

    // Mongoose bağlantısı yoksa bağlan
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Kullanıcıyı getir (şifre hariç)
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Profil bilgileri hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}

// Kullanıcı kendi profilini güncelleme
export async function PUT(request: NextRequest) {
  try {
    // Oturum kontrolü
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bu işlem için giriş yapmanız gerekmektedir" },
        { status: 401 }
      );
    }

    const { name, email, currentPassword, newPassword } = await request.json();

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

    // Kullanıcıyı getir (şifre dahil)
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // E-posta adresinin benzersiz olup olmadığını kontrol et (kullanıcının kendisi hariç)
    if (email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: session.user.id },
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
    }

    // Şifre değişikliği yapılacaksa
    if (currentPassword && newPassword) {
      // Mevcut şifreyi kontrol et
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return NextResponse.json(
          { message: "Mevcut şifre hatalı" },
          { status: 400 }
        );
      }

      // Yeni şifre uzunluğunu kontrol et
      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "Yeni şifre en az 6 karakter uzunluğunda olmalıdır" },
          { status: 400 }
        );
      }

      // Yeni şifreyi hashle
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Kullanıcı bilgilerini güncelle
    user.name = name;
    user.email = email;

    await user.save();

    // Şifreyi geri döndürmeden kullanıcı bilgilerini gönder
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json(
      {
        message: "Profil bilgileriniz başarıyla güncellendi",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası: " + (error.message || "Bilinmeyen hata") },
      { status: 500 }
    );
  }
}
