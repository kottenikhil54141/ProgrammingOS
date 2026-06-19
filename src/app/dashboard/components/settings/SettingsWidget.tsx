"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { User, Lock, Bell } from "lucide-react";
import { cn } from "@/utils/cn";

type SettingTab = "profile" | "security" | "notifications";

export default function SettingsWidget() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingTab>("profile");

  // Form states
  const [name, setName] = useState(user?.name || "");
  const [track, setTrack] = useState<"python" | "javascript" | "both">(
    (user?.track && user.track !== null) ? user.track : "python"
  );

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  // Verification states
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateUser({ name, track: track as any });
    triggerSuccess();
  }

  function handleSendCode() {
    if (verificationMethod === "phone" && !phoneNumber.trim()) {
      setVerificationError("Please enter a valid phone number.");
      return;
    }
    setVerificationError(null);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(code);
    setVerificationSent(true);
    setDebugMessage(`Verification code sent via ${verificationMethod.toUpperCase()}: ${code}`);
  }

  function handleSaveSecurity(e: React.FormEvent) {
    e.preventDefault();
    if (!verificationSent) {
      setVerificationError("Please request a verification code first.");
      return;
    }
    if (enteredCode.trim() !== verificationCode) {
      setVerificationError("Invalid verification code. Unable to change password.");
      return;
    }

    // Success path
    setVerificationError(null);
    setDebugMessage(null);
    setCurrentPw("");
    setNewPw("");
    setVerificationSent(false);
    setEnteredCode("");
    setVerificationCode("");
    triggerSuccess();
  }

  function triggerSuccess() {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">Account Preferences</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Configure profile settings, theme choices, security keys, and study goals.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-1.5 md:col-span-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-left transition-all outline-none",
              activeTab === "profile" ? "bg-border-subtle/50 text-[#7C5CFF]" : "text-muted hover:text-text"
            )}
          >
            <User className="h-4 w-4 shrink-0" />
            <span>Profile Detail</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-left transition-all outline-none",
              activeTab === "security" ? "bg-border-subtle/50 text-[#7C5CFF]" : "text-muted hover:text-text"
            )}
          >
            <Lock className="h-4 w-4 shrink-0" />
            <span>Password Keys</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold text-left transition-all outline-none",
              activeTab === "notifications" ? "bg-border-subtle/50 text-[#7C5CFF]" : "text-muted hover:text-text"
            )}
          >
            <Bell className="h-4 w-4 shrink-0" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 rounded-3xl border border-border-subtle bg-surface/45 p-6 backdrop-blur-2xl">
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-[#7C5CFF]" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider font-mono">Profile Details</h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold font-mono text-muted uppercase">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-input-bg px-3.5 py-2.5 text-xs text-text placeholder-text/20 outline-none focus:border-[#7C5CFF]/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold font-mono text-muted uppercase">Active Learning Track</label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as "python" | "javascript" | "both")}
                  className="w-full rounded-xl border border-border-subtle bg-surface px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                >
                  <option value="python">Python Core Engine</option>
                  <option value="javascript">JavaScript Scripting</option>
                  <option value="both">Both tracks (Full Stack)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.01] transition-transform outline-none"
                >
                  Save Settings
                </button>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold font-mono animate-fade-in">✓ Profile Updated</span>
                )}
              </div>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-[#FF6B4A]" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider font-mono">Password Settings</h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold font-mono text-muted uppercase">Current Password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-subtle bg-input-bg px-3.5 py-2.5 text-xs text-text placeholder-text/20 outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold font-mono text-muted uppercase">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-subtle bg-input-bg px-3.5 py-2.5 text-xs text-text placeholder-text/20 outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  required
                />
              </div>

              {/* Verification Channel Selection */}
              <div className="space-y-2 border-t border-border-subtle pt-4">
                <span className="block text-[10px] font-bold font-mono text-muted uppercase">Verification Channel</span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-xs text-text/80 cursor-pointer">
                    <input
                      type="radio"
                      name="verifChannel"
                      checked={verificationMethod === "email"}
                      onChange={() => {
                        setVerificationMethod("email");
                        setVerificationError(null);
                      }}
                      className="text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                    />
                    Email ({user?.email || "user@example.com"})
                  </label>
                  <label className="flex items-center gap-2 text-xs text-text/80 cursor-pointer">
                    <input
                      type="radio"
                      name="verifChannel"
                      checked={verificationMethod === "phone"}
                      onChange={() => {
                        setVerificationMethod("phone");
                        setVerificationError(null);
                      }}
                      className="text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                    />
                    Phone Number (SMS)
                  </label>
                </div>
              </div>

              {verificationMethod === "phone" && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold font-mono text-muted uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-border-subtle bg-input-bg px-3.5 py-2.5 text-xs text-text placeholder-text/20 outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="rounded-xl border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-4 py-2 text-xs font-mono font-bold text-[#7C5CFF] hover:bg-[#7C5CFF]/15 transition-all cursor-pointer"
                >
                  {verificationSent ? "Resend Verification Code" : "Send Verification Code"}
                </button>
              </div>

              {debugMessage && (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs font-mono text-amber-500 leading-relaxed">
                  📢 {debugMessage}
                </div>
              )}

              {verificationSent && (
                <div className="space-y-1.5 border-t border-border-subtle pt-4">
                  <label className="block text-[10px] font-bold font-mono text-[#7C5CFF] uppercase">Enter 6-Digit Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full rounded-xl border border-border-subtle bg-input-bg px-3.5 py-2.5 text-xs font-mono text-text placeholder-text/20 outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    required
                  />
                </div>
              )}

              {verificationError && (
                <div className="text-xs font-semibold text-rose-500 font-mono">
                  ⚠ {verificationError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <button
                  type="submit"
                  disabled={!verificationSent}
                  className="rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.01] transition-transform outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Change Password
                </button>
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold font-mono">✓ Password changed</span>
                )}
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider font-mono">Alert Configurations</h3>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-input-bg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-text/80 block">Weekly Digests</span>
                  <span className="text-[10px] text-muted">Summary report of XP gains and hours.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => {
                    setEmailAlerts(e.target.checked);
                    triggerSuccess();
                  }}
                  className="rounded border-border-medium bg-input-bg text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-input-bg cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-text/80 block">Streak Warnings</span>
                  <span className="text-[10px] text-muted">Alerts before daily coding window closes.</span>
                </div>
                <input
                  type="checkbox"
                  checked={streakReminders}
                  onChange={(e) => {
                    setStreakReminders(e.target.checked);
                    triggerSuccess();
                  }}
                  className="rounded border-border-medium bg-input-bg text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
