import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./utils/jwt";

// Paths only accessible when NOT logged in
const GUEST_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];

// Paths only accessible when logged in
const PROTECTED_PATHS = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract refresh token from cookies
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Validate the JWT
  let isValidSession = false;
  if (refreshToken) {
    const payload = await verifyJWT(refreshToken);
    if (payload && payload.sessionType === "refresh") {
      isValidSession = true;
    }
  }

  // Redirect authenticated user away from guest screens (e.g. login, signup)
  const isGuestPath = GUEST_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  if (isGuestPath && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated user away from protected screens (e.g. dashboard)
  const isProtectedPath = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  if (isProtectedPath && !isValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/dashboard/:path*",
  ],
};
