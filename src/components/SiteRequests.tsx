import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Clock, CheckCircle2, AlertCircle, Send, MessageSquare } from 'lucide-react';
import { SiteRequest, Priority, RequestStatus } from '../types';
import RequestDetail from './RequestDetail';
import { useLocalStorage } from '../hooks/useLocalStorage';

const allRequests: SiteRequest[] = [
  { 
    id: 'REQ-001', siteId: 'site-1', clientName: 'Sprouto Main', title: 'Update Homepage Hero Banner', description: 'Change the main hero image to the new summer campaign asset.', status: 'in-progress', priority: 'high', date: '2026-03-15',
    messages: [
      { id: 'm1', sender: 'client', text: 'Hi, we need this ASAP for the summer launch.', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'developer', text: 'Understood. I will get the new assets uploaded today.', timestamp: '10:15 AM' }
    ],
    attachments: [
      { id: 'a1', name: 'summer-banner-v2.jpg', size: '2.4 MB', type: 'image' }
    ]
  },
  { 
    id: 'REQ-002', siteId: 'site-1', clientName: 'Sprouto Main', title: 'Add New Testimonials', description: 'Upload the 3 new video testimonials to the "About Us" page.', status: 'pending', priority: 'medium', date: '2026-03-17',
    messages: [], attachments: []
  },
  { 
    id: 'REQ-003', siteId: 'site-2', clientName: 'Sprouto Blog', title: 'Fix Footer Links', description: 'The privacy policy link in the footer is currently returning a 404 error.', status: 'completed', priority: 'high', date: '2026-03-10',
    messages: [], attachments: []
  },
];

export default function SiteRequests({ siteId, role, sitePlan = 'Starter' }: { siteId: string, role: string, sitePlan?: string }) {
  const [requests, setRequests] = useLocalStorage<SiteRequest[]>('sprouto_requests', allRequests);
  const [filteredRequests, setFilteredRequests] = useState<SiteRequest[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', priority: 'medium' as Priority });
  const [selectedRequest, setSelectedRequest] = useState<SiteRequest | null>(null);

  useEffect(() => {
    if (role === 'admin') {
      setFilteredRequests(requests);
    } else {
      setFilteredRequests(requests.filter(r => r.siteId === siteId));
    }
  }, [siteId, role, requests]);

  // Calculate active requests for the current site
  const activeRequests = requests.filter(r => r.siteId === siteId && r.status !== 'completed');
  const activeHigh = activeRequests.filter(r => r.priority === 'high').length;
  const activeMedium = activeRequests.filter(r => r.priority === 'medium').length;
  const activeLow = activeRequests.filter(r => r.priority === 'low').length;

  const isHigherPlan = sitePlan.toLowerCase() !== 'starter';
  
  const limits = {
    high: isHigherPlan ? 3 : 1,
    medium: isHigherPlan ? Infinity : 2,
    low: isHigherPlan ? Infinity : 3
  };

  const canAddHigh = activeHigh < limits.high;
  const canAddMedium = activeMedium < limits.medium;
  const canAddLow = activeLow < limits.low;

  // Ensure selected priority is valid when form opens or limits change
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

    // Final safety check
    if (newRequest.priority === 'high' && !canAddHigh) return;
    if (newRequest.priority === 'medium' && !canAddMedium) return;
    if (newRequest.priority === 'low' && !canAddLow) return;

    const request: SiteRequest = {
      id: `REQ-00${Math.floor(Math.random() * 1000)}`,
      siteId,
      clientName: 'Current Client',
      ...newRequest,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      messages: [],
      attachments: []
    };

    // Send email to hello@sprouto.com
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'hello@sprouto.com',
          subject: `New Site Request - ${request.clientName}`,
          html: `
            <h2>A new request has been submitted!</h2>
            <p><strong>Client Name:</strong> ${request.clientName}</p>
            <p><strong>Request Title:</strong> ${request.title}</p>
            <p><strong>Priority:</strong> ${request.priority}</p>
            <p><strong>Description:</strong></p>
            <p>${request.description}</p>
          `
        })
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    setRequests([request, ...requests]);
    setNewRequest({ title: '', description: '', priority: 'medium' });
    setIsFormOpen(false);
  };

  const handleUpdateRequest = (updated: SiteRequest) => {
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
    setSelectedRequest(updated);
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

  if (selectedRequest) {
    return (
      <AnimatePresence mode="wait">
        <RequestDetail 
          key="detail"
          request={selectedRequest} 
          role={role} 
          onClose={() => setSelectedRequest(null)} 
          onUpdate={handleUpdateRequest}
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
            {role === 'admin' ? 'Manage and respond to client updates.' : 'Submit and track updates for your website.'}
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
              <span className="text-xs text-rose-400 font-medium">You have reached your active request limit.</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Request Title</label>
              <input
                type="text"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                placeholder="e.g., Update Hero Image"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Priority</label>
              <select
                value={newRequest.priority}
                onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as Priority })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none"
              >
                <option value="low" disabled={!canAddLow} className="bg-[#141414]">
                  Low {isHigherPlan ? '(Unlimited)' : `(${activeLow}/${limits.low})`}
                </option>
                <option value="medium" disabled={!canAddMedium} className="bg-[#141414]">
                  Medium {isHigherPlan ? '(Unlimited)' : `(${activeMedium}/${limits.medium})`}
                </option>
                <option value="high" disabled={!canAddHigh} className="bg-[#141414]">
                  High ({activeHigh}/{limits.high})
                </option>
              </select>
              <p className="text-[10px] text-slate-500 ml-1">Limits based on your {sitePlan} plan.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Description</label>
            <textarea
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
              placeholder="Provide details about the changes you need..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-white text-[#050505] px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a]/50 rounded-3xl border border-white/5">
            <p className="text-slate-500">No requests found.</p>
          </div>
        ) : (
          filteredRequests.map((request, index) => {
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
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded-md">{request.id}</span>
                      <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-emerald-400 transition-colors break-words">{request.title}</h3>
                      {role === 'admin' && (
                        <span className="text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md shrink-0">
                          {request.clientName}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-3xl line-clamp-2 break-words">
                      {request.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        {request.messages.length} messages
                      </div>
                      {request.attachments.length > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                          {request.attachments.length} attachments
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig[request.status].bg} ${statusConfig[request.status].color} ${statusConfig[request.status].border}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="capitalize">{request.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm mt-1">
                      <span className={`px-2.5 py-1 rounded-md font-medium text-xs uppercase tracking-wider border ${priorityConfig[request.priority]}`}>
                        {request.priority}
                      </span>
                      <span className="text-slate-500 font-mono text-xs">{request.date}</span>
                    </div>
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
