# Ekinci Elektronik - Stok Yönetim Sistemi

Ekinci Elektronik firması için geliştirilmiş, bilgisayar bataryaları için özel stok yönetim sistemi.

## 🚀 Özellikler

- 👤 Kullanıcı kaydı ve girişi (NextAuth.js)
- 👑 Admin ve normal kullanıcı rolleri
- 📦 Ürün, marka ve model yönetimi
- 🔍 Modele göre ürün filtreleme
- 📊 Stok durumu takibi
- 📱 Mobil uyumlu tasarım
- 🔐 Güvenli şifre yönetimi (bcrypt)
- 🗃️ MongoDB veri tabanı entegrasyonu

## 🛠 Teknolojiler

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Tip Güvenliği
- [MongoDB](https://www.mongodb.com/) - Veri Tabanı
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [NextAuth.js](https://next-auth.js.org/) - Kimlik Doğrulama
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework

## 🏁 Başlangıç

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. Repoyu klonlayın

```bash
git clone https://github.com/kullanici/ekinci-elektronik.git
cd ekinci-elektronik
```

2. Bağımlılıkları yükleyin

```bash
npm install
# veya
yarn install
```

3. .env.local dosyasını oluşturun

```bash
cp .env.local.example .env.local
```

4. .env.local dosyasını kendi bilgilerinizle düzenleyin:

- MongoDB bağlantı bilgilerinizi
- NextAuth secret key
- (Opsiyonel) İlk admin kullanıcı bilgilerinizi

5. Geliştirme sunucusunu başlatın

```bash
npm run dev
# veya
yarn dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görebilirsiniz.

## 📂 Proje Yapısı

```
/app
  /api               # API Endpoint'leri
    /auth            # Kimlik doğrulama
    /products        # Ürün işlemleri
    /brands          # Marka işlemleri
  /components        # Yeniden kullanılabilir bileşenler
  /models            # Mongoose veri modelleri
  /lib               # Yardımcı fonksiyonlar ve bağlantılar
  /admin             # Yönetici paneli
  /products          # Ürün sayfaları
  /auth              # Giriş/Kayıt sayfaları
```

## 📋 Yapılacaklar

- [ ] Ürün resimleri için yükleme sistemi
- [ ] Sipariş yönetimi
- [ ] İstatistik ve raporlama
- [ ] Daha gelişmiş arama ve filtreleme

## 📝 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

Bu projenin geliştirilmesine katkı sağlayan herkese teşekkürler!
