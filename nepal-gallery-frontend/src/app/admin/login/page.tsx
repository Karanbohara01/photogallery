"use client";

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const { data } = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password
      });

      // 1. SAVE TOKEN AND ROLE (all signed-up users can access dashboard)
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.role || 'user');
      
      // 2. Redirect to dashboard for any authenticated user
      router.push('/admin/dashboard');
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white p-4">
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-2xl w-full max-w-md border border-[#333]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#e62e04] mb-2 tracking-tighter">
            X<span className="text-white">TUBE</span>
          </h1>
          <p className="text-gray-400 text-sm">Access your account to upload</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded bg-[#222] border border-[#333] focus:border-[#e62e04] focus:outline-none text-white transition-colors"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded bg-[#222] border border-[#333] focus:border-[#e62e04] focus:outline-none text-white transition-colors"
              placeholder="Enter secure password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#e62e04] hover:bg-red-700 text-white font-bold py-3 rounded transition-all duration-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
        
        {error && (
          <div className="mt-6 p-3 bg-red-900/50 border border-red-900 text-red-200 text-sm text-center rounded">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-300 text-xs underline transition-colors"
          >
            &larr; Return to Home Page
          </button>
        </div>

      </div>
    </div>
  );
}