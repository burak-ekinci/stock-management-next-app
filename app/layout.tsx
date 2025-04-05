import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/app/components/SessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekinci Elektronik - Laptop Batarya Uzmanı",
  description:
    "Bilgisayar, tablet, klavye ve diğer elektronik ürünler için batarya satışı yapan uzman mağaza.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#eceff4]`}
      >
        <SessionProvider session={session}>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <footer className="bg-[#4c566a] text-white py-6 mt-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2">Ekinci Elektronik</h3>
                  <p className="text-sm text-[#d8dee9]">
                    Bilgisayar ürünleri ve batarya uzmanı
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">İletişim</h4>
                  <p className="text-sm text-[#d8dee9]">
                    info@ekincielektronik.com
                  </p>
                  <p className="text-sm text-[#d8dee9]">+90 555 123 4567</p>
                </div>
              </div>
              <div className="mt-6 border-t border-[#3b4252] pt-4 text-center text-sm text-[#d8dee9]">
                &copy; {new Date().getFullYear()} Ekinci Elektronik. Tüm hakları
                saklıdır.
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
