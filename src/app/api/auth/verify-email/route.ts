import { NextResponse } from "next/server";
import { DBService } from "@/services/db";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "missing_token" },
        { status: 400 }
      );
    }

    const users = DBService.getUsers();
    const user = users.find((u) => u.verificationToken === token);

    if (!user) {
      return NextResponse.json(
        { error: "invalid_verification_token" },
        { status: 400 }
      );
    }

    DBService.updateUser(user.id, {
      isVerified: true,
      verificationToken: undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("Verify Email API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
