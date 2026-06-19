/* ─── Auth Types ─────────────────────────────────────────────────── */

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  track: "python" | "javascript" | "both" | null;
  xp: number;
  level: number;
  streak: number;
  joinedAt: string;
  portfolio?: {
    title: string;
    location: string;
    phone: string;
    github: string;
    linkedin: string;
    summary: string;
    skills: {
      languages: string[];
      frameworks: string[];
      tools: string[];
    };
    experiences: Array<{
      id: string;
      company: string;
      role: string;
      dates: string;
      description: string;
    }>;
    projects: Array<{
      id: string;
      name: string;
      tech: string;
      description: string;
      url: string;
    }>;
    education: Array<{
      id: string;
      school: string;
      degree: string;
      dates: string;
    }>;
  };
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
  | "username_taken"
  | "weak_password"
  | "invalid_email"
  | "social_account"
  | "email_not_verified"
  | "network_error"
  | "unknown";

export const AUTH_ERROR_MESSAGES: Record<AuthError, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_taken: "An account with this email already exists.",
  username_taken: "This username is already taken.",
  weak_password: "Password must be at least 8 characters.",
  invalid_email: "Please enter a valid email address.",
  social_account: "This account uses Google or SSO sign-in. Please use the social login buttons.",
  email_not_verified: "Please verify your email before logging in.",
  network_error: "Network error. Please try again.",
  unknown: "Something went wrong. Please try again.",
};
