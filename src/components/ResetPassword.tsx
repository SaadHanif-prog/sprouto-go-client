import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useResetPassword } from "@/src/hooks new/auth.hook";

const ResetPassword = () => {
  const { id } = useParams(); 

  const resetPasswordMutation = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!id) {
      return setError("Invalid or missing token");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    resetPasswordMutation.mutate(
      {
        token: id,
        payload: { password },
      },
      {
        onSuccess: () => {
         window.location.href = "/";
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Reset Password 🔐
        </h2>

        <p className="text-slate-400 text-sm mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {resetPasswordMutation.isError && (
            <p className="text-red-400 text-sm">
              {(resetPasswordMutation.error as any)?.response?.data?.message ||
                "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-[#050505] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
          >
            {resetPasswordMutation.isPending
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;