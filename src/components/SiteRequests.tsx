import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, CheckCircle2, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { Priority } from '../types';
import RequestDetail from './RequestDetail';

import { useSelector } from "react-redux";
import { selectSelectedSiteId } from "@/src/global-states/slices/siteSlice";

import { useGetRequests, useCreateRequest, useAssignRequest } from "@/src/hooks new/requests.hook";
import { useGetAllUsers } from "@/src/hooks new/auth.hook";
import { RootState } from '../global-states/store';

export default function SiteRequests({ role, sitePlan = 'Starter' }: { role: string, sitePlan?: string }) {

  const selectedSiteId = useSelector(selectSelectedSiteId);

  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading } = useGetRequests(
    role === "admin" ? undefined : selectedSiteId
  );

  const createRequestMutation = useCreateRequest();
  const assignMutation = useAssignRequest();

  const { data: usersData } = useGetAllUsers();

  console.log("users data", usersData)


  const developers =
    usersData?.data?.filter((u: any) => u.role === "developer") || [];

  const [selectedDeveloper, setSelectedDeveloper] = useState<Record<string, string>>({});

  // ✅ NORMALIZE BACKEND DATA
  const requests = (data?.data || []).map((r: any) => ({
    ...r,
    id: r._id,
    messages: r.messages || [],
    attachments: r.attachments || [],
  }));

  const filteredRequests =
  role === "developer"
    ? requests.filter((r: any) => r.assignedTo?._id === user?.userId)
    : requests;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority
  });
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // ACTIVE REQUEST CALCULATION
  const activeRequests = filteredRequests.filter((r: any) =>
    r.siteId === selectedSiteId && r.status !== 'completed'
  );

  const activeHigh = activeRequests.filter((r: any) => r.priority === 'high').length;
  const activeMedium = activeRequests.filter((r: any) => r.priority === 'medium').length;
  const activeLow = activeRequests.filter((r: any) => r.priority === 'low').length;

  const isHigherPlan = sitePlan.toLowerCase() !== 'starter';

  const limits = {
    high: isHigherPlan ? 3 : 1,
    medium: isHigherPlan ? Infinity : 2,
    low: isHigherPlan ? Infinity : 3
  };

  const canAddHigh = activeHigh < limits.high;
  const canAddMedium = activeMedium < limits.medium;
  const canAddLow = activeLow < limits.low;

  useEffect(() => {
    if (!isFormOpen) return;

    if (newRequest.priority === 'high' && !canAddHigh) {
      setNewRequest(prev => ({ ...prev, priority: canAddMedium ? 'medium' : (canAddLow ? 'low' : 'high') }));
    } else if (newRequest.priority === 'medium' && !canAddMedium) {
      setNewRequest(prev => ({ ...prev, priority: canAddLow ? 'low' : (canAddHigh ? 'high' : 'medium') }));
    } else if (newRequest.priority === 'low' && !canAddLow) {
      setNewRequest(prev => ({ ...prev, priority: canAddMedium ? 'medium' : (canAddHigh ? 'high' : 'low') }));
    }
  }, [isFormOpen, canAddHigh, canAddMedium, canAddLow]);

  const canAddNewRequest = canAddHigh || canAddMedium || canAddLow;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRequest.title || !newRequest.description) return;

    await createRequestMutation.mutateAsync({
      siteId: selectedSiteId,
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
    });

    setNewRequest({ title: '', description: '', priority: 'medium' });
    setIsFormOpen(false);
  };

  // ✅ ASSIGN HANDLER
  const handleAssign = async (requestId: string) => {
    const developerId = selectedDeveloper[requestId];
    if (!developerId) return;

    await assignMutation.mutateAsync({
      requestId,
      developerId,
    });
  };

  const statusConfig = {
    'pending': { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    'in-progress': { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    'completed': { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  };

  const priorityConfig = {
    'low': 'bg-white/5 border-white/10 text-slate-400',
    'medium': 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    'high': 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  if (isLoading) {
    return <div className="text-center text-slate-400">Loading requests...</div>;
  }

  // ✅ CHAT VIEW
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            {role === 'admin' ? 'All Client Requests' : 'Site Change Requests'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {role === 'admin'
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
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />

          <textarea
            value={newRequest.description}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
          />

          <button className="inline-flex items-center gap-2 bg-white text-[#050505] px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
            <Send className="w-4 h-4" />
            Submit Request
          </button>
        </motion.form>
      )}

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a]/50 rounded-3xl border border-white/5">
            <p className="text-slate-500">No requests found.</p>
          </div>
        ) : (
          filteredRequests.map((request: any, index: number) => {
            const StatusIcon = statusConfig[request.status].icon;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRequest(request)}
                className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg hover:border-emerald-500/30 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between gap-6">

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {request.title}
                    </h3>

                    {role === 'admin' || role === "superadmin" && (
                      <span className="text-xs text-indigo-400">
                        {request.siteId?.name}
                      </span>
                    )}

                    <p className="text-slate-400 text-sm">
                      {request.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <MessageSquare className="w-4 h-4" />
                      {request.messages.length} messages
                    </div>

                    {/* ✅ ASSIGN (NO STYLE CHANGE) */}
                    {role === "admin"  || role === "superadmin" && (
                      <div
                        className="flex items-center gap-2 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          className="bg-[#0a0a0a] border border-white/10 text-white text-xs px-2 py-1 rounded"
                          value={selectedDeveloper[request.id] || ""}
                          onChange={(e) =>
                            setSelectedDeveloper((prev) => ({
                              ...prev,
                              [request.id]: e.target.value,
                            }))
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
                          className="text-xs bg-emerald-500 text-black px-2 py-1 rounded hover:bg-emerald-400"
                        >
                          Assign
                        </button>
                      </div>
                    )}

                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs border ${statusConfig[request.status].bg} ${statusConfig[request.status].color}`}>
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