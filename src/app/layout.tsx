import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ProgrammingOS — Become an Engineer",
    template: "%s | ProgrammingOS",
  },
  description:
    "The world's best programming learning platform. Learn Python and JavaScript through immersive coding, visual execution, AI-powered guidance, and real-world projects.",
  keywords: [
    "programming",
    "learn python",
    "learn javascript",
    "coding platform",
    "AI tutor",
    "interview prep",
    "placement preparation",
    "programming courses",
    "ProgrammingOS",
  ],
  authors: [{ name: "ProgrammingOS Team" }],
  creator: "ProgrammingOS",
  metadataBase: new URL("https://programmingos.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://programmingos.dev",
    title: "ProgrammingOS — Become an Engineer",
    description:
      "Not just another learner. Learn Python and JavaScript through immersive coding, AI guidance, and real-world projects.",
    siteName: "ProgrammingOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ProgrammingOS — Become an Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProgrammingOS — Become an Engineer",
    description: "Not just another learner. The world's best programming learning platform.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050816" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}