import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DBService, hashPassword } from "@/services/db";
import { signJWT } from "@/utils/jwt";

export async function POST(request: Request) {
  try {
    const { provider, email: customEmail, name: customName, username: customUsername } = await request.json();

    if (!provider || (provider !== "google" && provider !== "sso")) {
      return NextResponse.json(
        { error: "invalid_provider" },
        { status: 400 }
      );
    }

    const email = customEmail || `${provider}-user@niks.ai`;
    let user = DBService.getUserByEmail(email);

    if (!user) {
      // Create a mock social user
      const name = customName || (provider === "google" ? "Google User" : "SSO User");
      const username = customUsername || email.split("@")[0] || `${provider}_user`;
      const { hash, salt } = hashPassword("social-login-placeholder-pass");
      
      user = DBService.createUser({
        name,
        username,
        email,
        passwordHash: hash,
        salt,
        role: "user",
        theme: "light",
        isVerified: true,
        learningPreferences: {
          track: "both",
          goal: "job",
        },
      });
    } else if (!user.isVerified) {
      // Ensure verified
      DBService.updateUser(user.id, { isVerified: true });
      user.isVerified = true;
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

    // Set cookie
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

    const { passwordHash, salt, verificationToken, resetToken, resetTokenExpires, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      accessToken,
    });
  } catch (error) {
    console.error("Social login API error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
