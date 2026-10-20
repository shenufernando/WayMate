'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  // State Variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Password show/hide toggle state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. HARDCODED ADMIN CHECK (Database එකට නොගොස් කෙළින්ම Admin ලෙස ඇතුළු වීම)
    if (email.toLowerCase() === 'admin@gmail.com' && password === 'admin123') {
      setSuccess('Admin Login Successful! Redirecting to Admin Dashboard...');
      
      localStorage.setItem('adminToken', 'hardcoded-admin-token-12345');
      localStorage.setItem('adminEmail', 'admin@gmail.com');

      setTimeout(() => {
        router.push('/admin');
      }, 1500);
      return; // Backend එකට යෑම නතර කරයි
    }

    // 2. NORMAL USER BACKEND API CHECK (සාමාන්‍ය Users ලා සඳහා පමණක්)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password!');
      }

      setSuccess('Login Successful! Redirecting to User Dashboard...');

      setTimeout(() => {
        if (data.user?.role === 'admin') {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminEmail', data.user.email);
          router.push('/admin');
        } else {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          router.push('/user');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access User Dashboard or Admin Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold text-center">
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          
          {/* Browser Autofill නතර කිරීමට Dummy Inputs */}
          <input type="text" name="fake_email" style={{ display: 'none' }} tabIndex={-1} />
          <input type="password" name="fake_password" style={{ display: 'none' }} tabIndex={-1} />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              name="user_email_unique"
              required
              autoComplete="new-password"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="user_password_unique"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 hover:text-emerald-600 focus:outline-none bg-slate-100 px-2 py-1 rounded-md transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-600 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}