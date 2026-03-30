"use client";
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Search, BarChart2, Users, LogIn, Trophy, ChevronDown, Moon, Sun, Lock, Trash2, LayoutDashboard, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from 'next-themes';

export default function Navbar() {
  const { user, profile, signInWithGoogle, logOut, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full border-b border-white/5 bg-slate-900/50 backdrop-blur-xl z-50 sticky top-0">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:bg-blue-500 transition-colors">
            <ShieldAlert className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">VISHWAS</span>
        </Link>
        <div className="flex gap-6 items-center">
          {user && (
            <div className="flex gap-6 items-center">
              <Link href="/analyze" className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                 <ShieldAlert className="w-4 h-4" /> Scanner
              </Link>
              <Link href="/search" className="text-sm font-medium text-slate-300 hover:text-white flex gap-2 items-center transition-colors">
                <Search className="w-4 h-4" /> Company Search
              </Link>
              <Link href="/insights" className="text-sm font-medium text-slate-300 hover:text-white flex gap-2 items-center transition-colors">
                <BarChart2 className="w-4 h-4" /> Scam Insights
              </Link>
              <Link href="/leaderboard" className="text-sm font-medium text-amber-400 hover:text-amber-300 flex gap-2 items-center transition-colors">
                 <Trophy className="w-4 h-4" /> Leaderboard
              </Link>
              <Link href="/community" className="text-sm font-medium text-slate-300 hover:text-white flex gap-2 items-center transition-colors">
                 <Users className="w-4 h-4" /> Community
              </Link>
              <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-white flex gap-2 items-center transition-colors">
                 <Mail className="w-4 h-4" /> Get In Touch
              </Link>
            </div>
          )}

          {user ? (
            <div className="relative group ml-4 pl-4 border-l border-white/10">
               {/* Dropdown Trigger */}
               <div className="flex items-center gap-3 cursor-pointer py-2">
                  {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-full border border-blue-500/50 group-hover:border-blue-400 transition-colors" />
                  ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold">{user.email?.charAt(0).toUpperCase()}</div>
                  )}
                  <div className="flex flex-col hidden sm:flex">
                     <span className="text-sm font-medium text-white capitalize leading-tight">{profile?.name || "Agent"}</span>
                     <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase flex items-center gap-1">
                       LVL {profile?.level || 1} <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                     </span>
                  </div>
               </div>

               {/* Dropdown Menu */}
               <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
                    <p className="text-sm text-white font-semibold truncate">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5">VISHWAS Identity Network</p>
                  </div>
                  
                  <div className="p-2 space-y-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-blue-400" /> Agent Dashboard
                    </Link>
                    
                    <button 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                      Appearance: {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left" onClick={() => alert("Your data is secured using IPQS routing and cryptographic database isolation. We do not sell user patterns.")}>
                      <Lock className="w-4 h-4 text-emerald-400" /> Privacy & Security
                    </button>
                    
                    <div className="h-px w-full bg-slate-700/50 my-2" />

                    <button 
                      onClick={() => {
                        logOut().then(() => window.location.href='/login');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left"
                    >
                      <LogIn className="w-4 h-4 text-blue-400" /> Log Out
                    </button>

                    <button 
                      onClick={() => {
                        deleteAccount().then(() => window.location.href='/login');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <Trash2 className="w-4 h-4" /> Terminate Account
                    </button>
                  </div>
               </div>
            </div>
          ) : (
            <Link href="/login" className="ml-4 pl-4 border-l border-white/10 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
               <LogIn className="w-4 h-4" /> Sign In
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}
