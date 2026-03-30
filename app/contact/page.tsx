"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, User, MessageSquare, Sparkles, CheckCircle, AlertCircle, Zap, Shield, Globe } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useAuth } from '@/context/AuthContext';

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [activeField, setActiveField] = useState<string | null>(null);

  // Auto-fill from profile
  React.useEffect(() => {
    if (user && profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || '',
        email: user.email || ''
      }));
    }
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('sending');

    try {
      // EmailJS: Replace these with your actual service/template/public key
      await emailjs.sendForm(
        'service_o0n4tfv',       // EmailJS Service ID
        'template_huew01k',      // EmailJS Template ID
        formRef.current!,
        'L1xOsMwVGBDLqqVRL'      // EmailJS Public Key
      );
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: "Lightning Response", desc: "We respond within 24 hours" },
    { icon: <Shield className="w-5 h-5" />, title: "Encrypted Channel", desc: "Your data is protected end-to-end" },
    { icon: <Globe className="w-5 h-5" />, title: "Global Support", desc: "Available across all time zones" },
  ];

  return (
    <div className="flex-1 relative overflow-hidden pb-20 min-h-screen">
      {/* Animated Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/8 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full pointer-events-none"
          style={{
            top: `${15 + i * 14}%`,
            left: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">Direct Channel</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Get In <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Have questions, feedback, or want to report a threat? Our intelligence team is standing by.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass-card p-5 border border-white/5 flex items-start gap-4 cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{feat.title}</h3>
                <p className="text-slate-500 text-xs">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card p-8 md:p-10 border border-white/10 shadow-2xl shadow-blue-900/10 relative overflow-hidden"
        >
          {/* Animated top border */}
          <motion.div
            className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          />

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <motion.div
                whileFocus={{ scale: 1.01 }}
                className="space-y-2"
              >
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${activeField === 'name' ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${activeField === 'email' ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    placeholder="john@example.com"
                    required
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Subject Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Subject
              </label>
              <div className={`relative rounded-xl transition-all duration-300 ${activeField === 'subject' ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setActiveField('subject')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select a topic...</option>
                  <option value="General Inquiry" className="bg-slate-900">💬 General Inquiry</option>
                  <option value="Report a Scam" className="bg-slate-900">🚨 Report a Scam</option>
                  <option value="Feature Request" className="bg-slate-900">✨ Feature Request</option>
                  <option value="Bug Report" className="bg-slate-900">🐛 Bug Report</option>
                  <option value="Partnership" className="bg-slate-900">🤝 Partnership Opportunity</option>
                  <option value="Security Concern" className="bg-slate-900">🔒 Security Concern</option>
                </select>
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Message
              </label>
              <div className={`relative rounded-xl transition-all duration-300 ${activeField === 'message' ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/10' : ''}`}>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setActiveField('message')}
                  onBlur={() => setActiveField(null)}
                  rows={5}
                  required
                  placeholder="Describe your query in detail..."
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all font-medium resize-none"
                />
              </div>
              <div className="flex justify-end">
                <span className={`text-xs font-mono ${formData.message.length > 500 ? 'text-amber-400' : 'text-slate-600'}`}>
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-green-400 font-bold text-sm">Message transmitted successfully!</p>
                    <p className="text-green-400/70 text-xs mt-0.5">Our team will respond within 24 hours.</p>
                  </div>
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-red-400 font-bold text-sm">Transmission failed. Please try again or email us directly.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status === 'sending' || !formData.message}
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            >
              {status === 'sending' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Transmit Message</span>
                </>
              )}

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.button>
          </form>

          {/* Bottom info */}
          <div className="mt-8 pt-6 border-t border-slate-700/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Your information is encrypted and never shared with third parties.
            </p>
            <p className="text-xs text-slate-600">
              Powered by <span className="text-blue-400 font-semibold">EmailJS</span> + <span className="text-amber-400 font-semibold">VISHWAS</span>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
