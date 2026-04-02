import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Send, Paperclip, Image as ImageIcon,
  FileText, Download, User, Code, X, Wifi, WifiOff
} from 'lucide-react';
import { Attachment } from '../types';
import { useChat } from '@/src/hooks new/chat.hook';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/global-states/store'; 


interface RequestDetailProps {
  key?: React.Key;
  request: any;
  role: string;
  onClose: () => void;
  onUpdate: (updatedRequest: any) => void;
}

export default function RequestDetail({ request, role, onClose, onUpdate }: RequestDetailProps) {
 const { user } = useSelector((state: RootState) => state.auth);
  const { messages, sendMessage, connected, error } = useChat(
    request.id,
    user?.accessToken
  );

  const [newMessage, setNewMessage]   = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>(request.attachments || []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const btn = document.getElementById('ai-chat-toggle');
    if (window.innerWidth < 1024 && btn) btn.style.display = 'none';
    return () => { if (btn) btn.style.display = 'flex'; };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((file: File) => ({
      id: Date.now().toString() + Math.random().toString(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type.startsWith('image/') ? 'image' : 'document',
    }));

    const merged = [...attachments, ...newAttachments];
    setAttachments(merged);
    onUpdate({ ...request, attachments: merged });
  };

  const isMine = (msg: any): boolean =>{
    console.log("sender id",msg.senderId)
   return !!user?.userId && msg.senderId?._id?.toString() === user.userId;}


  const senderLabel = (msg: any): string =>
    `${msg.senderId?.firstname ?? ''} ${msg.senderId?.surname ?? ''}`.trim() ||
    msg.senderId?.role ||
    'Unknown';

  const senderRole = (msg: any): 'developer' | 'client' =>
    msg.senderId?.role === 'developer' ? 'developer' : 'client';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 lg:relative lg:inset-auto bg-[#0a0a0a] lg:bg-[#0a0a0a]/80 backdrop-blur-xl lg:rounded-3xl border-0 lg:border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full lg:h-[80vh] z-[60] lg:z-0"
    >
      <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white lg:flex hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 lg:gap-3">
              <span className="text-[10px] lg:text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 lg:py-1 rounded-md border border-emerald-500/20">
                {request.id}
              </span>
              <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight truncate max-w-[180px] lg:max-w-none">
                {request.title}
              </h2>
            </div>
            {(role === 'admin' || role === 'superadmin') && (
              <p className="text-xs lg:text-sm text-slate-400 mt-0.5 lg:mt-1">
                Site: {request.siteId?.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px] lg:text-xs">
            {connected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-slate-500" />
                <span className="text-slate-500 hidden sm:inline">Connecting…</span>
              </>
            )}
          </div>
          <span className="px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
            {request.status}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Left column — description + attachments */}
        <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/10 p-5 lg:p-6 overflow-y-auto bg-[#050505]/50 flex flex-col gap-6 lg:gap-8 shrink-0 max-h-[35vh] lg:max-h-none">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</h3>
            <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              {request.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attachments</h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors"
              >
                <Paperclip className="w-3 h-3" /> Add File
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple />
            </div>

            <div className="space-y-3">
              {attachments.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl text-slate-500 text-sm">
                  No attachments yet.
                </div>
              ) : (
                attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#141414] flex items-center justify-center text-slate-400 shrink-0">
                        {att.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-slate-200 truncate">{att.name}</span>
                        <span className="text-xs text-slate-500">{att.size}</span>
                      </div>
                    </div>
                    <button className="p-1.5 text-slate-400 hover:text-white lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column — real-time chat */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" /> Developer Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <p className="text-center text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2">
                {error}
              </p>
            )}

            {messages.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                <Code className="w-8 h-8 opacity-30" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            )}

            {messages.map((msg: any) => {
              const mine = isMine(msg);
              const sr   = senderRole(msg);

              return (
                <div key={msg._id} className={`flex gap-3 ${mine ? 'justify-end' : 'justify-start'}`}>
                  {!mine && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${sr === 'developer' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                      {sr === 'developer' ? <Code className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                  )}

                  <div className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-xs font-medium text-slate-400">{senderLabel(msg)}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`max-w-[85%] lg:max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed break-words ${mine ? 'bg-emerald-500 text-[#050505] rounded-tr-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>
                  </div>

                  {mine && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${sr === 'developer' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}`}>
                      {sr === 'developer' ? <Code className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={connected ? 'Type your message…' : 'Connecting to chat…'}
                disabled={!connected}
                className="w-full pl-4 pr-12 py-3 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#1a1a1a] transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !connected}
                className="absolute right-2 p-2 bg-emerald-500 text-[#050505] rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:bg-emerald-500/50 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </motion.div>
  );
}