"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Mail, Lock, User as UserIcon, LogIn, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoadingLocal(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        router.push('/');
      } else {
        if (!name.trim()) throw new Error("Agent designation (name) is required.");
        await signUpWithEmail(email, password, name);
        // Don't auto-login — show success and switch to login mode
        setSuccess("Account created successfully! You can now login with your credentials.");
        setIsLogin(true);
        setPassword('');
        setLoadingLocal(false);
        return;
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (isLogin) {
        if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
          setError("Invalid credentials. If you signed up with Google, use the 'Sign in with Google' button below.");
        } else {
          setError(err.message || "Login failed.");
        }
      } else {
        if (code === 'auth/email-already-in-use') {
          setError("This email is already registered (possibly via Google). Try logging in or use 'Sign in with Google' below.");
          setIsLogin(true);
        } else if (code === 'auth/weak-password') {
          setError("Password too weak. Use at least 6 characters.");
        } else {
          setError(err.message || "Signup failed.");
        }
      }
      setLoadingLocal(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') return; // User cancelled, ignore
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden py-12 px-4 h-full">
      {/* Background Ornaments */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border border-white/10 shadow-2xl shadow-blue-900/10">
          
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 shadow-xl shadow-blue-500/30 flex items-center justify-center mb-6">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isLogin ? "Welcome Back" : "Initiate Protocol"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              {isLogin ? "Sign in to access the VISHWAS intelligence network." : "Create an agent profile to begin hunting employment fraud."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Agent Designation</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      required={!isLogin}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Target Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@vishwas.network"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Encryption Key (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium text-center">
                {error}
                {(error.includes('sign up') || error.includes('not registered')) && (
                  <button onClick={() => { setIsLogin(false); setError(''); }} className="block mx-auto mt-2 text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4">
                    Click here to Sign Up →
                  </button>
                )}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium text-center">
                ✅ {success}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loadingLocal}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loadingLocal ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Authenticate Engine" : "Initialize Agent Profile"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center before:content-[''] before:absolute before:w-full before:h-[1px] before:bg-slate-700/50">
            <span className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-900/80 backdrop-blur-md relative z-10">Or connect via</span>
          </div>

          <button 
            type="button" 
            onClick={handleGoogle}
            className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-white/5 flex items-center justify-center border-r border-white/5 group-hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            Sign in with Google Search Identity
          </button>

          <p className="mt-8 text-center text-sm text-slate-400 font-medium">
            {isLogin ? "Unregistered operative?" : "Already active in the network?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              {isLogin ? "Enlist Now" : "Authenticate Identity"}
            </button>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
