"use client";
import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { ref, get, query, orderByChild } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchLeaderboard();
    else setLoading(false);
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const usersRef = query(ref(db, 'users'), orderByChild('xp_points'));
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }))
        .sort((a: any, b: any) => (b.xp_points || 0) - (a.xp_points || 0))
        .slice(0, 10);
        setLeaders(usersList);
      } else {
        setLeaders([]);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard from Firebase:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center h-full"><div className="w-8 h-8 rounded-full border-4 border-t-blue-500 border-white/10 animate-spin" /></div>;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden pb-20">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-amber-900/10 rounded-[100%] blur-3xl -translate-y-1/2 pointer-events-none" />

      <main className="flex-1 relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 flex flex-col items-center"
        >
           <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <Trophy className="w-8 h-8 text-amber-500" />
           </div>
           <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Global Leaderboard
           </h1>
           <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Top VISHWAS agents dedicated to hunting employment fraud and securing the corporate ecosystem.
           </p>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="glass-card overflow-hidden border border-white/5"
        >
          {leaders.length === 0 ? (
             <div className="p-12 text-center text-slate-500">No agents found on the global network yet. Start scanning to claim rank 1!</div>
          ) : (
            <div className="divide-y divide-white/5">
               {leaders.map((agent, index) => (
                 <motion.div 
                   key={agent.id || index} 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.1 + (index * 0.05) }}
                   className={`flex items-center gap-6 p-6 transition-colors hover:bg-slate-800/50 ${index === 0 ? 'bg-amber-950/20' : ''}`}
                 >
                    <div className="flex-shrink-0 w-12 text-center">
                       {index === 0 ? <Trophy className="w-8 h-8 text-amber-400 mx-auto" /> : 
                        index === 1 ? <Medal className="w-8 h-8 text-slate-300 mx-auto" /> : 
                        index === 2 ? <Medal className="w-8 h-8 text-amber-700 mx-auto" /> : 
                        <span className="text-2xl font-bold text-slate-600">#{index + 1}</span>}
                    </div>
                    
                    <div className="flex-1">
                       <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-3">
                          {agent.name || 'Anonymous Agent'}
                          {index === 0 && <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-amber-500 text-amber-950 uppercase">Apex Commander</span>}
                       </h3>
                       <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="text-blue-400">Level {agent.level || 1}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-emerald-400">{agent.xp_points || 0} XP</span>
                       </div>
                    </div>
                    
                    {agent.badges && agent.badges.length > 0 && (
                       <div className="hidden md:flex gap-2">
                          {agent.badges.slice(0, 3).map((b: string, i: number) => (
                             <div key={i} title={b} className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <Star className="w-4 h-4 text-amber-500/80" />
                             </div>
                          ))}
                       </div>
                    )}
                 </motion.div>
               ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
