'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-luxury-silver/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-luxury-silver text-3xl font-display font-bold">M</span>
          </div>
          <h1 className="text-2xl font-display text-luxury-white mb-1">Manilakshmi Silver</h1>
          <p className="text-sm text-luxury-white/40">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-luxury-charcoal/60 border border-luxury-gunmetal/30 p-8 space-y-6"
        >
          <h2 className="text-xs tracking-[0.2em] uppercase text-luxury-silver/60 text-center font-medium">
            Sign In
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-luxury-white/40 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-luxury-black border border-luxury-gunmetal/50 px-4 py-3 
                       text-luxury-white placeholder:text-luxury-steel/30
                       focus:outline-none focus:border-luxury-silver/30 transition-all duration-300"
              placeholder="admin@manilakshmi.com"
            />
          </div>

          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-luxury-white/40 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-luxury-black border border-luxury-gunmetal/50 px-4 py-3 
                         text-luxury-white placeholder:text-luxury-steel/30 pr-12
                         focus:outline-none focus:border-luxury-silver/30 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-white/30 hover:text-luxury-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-luxury-white text-luxury-black 
                     px-6 py-3.5 text-sm tracking-[0.15em] uppercase font-medium
                     hover:bg-luxury-silver disabled:opacity-50 transition-all duration-500"
          >
            <LogIn size={16} />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-luxury-white/20">
          Secure admin access &bull; Manilakshmi Silver
        </p>
      </div>
    </div>
  );
}
