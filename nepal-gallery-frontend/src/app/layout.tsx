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
        <footer className="bg-[#111] border-t border-[#222] py-8 text-center text-gray-500 text-xs mt-12">
          <p>&copy; 2025 NepalTube. All rights reserved.</p>
          <p className="mt-2">18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement</p>
          
         <div className="mt-4 flex justify-center gap-4 text-[11px] uppercase tracking-wider">
  <a href="/terms" className="hover:text-white transition-colors">Terms</a>
  <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
  <a href="/terms" className="hover:text-white transition-colors">DMCA</a>
  <a href="/2257" className="hover:text-white transition-colors">2257 Exemption</a>
</div>
        </footer>

        {/* 5. Analytics (Google/Cloudflare) */}
        {/* --- GOOGLE ANALYTICS GOES HERE LATER --- */}
      </body>
    </html>
  );
}