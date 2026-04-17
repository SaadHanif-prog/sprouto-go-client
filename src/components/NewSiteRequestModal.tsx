import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useCreateRequestWithUpload } from "@/src/hooks new/requests.hook";
import { useSelector } from "react-redux";
import { selectSelectedSiteId } from "@/src/global-states/slices/siteSlice";

interface NewSiteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function NewSiteRequestModal({
  isOpen,
  onClose,
  onSubmitted,
}: NewSiteRequestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createRequestMutation = useCreateRequestWithUpload();
  const selectedSiteId = useSelector(selectSelectedSiteId);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createRequestMutation.mutateAsync({
      file: undefined,
      payload: {
        title,
        description: description || "",
        priority: "medium",
      },
    });
    onSubmitted();
  };

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

            <div className="p-8">
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {["Plan", "Tell us about your site", "Done"].map((label, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i === 0
                          ? "bg-emerald-500/20 text-emerald-400"
                          : i === 1
                          ? "bg-emerald-500 text-[#050505]"
                          : "bg-white/10 text-slate-500"
                      }`}
                    >
                      {i === 0 ? "✓" : i + 1}
                    </div>
                    {i < 2 && <div className="flex-1 h-px bg-white/10 w-6" />}
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Tell us about your new site
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                We'll create your first request so the team can get started straight away.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Site / project title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Acme Corp Website"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
{/* 
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Website URL <span className="text-slate-500 font-normal">(if known)</span>
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://acmecorp.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div> */}

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    What do you need help with?
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe your goals, current state, and what you'd like us to focus on…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!title.trim() || createRequestMutation.isPending}
                className="w-full mt-6 py-3 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-[#050505] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                {createRequestMutation.isPending ? "Submitting…" : (
                  <>Submit & go to requests <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}