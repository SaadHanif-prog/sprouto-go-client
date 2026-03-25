import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Search, Activity, TrendingUp, AlertTriangle, CheckCircle2, Bot, User, Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';
// import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Site } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function SEOAuditor({ site }: { site: Site }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: `Hi there! I am your SEO & GEO Auditor for ${site.name}. I've analysed your site's health and trending keywords. How can I help you improve your search rankings today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReRunning, setIsReRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // State for report runs
  const [reportState, setReportState] = useLocalStorage(`seo_report_state_${site.id}`, {
    runsUsed: 0,
    lastRunMonth: new Date().getMonth()
  });

  // State for dynamic stats
  const [stats, setStats] = useLocalStorage(`seo_stats_${site.id}`, {
    health: 88,
    traffic: 12.4,
    issues: 3
  });

  useEffect(() => {
    // Reset runs if it's a new month
    const currentMonth = new Date().getMonth();
    if (reportState.lastRunMonth !== currentMonth) {
      setReportState({ runsUsed: 0, lastRunMonth: currentMonth });
    }
  }, [reportState.lastRunMonth, setReportState]);

  // useEffect(() => {
  //   if (!chatRef.current) {
  //     chatRef.current = ai.chats.create({
  //       model: 'gemini-3-flash-preview',
  //       config: {
  //         systemInstruction: "You are an expert SEO and GEO consultant for SproutoGO, powered by our innovative AI engine Go's and our bio-diverse system. The user is asking about their site's SEO health, trending keywords, and next month's targets. Respond in a friendly, conversational, and highly human-like manner. Always format your responses with clear, well-spaced paragraphs. Use bullet points when listing items to make them easy to read. Avoid dense walls of text and overly technical jargon without explanation. Be concise but warm and helpful.",
  //       }
  //     });
  //   }
  // }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage.content });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || 'I am sorry, I could not process that request.'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: 'Sorry, I encountered an error connecting to the AI service. Please check your API key configuration.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const csvContent = `Target Keyword,Search Volume,Difficulty,Current Rank,Target Rank
"Bio-Diverse Automation",12500,High,15,5
"Business Software",8400,Medium,22,10
"Workflow Optimisation",5200,Low,8,3
"Enterprise Solutions",21000,High,45,20`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${site.name.replace(/\s+/g, '_')}_SEO_Targets_Next_Month.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReRun = () => {
    if (reportState.runsUsed >= 3) return;
    
    setIsReRunning(true);
    
    // Simulate report generation
    setTimeout(() => {
      setStats(prev => ({
        health: Math.min(100, prev.health + Math.floor(Math.random() * 3)),
        traffic: +(prev.traffic + Math.random() * 0.5).toFixed(1),
        issues: Math.max(0, prev.issues - Math.floor(Math.random() * 2))
      }));
      setReportState(prev => ({ ...prev, runsUsed: prev.runsUsed + 1 }));
      setIsReRunning(false);
    }, 2500);
  };

  if (!site.liveUrl) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">GEO/SEO Auditor</h2>
          <p className="text-slate-400 mt-1">In-depth breakdown and monthly targets for {site.name}</p>
        </div>
        
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Auditor Pending Setup</h3>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            Your GEO/SEO Auditor will become available once your website is live and the URL has been connected by our team. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">GEO/SEO Auditor</h2>
          <p className="text-slate-400 mt-1">In-depth breakdown and monthly targets for {site.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-2">
            <span className="text-xs text-slate-400 font-medium">{3 - reportState.runsUsed} updates remaining</span>
            <span className="text-[10px] text-slate-500">Resets monthly</span>
          </div>
          <button 
            onClick={handleReRun}
            disabled={isReRunning || reportState.runsUsed >= 3}
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            <RefreshCw className={`w-4 h-4 ${isReRunning ? 'animate-spin' : ''}`} />
            {isReRunning ? 'Analysing...' : 'Re-run Report'}
          </button>
          <button 
            onClick={handleDownload}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#050505] px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            <Download className="w-4 h-4" />
            Download Next Month Targets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stats & Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 font-medium">Health Score</h3>
              </div>
              <div className="text-3xl font-bold text-white mt-4">{stats.health}<span className="text-lg text-slate-500 font-normal">/100</span></div>
              <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5 from last month</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 font-medium">Organic Traffic</h3>
              </div>
              <div className="text-3xl font-bold text-white mt-4">{stats.traffic}k</div>
              <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% from last month</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 font-medium">Critical Issues</h3>
              </div>
              <div className="text-3xl font-bold text-white mt-4">{stats.issues}</div>
              <p className="text-sm text-rose-400 mt-2">Needs attention</p>
            </div>
          </div>

          {/* Trending Words */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Trending Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {['Bio-Diverse System', 'Workflow Software', 'Enterprise Tech', 'Cloud Solutions', 'Data Analytics', 'Machine Learning'].map((word, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  {word}
                </span>
              ))}
            </div>
          </div>

          {/* Page Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Page Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Page URL</th>
                    <th className="px-6 py-4 font-medium">Health</th>
                    <th className="px-6 py-4 font-medium">Top Keyword</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { url: '/', health: 95, keyword: 'Sprouto Platform', status: 'Good' },
                    { url: '/features', health: 82, keyword: 'Bio-Diverse Features', status: 'Needs Work' },
                    { url: '/pricing', health: 90, keyword: 'Sprouto Pricing', status: 'Good' },
                    { url: '/blog/ai-trends', health: 75, keyword: "Go's AI Trends 2026", status: 'Critical' },
                  ].map((page, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-slate-300">{page.url}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${page.health >= 90 ? 'bg-emerald-500' : page.health >= 80 ? 'bg-yellow-500' : 'bg-rose-500'}`}
                              style={{ width: `${page.health}%` }}
                            />
                          </div>
                          <span className="text-slate-400">{page.health}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{page.keyword}</td>
                      <td className="px-6 py-4">
                        {page.status === 'Good' && <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Good</span>}
                        {page.status === 'Needs Work' && <span className="inline-flex items-center gap-1 text-yellow-400"><AlertTriangle className="w-4 h-4" /> Needs Work</span>}
                        {page.status === 'Critical' && <span className="inline-flex items-center gap-1 text-rose-400"><AlertTriangle className="w-4 h-4" /> Critical</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat */}
        <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[800px] lg:h-auto">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">SEO Assistant</h3>
              <p className="text-xs text-slate-400">Ask about your targets</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-500 text-[#050505] rounded-tr-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {msg.role === 'model' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Analysing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-white/5">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your SEO health..."
                className="w-full pl-4 pr-12 py-3 bg-[#141414] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#1a1a1a] transition-all placeholder:text-slate-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-emerald-500 text-[#050505] rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:bg-emerald-500/50 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
