import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ─── Optimize: Disable strict mode in dev to speed up initial loads ───
  reactStrictMode: false,

  // ─── Dev Indicators & Page Buffer Optimizations ─────────────────────
  // Disable dev indicators and buffer fewer pages in memory to reduce RAM/Swap pressure
  devIndicators: false,
  onDemandEntries: {
    maxInactiveAge: 15 * 1000, // keep pages compiled in memory for 15s max (Turbopack disk cache will reload them instantly)
    pagesBufferLength: 1,      // buffer only 1 page in memory to prevent RAM bloat
  },

  // ─── Fix: Turbopack workspace root ──────────────────────────────────
  // Without this, Next.js detects /home/nick/package-lock.json as the root
  // instead of this project, causing slow startup and warnings.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // ─── Fix: Allow network device access (phone / laptop on LAN) ───────
  // Without this, HMR is blocked from 192.168.x.x IPs → blank page on mobile
  allowedDevOrigins: [
    "192.168.43.204",
    // Add other IPs here if your local IP changes
  ],

  // ─── Fix: typedRoutes moved out of experimental in Next 16 ──────────
  // (disabled — we don't need typed route checking in dev)
  typedRoutes: false,

  // ─── Optimize: Enable persistent filesystem cache for Turbopack ─────
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
    instantNavigationDevToolsToggle: true,
    optimizePackageImports: ["lucide-react"],
  },

  // ─── Reduce file-tracing scope (faster cold starts) ─────────────────
  outputFileTracingExcludes: {
    "*": [
      "./node_modules/@swc/core-linux-x64-gnu",
      "./node_modules/@swc/core-linux-x64-musl",
      "./node_modules/esbuild",
    ],
  },

  logging: {
    fetches: { fullUrl: false },
  },
};

export default nextConfig;
