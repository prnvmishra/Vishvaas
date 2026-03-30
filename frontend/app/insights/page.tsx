"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function InsightsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) computeStats();
  }, [user]);

  const computeStats = async () => {
    try {
      // Fetch all reports and scam_reports from Firebase RTDB
      const reportsSnap = await get(ref(db, 'reports'));
      const scamSnap = await get(ref(db, 'scam_reports'));

      const reports = reportsSnap.exists() ? Object.values(reportsSnap.val()) as any[] : [];
      const scamReports = scamSnap.exists() ? Object.values(scamSnap.val()) as any[] : [];

      const totalAnalyzed = reports.length;
      const highRisk = reports.filter((r: any) => r.risk_level === 'High Risk' || r.risk_level === 'Critical').length;
      const totalCommunity = scamReports.length;

      // Build monthly chart data from timestamps
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyCounts: Record<string, number> = {};

      [...reports, ...scamReports].forEach((r: any) => {
        if (r.timestamp) {
          const d = new Date(r.timestamp);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        }
      });

      const now = new Date();
      const chartData = [];
      for (let i = 5; i >= 0; i--) {
        const targetMonth = (now.getMonth() - i + 12) % 12;
        const targetYear = now.getFullYear() + Math.floor((now.getMonth() - i) / 12);
        const key = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
        chartData.push({ name: months[targetMonth], scams: monthlyCounts[key] || 0 });
      }

      // Growth rate: compare last two months
      let growthRate = 0;
      if (chartData.length >= 2) {
        const current = chartData[chartData.length - 1].scams;
        const prev = chartData[chartData.length - 2].scams;
        if (prev > 0) growthRate = Math.round(((current - prev) / prev) * 100);
        else if (current > 0) growthRate = 100;
      }

      // Compute threat vectors from report reasons
      const reasonCounts: Record<string, number> = {};
      reports.forEach((r: any) => {
        if (r.reasons && Array.isArray(r.reasons)) {
          r.reasons.forEach((reason: string) => {
            const lower = reason.toLowerCase();
            if (lower.includes('gmail') || lower.includes('disposable')) {
              reasonCounts['Public Domain Emails (Gmail/Disposable)'] = (reasonCounts['Public Domain Emails (Gmail/Disposable)'] || 0) + 1;
            }
            if (lower.includes('fee') || lower.includes('payment')) {
              reasonCounts['"Registration Fee" Requests'] = (reasonCounts['"Registration Fee" Requests'] || 0) + 1;
            }
            if (lower.includes('footprint') || lower.includes('linkedin') || lower.includes('shell')) {
              reasonCounts['No Corporate Footprint (Shell Company)'] = (reasonCounts['No Corporate Footprint (Shell Company)'] || 0) + 1;
            }
          });
        }
      });

      const safeTotal = Math.max(1, totalAnalyzed);
      const vectors = Object.entries(reasonCounts)
        .map(([name, count]) => ({ name, percentage: Math.round((count / safeTotal) * 100) }))
        .sort((a, b) => b.percentage - a.percentage);

      setStats({
        total_analyzed: totalAnalyzed,
        high_risk_detected: highRisk,
        community_reports: totalCommunity,
        growth_rate: growthRate,
        chart_data: chartData,
        vectors: vectors.length > 0 ? vectors : null
      });
    } catch (e) {
      console.error('Failed to compute insights from Firebase:', e);
    }
  };

  const chartData = stats?.chart_data || [
    { name: 'Jan', scams: 0 },
    { name: 'Feb', scams: 0 },
    { name: 'Mar', scams: 0 },
    { name: 'Apr', scams: 0 },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Scam Insights <span className="text-blue-500">Dashboard</span></h1>
        <p className="text-slate-400">Real-time macro analysis of the fraudulent job market ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-blue-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="text-slate-400 font-medium">Total Offers Analyzed</div>
             <ShieldAlert className="text-blue-500 w-5 h-5" />
          </div>
          <div className="text-5xl font-black text-white">{stats?.total_analyzed ?? 0}</div>
        </div>
        <div className="glass-card p-6 border-red-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="text-slate-400 font-medium">Scams Identified</div>
             <AlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <div className="text-5xl font-black text-red-500">{stats?.high_risk_detected ?? 0}</div>
        </div>
        <div className="glass-card p-6 border-green-500/20">
          <div className="flex justify-between items-start mb-4">
             <div className="text-slate-400 font-medium">Growth Rate (MoM)</div>
             <TrendingUp className="text-green-500 w-5 h-5" />
          </div>
          <div className="text-5xl font-black text-green-400">{stats?.growth_rate !== undefined ? `${stats.growth_rate > 0 ? '+' : ''}${stats.growth_rate}%` : '0%'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 h-96 flex flex-col">
          <h2 className="text-xl font-semibold mb-6">Employment Fraud Velocity (2024)</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="scams" fill="#ef4444" radius={[4, 4, 0, 0]}>
                  {chartData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#ef4444' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-2">Most Common Vectors</h2>
          
          {stats?.vectors ? stats.vectors.map((vector: any, idx: number) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-2">
                 <span className="text-slate-300">{vector.name}</span>
                 <span className="text-red-400 font-medium">{vector.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                 <div className="bg-red-500 h-2 rounded-full" style={{ width: `${vector.percentage}%` }}></div>
              </div>
            </div>
          )) : (
            <div className="text-slate-500 text-sm">No data yet. Analyze offers to populate threat vectors.</div>
          )}
          
          <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl mt-6">
             <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">VISHWAS AI Observation</div>
             <p className="text-slate-300 text-sm">Most fraudulent offers originate from generic Gmail accounts mimicking real tech companies. "Registration Fees" remain a primary indicator of a scam in our live database.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
