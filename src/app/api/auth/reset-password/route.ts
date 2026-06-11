import { NextResponse } from "next/server";
import { DBService, hashPassword } from "@/services/db";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "missing_fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "weak_password" },
        { status: 400 }
      );
    }

    const users = DBService.getUsers();
    const user = users.find(
      (u) =>
        u.resetToken === token &&
        u.resetTokenExpires &&
        u.resetTokenExpires > Date.now()
    );

    if (!user) {
      return NextResponse.json(
        { error: "invalid_or_expired_token" },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);

    DBService.updateUser(user.id, {
      passwordHash: hash,
      salt,
      resetToken: undefined,
      resetTokenExpires: undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
