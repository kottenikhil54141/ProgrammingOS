import { DBService } from "@/services/db";
import PortfolioClient from "./PortfolioClient";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

interface PageProps {
  params: Promise<{ username: string }>;
}

// This page reads from the local JSON database at request time,
// so it must be dynamically server-rendered — never statically prerendered.
// Note: export const dynamic is not compatible with cacheComponents,
// so we use noStore() inside the function instead.

export default async function UserPortfolioPage({ params }: PageProps) {
  noStore(); // opt out of static caching for this page
  const { username } = await params;
  const user = DBService.getUserByUsername(username);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Glowing backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7C5CFF]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#2563EB]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="text-center space-y-6 relative z-10 max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto text-red-400 font-bold text-3xl shadow-lg shadow-red-500/5">
            404
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Developer Profile Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The user <span className="text-[#A78BFF] font-mono">@{username}</span> has not set up a public portfolio yet, or the username is incorrect.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-semibold text-white bg-[#7C5CFF] hover:bg-[#7C5CFF]/90 px-6 py-3 rounded-2xl shadow-lg shadow-[#7C5CFF]/20 transition-all hover:scale-[1.02] cursor-pointer border-0"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  // Generate safe user details
  const { passwordHash, salt, verificationToken, resetToken, resetTokenExpires, ...safeUser } = user;

  // Render portfolio
  return (
    <PortfolioClient
      user={{
        ...safeUser,
        track: user.learningPreferences?.track || null,
      }}
    />
  );
}
