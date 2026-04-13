import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, X } from "lucide-react";

interface HasSiteModalProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  onSkip: () => void;
}

export default function HasSiteModal({ isOpen, onYes, onNo, onSkip }: HasSiteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-blue-500" />

            {/* <button
              onClick={onSkip}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button> */}

            <div className="p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <CheckCircle className="w-4 h-4" />
                <span>Payment successful</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Do you already have a site?
              </h2>
              <p className="text-slate-400 text-sm mb-8">
                If you've added a site to your account, we'll take you straight to your dashboard.
                If not, we'll help you submit your first request right now.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={onNo}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                >
                  No, I need one
                </button>
                <button
                  onClick={onYes}
                  className="flex-1 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-[#050505] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Yes, I have one
                </button>
              </div>

              {/* <div className="text-center mt-5">
                <button
                  onClick={onSkip}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                >
                  Skip for now
                </button>
              </div> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}