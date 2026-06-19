"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/constants/routes";
import { ArrowLeft, User, Mail, Shield, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

// Google Icon Component
function GoogleBrandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface OAuthAccount {
  name: string;
  email: string;
  username: string;
  avatarUrl?: string;
  initials: string;
  bgGradient: string;
}

const GOOGLE_ACCOUNTS: OAuthAccount[] = [
  {
    name: "Nik Developer",
    email: "nik.developer@gmail.com",
    username: "nik_dev",
    initials: "ND",
    bgGradient: "from-indigo-500 to-purple-600",
  },
  {
    name: "Guest Coder",
    email: "guest.coder@gmail.com",
    username: "guest_coder",
    initials: "GC",
    bgGradient: "from-emerald-500 to-teal-600",
  },
];

const SSO_ACCOUNTS: OAuthAccount[] = [
  {
    name: "SSO User",
    email: "sso-user@niks.ai",
    username: "sso_user",
    initials: "SU",
    bgGradient: "from-indigo-600 to-blue-700",
  },
  {
    name: "Enterprise Admin",
    email: "admin@enterprise.com",
    username: "ent_admin",
    initials: "EA",
    bgGradient: "from-slate-700 to-slate-900",
  },
];

function OAuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithProvider } = useAuth();

  const providerParam = searchParams.get("provider") || "google";
  const provider: "google" | "sso" = providerParam === "sso" ? "sso" : "google";

  const accounts = provider === "google" ? GOOGLE_ACCOUNTS : SSO_ACCOUNTS;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Custom account fields
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customUsername, setCustomUsername] = useState("");

  const handleSelectAccount = async (account: { name: string; email: string; username: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: loginError } = await loginWithProvider(provider, account);
      if (loginError) {
        setError("Failed to authenticate. Please try again.");
      } else {
        router.push(ROUTES.DASHBOARD);
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const username = customUsername.trim() || customEmail.split("@")[0];
    const name = customName.trim() || username;

    handleSelectAccount({ name, email: customEmail, username });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md animate-fade-in my-8 px-4">
      {/* Back button */}
      <div className="flex justify-start">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-text transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      {/* Main Consent Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface/95 shadow-2xl backdrop-blur-2xl p-6 sm:p-8">
        {/* Glow decoration */}
        <div
          className={cn(
            "pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-20 blur-2xl",
            provider === "google" ? "bg-blue-500" : "bg-emerald-600"
          )}
        />

        {/* Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-2.5 mb-3">
            {provider === "google" ? (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white dark:bg-slate-900 border border-border-subtle shadow-md">
                <GoogleBrandIcon />
              </div>
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0F172A]/[0.05] dark:bg-white/[0.05] border border-border-subtle shadow-md text-[#FF6B4A]">
                <Shield className="h-6 w-6" />
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-text">
            {provider === "google" ? "Sign in with Google" : "Authorize via SSO"}
          </h1>
          <p className="text-xs text-muted mt-1">
            to continue to <span className="font-semibold text-text">NIK's AI</span>
          </p>
        </div>

        {/* Loading Spinner Overlays */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface/80 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className={cn(
                "h-10 w-10 rounded-full border-4 border-t-transparent",
                provider === "google" ? "border-blue-500" : "border-[#FF6B4A]"
              )}
            />
            <span className="mt-4 text-xs font-semibold text-text">
              Connecting accounts...
            </span>
          </div>
        )}

        {/* Body content */}
        <div className="py-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl border border-red-500/20 bg-red-500/[0.04] text-xs text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!showCustomForm ? (
              <motion.div
                key="accounts-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted block mb-1">
                  Select a sandbox account
                </span>

                <div className="space-y-2">
                  {accounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => handleSelectAccount(account)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-border-subtle bg-white/[0.02] dark:bg-white/[0.02] hover:bg-[#0F172A]/[0.03] dark:hover:bg-white/[0.05] hover:border-border-medium transition-all duration-200 text-left group"
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0",
                          account.bgGradient
                        )}
                      >
                        {account.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text group-hover:text-text/95 truncate">
                          {account.name}
                        </div>
                        <div className="text-xs text-muted truncate">
                          {account.email}
                        </div>
                      </div>
                      <div className="h-5 w-5 rounded-full border border-border-subtle group-hover:border-border-medium group-hover:bg-[#FF6B4A]/5 flex items-center justify-center transition-colors">
                        <Check className="h-3 w-3 text-[#FF6B4A] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomForm(true)}
                  className="w-full py-3.5 text-center text-xs font-semibold text-text/80 hover:text-text border border-dashed border-border-subtle rounded-2xl hover:border-border-medium hover:bg-[#0F172A]/[0.01] dark:hover:bg-white/[0.01] transition-colors"
                >
                  + Use another custom profile
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="custom-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleCustomSubmit}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                    Custom Account Details
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-xs font-bold text-[#FF6B4A] hover:underline"
                  >
                    View Sandbox Profiles
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="oauth-name" className="block text-xs font-medium text-text/80">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        id="oauth-name"
                        type="text"
                        required
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-border-subtle bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-text placeholder-muted/50 outline-none transition-all focus:border-[#7C5CFF]/60 focus:ring-2 focus:ring-[#7C5CFF]/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="oauth-email" className="block text-xs font-medium text-text/80">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        id="oauth-email"
                        type="email"
                        required
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="w-full rounded-xl border border-border-subtle bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-text placeholder-muted/50 outline-none transition-all focus:border-[#7C5CFF]/60 focus:ring-2 focus:ring-[#7C5CFF]/15"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="oauth-username" className="block text-xs font-medium text-text/80">
                      Username (Optional)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        <span className="text-xs font-semibold select-none font-mono">@</span>
                      </div>
                      <input
                        id="oauth-username"
                        type="text"
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full rounded-xl border border-border-subtle bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-text placeholder-muted/50 outline-none transition-all focus:border-[#7C5CFF]/60 focus:ring-2 focus:ring-[#7C5CFF]/15"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className={cn(
                    "w-full py-3.5 rounded-2xl text-xs font-semibold text-white transition-all shadow-md active:scale-[0.98]",
                    provider === "google"
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/10"
                      : "bg-[#FF6B4A] hover:bg-[#FF8B70] shadow-[#FF6B4A]/10"
                  )}
                >
                  {provider === "google" ? "Continue" : "Authorize SSO"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Security & Info consent footer */}
        <div className="border-t border-border-subtle pt-4 mt-2">
          <div className="flex gap-2.5 items-start">
            <Shield className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted leading-relaxed">
              {provider === "google" ? (
                <>
                  To continue, Google will share your name, email address, language preference,
                  and profile picture with NIK&apos;s AI.
                </>
              ) : (
                <>
                  To continue, SSO will authenticate your identity and share your work profile 
                  with NIK&apos;s AI.
                </>
              )}
            </p>
          </div>

          <div className="flex gap-4 justify-center text-[10px] text-muted hover:text-text/75 font-medium mt-4">
            <Link href="#" className="hover:underline flex items-center gap-1">
              Privacy Policy <ExternalLink className="h-2.5 w-2.5" />
            </Link>
            <span className="text-border-subtle">•</span>
            <Link href="#" className="hover:underline flex items-center gap-1">
              Terms of Service <ExternalLink className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7C5CFF] border-t-transparent" />
        </div>
      }
    >
      <OAuthPageContent />
    </Suspense>
  );
}
