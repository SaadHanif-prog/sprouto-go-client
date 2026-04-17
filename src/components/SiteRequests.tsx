import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, CheckCircle2, AlertCircle, Send, MessageSquare, Paperclip, X } from 'lucide-react';
import { Priority } from '../types';
import RequestDetail from './RequestDetail';

import { useSelector } from "react-redux";
import { selectSelectedSiteId } from "@/src/global-states/slices/siteSlice";

import { useGetRequests, useCreateRequestWithUpload, useAssignRequest, useCompleteRequest } from "@/src/hooks new/requests.hook";
import { useGetAllUsers } from "@/src/hooks new/auth.hook";
import { RootState } from '../global-states/store';


function getAgeStyle(createdAt: string | Date): {
  border: string;
  glow: string;
  dot: string;
  label: string;
} {
  const created = new Date(createdAt).getTime();
  const ageMs   = Date.now() - created;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays < 7) {
    return {
      border: 'border-emerald-500/40',
      glow:   'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      dot:    'bg-emerald-400',
      label:  'New',
    };
  }
  if (ageDays < 14) {
    return {
      border: 'border-amber-500/40',
      glow:   'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      dot:    'bg-amber-400',
      label:  'Aging',
    };
  }
  return {
    border: 'border-rose-500/40',
    glow:   'shadow-[0_0_12px_rgba(239,68,68,0.15)]',
    dot:    'bg-rose-400',
    label:  'Overdue',
  };
}

export default function SiteRequests({ role, sitePlan = 'Starter' }: { role: string, sitePlan?: string }) {

  const selectedSiteId = useSelector(selectSelectedSiteId);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetRequests(
    role === "admin" ? undefined : selectedSiteId
  );

  const createRequestMutation = useCreateRequestWithUpload();
  const assignMutation = useAssignRequest();
  const { mutate: completeRequest, isPending } = useCompleteRequest();


  const { data: usersData } = useGetAllUsers();

  const developers = usersData?.data?.filter((u: any) => u.role === "developer") || [];

  const [selectedDeveloper, setSelectedDeveloper] = useState<Record<string, string>>({});

  const requests = (data?.data || []).map((r: any) => ({
    ...r,
    id:          r._id,
    messages:    r.messages    || [],
    attachments: r.attachments || [],
  }));

  const filteredRequests =
    role === "developer"
      ? requests.filter((r: any) => r.assignedTo?._id === user?.userId)
      : requests;

  const [isFormOpen,    setIsFormOpen]    = useState(false);
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newRequest, setNewRequest] = useState<{
    title:       string;
    description: string;
    priority:    Priority;
  }>({
    title:       '',
    description: '',
    priority:    'medium',
  });

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // ─── ACTIVE REQUEST LIMITS ────────────────────────────────────────────────
  const activeRequests = filteredRequests.filter((r: any) => {
    const siteIdVal = r.siteId?._id ?? r.siteId;
    return siteIdVal === selectedSiteId && r.status !== 'completed';
  });

  const activeHigh   = activeRequests.filter((r: any) => r.priority === 'high').length;
  const activeMedium = activeRequests.filter((r: any) => r.priority === 'medium').length;
  const activeLow    = activeRequests.filter((r: any) => r.priority === 'low').length;

  const isHigherPlan = sitePlan.toLowerCase() !== 'starter';

  const limits = {
    high:   isHigherPlan ? 3        : 1,
    medium: isHigherPlan ? Infinity : 2,
    low:    isHigherPlan ? Infinity : 3,
  };

  const canAddHigh   = activeHigh   < limits.high;
  const canAddMedium = activeMedium < limits.medium;
  const canAddLow    = activeLow    < limits.low;

  useEffect(() => {
    if (!isFormOpen) return;
    if      (newRequest.priority === 'high'   && !canAddHigh)   setNewRequest(p => ({ ...p, priority: canAddMedium ? 'medium' : canAddLow ? 'low' : 'high'   }));
    else if (newRequest.priority === 'medium' && !canAddMedium) setNewRequest(p => ({ ...p, priority: canAddLow    ? 'low'    : canAddHigh ? 'high' : 'medium' }));
    else if (newRequest.priority === 'low'    && !canAddLow)    setNewRequest(p => ({ ...p, priority: canAddMedium ? 'medium' : canAddHigh ? 'high' : 'low'    }));
  }, [isFormOpen, canAddHigh, canAddMedium, canAddLow]);

  const canAddNewRequest = canAddHigh || canAddMedium || canAddLow;

  // ─── DOWNLOAD HELPER ──────────────────────────────────────────────────────
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob     = await response.blob();
      const link     = document.createElement("a");
      link.href      = URL.createObjectURL(blob);
      link.download  = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(url, "_blank");
    }
  };

  // ─── SUBMIT ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.description) return;

    await createRequestMutation.mutateAsync({
      file: selectedFile ?? undefined,
      payload: {
        siteId:      selectedSiteId,
        title:       newRequest.title,
        description: newRequest.description,
        priority:    newRequest.priority,
      },
    });

    setNewRequest({ title: '', description: '', priority: 'medium' });
    setSelectedFile(null);
    setIsFormOpen(false);
  };

  // ─── ASSIGN ───────────────────────────────────────────────────────────────
  const handleAssign = async (requestId: string) => {
    const developerId = selectedDeveloper[requestId];
    if (!developerId) return;
    await assignMutation.mutateAsync({ requestId, developerId });
  };

  // ─── ROLE HELPER ──────────────────────────────────────────────────────────
  const isAdminOrSuper = role === "admin" || role === "superadmin";

  // ─── CONFIGS ──────────────────────────────────────────────────────────────
  const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
    'pending':     { icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'  },
    'in-progress': { icon: AlertCircle,  color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20'   },
    'completed':   { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20'},
  };

  const priorityConfig: Record<string, string> = {
    'low':    'bg-white/5 border-white/10 text-slate-400',
    'medium': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    'high':   'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const priorityOptions: { value: Priority; label: string; disabled: boolean }[] = [
    { value: 'high',   label: `High${!canAddHigh     ? ' (limit reached)' : ''}`, disabled: !canAddHigh   },
    { value: 'medium', label: `Medium${!canAddMedium ? ' (limit reached)' : ''}`, disabled: !canAddMedium },
    { value: 'low',    label: `Low${!canAddLow       ? ' (limit reached)' : ''}`, disabled: !canAddLow    },
  ];

  // ─── LOADING ──────────────────────────────────────────────────────────────
  if (isLoading) return <div className="text-center text-slate-400">Loading requests...</div>;

  // ─── DETAIL VIEW ──────────────────────────────────────────────────────────
  if (selectedRequest) {
    return (
      <AnimatePresence mode="wait">
        <RequestDetail
          key={selectedRequest.id}
          request={selectedRequest}
          role={role}
          onClose={() => setSelectedRequest(null)}
          onUpdate={() => {}}
        />
      </AnimatePresence>
    );
  }

  // ─── MAIN VIEW ────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            {isAdminOrSuper ? 'All Client Requests' : 'Site Change Requests'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isAdminOrSuper
              ? 'Manage and respond to client updates.'
              : 'Submit and track updates for your website.'}
          </p>
        </div>

        {role === 'client' && (
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              disabled={!canAddNewRequest}
              className="inline-flex items-center gap-2 bg-emerald-500 text-[#050505] px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              New Request
            </button>
            {!canAddNewRequest && (
              <span className="text-xs text-rose-400 font-medium">
                You have reached your active request limit.
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── FORM ── */}
      <AnimatePresence>
        {isFormOpen && role === 'client' && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-[#0a0a0a]/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 overflow-hidden"
          >
            <input
              type="text"
              value={newRequest.title}
              onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
              placeholder="Request Title"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />

            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              placeholder="Description"
              rows={4}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Priority</label>
              <div className="flex gap-2">
                {priorityOptions.map(({ value, label, disabled }) => (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && setNewRequest(p => ({ ...p, priority: value }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors
                      ${newRequest.priority === value ? priorityConfig[value] : 'bg-white/5 border-white/10 text-slate-500'}
                      disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* File attachment */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Attachment (optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/40 transition-colors"
              >
                <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-400 truncate">
                  {selectedFile ? selectedFile.name : 'Click to attach a file'}
                </span>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    className="ml-auto text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <button
              type="submit"
              disabled={createRequestMutation.isPending}
              className="inline-flex items-center gap-2 bg-white text-[#050505] px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── REQUEST LIST ── */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a]/50 rounded-3xl border border-white/5">
            <p className="text-slate-500">No requests found.</p>
          </div>
        ) : (
          filteredRequests.map((request: any, index: number) => {

            console.log("Requests", request)
            const StatusIcon = statusConfig[request.status]?.icon ?? Clock;

            // ── Age-based card styling ──────────────────────────────────────
            // Completed requests stay neutral — no urgency colouring needed.
            const ageStyle = request.status === 'completed'
              ? { border: 'border-white/10', glow: '', dot: 'bg-slate-500', label: '' }
              : getAgeStyle(request.createdAt);

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRequest(request)}
                className={`bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border transition-colors group cursor-pointer
                  ${ageStyle.border} ${ageStyle.glow}
                  hover:brightness-110`}
              >
                <div className="flex justify-between gap-6">
                  <div className="space-y-2 min-w-0">

                    {/* Title row with age indicator dot */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Pulsing dot for non-completed requests */}
                      {request.status !== 'completed' && (
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${ageStyle.dot}`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${ageStyle.dot}`} />
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {request.title}
                      </h3>
                      {/* Age label badge */}
                      {request.status !== 'completed' && ageStyle.label && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border
                          ${ageStyle.dot === 'bg-emerald-400' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : ''}
                          ${ageStyle.dot === 'bg-amber-400'   ? 'text-amber-400   border-amber-500/30   bg-amber-500/10'   : ''}
                          ${ageStyle.dot === 'bg-rose-400'    ? 'text-rose-400    border-rose-500/30    bg-rose-500/10'    : ''}
                        `}>
                          {ageStyle.label}
                        </span>
                      )}
                      {/* Creation date — always shown, right after the label */}
                      {request.createdAt && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(request.createdAt).toLocaleDateString('en-GB', {
                            day:    '2-digit',
                            month:  'short',
                            year:   'numeric',
                            hour:   '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    {isAdminOrSuper && (
                      <span className="text-xs text-indigo-400">
                        {request.siteId?.name}
                      </span>
                    )}

                    <p className="text-slate-400 text-sm line-clamp-2">
                      {request.description}
                    </p>

                    {/* Counts row */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        {request.messages.length} messages
                      </span>
                      {request.attachments.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Paperclip className="w-4 h-4" />
                          {request.attachments.length} file{request.attachments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* ── ATTACHMENT DOWNLOAD LINKS ── */}
                    {request.attachments.length > 0 && (
                      <div
                        className="flex flex-col gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {request.attachments.map((att: any) => (
                          <button
                            key={att._id}
                            type="button"
                            onClick={() => handleDownload(att.url, att.original_name)}
                            className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors w-fit"
                          >
                            <Paperclip className="w-3 h-3 shrink-0" />
                            <span className="truncate max-w-[200px]">{att.original_name}</span>
                            <span className="text-slate-500 shrink-0">
                              ({(att.size / 1024).toFixed(1)} KB)
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Admin: assign developer */}
                    {isAdminOrSuper && (
                      <div
                        className="flex items-center gap-2 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="bg-[#0a0a0a] border border-white/10 text-white text-xs px-2 py-1 rounded"
                          value={selectedDeveloper[request.id] || ""}
                          onChange={(e) =>
                            setSelectedDeveloper((prev) => ({ ...prev, [request.id]: e.target.value }))
                          }
                        >
                          <option value="">Assign Developer</option>
                          {developers.map((dev: any) => (
                            <option key={dev._id} value={dev._id}>
                              {dev.firstname} {dev.surname}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleAssign(request.id)}
                          disabled={assignMutation.isPending}
                          className="text-xs bg-emerald-500 text-black px-2 py-1 rounded hover:bg-emerald-400 disabled:opacity-50"
                        >
                          {assignMutation.isPending ? '...' : 'Assign'}
                        </button>

                        {request.assignedTo && (
                          <span className="text-xs text-slate-400">
                            Assigned: {request.assignedTo.firstname} {request.assignedTo.surname}
                          </span>
                        )}
                      </div>
                    )}
 
                    {user?.role === "developer" && request.status !== "completed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeRequest({ requestId: request._id })}}
                        
                        disabled={isPending}
                        style={{
                          marginTop: "12px",
                          padding: "10px 20px",
                          background: "#22c55e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: 600,
                          cursor: isPending ? "not-allowed" : "pointer",
                          opacity: isPending ? 0.7 : 1,
                        }}
                      >
                        Mark as complete
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`px-3 py-1 rounded-full text-xs border ${statusConfig[request.status]?.bg} ${statusConfig[request.status]?.color}`}>
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {request.status}
                    </div>
                    <span className={`px-2 py-1 text-xs border rounded ${priorityConfig[request.priority]}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

    </motion.div>
  );
}