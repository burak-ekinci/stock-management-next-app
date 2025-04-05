import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero bölümü */}
      <section className="bg-[#4c566a] text-white rounded-xl overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="p-8 md:p-12 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Ekinci Elektronik&apos;e Hoş Geldiniz
            </h1>
            <p className="text-lg mb-6 text-[#e5e9f0]">
              Bilgisayar ve elektronik ürünler için en güvenilir batarya
              çözümleri. Tüm marka ve modeller için özel ürünlerle
              hizmetinizdeyiz.
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#f1953e] hover:bg-[#f1953e] text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Ürünleri Keşfet
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-full w-full min-h-[500px]">
              <Image
                src="/banner.png"
                alt="Electronics"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler bölümü */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2e3440]">
          Neden Bizi Tercih Etmelisiniz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#f1953e]">
            <h3 className="text-xl font-semibold mb-3 text-[#4c566a]">
              Güvenilir Ürünler
            </h3>
            <p className="text-gray-700">
              Tüm ürünlerimiz orijinal veya yüksek kaliteli muadillerden
              seçilmektedir. Güvenliğiniz bizim için önceliklidir.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#f1953e]">
            <h3 className="text-xl font-semibold mb-3 text-[#4c566a]">
              Geniş Ürün Yelpazesi
            </h3>
            <p className="text-gray-700">
              Farklı marka ve modellere uygun, zengin ürün çeşitliliği ile
              ihtiyacınız olan bataryayı kolayca bulabilirsiniz.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#f1953e]">
            <h3 className="text-xl font-semibold mb-3 text-[#4c566a]">
              Teknik Destek
            </h3>
            <p className="text-gray-700">
              Uzman ekibimiz, ürün seçiminden kuruluma kadar tüm aşamalarda
              teknik destek sağlamaktadır.
            </p>
          </div>
        </div>
      </section>

      {/* Popüler Markalar bölümü */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2e3440]">
          Popüler Markalar
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/products?brand=asus"
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300 hover:bg-[#eceff4]"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#f1953e]">Asus</h3>
            </div>
          </Link>
          <Link
            href="/products?brand=hp"
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300 hover:bg-[#eceff4]"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#f1953e]">HP</h3>
            </div>
          </Link>
          <Link
            href="/products?brand=dell"
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300 hover:bg-[#eceff4]"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#f1953e]">Dell</h3>
            </div>
          </Link>
          <Link
            href="/products?brand=lenovo"
            className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300 hover:bg-[#eceff4]"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#f1953e]">Lenovo</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Hakkımızda kısa bilgi */}
      <section className="py-8 bg-[#eceff4] rounded-xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-[#2e3440]">
          Ekinci Elektronik Hakkında
        </h2>
        <p className="text-gray-700 mb-4">
          Ekinci Elektronik, uzun yıllardır elektronik ürünler ve özellikle
          bilgisayar bataryaları konusunda hizmet veren güvenilir bir markadır.
          Müşteri memnuniyetini ön planda tutarak, kaliteli ürünleri uygun
          fiyatlarla sunmayı hedefliyoruz.
        </p>
        <p className="text-gray-700">
          Profesyonel ekibimiz ve geniş ürün yelpazemiz ile sizlere en iyi
          hizmeti sunmak için çalışıyoruz. Ekinci Elektronik olarak temel
          amacımız, elektronik ürünleri güvenle kullanmanızı sağlamaktır.
        </p>
      </section>
    </div>
  );
}
