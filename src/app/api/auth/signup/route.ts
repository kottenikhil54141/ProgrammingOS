import { NextResponse } from "next/server";
import { DBService, hashPassword } from "@/services/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, password, username, track, goal } = data;

    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "missing_fields" },
        { status: 400 }
      );
    }

    // Server-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "invalid_email" },
        { status: 400 }
      );
    }

    // Email check
    const existingEmail = DBService.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "email_taken" },
        { status: 400 }
      );
    }

    // Username check
    const existingUser = DBService.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: "username_taken" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "weak_password" },
        { status: 400 }
      );
    }

    const { hash, salt } = hashPassword(password);
    // Cryptographically secure random token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = DBService.createUser({
      name,
      username,
      email,
      passwordHash: hash,
      salt,
      role: "user",
      authProvider: "password",
      theme: "light",
      isVerified: false,
      verificationToken,
      learningPreferences: {
        track: track || "both",
        goal: goal || "job",
      },
    });

    // Strip sensitive fields
    const { passwordHash, salt: _, verificationToken: __, ...safeUser } = newUser;

    return NextResponse.json({
      user: safeUser,
      message: "Signup successful. Verification email simulated.",
      // Only expose the token in non-production environments for sandbox testing
      ...(process.env.NODE_ENV !== "production" && { verificationToken }),
    });
  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
