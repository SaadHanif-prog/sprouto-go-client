import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForgotPassword } from "@/src/hooks new/auth.hook";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ForgotPasswordModal = ({ isOpen, onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      return setError("Email is required");
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setEmail("");
          onClose(); 
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-semibold text-white mb-2">
                Forgot Password 🔐
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Enter your email to receive a reset link
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-[#050505] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                >
                  {forgotPasswordMutation.isPending
                    ? "Sending..."
                    : "Send Reset Link"}
                </button>
              </form>

              <button
                onClick={onClose}
                className="mt-4 text-sm text-slate-400 hover:text-white w-full"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;