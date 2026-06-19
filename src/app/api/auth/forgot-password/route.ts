import { NextResponse } from "next/server";
import { DBService } from "@/services/db";
import crypto from "crypto";

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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    DBService.updateUser(user.id, {
      resetToken,
      resetTokenExpires,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset link generated.",
      // Only expose token in non-production for sandbox/demo flow
      ...(process.env.NODE_ENV !== "production" && { resetToken }),
    });
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
