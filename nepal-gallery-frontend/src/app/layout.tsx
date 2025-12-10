import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '../components/Navbar';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NepalTube - Free Gallery",
  description: "The best free gallery in Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="448eb6a033a3f15c065aa66755d3f5a8" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f0f] text-gray-100`}>

        {/* 1. Navigation Bar (Sticky Top) */}
        <Navbar />

        {/* 2. Global Ad Placeholder (Pop-unders load here) */}
        {/* --- EXOCLICK POP-UNDER CODE GOES HERE LATER --- */}

        {/* 3. Main Content Container */}
        {/* This wrapper ensures content doesn't stretch too wide on huge screens */}
        <div className="max-w-[1600px] mx-auto min-h-screen">
          {children}
        </div>

        {/* 4. Footer */}
        <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-12 text-center text-gray-500 text-xs mt-20">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-lg font-bold text-gray-300 mb-2 tracking-tight">NEPALTUBE</h3>
            <p className="mb-6 opacity-60">The best destination for free galleries and videos.</p>

            <div className="h-px w-16 bg-[#cc0000] mx-auto mb-6"></div>

            <p>&copy; 2025 NepalTube. All rights reserved.</p>
            <p className="mt-2">18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement</p>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-wider font-bold">
              <a href="/terms" className="hover:text-[#cc0000] transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-[#cc0000] transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-[#cc0000] transition-colors">DMCA</a>
              <a href="/2257" className="hover:text-[#cc0000] transition-colors">2257 Exemption</a>
            </div>
          </div>
        </footer>

        {/* 5. Analytics (Google/Cloudflare) */}
        {/* --- GOOGLE ANALYTICS GOES HERE LATER --- */}
      </body>
    </html>
  );
}