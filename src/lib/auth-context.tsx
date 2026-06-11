"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
const STORAGE_KEY = "codeversai_auth";

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
  login: (credentials: LoginCredentials) => Promise<{ error: AuthError | null }>;
  signup: (data: SignupData) => Promise<{ error: AuthError | null }>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Mock helpers (swapped for real API when backend is ready) ────── */
function createMockUser(data: SignupData): User {
  return {
    id: `user_${Date.now()}`,
    email: data.email,
    name: data.name,
    avatar: undefined,
    track: data.track,
    xp: 0,
    level: 1,
    streak: 0,
    joinedAt: new Date().toISOString(),
  };
}

function persist(user: User | null) {
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

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = loadPersistedUser();
    if (saved) {
      dispatch({ type: "SET_USER", user: saved });
    } else {
      dispatch({ type: "SET_LOADING", value: false });
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<{ error: AuthError | null }> => {
      dispatch({ type: "SET_LOADING", value: true });

      // Simulate network latency
      await new Promise((r) => setTimeout(r, 900));

      // Retrieve mock stored user
      const stored = loadPersistedUser();
      if (stored && stored.email === credentials.email) {
        dispatch({ type: "SET_USER", user: stored });
        persist(stored);
        return { error: null };
      }

      dispatch({ type: "SET_LOADING", value: false });
      return { error: "invalid_credentials" };
    },
    []
  );

  const signup = useCallback(
    async (data: SignupData): Promise<{ error: AuthError | null }> => {
      dispatch({ type: "SET_LOADING", value: true });

      await new Promise((r) => setTimeout(r, 1000));

      if (data.password.length < 8) {
        dispatch({ type: "SET_LOADING", value: false });
        return { error: "weak_password" };
      }

      const user = createMockUser(data);
      dispatch({ type: "SET_USER", user });
      persist(user);
      return { error: null };
    },
    []
  );

  const logout = useCallback(() => {
    persist(null);
    dispatch({ type: "CLEAR_USER" });
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    if (!state.user) return;
    const updated = { ...state.user, ...patch };
    persist(updated);
    dispatch({ type: "SET_USER", user: updated });
  }, [state.user]);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, signup, logout, updateUser }),
    [state, login, signup, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── Hook ──────────────────────────────────────────────────────────── */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
