import { NextRequest, NextResponse } from "next/server";

function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚫 Logged-in users should not see /login
  if (token && isAuthPage) {
    const decoded = decodeJWT(token);

    if (decoded.role === "1")
      return NextResponse.redirect(new URL("/admin", req.url));
    if (decoded.role === "2")
      return NextResponse.redirect(new URL("/employee", req.url));
  }

  // ✅ Role-based checks
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded?.role === "1" && req.nextUrl.pathname.startsWith("/employee")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (decoded?.role === "2" && req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // runs everywhere except internals
};
