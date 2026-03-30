"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldAlert, Activity, Users, Database, ArrowRight, TrendingUp } from 'lucide-react';

export default function MarketingLanding() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="w-full flex flex-col relative bg-slate-950 min-h-[150vh]">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-900/20 via-slate-900/50 to-transparent pointer-events-none z-0" />
      <div className="fixed top-20 right-20 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-40 flex flex-col items-center justify-center min-h-[90vh]">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="text-center"
           style={{ y: y1, opacity: opacity1 }}
         >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-500/5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-bold tracking-widest text-blue-300 uppercase">Live Global Threat Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8">
              Verify Employment.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                 Defeat Corporate Fraud.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12">
              Join the gamified open-source intelligence network. 
              VISHWAS utilizes cutting-edge AI parsing, RAG-verified MCA databases, and community consensus to detect impossible salary spikes and malicious employment traps.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href={user ? "/analyze" : "/login"}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold text-lg flex items-center gap-3 transition-colors shadow-[0_0_40px_rgba(37,99,235,0.4)] group overflow-hidden relative"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {user ? "Launch OSINT Analyzer" : "Enlist as an Agent"} <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              {!user && (
                <Link href="/login" className="px-8 py-5 glass-panel rounded-2xl text-white font-bold text-lg hover:bg-white/10 transition-colors border border-slate-700 hover:border-slate-500">
                  Authentication Portal
                </Link>
              )}
            </div>
         </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 py-24 border-t border-slate-800/50">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-4">A Zero-Trust Ecosystem</h2>
          <p className="text-slate-400 text-center text-lg max-w-2xl mx-auto">VISHWAS relies on cryptographic data and deterministic algorithms to alert users to employment deception.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Database className="w-8 h-8 text-blue-400" />,
              title: "1,850+ Verified NSE Entities",
              desc: "Deep-learning datasets continuously crawled from live MCA databases guarantee factual structural verifications."
            },
            {
              icon: <Activity className="w-8 h-8 text-emerald-400" />,
              title: "IPQS Threat Modeling",
              desc: "Live zero-day API calls check incoming HR email addresses against live blacklists to flag disposable and malicious domains instantly."
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-amber-400" />,
              title: "Gamified Bounty Network",
              desc: "Earn XP, badges, and permanent Leaderboard titles for actively dismantling scam chains and verifying corporate legitimacy."
            }
          ].map((feat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.2, duration: 0.8 }}
               className="glass-card p-10 relative overflow-hidden group hover:border-blue-500/50 transition-colors"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/20 blur-2xl rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
                <div className="mb-6">{feat.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{feat.desc}</p>
             </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
