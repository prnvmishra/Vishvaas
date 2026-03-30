"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Award, Star, TrendingUp, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-32 h-full text-center px-4">
         <Lock className="w-16 h-16 text-slate-700 mb-6" />
         <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Access Restricted</h1>
         <p className="text-slate-400">Please sign in via the Navigation Bar to access your agent profile.</p>
      </div>
    );
  }

  const xpProgress = profile.xp_points % 100;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden pb-20">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-blue-900/10 rounded-[100%] blur-3xl -translate-y-1/2 pointer-events-none" />

      <main className="flex-1 relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-6"
        >
           <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0D8ABC&color=fff`} alt="Profile" className="w-24 h-24 rounded-2xl shadow-xl shadow-blue-500/20 object-cover border-2 border-slate-700/50" />
           <div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                 Commander {profile.name.split(' ')[0]}
              </h1>
              <div className="flex items-center gap-3 text-sm font-semibold tracking-wider text-blue-400 uppercase">
                 <ShieldAlert className="w-4 h-4" /> Operations Dashboard
              </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="md:col-span-2 glass-card p-8 border border-white/10 relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-xl font-bold text-white mb-1">Rank Progression</h2>
                    <p className="text-sm text-slate-400">Analyze offers and report threats to level up.</p>
                 </div>
                 <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 font-bold text-sm tracking-widest uppercase">
                    Level {profile.level}
                 </div>
              </div>

              <div className="w-full bg-slate-900/80 rounded-full h-3 mb-3 border border-slate-700/50">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${xpProgress}%` }}
                   transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                   className="bg-blue-500 h-full rounded-full relative"
                 >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm rounded-full" />
                 </motion.div>
              </div>
              <div className="flex justify-between text-xs font-bold text-slate-400">
                 <span>{profile.xp_points} Total XP</span>
                 <span>{100 - xpProgress} XP to Level {profile.level + 1}</span>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-card p-8 border border-white/10 flex flex-col justify-center items-center text-center"
           >
              <TrendingUp className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-3xl font-black text-white mb-1">{profile.xp_points}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Reputation</p>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="md:col-span-3 glass-card p-8 border border-white/10"
           >
              <div className="flex items-center gap-3 mb-6">
                 <Award className="w-6 h-6 text-amber-400" />
                 <h2 className="text-xl font-bold text-white">Unlocked Badges</h2>
              </div>
              
              {profile.badges && profile.badges.length > 0 ? (
                 <div className="flex flex-wrap gap-4">
                    {profile.badges.map((badge, idx) => (
                       <div key={idx} className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg shadow-black/20">
                          <Star className="w-5 h-5 text-amber-400" />
                          <span className="text-sm font-bold text-slate-200">{badge}</span>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="w-full p-8 border border-dashed border-slate-700/50 rounded-xl flex flex-col items-center justify-center text-center">
                    <Award className="w-8 h-8 text-slate-600 mb-3" />
                    <p className="text-slate-400 font-medium">No Badges Yet</p>
                    <p className="text-xs text-slate-500 mt-1">Start scanning offer letters to earn your first rank.</p>
                 </div>
              )}
           </motion.div>
        </div>
      </main>
    </div>
  );
}
