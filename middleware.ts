import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware fonksiyonu
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Korumasız rotalar (halka açık)
  const publicRoutes = [
    "/",
    "/products",
    "/auth/login",
    "/auth/register",
    "/api/auth/register",
  ];

  // API rotaları için özel izinler
  const publicApiRoutes = [
    "/api/auth/session",
    "/api/auth/signin",
    "/api/auth/providers",
    "/api/auth/callback",
    "/api/auth/csrf",
  ];

  // İfadeler ile eşleşen rotalar
  const isNextAuthRoute = pathname.startsWith("/api/auth");
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProductsSubRoute = pathname.startsWith("/products/");
  const isStaticAsset = pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/);

  // Genel erişime açık rotalar veya statik dosyalar
  if (
    isPublicRoute ||
    isPublicApiRoute ||
    isProductsSubRoute ||
    isStaticAsset
  ) {
    return NextResponse.next();
  }

  // NextAuth rotaları (genel API'ler)
  if (isNextAuthRoute) {
    return NextResponse.next();
  }

  // JWT token'ı al
  const token = await getToken({ req: request });

  // Oturum açılmadıysa giriş sayfasına yönlendir
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Admin korumalı rotalar
  const adminProtectedRoutes = [
    "/admin",
    "/api/brands",
    "/api/models",
    "/api/products",
    "/api/users",
    "/api/profile",
  ];

  const isAdminRoute = adminProtectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route
  );

  // Admin değilse ama admin rotasına erişmeye çalışıyorsa ana sayfaya yönlendir
  if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Diğer durumlarda normal işleme devam et
  return NextResponse.next();
}

// Hangi rotaların middleware tarafından işleneceğini belirt
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
