import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DBService } from "@/services/db";
import { verifyJWT, signJWT } from "@/utils/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refresh_token");

    if (!refreshCookie?.value) {
      return NextResponse.json(
        { user: null, accessToken: null, error: "no_refresh_token" },
        { status: 200 }
      );
    }

    const payload = await verifyJWT(refreshCookie.value);
    if (!payload || payload.sessionType !== "refresh") {
      return NextResponse.json(
        { user: null, accessToken: null, error: "invalid_refresh_token" },
        { status: 200 }
      );
    }

    const user = DBService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { user: null, accessToken: null, error: "user_not_found" },
        { status: 200 }
      );
    }

    // Generate fresh access token
    const accessToken = await signJWT(
      { userId: user.id, email: user.email, role: user.role },
      900 // 15 mins
    );

    const { passwordHash, salt, verificationToken, resetToken, resetTokenExpires, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      accessToken,
    });
  } catch (error) {
    console.error("Refresh Token API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
