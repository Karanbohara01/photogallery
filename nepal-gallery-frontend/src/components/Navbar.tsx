"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Check User Role on Load
  useEffect(() => {
    const loadRole = () => {
      if (typeof window === 'undefined') return;
      const role = localStorage.getItem('userRole');
      setUserRole(role);
    };

    loadRole(); // initial read
    window.addEventListener('storage', loadRole);
    return () => window.removeEventListener('storage', loadRole);
  }, []);

  // Refresh role when navigating between pages (avoids stale value after login)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [pathname]);

  // Handle scroll for sticky glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Handle Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.clear();
    setUserRole(null);
    window.location.href = '/'; // Hard refresh to clear state
  };

  // Categories for the bottom strip
  const categories = [
    "Amateur", "Asian", "Big Tits", "Blonde", "Ebony", "MILF", "Teen (18+)", "Mature", "Latina", "Lesbian", "Hentai"
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass' : 'bg-[#0f0f0f] border-b border-[#2a2a2a]'}`}>

      {/* --- TOP ROW: LOGO, SEARCH, USER --- */}
      <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between gap-6">

        {/* A. Logo Section */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-2xl text-gray-400 hover:text-white transition-colors">
            <FiMenu />
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white text-black font-extrabold px-2 py-0.5 rounded-sm tracking-tighter group-hover:bg-[#cc0000] group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
              NEPAL
            </div>
            <div className="text-white font-extrabold text-2xl tracking-tighter group-hover:text-gray-200 transition-colors">
              TUBE
            </div>
          </Link>
        </div>

        {/* B. Search Bar (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="flex w-full bg-[#1a1a1a] rounded-full overflow-hidden border border-[#333] focus-within:border-[#cc0000] focus-within:ring-1 focus-within:ring-[#cc0000] transition-all duration-300 shadow-sm hover:shadow-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos & images..."
              className="w-full bg-transparent text-gray-200 px-5 py-2.5 outline-none text-sm placeholder-gray-500 font-medium"
            />
            <button type="submit" className="px-6 bg-[#2a2a2a] hover:bg-[#cc0000] text-gray-300 hover:text-white transition-all duration-300 flex items-center justify-center border-l border-[#333]">
              <FiSearch className="text-lg" />
            </button>
          </form>
        </div>

        {/* C. User / Upload Section */}
        <div className="flex items-center gap-5">

          {/* UPLOAD Button (Any signed-in user) */}
          {userRole && (
            <Link
              href="/admin/dashboard"
              className="px-5 py-2 bg-[#cc0000] hover:bg-[#aa0000] text-white text-xs font-bold uppercase rounded-md transition-all shadow-[0_4px_14px_0_rgba(204,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(204,0,0,0.23)] hover:-translate-y-[1px]"
            >
              Upload
            </Link>
          )}

          {/* Login / Logout / Register */}
          <div className="flex items-center gap-3">
            {userRole ? (
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wide transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="text-sm font-bold text-gray-400 hover:text-white uppercase tracking-wide transition-colors"
                >
                  Login
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  href="/admin/register"
                  className="text-sm font-bold text-white hover:text-[#cc0000] uppercase tracking-wide transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW: CATEGORIES --- */}
      <div className={`h-11 flex items-center overflow-x-auto no-scrollbar border-b border-[#2a2a2a] ${isScrolled ? 'bg-[#0f0f0f]/80' : 'bg-[#1a1a1a]'}`}>
        <div className="max-w-[1600px] mx-auto px-6 flex gap-2">
          <Link href="/" className="px-3 py-1.5 text-xs font-bold text-[#cc0000] hover:bg-[#2a2a2a] rounded-sm whitespace-nowrap uppercase transition-colors">
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?search=${encodeURIComponent(cat)}`}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-sm whitespace-nowrap transition-colors uppercase"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;