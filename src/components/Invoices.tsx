import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ChevronLeft,
  Download,
  Zap,
  Shield,
  Globe,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Mail,
} from "lucide-react";
import { useGetMyInvoices } from "@/src/hooks new/invoices.hook";
import type { Invoice, InvoiceStatus } from "@/src/api/invoices.api";

// ─── Pricing (keep in sync with backend / Plans.tsx) ──────────────────────────
const PLAN_PRICES: Record<string, { monthly: number; annually: number }> = {
  starter: { monthly: 159, annually: 1526 },
  pro:     { monthly: 249, annually: 2390 },
};
const ADDON_PRICES: Record<string, { monthly: number; annually: number }> = {
  a1: { monthly: 9,  annually: 90  },
  a2: { monthly: 14, annually: 140 },
  a3: { monthly: 19, annually: 190 },
  a4: { monthly: 9.99, annually: 96 },
  a5: { monthly: 9.99, annually: 96 },

};
const ADDON_ICONS: Record<string, React.FC<{ className?: string }>> = {
  a1: Globe,
  a2: Shield,
  a3: Zap,
  a4: Sparkles,
  a5: Mail
};
const VAT_RATE = 0.2;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInvoiceStatus(inv: Invoice): InvoiceStatus {
  if (new Date(inv.expiresAt) < new Date()) return "expired";
  if (inv.cancelAtPeriodEnd) return "cancelled";
  return "active";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function invoiceNumber(sub: string) {
  return "INV-" + sub.replace("sub_", "").toUpperCase().slice(0, 6);
}

function getPrice(inv: Invoice): number {
  const map = inv.type === "plan" ? PLAN_PRICES : ADDON_PRICES;
  const key = inv.type === "plan" ? (inv.planId ?? "") : (inv.addonId ?? "");
  return map[key]?.monthly ?? 0;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<InvoiceStatus, string> = {
  active:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  expired:   "bg-red-500/10 text-red-400 border-red-500/20",
};
const STATUS_ICONS: Record<InvoiceStatus, React.FC<{ className?: string }>> = {
  active:    Check,
  cancelled: AlertTriangle,
  expired:   X,
};

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status]}`}
    >
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Invoice row ──────────────────────────────────────────────────────────────
function InvoiceRow({
  inv,
  index,
  onClick,
}: {
  inv: Invoice;
  index: number;
  onClick: () => void;
}) {
  const status = getInvoiceStatus(inv);
  const price  = getPrice(inv);
  const total  = Math.round(price * (1 + VAT_RATE) * 100) / 100;

  const Icon =
    inv.type === "addon"
      ? (ADDON_ICONS[inv.addonId ?? ""] ?? FileText)
      : FileText;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={onClick}
      className="w-full text-left bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group flex items-center gap-4"
    >
      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors
          ${inv.type === "plan"
            ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
            : "bg-white/5 text-slate-400 group-hover:bg-white/10"
          }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      {/* Name + sub ID */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{inv.name}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-mono truncate">
          {inv.stripeSubscriptionId}
        </p>
      </div>

      {/* Renews */}
      <div className="hidden sm:block text-right shrink-0">
        <p className="text-xs text-slate-500">
          {getInvoiceStatus(inv) === "expired" ? "Expired" : inv.cancelAtPeriodEnd ? "Ends" : "Renews"}
        </p>
        <p className="text-xs text-slate-300 mt-0.5">{fmtDate(inv.expiresAt)}</p>
      </div>

      {/* Total */}
      <div className="hidden md:block text-right shrink-0 w-20">
        <p className="text-sm font-semibold text-white">£{total.toFixed(2)}</p>
        <p className="text-xs text-slate-500 mt-0.5">inc. VAT</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusBadge status={status} />
      </div>

      <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-slate-400 rotate-180 shrink-0 transition-colors" />
    </motion.button>
  );
}

// ─── Invoice detail / printable receipt ───────────────────────────────────────
function InvoiceDetail({ inv, onBack }: { inv: Invoice; onBack: () => void }) {
  const status   = getInvoiceStatus(inv);
  const price    = getPrice(inv);
  const tax      = Math.round(price * VAT_RATE * 100) / 100;
  const total    = Math.round((price + tax) * 100) / 100;
  const { billedTo } = inv;

  const handleDownload = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/><title>${invoiceNumber(inv.stripeSubscriptionId)}</title>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111}
        .wrap{max-width:720px;margin:40px auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
        .hdr{background:#042C53;padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-start}
        .logo{display:flex;align-items:center;gap:10px}
        .logo svg{width:36px;height:36px;fill:#fff}
        .brand{font-size:20px;font-weight:600;color:#fff}
        .inv-num{font-size:22px;font-weight:600;color:#fff;text-align:right}
        .inv-sub{font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px;text-align:right}
        .body{padding:32px}
        .parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
        .lbl{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px}
        .pname{font-size:15px;font-weight:600;color:#111}
        .pline{font-size:13px;color:#6b7280;margin-top:4px;line-height:1.6}
        hr{border:none;border-top:1px solid #f3f4f6;margin:0 0 24px}
        table{width:100%;border-collapse:collapse}
        th{font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.7px;padding:0 0 10px;text-align:left}
        th:last-child{text-align:right}
        td{font-size:13px;padding:12px 0;border-top:1px solid #f3f4f6;vertical-align:top}
        td:last-child{text-align:right}
        .iname{font-weight:600}
        .idesc{font-size:12px;color:#6b7280;margin-top:3px}
        .totals{margin-top:20px;display:flex;flex-direction:column;align-items:flex-end;gap:6px}
        .trow{display:flex;gap:48px;font-size:13px;color:#6b7280}
        .trow.grand{color:#111;font-weight:600;font-size:15px;padding-top:8px;border-top:1px solid #e5e7eb;margin-top:4px}
        .ftr{background:#f9fafb;padding:16px 32px;display:flex;justify-content:space-between;align-items:center}
        .paid{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#3B6D11}
        .dot{width:8px;height:8px;border-radius:50%;background:#9dc95266;border:2px solid #639922}
        .ref{font-size:12px;color:#9ca3af}
        @media print{body{margin:0}.wrap{margin:0;border:none;border-radius:0}}
      </style></head><body>
      <div class="wrap">
        <div class="hdr">
          <div class="logo">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M50 92C67.6731 92 82 77.6731 82 60C82 42.3269 67.6731 28 50 28C32.3269 28 18 42.3269 18 60C18 77.6731 32.3269 92 50 92ZM50 74C57.732 74 64 67.732 64 60C64 52.268 57.732 46 50 46C42.268 46 36 52.268 36 60C36 67.732 42.268 74 50 74Z"/>
              <path d="M49 27 Q 32 27 30 10 Q 46 10 49 27 Z"/>
              <path d="M51 27 Q 68 27 70 10 Q 54 10 51 27 Z"/>
            </svg>
            <span class="brand">SproutoGo</span>
          </div>
          <div>
            <div class="inv-num">${invoiceNumber(inv.stripeSubscriptionId)}</div>
            <div class="inv-sub">Issued ${fmtDate(inv.expiresAt)}</div>
          </div>
        </div>
        <div class="body">
          <div class="parties">
            <div>
              <div class="lbl">From</div>
              <div class="pname">SproutoGo</div>
              <div class="pline">go@sproutogo.com
            </div>
            <div>
              <div class="lbl">Billed to</div>
              <div class="pname">${billedTo.title} ${billedTo.firstname} ${billedTo.surname}</div>
              <div class="pline">${billedTo.email}<br/>${billedTo.company.name} · ${billedTo.company.number}<br/>${billedTo.address.line1}, ${billedTo.address.city}, ${billedTo.address.postcode}</div>
            </div>
          </div>
          <hr/>
          <table>
            <tbody>
              <tr>
                <td>
                  <div class="iname">${inv.name}</div>
                  <div class="idesc">${inv.type === "plan" ? "Subscription plan" : "Add-on subscription"} · ${inv.stripeSubscriptionId}</div>
                </td>
                <td style="color:#6b7280;font-size:12px">Until ${fmtDate(inv.expiresAt)}</td>
                <td>£${price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="totals">
            <div class="trow"><span>Subtotal</span><span>£${price.toFixed(2)}</span></div>
            <div class="trow"><span>VAT (20%)</span><span>£${tax.toFixed(2)}</span></div>
            <div class="trow grand"><span>Total</span><span>£${total.toFixed(2)}</span></div>
          </div>
        </div>
        <div class="ftr">
          <div class="paid"><div class="dot"></div>Payment received</div>
          <div class="ref">Stripe ref: ${inv.stripeSubscriptionId}</div>
        </div>
      </div>
      <script>window.onload=()=>window.print()<\/script>
    </body></html>`);
    win.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to invoices
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl px-4 py-2 transition-all"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Invoice card */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#042C53] to-[#063a6b] px-8 py-7 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-9 h-9" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M50 92C67.6731 92 82 77.6731 82 60C82 42.3269 67.6731 28 50 28C32.3269 28 18 42.3269 18 60C18 77.6731 32.3269 92 50 92ZM50 74C57.732 74 64 67.732 64 60C64 52.268 57.732 46 50 46C42.268 46 36 52.268 36 60C36 67.732 42.268 74 50 74Z"/>
              <path d="M49 27 Q 32 27 30 10 Q 46 10 49 27 Z"/>
              <path d="M51 27 Q 68 27 70 10 Q 54 10 51 27 Z"/>
            </svg>
            <span className="text-xl font-semibold text-white tracking-tight">SproutoGo</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">{invoiceNumber(inv.stripeSubscriptionId)}</p>
            <p className="text-xs text-white/40 mt-1">Issued {fmtDate(inv.expiresAt)}</p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {/* Parties */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">From</p>
              <p className="text-sm font-semibold text-white">SproutoGo</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                go@sproutogo.com
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Billed to</p>
              <p className="text-sm font-semibold text-white">
                {billedTo.title} {billedTo.firstname} {billedTo.surname}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {billedTo.email}<br />
                {billedTo.company.name} · {billedTo.company.number}<br />
                {billedTo.address.line1}, {billedTo.address.city}, {billedTo.address.postcode}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5 mb-6" />

          {/* Line items table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                {["Description", "Period", "Amount"].map((h, i) => (
                  <th
                    key={h}
                    className={`text-[11px] font-semibold text-slate-500 uppercase tracking-widest pb-3 ${i === 3 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-white">{inv.name}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    {inv.type === "plan" ? "Subscription plan" : "Add-on subscription"} · {inv.stripeSubscriptionId}
                  </p>
                </td>
                <td className="py-4 text-xs text-slate-400 pr-4">
                  Until {fmtDate(inv.expiresAt)}
                </td>
           
                <td className="py-4 font-semibold text-white">
                  £{price.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex flex-col items-end gap-2 mt-6 pt-4 border-t border-white/5">
            <div className="flex gap-12 text-sm text-slate-400">
              <span>Subtotal</span>
              <span>£{price.toFixed(2)}</span>
            </div>
            <div className="flex gap-12 text-sm text-slate-400">
              <span>VAT (20%)</span>
              <span>£{tax.toFixed(2)}</span>
            </div>
            <div className="flex gap-12 text-base font-semibold text-white border-t border-white/10 pt-3 mt-1">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/[0.03] border-t border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500/40 border-2 border-emerald-500 block" />
            <span className="text-sm font-semibold text-emerald-400">Payment received</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">{inv.stripeSubscriptionId}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <FileText className="w-7 h-7 text-slate-500" />
      </div>
      <p className="text-base font-semibold text-slate-300">No invoices yet</p>
      <p className="text-sm text-slate-500 mt-2 max-w-xs">
        Once you purchase a plan or add-on, your invoices will appear here.
      </p>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Invoices() {
  const { data, isLoading, isError } = useGetMyInvoices();
  const [selected, setSelected] = useState<Invoice | null>(null);

  const invoices = data?.invoices ?? [];

  // Stats
  const activeCount   = invoices.filter(i => getInvoiceStatus(i) === "active").length;
  const planCount     = invoices.filter(i => i.type === "plan").length;
  const addonCount    = invoices.filter(i => i.type === "addon").length;

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {selected ? (
          <InvoiceDetail
            key="detail"
            inv={selected}
            onBack={() => setSelected(null)}
          />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Invoices</h2>
                <p className="text-slate-400 mt-2 text-sm">
                  Your subscription and add-on receipts. click any row to view or download.
                </p>
              </div>
              {/* Summary pills */}
              {invoices.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    {activeCount} active
                  </div>
                  {planCount > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                      <FileText className="w-3 h-3" />
                      {planCount} {planCount === 1 ? "plan" : "plans"}
                    </div>
                  )}
                  {addonCount > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                      <Zap className="w-3 h-3" />
                      {addonCount} {addonCount === 1 ? "add-on" : "add-ons"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading invoices…</span>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm">Failed to load invoices. Please try again later.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && invoices.length === 0 && <EmptyState />}

            {/* List */}
            {!isLoading && !isError && invoices.length > 0 && (
              <div className="space-y-3">
                {invoices.map((inv, i) => (
                  <InvoiceRow
                    key={inv.id}
                    inv={inv}
                    index={i}
                    onClick={() => setSelected(inv)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}