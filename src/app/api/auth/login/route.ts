import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DBService, verifyPassword } from "@/services/db";
import { signJWT } from "@/utils/jwt";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 400 }
      );
    }

    const user = DBService.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "email_not_verified" },
        { status: 403 }
      );
    }

    // Generate tokens
    const accessToken = await signJWT(
      { userId: user.id, email: user.email, role: user.role },
      900 // 15 mins
    );

    const refreshToken = await signJWT(
      { userId: user.id, email: user.email, sessionType: "refresh" },
      30 * 24 * 60 * 60 // 30 days
    );

    // Set HTTP-only secure cookie for refresh token
    const cookieStore = await cookies();
    cookieStore.set({
      name: "refresh_token",
      value: refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    // Strip sensitive fields
    const { passwordHash, salt, verificationToken, resetToken, resetTokenExpires, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      accessToken,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
