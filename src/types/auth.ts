/* ─── Auth Types ─────────────────────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  track: "python" | "javascript" | "both" | null;
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupStep1 {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupStep2 {
  name: string;
  username: string;
}

export interface SignupStep3 {
  track: "python" | "javascript" | "both";
  goal: "job" | "freelance" | "hobby" | "upskill";
}

export type SignupData = SignupStep1 & SignupStep2 & SignupStep3;

export type AuthError =
  | "invalid_credentials"
  | "email_taken"
  | "weak_password"
  | "network_error"
  | "unknown";

export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_taken: "An account with this email already exists.",
  weak_password: "Password must be at least 8 characters.",
  network_error: "Network error. Please try again.",
  unknown: "Something went wrong. Please try again.",
};
