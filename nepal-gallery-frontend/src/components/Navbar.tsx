// "use client"; // <--- Add this at the very top

// import React, { useState } from 'react'; // Import useState
// import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Import useRouter
// import { FiSearch, FiMenu } from 'react-icons/fi';

// const Navbar = () => {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState('');

//   const categories = [
//     "Amateur", "Asian", "Big Tits", "Blonde", "Ebony", "MILF", "Teen (18+)", "Mature", "Latina", "Lesbian", "Hentai"
//   ];

//   // Function to handle search
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault(); // Stop page refresh
//     if (searchTerm.trim()) {
//       router.push(`/?search=${encodeURIComponent(searchTerm)}`);
//     }
//   };

//   return (
//     <nav className="bg-[#181818] border-b border-[#2a2a2a] sticky top-0 z-50">
      
//       <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
        
//         {/* Logo */}
//         <div className="flex items-center gap-4">
//           <button className="lg:hidden text-2xl text-gray-400"><FiMenu /></button>
//           <Link href="/" className="flex items-center gap-1 group">
//             <div className="bg-white text-black font-bold px-2 py-1 rounded-sm tracking-tighter group-hover:bg-tube-red transition-colors">
//               NEPAL
//             </div>
//             <div className="text-white font-bold text-xl tracking-tighter">
//               TUBE
//             </div>
//           </Link>
//         </div>

//         {/* Search Bar (Functional Now) */}
//         <div className="hidden md:flex flex-1 max-w-xl mx-8">
//           <form onSubmit={handleSearch} className="flex w-full bg-[#282828] rounded-full overflow-hidden border border-[#333] focus-within:border-[#555]">
//             <input 
//               type="text" 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search videos & images..." 
//               className="w-full bg-transparent text-white px-4 py-2 outline-none text-sm"
//             />
//             <button type="submit" className="px-6 bg-[#333] hover:bg-tube-red text-white transition-colors">
//               <FiSearch />
//             </button>
//           </form>
//         </div>

//         {/* User / Upload */}
//         <div className="flex items-center gap-4">
//           <Link href="/admin/login" className="hidden md:block text-sm font-bold text-gray-300 hover:text-white">
//             LOGIN
//           </Link>
//           <Link href="/admin/dashboard" className="px-4 py-1.5 bg-tube-red hover:bg-red-700 text-white text-xs font-bold uppercase rounded-sm transition-colors">
//             Upload
//           </Link>
//         </div>
//       </div>

//       {/* Categories */}
//       <div className="bg-[#222] h-10 flex items-center overflow-x-auto no-scrollbar border-b border-[#333]">
//         <div className="max-w-[1600px] mx-auto px-4 flex gap-1">
//           {categories.map((cat) => (
//             <Link 
//               key={cat} 
//               href={`/?search=${encodeURIComponent(cat)}`} 
//               className="px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#333] whitespace-nowrap transition-colors uppercase"
//             >
//               {cat}
//             </Link>
//           ))}
//           <Link href="/" className="px-3 py-2 text-xs font-bold text-tube-red hover:bg-[#333] whitespace-nowrap uppercase">
//             View All Categories +
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Check User Role on Load
  useEffect(() => {
    // We use window check to avoid server-side mismatch errors
    if (typeof window !== 'undefined') {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }
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
    <nav className="bg-[#181818] border-b border-[#2a2a2a] sticky top-0 z-50">
      
      {/* --- TOP ROW: LOGO, SEARCH, USER --- */}
      <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* A. Logo Section */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-2xl text-gray-400 hover:text-white">
            <FiMenu />
          </button>
          <Link href="/" className="flex items-center gap-1 group">
            <div className="bg-white text-black font-bold px-2 py-1 rounded-sm tracking-tighter group-hover:bg-[#e62e04] transition-colors">
              NEPAL
            </div>
            <div className="text-white font-bold text-xl tracking-tighter">
              TUBE
            </div>
          </Link>
        </div>

        {/* B. Search Bar (Hidden on mobile, visible on md+) */}
        <div className="hidden md:flex flex-1 max-w-xl">
          <form onSubmit={handleSearch} className="flex w-full bg-[#282828] rounded-sm overflow-hidden border border-[#333] focus-within:border-[#555]">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search videos & images..." 
              className="w-full bg-transparent text-white px-4 py-2 outline-none text-sm placeholder-gray-500"
            />
            <button type="submit" className="px-5 bg-[#333] hover:bg-[#e62e04] text-white transition-colors flex items-center justify-center">
              <FiSearch className="text-lg" />
            </button>
          </form>
        </div>

        {/* C. User / Upload Section */}
        <div className="flex items-center gap-4">
          
          {/* UPLOAD Button (Only for Admins) */}
          {userRole === 'admin' && (
            <Link 
              href="/admin/dashboard" 
              className="px-4 py-1.5 bg-[#e62e04] hover:bg-red-700 text-white text-xs font-bold uppercase rounded-sm transition-colors"
            >
              Upload
            </Link>
          )}

          {/* Login / Logout */}
          {userRole ? (
             <button 
               onClick={handleLogout}
               className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wide"
             >
               Logout
             </button>
          ) : (
             <Link 
               href="/admin/login" 
               className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wide"
             >
               Login
             </Link>
          )}
        </div>
      </div>

      {/* --- BOTTOM ROW: CATEGORIES --- */}
      <div className="bg-[#222] h-10 flex items-center overflow-x-auto no-scrollbar border-b border-[#333]">
        <div className="max-w-[1600px] mx-auto px-4 flex gap-1">
          <Link href="/" className="px-3 py-2 text-xs font-bold text-[#e62e04] hover:bg-[#333] whitespace-nowrap uppercase transition-colors">
            Home
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat} 
              href={`/?search=${encodeURIComponent(cat)}`} 
              className="px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#333] whitespace-nowrap transition-colors uppercase"
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