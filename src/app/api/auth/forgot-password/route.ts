import { NextResponse } from "next/server";
import { DBService } from "@/services/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "missing_email" },
        { status: 400 }
      );
    }

    const user = DBService.getUserByEmail(email);
    if (!user) {
      // For security, don't reveal if user exists, but here we can return success
      return NextResponse.json({
        success: true,
        message: "If the email exists, a reset link will be sent.",
      });
    }

    const resetToken = `rst_${Math.random().toString(36).substring(2, 15)}`;
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    DBService.updateUser(user.id, {
      resetToken,
      resetTokenExpires,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link generated.",
      resetToken, // Returned for sandbox flow testing convenience
    });
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
