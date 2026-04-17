import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  Bot,
  User,
  Paperclip,
  FileText,
  X,
  FileDown,
  RotateCcw,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { Site } from "../types";
import {
  useSendSproutoAIMessage,
  useClearSproutoAISession,
} from "@/src/hooks new/sprouto-ai-hook";

/* ================= TYPES ================= */

interface SproutoAIProps {
  site: Site;
}

type Attachment = {
  id: string;
  name: string;
  data: string; // base64 — kept for preview; filenames sent as context to backend
  mimeType: string;
  isImage: boolean;
};

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
};

/* ================= HELPERS ================= */

/**
 * Build a stable, site-scoped session key so that this
 * full-page assistant stays isolated from the global
 * AIChat widget sessions stored on the backend.
 */
const buildSessionId = (
  userId: string | undefined,
  siteUrl: string,
): string => {
  const base = userId ?? "guest";
  // Sanitise the URL into a safe slug
  const slug = siteUrl.replace(/https?:\/\//, "").replace(/[^a-zA-Z0-9]/g, "-");
  return `sprouto-ai-${base}-${slug}`;
};

/* ================= COMPONENT ================= */

export default function SproutoAI({ site }: SproutoAIProps) {
  if (!site) return;
  const user = useSelector((state: any) => state.auth.user);

  // Stable session ID — scoped per-user AND per-site
  const sessionId = useRef(buildSessionId(user?.userId, site.url)).current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: `Hello! I'm **SproutoAI**, your advanced site intelligence agent. I can analyse **${site.name}**, provide deep insights, compare metrics, explain predictions, and much more.\n\nYou can also attach documents or files to give me extra context about your brand. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: sendMessage, isPending: isGenerating } =
    useSendSproutoAIMessage();
  const { mutate: clearSession } = useClearSproutoAISession();

  /* ---------- scroll ---------- */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  /* ---------- file upload ---------- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1];
        setAttachments((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            data: base64Data,
            mimeType: file.type,
            isImage: file.type.startsWith("image/"),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  /* ---------- export ---------- */
  const exportDocument = (content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SproutoAI_Export_${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- reset session ---------- */
  const handleReset = () => {
    clearSession(sessionId);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "ai",
        content: `Session reset. I'm ready to help you with **${site.name}** again — what would you like to know?`,
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setAttachments([]);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isGenerating) return;

    const currentInput = input.trim();
    const currentAttachments = [...attachments];

    // Optimistically show the user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
      attachments: currentAttachments,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);

    // Build the full message string sent to the backend:
    // — Prepend site context so Gemini's session is always aware of the site
    // — Append attachment filenames as plain-text context (backend is text-only)
    const attachmentContext =
      currentAttachments.length > 0
        ? `\n\n[Attached files for context: ${currentAttachments.map((a) => a.name).join(", ")}]`
        : "";

    const fullMessage = `[Site: ${site.name} | ${site.url}]\n\n${currentInput}${attachmentContext}`;

    try {
      const response = await sendMessage({
        message: `${currentInput}${attachmentContext}`,
        sessionId,
        siteId: site.id,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          role: "ai",
          content: response.data.content,
          timestamp: new Date(),
        },
      ]);
    } catch {
      // onError toast is already handled inside the hook
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now() + 1}`,
          role: "ai",
          content:
            "An error occurred while processing your request. Please check your connection or try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  /* ================= RENDER ================= */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-8rem)] flex flex-col bg-[#050505] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
    >
      {/* ── Animated background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* ── Header ── */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 animate-pulse rounded-2xl" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#141414] border border-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              SproutoAI
            </h2>
            <p className="text-sm text-emerald-400/80 font-medium">
              Advanced Site Intelligence — {site.name}
            </p>
          </div>
        </div>

        {/* Reset session button */}
        <button
          onClick={handleReset}
          title="Reset conversation"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-3 py-2 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI avatar */}
              {msg.role === "ai" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
              )}

              <div
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                } max-w-[85%]`}
              >
                {/* Name + timestamp */}
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-xs font-medium text-slate-400">
                    {msg.role === "user" ? "You" : "SproutoAI"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  className={`p-5 rounded-3xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-500 text-[#050505] rounded-tr-sm font-medium shadow-[0_5px_20px_rgba(16,185,129,0.2)]"
                      : "bg-[#141414]/80 border border-white/10 text-slate-200 rounded-tl-sm shadow-xl backdrop-blur-md"
                  }`}
                >
                  {/* Attachment chips (user messages only) */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10"
                        >
                          {att.isImage ? (
                            <ImageIcon className="w-3.5 h-3.5" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          <span className="text-xs truncate max-w-[150px]">
                            {att.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message body — always markdown */}
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {/* Export button for longer AI responses */}
                {msg.role === "ai" && msg.content.length > 100 && (
                  <button
                    onClick={() => exportDocument(msg.content)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 rounded-md hover:bg-emerald-500/10"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Export as Document
                  </button>
                )}
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 justify-start"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div className="bg-[#141414]/80 backdrop-blur-md border border-white/10 p-4 rounded-3xl rounded-tl-sm flex items-center gap-3 shadow-xl">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-sm text-slate-400 font-medium">
                Processing request...
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="p-6 bg-gradient-to-t from-[#050505] to-transparent relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Attachment previews */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-wrap gap-3 mb-4"
              >
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-3 py-2 rounded-xl"
                  >
                    {att.isImage ? (
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-indigo-400" />
                    )}
                    <span className="text-xs text-slate-300 truncate max-w-[120px]">
                      {att.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors ml-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-3"
          >
            <div className="relative flex-1 bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-inner focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all flex items-end p-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl transition-colors shrink-0"
                title="Attach files or images"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask SproutoAI to analyse data, generate a report, or anything else..."
                className="w-full max-h-40 min-h-[44px] bg-transparent text-white placeholder:text-slate-500 px-3 py-3 focus:outline-none resize-none text-sm leading-relaxed"
                rows={1}
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: "welcome",
                    role: "ai",
                    content: `Hello! I'm **SproutoAI**, your advanced site intelligence agent. I can analyse **${site.name}**, provide deep insights, compare metrics, explain predictions, and much more.\n\nYou can also attach documents or files to give me extra context about your brand. How can I help you today?`,
                    timestamp: new Date(),
                  },
                ])
              }
              className="h-[60px] px-6 bg-gradient-to-r from-[#1f1f1f] to-[#2a2a2a] text-white rounded-3xl font-bold hover:from-[#2a2a2a] hover:to-[#333333] transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center gap-2 shrink-0"
            >
              <span className="hidden sm:inline">Clear Chat</span>
            </button>

            <button
              type="submit"
              disabled={
                (!input.trim() && attachments.length === 0) || isGenerating
              }
              className="h-[60px] px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-[#050505] rounded-3xl font-bold hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:from-emerald-500/50 disabled:to-emerald-600/50 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 shrink-0"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
