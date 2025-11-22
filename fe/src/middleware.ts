import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/agency", "/dashboard", "/checkout", "/orders"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const refreshToken = cookies.get("refresh_token")?.value;
  const isLoggedIn = !!refreshToken;

  console.log(
    "path:",
    pathname,
    "| refresh_token:",
    refreshToken,
    "| logged:",
    isLoggedIn
  );

  if (isProtectedPath(pathname) && !isLoggedIn) {
    const homeUrl = new URL("/", request.url);
    homeUrl.searchParams.set("redirect", pathname + nextUrl.search);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agency/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};
