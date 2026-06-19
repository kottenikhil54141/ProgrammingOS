import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DBService } from "@/services/db";
import { verifyJWT } from "@/utils/jwt";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get("refresh_token");

    if (!refreshCookie?.value) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(refreshCookie.value);
    if (!payload || payload.sessionType !== "refresh") {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const body = await request.json();
    const { portfolio } = body;

    const user = DBService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "user_not_found" },
        { status: 404 }
      );
    }

    // Update in database
    const updatedUser = DBService.updateUser(userId, { portfolio });
    if (!updatedUser) {
      return NextResponse.json(
        { error: "failed_to_update" },
        { status: 500 }
      );
    }

    const { passwordHash, salt, verificationToken, resetToken, resetTokenExpires, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error("Save Portfolio API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
