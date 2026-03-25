import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
// import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

// Initialize the Gemini AI client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export default function AIChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', content: 'Hi there! I am your SproutoGO AI assistant. How can I help you with your site, targets, or analytics today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // useEffect(() => {
  //   if (!chatRef.current) {
  //     chatRef.current = ai.chats.create({
  //       model: 'gemini-3-flash-preview',
  //       config: {
  //         systemInstruction: "You are the AI support assistant for SproutoGO, powered by our innovative AI engine Go's and our bio-diverse system. You are Your Partners built for microbusinesses to redefine their digital presence so they can focus on scaling. You must ALWAYS use UK English spelling and grammar (e.g., \"colour\", \"optimise\", \"programme\", \"£\"). You must respond in a friendly, conversational, and highly human-like manner. Always format your responses with clear, well-spaced paragraphs. Use bullet points when listing items to make them easy to read. Avoid dense walls of text. Be concise but warm and helpful.",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-24 right-4 left-4 lg:left-auto lg:right-6 lg:w-[380px] h-[600px] max-h-[80vh] bg-[#0a0a0a]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-white/5 p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white tracking-tight">Sprouto AI</h3>
            <p className="text-xs text-emerald-400/80">Always here to help</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
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
              className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed break-words ${
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
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your targets or stats..."
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
    </motion.div>
  );
}
