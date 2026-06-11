import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_FILE = path.join(process.cwd(), "src/services/db.json");

export interface UserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  avatar?: string;
  role: "user" | "admin";
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
  learningPreferences?: {
    track: "python" | "javascript" | "both";
    goal: "job" | "freelance" | "hobby" | "upskill";
  };
  theme: "dark" | "light";
  isVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpires?: number;
}

// Password Hashing helpers
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === checkHash;
}

// Read database
function readDB(): UserRecord[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Create empty db or seed with mock data
      const initialUsers: UserRecord[] = [];
      
      // Seed an admin and a test user
      const adminHash = hashPassword("password123");
      const userHash = hashPassword("password123");
      
      initialUsers.push({
        id: "usr_admin",
        name: "Admin User",
        username: "admin",
        email: "admin@niks.ai",
        passwordHash: adminHash.hash,
        salt: adminHash.salt,
        role: "admin",
        xp: 1500,
        level: 12,
        streak: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: "dark",
        isVerified: true
      });

      initialUsers.push({
        id: "usr_test",
        name: "Nik Test User",
        username: "niktest",
        email: "user@niks.ai",
        passwordHash: userHash.hash,
        salt: userHash.salt,
        role: "user",
        xp: 120,
        level: 2,
        streak: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        theme: "dark",
        isVerified: true
      });

      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(initialUsers, null, 2));
      return initialUsers;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("DB read error, returning empty list:", error);
    return [];
  }
}

// Write database
function writeDB(users: UserRecord[]): void {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("DB write error:", error);
  }
}

// Service Actions
export const DBService = {
  getUsers(): UserRecord[] {
    return readDB();
  },

  getUserByEmail(email: string): UserRecord | null {
    const users = readDB();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserByUsername(username: string): UserRecord | null {
    const users = readDB();
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
  },

  getUserById(id: string): UserRecord | null {
    const users = readDB();
    return users.find((u) => u.id === id) || null;
  },

  createUser(user: Omit<UserRecord, "id" | "createdAt" | "updatedAt" | "xp" | "level" | "streak">): UserRecord {
    const users = readDB();
    const newUser: UserRecord = {
      ...user,
      id: `usr_${Math.random().toString(36).substring(2, 11)}`,
      xp: 0,
      level: 1,
      streak: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeDB(users);
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserRecord>): UserRecord | null {
    const users = readDB();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    const updatedUser = {
      ...users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users[idx] = updatedUser;
    writeDB(users);
    return updatedUser;
  },

  deleteUser(id: string): boolean {
    const users = readDB();
    const initialLen = users.length;
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === initialLen) return false;
    writeDB(filtered);
    return true;
  }
};
