import React, { useState, useRef, useEffect } from 'react';
import {
  Download, Search, Activity, TrendingUp, AlertTriangle,
  CheckCircle2, Bot, User, Send, Loader2, Sparkles, RefreshCw, FileText,
} from 'lucide-react';
import Markdown from 'react-markdown';
import { Site } from '../types';
import { useGetAudit, useReRunAudit, useSendChatMessage, useDownloadTargetsCsv } from '@/src/hooks new/auditor.hook';
import type { ChatMessage, AuditData } from '@/src/api/auditor-api';

export default function SEOAuditor({ site }: { site: Site }) {
  if (!site) return;

  /* ── Chat state ── */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Hi there! I am your SEO & GEO Auditor for **${site.name}**. I'm analysing your site right now — ask me anything about your rankings, keywords, or performance!`,
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  /* ── Hooks ── */
  const { data: auditResponse, isLoading: auditLoading, refetch } = useGetAudit(site.url);
  const { mutate: reRun, isPending: isReRunning, data: reRunData } = useReRunAudit(site.url);
  const { mutate: sendChat, isPending: isChatLoading } = useSendChatMessage();
  const { mutate: downloadCsv, isPending: isDownloading } = useDownloadTargetsCsv();

  const report: AuditData | null = reRunData?.data ?? auditResponse?.data ?? null;
  const isAnalysing = auditLoading || isReRunning;

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Temporary code, faking the organic traffic
  const [totalSearches, setTotalSearches] = useState<string | null>(null);

  useEffect(() => {
    const value = localStorage.getItem("total searches");
    console.log("Value in local storage", value);
    setTotalSearches(value);
  }, []);

  const organicTrafficValue = Math.floor((totalSearches as unknown as number) * 2.1);

  /* ── PDF Generation ── */
  const handleGenerateMonthlyReport = async () => {
    setIsGeneratingPdf(true);
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      const now = new Date();
      const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

      // ── Dark header band ──
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Accent stripe
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.rect(0, 0, 4, 42, 'F');

      // Site name / title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text('Monthly SEO Report', 14, 16);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(160, 160, 160);
      doc.text(`${site.name}  ·  ${monthName}`, 14, 26);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 35);

      // ── KPI Cards Row ──
      const kpiY = 52;
      const cardW = 55;
      const cardH = 28;
      const gap = 8;

      const kpis = [
        { label: 'Health Score', value: `${report?.healthScore ?? '—'}/100`, color: [16, 185, 129] as [number,number,number] },
        { label: 'Organic Traffic', value: `${isNaN(organicTrafficValue) ? '—' : organicTrafficValue.toLocaleString()}`, color: [99, 102, 241] as [number,number,number] },
        { label: 'Critical Issues', value: `${report?.criticalIssues ?? '—'}`, color: [239, 68, 68] as [number,number,number] },
      ];

      kpis.forEach((kpi, i) => {
        const x = 14 + i * (cardW + gap);

        // Card background
        doc.setFillColor(20, 20, 20);
        doc.roundedRect(x, kpiY, cardW, cardH, 3, 3, 'F');

        // Top accent line
        doc.setFillColor(...kpi.color);
        doc.roundedRect(x, kpiY, cardW, 2, 1, 1, 'F');

        // Label
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(140, 140, 140);
        doc.text(kpi.label, x + 5, kpiY + 10);

        // Value
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...kpi.color);
        doc.text(kpi.value, x + 5, kpiY + 22);
      });

      // ── Trending Keywords ──
      const kwY = kpiY + cardH + 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(230, 230, 230);
      doc.text('Trending Keywords', 14, kwY);

      // Emerald underline
      doc.setFillColor(16, 185, 129);
      doc.rect(14, kwY + 2, 38, 0.8, 'F');

      const keywords = report?.trendingKeywords ?? [];
      let kwX = 14;
      let kwRow = kwY + 10;
      const pillH = 7;

      doc.setFontSize(8);
      keywords.forEach((word) => {
        const textWidth = doc.getTextWidth(word) + 8;
        if (kwX + textWidth > pageWidth - 14) {
          kwX = 14;
          kwRow += pillH + 3;
        }
        doc.setFillColor(30, 30, 30);
        doc.roundedRect(kwX, kwRow - 5, textWidth, pillH, 2, 2, 'F');
        doc.setFillColor(16, 185, 129);
        doc.circle(kwX + 3.5, kwRow - 1.5, 1, 'F');
        doc.setTextColor(200, 200, 200);
        doc.text(word, kwX + 7, kwRow);
        kwX += textWidth + 4;
      });

      // ── Page Breakdown Table ──
      const tableY = kwRow + 14;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(230, 230, 230);
      doc.text('Page Breakdown', 14, tableY);

      doc.setFillColor(16, 185, 129);
      doc.rect(14, tableY + 2, 34, 0.8, 'F');

      const pageRows = (report?.pageBreakdown ?? []).map((p) => [
        p.url,
        `${p.health}/100`,
        p.keyword,
        p.status,
      ]);

      autoTable(doc, {
        startY: tableY + 8,
        head: [['Page URL', 'Health', 'Top Keyword', 'Status']],
        body: pageRows,
        theme: 'grid',
        styles: {
          fontSize: 8.5,
          cellPadding: 4,
          textColor: [210, 210, 210],
          fillColor: [18, 18, 18],
          lineColor: [40, 40, 40],
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: [20, 20, 20],
          textColor: [16, 185, 129],
          fontStyle: 'bold',
          lineColor: [16, 185, 129],
          lineWidth: 0.4,
        },
        alternateRowStyles: {
          fillColor: [24, 24, 24],
        },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 22, halign: 'center' },
          2: { cellWidth: 65 },
          3: { cellWidth: 28, halign: 'center' },
        },
        didParseCell: (data) => {
          if (data.column.index === 3 && data.section === 'body') {
            const val = String(data.cell.raw);
            if (val === 'Good') data.cell.styles.textColor = [16, 185, 129];
            else if (val === 'Needs Work') data.cell.styles.textColor = [234, 179, 8];
            else if (val === 'Critical') data.cell.styles.textColor = [239, 68, 68];
          }
          if (data.column.index === 1 && data.section === 'body') {
            const score = parseInt(String(data.cell.raw));
            if (score >= 80) data.cell.styles.textColor = [16, 185, 129];
            else if (score >= 50) data.cell.styles.textColor = [234, 179, 8];
            else data.cell.styles.textColor = [239, 68, 68];
          }
        },
      });

      // ── Footer ──
      doc.setFillColor(10, 10, 10);
      doc.rect(0, pageHeight - 14, pageWidth, 14, 'F');
      doc.setFillColor(16, 185, 129);
      doc.rect(0, pageHeight - 14, pageWidth, 0.8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`${site.name}  ·  GEO/SEO Monthly Report  ·  ${monthName}`, 14, pageHeight - 5);
      doc.setTextColor(16, 185, 129);
      doc.text('Powered by SEO Auditor', pageWidth - 14, pageHeight - 5, { align: 'right' });

      // ── Save ──
      const fileName = `${site.name.replace(/\s+/g, '_')}_SEO_Report_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  /* ── Handlers ── */
  const handleReRun = () => reRun();

  const handleDownload = () => {
    downloadCsv({
      payload: { url: site.liveUrl!, auditContext: report },
      siteName: site.name,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');

    sendChat(
      {
        url: site.url,
        siteName: site.name,
        messages: nextMessages,
        auditContext: report,
      },
      {
        onSuccess: (res) =>
          setMessages((prev) => [...prev, { role: 'model', content: res.data.reply }]),
        onError: () =>
          setMessages((prev) => [
            ...prev,
            { role: 'model', content: 'Sorry, I hit an error. Please try again in a moment.' },
          ]),
      }
    );
  };

  /* ── No live URL guard ── */
  if (!site.url) {
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

  /* ── Skeleton card ── */
  const SkeletonCard = () => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="h-4 w-28 bg-white/10 rounded" />
      </div>
      <div className="h-9 w-24 bg-white/10 rounded mt-4 mb-2" />
      <div className="h-3 w-32 bg-white/10 rounded" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">GEO/SEO Auditor</h2>
          <p className="text-slate-400 mt-1">In-depth breakdown and monthly targets for {site.name}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleReRun}
            disabled={isAnalysing}
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalysing ? 'animate-spin' : ''}`} />
            {isAnalysing ? 'Analysing...' : 'Re-run Report'}
          </button>

          {/* ── NEW: Generate Monthly Report PDF ── */}
          <button
            onClick={handleGenerateMonthlyReport}
            disabled={isGeneratingPdf || isAnalysing}
            className="bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          >
            {isGeneratingPdf
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <FileText className="w-4 h-4" />}
            {isGeneratingPdf ? 'Generating...' : 'Generate Monthly Report'}
          </button>

          {/* <button
            onClick={handleDownload}
            disabled={isDownloading || isAnalysing}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#050505] px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Download className="w-4 h-4" />}
            Download Next Month Targets
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAnalysing ? (
              <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-slate-400 font-medium">Health Score</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mt-4">
                    {report?.healthScore ?? '—'}
                    <span className="text-lg text-slate-500 font-normal">/100</span>
                  </div>
                  <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Updated just now
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-slate-400 font-medium">Organic Traffic</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mt-4">
                    {isNaN(organicTrafficValue) ? '—' : organicTrafficValue.toLocaleString()}
                  </div>
                  <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> visitors / month
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-slate-400 font-medium">Critical Issues</h3>
                  </div>
                  <div className="text-3xl font-bold text-white mt-4">
                    {report?.criticalIssues ?? '—'}
                  </div>
                  <p className="text-sm text-rose-400 mt-2">Needs attention</p>
                </div>
              </>
            )}
          </div>

          {/* Trending Keywords */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Trending Keywords</h3>
            {isAnalysing ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 w-32 rounded-lg bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(report?.trendingKeywords ?? []).map((word, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {word}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Page Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Page Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              {isAnalysing ? (
                <div className="p-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              ) : (
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
                    {(report?.pageBreakdown ?? []).map((page, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-300">{page.url}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  page.health >= 90 ? 'bg-emerald-500' :
                                  page.health >= 80 ? 'bg-yellow-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${page.health}%` }}
                              />
                            </div>
                            <span className="text-slate-400">{page.health}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{page.keyword}</td>
                        <td className="px-6 py-4">
                          {page.status === 'Good' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" /> Good
                            </span>
                          )}
                          {page.status === 'Needs Work' && (
                            <span className="inline-flex items-center gap-1 text-yellow-400">
                              <AlertTriangle className="w-4 h-4" /> Needs Work
                            </span>
                          )}
                          {page.status === 'Critical' && (
                            <span className="inline-flex items-center gap-1 text-rose-400">
                              <AlertTriangle className="w-4 h-4" /> Critical
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column: Chat ── */}
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
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-[#050505] rounded-tr-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.role === 'model' ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  ) : msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && (
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
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isChatLoading}
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