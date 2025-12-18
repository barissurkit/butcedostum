import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");

async function isLoggedIn(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  if (!token) return false;
  if (!process.env.JWT_SECRET) return false;

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const logged = await isLoggedIn(req);

  // 1) Login olmayan dashboard'a giremesin
  if (!logged && pathname.startsWith("/dashboard")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // İstersen geri dönmek için:
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // 2) Login olmuş kişi login/register sayfasına gitmesin
  if (logged && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
