'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/authSlice';
import axiosInstance from '@/api/axios';
import { toast } from 'react-hot-toast';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      dispatch(loginSuccess(response.data));
      toast.success('Login successful');
      router.push('/admin/dashboard');
    } catch (error: any) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!error.response) {
        toast.error(
          apiUrl
            ? 'Cannot reach API. Check Render is running and FRONTEND_URL includes your Vercel domain.'
            : 'NEXT_PUBLIC_API_URL is not set on Vercel. Add your Render API URL and redeploy.'
        );
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md bg-sacred p-10 md:p-12 rounded-[2rem] shadow-divine border border-gold/10 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-espresso rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-gold/20">
            <Lock size={24} className="text-gold" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-espresso uppercase">The Sanctuary</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-espresso/40 mt-2">Master Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-espresso/40">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-14 pr-6 py-5 bg-ivory/50 border border-gold/15 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-espresso font-medium text-sm shadow-inner"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-espresso/40">
              <Lock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-6 py-5 bg-ivory/50 border border-gold/15 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-espresso font-medium text-sm shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-espresso text-sacred py-5 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gold hover:text-espresso transition-all shadow-2xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none mt-4"
          >
            {loading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>
      </div>
    </div>
  );
}
