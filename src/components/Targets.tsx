import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  Calendar,
  UploadCloud,
  CheckCircle2,
  Download,
  Plus,
  X,
  Loader2,
  Trash2,
} from 'lucide-react';
import { useGetTargets, useCreateTarget, useDeleteTarget } from '@/src/hooks new/targets.hook';
import { Site } from '../types';


/* ─────────────────────────── TYPES ─────────────────────────── */

interface AddTargetForm {
  metric: string;
  targetValue: string;
  unit: string;
  month: string;
}

const UNIT_SUGGESTIONS = ['visitors', 'conversions'];

const MONTH_OPTIONS = (() => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(
      d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    );
  }
  return months;
})();

/* ─────────────────────────── MODAL ─────────────────────────── */

function AddTargetModal({
  siteId,
  siteUrl,
  onClose,
}: {
  siteId: string;
  siteUrl?: string;
  onClose: () => void;
}) {
  const { mutateAsync: createTarget, isPending } = useCreateTarget();

  const [form, setForm] = useState<AddTargetForm>({
    metric: '',
    targetValue: '',
    unit: 'visitors',
    month: MONTH_OPTIONS[1] ?? '',
  });
  const [error, setError] = useState('');

  const set = (field: keyof AddTargetForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.metric.trim()) return setError('Metric name is required.');
    if (!form.targetValue || isNaN(Number(form.targetValue)) || Number(form.targetValue) <= 0)
      return setError('Please enter a valid positive target value.');
    if (!form.unit.trim()) return setError('Unit is required.');
    if (!form.month) return setError('Month is required.');

    setError('');
    try {
      await createTarget({
        siteId,
        metric: form.metric.trim(),
        targetValue: Number(form.targetValue),
        unit: form.unit.trim(),
        month: form.month,
        url: siteUrl,
      });
      onClose();
    } catch {
      setError('Failed to create target. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Top accent bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight">Add New Target</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sprouto AI will estimate your current baseline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-white/5" />

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* Metric name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Metric Name
            </label>
            <input
              value={form.metric}
              onChange={set('metric')}
              placeholder="e.g. Organic Traffic, Conversion Rate…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors"
            />
          </div>

          {/* Target value + unit */}
          <div className="flex gap-3">
            <div className="space-y-2 flex-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Value
              </label>
              <input
                type="number"
                min="0"
                value={form.targetValue}
                onChange={set('targetValue')}
                placeholder="50000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors"
              />
            </div>
            <div className="space-y-2 w-36">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={set('unit')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors appearance-none cursor-pointer"
              >
                {UNIT_SUGGESTIONS.map(u => (
                  <option key={u} value={u} className="bg-[#0a0a0a]">{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" /> Target Month
            </label>
            <select
              value={form.month}
              onChange={set('month')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-colors appearance-none cursor-pointer"
            >
              {MONTH_OPTIONS.map(m => (
                <option key={m} value={m} className="bg-[#0a0a0a]">{m}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 pb-7 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Target
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */

export default function Targets({ site }: { site: Site }) {
  if(!site) return;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data, isLoading, isError } = useGetTargets(site.id);
  const { mutate: deleteTarget } = useDeleteTarget(site.id);

  const targets = data?.data ?? [];

  const handleDownloadTargets = () => {
    const rows = targets.map(t =>
      `"${t.metric}",${t.targetValue},"${t.unit}","${t.month}"`
    );
    const csvContent = `Metric,Target Value,Unit,Month\n${rows.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Targets_${site.id}.csv`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1500);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Monthly Targets</h2>
            <p className="text-sm text-slate-400 mt-1">Set and track your performance goals.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleDownloadTargets}
              className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-500/20 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={handleSimulateUpload}
              disabled={isUploading}
              className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-500/20 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <UploadCloud className="w-5 h-5" />
                </motion.div>
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
              {isUploading ? 'Processing…' : 'Upload CSV'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-400 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <Plus className="w-5 h-5" />
              Add Target
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : isError ? (
            <div className="col-span-full text-center py-12 bg-[#0a0a0a]/50 rounded-3xl border border-red-500/20">
              <p className="text-red-400 text-sm">Failed to load targets. Please refresh.</p>
            </div>
          ) : targets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center gap-4 py-16 bg-[#0a0a0a]/50 rounded-3xl border border-white/5 border-dashed"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Target className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">No targets yet</p>
                <p className="text-slate-500 text-sm mt-1">Add your first target to start tracking progress.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-400 transition-colors mt-1"
              >
                <Plus className="w-4 h-4" />
                Add First Target
              </button>
            </motion.div>
          ) : (
            targets.map((target, index) => {
              const progress = Math.min(100, Math.round((target.currentValue / target.targetValue) * 100));
              const isComplete = progress >= 100;

              return (
                <motion.div
                  key={target._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-[#0a0a0a]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors"
                >
                  {/* Progress bar top */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
                      className={`h-full ${isComplete ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]'}`}
                    />
                  </div>

                  {/* Delete button — visible on hover */}
                  <button
                    onClick={() => deleteTarget(target._id)}
                    className="absolute top-5 right-5 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

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
                        transition={{ duration: 1, delay: 0.2 + index * 0.08 }}
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AddTargetModal
            siteId={site.id}
            siteUrl={site.url}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}