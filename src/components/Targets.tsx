import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Calendar, UploadCloud, CheckCircle2, Sparkles, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface MonthlyTarget {
  id: string;
  siteId: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  month: string;
}

const allTargets: MonthlyTarget[] = [
  { id: '1', siteId: 'site-1', metric: 'Organic Traffic', targetValue: 50000, currentValue: 34500, unit: 'visitors', month: 'March 2026' },
  { id: '2', siteId: 'site-1', metric: 'Conversion Rate', targetValue: 4.5, currentValue: 3.2, unit: '%', month: 'March 2026' },
  { id: '3', siteId: 'site-1', metric: 'New Leads', targetValue: 800, currentValue: 650, unit: 'leads', month: 'March 2026' },
  { id: '4', siteId: 'site-2', metric: 'Blog Subscribers', targetValue: 1000, currentValue: 850, unit: 'subs', month: 'March 2026' },
];

export default function Targets({ siteId }: { siteId: string }) {
  const [globalTargets, setGlobalTargets] = useLocalStorage<MonthlyTarget[]>('sprouto_targets', allTargets);
  const [isUploading, setIsUploading] = useState(false);

  const targets = globalTargets.filter(t => t.siteId === siteId);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setGlobalTargets([
        ...globalTargets,
        { id: Date.now().toString(), siteId, metric: 'Bounce Rate Reduction', targetValue: 40, currentValue: 48, unit: '%', month: 'April 2026' }
      ]);
      setIsUploading(false);
    }, 1500);
  };

  const handleDownloadTargets = () => {
    const csvContent = `Metric,Target Value,Unit,Month
"Organic Traffic",60000,"visitors","April 2026"
"Conversion Rate",5.0,"%","April 2026"
"New Leads",1000,"leads","April 2026"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Next_Month_Targets.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Monthly Targets</h2>
          <p className="text-sm text-slate-400 mt-1">Set and track your performance goals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTargets}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-500/20 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <Download className="w-5 h-5" />
            Download Next Month
          </button>
          <button
            onClick={handleSimulateUpload}
            disabled={isUploading}
            className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-500/20 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <UploadCloud className="w-5 h-5" />
              </motion.div>
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            {isUploading ? 'Processing...' : 'Upload CSV'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {targets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-[#0a0a0a]/50 rounded-3xl border border-white/5">
            <p className="text-slate-500">No targets set for this site.</p>
          </div>
        ) : (
          targets.map((target, index) => {
            const progress = Math.min(100, Math.round((target.currentValue / target.targetValue) * 100));
            const isComplete = progress >= 100;

            return (
              <motion.div
                key={target.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a0a0a]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className={`h-full ${isComplete ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]'}`}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-8 mt-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {target.month}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">{target.metric}</h3>
                
                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {target.currentValue.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-slate-500 mb-1.5 uppercase tracking-wider">
                    / {target.targetValue.toLocaleString()} {target.unit}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold uppercase tracking-wider">
                    <span className={isComplete ? 'text-emerald-400' : 'text-indigo-400'}>
                      {progress}% Completed
                    </span>
                    {isComplete && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className={`h-full rounded-full ${isComplete ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]'}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
