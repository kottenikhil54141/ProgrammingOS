"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthState,
  LoginCredentials,
  SignupData,
  User,
  AuthError,
} from "@/types/auth";

/* ─── Storage key ───────────────────────────────────────────────────── */
const STORAGE_KEY = "niks_ai_auth";

/* ─── Reducer ───────────────────────────────────────────────────────── */
type AuthAction =
  | { type: "SET_USER"; user: User }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; value: boolean };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { user: action.user, isLoading: false, isAuthenticated: true };
    case "CLEAR_USER":
      return { user: null, isLoading: false, isAuthenticated: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    default:
      return state;
  }
}

/* ─── Context ───────────────────────────────────────────────────────── */
interface AuthContextValue extends AuthState {
  accessToken: string | null;
  login: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>;
  loginWithProvider: (
    provider: "google" | "sso",
    oauthDetails?: { email: string; name: string; username: string }
  ) => Promise<{ error: AuthError | null }>;
  signup: (data: SignupData) => Promise<{ error: AuthError | null; verificationToken?: string }>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function loadPersistedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/* ─── Provider ──────────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Silent session refresh / rehydration
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.accessToken && data.user) {
          setAccessToken(data.accessToken);
          dispatch({ type: "SET_USER", user: data.user });
          persistUser(data.user);
          return true;
        }
      }
    } catch (err) {
      console.error("Session refresh network error:", err);
    }
    // If refresh fails, clear auth state
    setAccessToken(null);
    dispatch({ type: "CLEAR_USER" });
    persistUser(null);
    return false;
  }, []);

  // Rehydrate on mount
  useEffect(() => {
    async function initAuth() {
      // 1. Check local storage optimistically to render UI instantly
      const local = loadPersistedUser();
      if (local) {
        dispatch({ type: "SET_USER", user: local });
      }
      
      // 2. Silently verify session via cookie refresh in background
      const success = await refreshSession();
      if (!success && !local) {
        dispatch({ type: "SET_LOADING", value: false });
      }
    }
    initAuth();
  }, [refreshSession]);

  // Login handler
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ error: AuthError | null }> => {
      dispatch({ type: "SET_LOADING", value: true });
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await res.json();

        if (!res.ok) {
          dispatch({ type: "SET_LOADING", value: false });
          return { error: data.error || "invalid_credentials" };
        }

        setAccessToken(data.accessToken);
        dispatch({ type: "SET_USER", user: data.user });
        persistUser(data.user);
        return { error: null };
      } catch {
        dispatch({ type: "SET_LOADING", value: false });
        return { error: "network_error" };
      }
    },
    []
  );

  // Signup handler
  const signup = useCallback(
    async (data: SignupData): Promise<{ error: AuthError | null; verificationToken?: string }> => {
      dispatch({ type: "SET_LOADING", value: true });
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const resData = await res.json();

        dispatch({ type: "SET_LOADING", value: false });
        if (!res.ok) {
          return { error: resData.error || "unknown" };
        }

        return { error: null, verificationToken: resData.verificationToken };
      } catch {
        dispatch({ type: "SET_LOADING", value: false });
        return { error: "network_error" };
      }
    },
    []
  );

  // Social Login handler
  const loginWithProvider = useCallback(
    async (
      provider: "google" | "sso",
      oauthDetails?: { email: string; name: string; username: string }
    ): Promise<{ error: AuthError | null }> => {
      dispatch({ type: "SET_LOADING", value: true });
      try {
        const res = await fetch("/api/auth/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, ...oauthDetails }),
        });
        const data = await res.json();

        if (!res.ok) {
          dispatch({ type: "SET_LOADING", value: false });
          return { error: data.error || "unknown" };
        }

        setAccessToken(data.accessToken);
        dispatch({ type: "SET_USER", user: data.user });
        persistUser(data.user);
        return { error: null };
      } catch {
        dispatch({ type: "SET_LOADING", value: false });
        return { error: "network_error" };
      }
    },
    []
  );

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout network issue:", err);
    }
    setAccessToken(null);
    dispatch({ type: "CLEAR_USER" });
    persistUser(null);
  }, []);

  // Update user details locally
  const updateUser = useCallback((patch: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...patch };
    persistUser(updated);
    dispatch({ type: "SET_USER", user: updated });
  }, [state.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      accessToken,
      login,
      loginWithProvider,
      signup,
      logout,
      updateUser,
      refreshSession,
    }),
    [state, accessToken, login, loginWithProvider, signup, logout, updateUser, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ──────────────────────────────────────────────────────────── */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
