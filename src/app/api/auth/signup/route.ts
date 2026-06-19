import { NextResponse } from "next/server";
import { DBService, hashPassword } from "@/services/db";

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
    const verificationToken = `vtok_${Math.random().toString(36).substring(2, 15)}`;

    const newUser = DBService.createUser({
      name,
      username,
      email,
      passwordHash: hash,
      salt,
      role: "user",
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
      // Return the token so client-side sandbox can verify it easily without actual email transport
      verificationToken,
    });
  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { error: "unknown" },
      { status: 500 }
    );
  }
}
