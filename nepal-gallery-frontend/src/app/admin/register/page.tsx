"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating Admin...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      await axios.post(`${apiUrl}/auth/register`, {
        username,
        password
      });

      setStatus('Success! Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2000);
      
    } catch (err: any) {
      setStatus('Error: ' + (err.response?.data?.error || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h1 className="text-2xl font-bold text-red-500 mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-red-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-red-500 outline-none"
              required
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold transition-colors">
            Sign Up
          </button>
        </form>
        
        {status && <p className="mt-4 text-center text-yellow-400">{status}</p>}
      </div>
    </div>
  );
}