import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap, ArrowRight, Rocket, X } from "lucide-react";
import { Plan, mockPlans } from "../types";
import apiClient from "../api/apiClient";
import StripeProvider from "./StripeProvider";
import CheckoutForm from "./Checkoutform";
import HasSiteModal from "./HasSiteModal";
import NewSiteRequestModal from "./NewSiteRequestModal";
import { useQueryClient } from "@tanstack/react-query";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToRequests: () => void;
  onGoToSites: () => void;
}

export default function PlanSelectionModal({
  isOpen,
  onClose,
  onGoToRequests,
  onGoToSites,
}: PlanSelectionModalProps) {
  const plans: Plan[] = mockPlans;

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  );
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showHasSiteModal, setShowHasSiteModal] = useState(false);
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);
  const queryClient = useQueryClient();

  const handleHasSite = async () => {
    setShowHasSiteModal(false);
    await queryClient.invalidateQueries({ queryKey: ["verifyMe"] });
    setTimeout(() => {
      onClose();
      onGoToSites();
    }, 100);
  };

  const handleCheckout = async (plan: Plan) => {
    setProcessingId(plan.id);
    try {
      const { data } = await apiClient.post("/subscription/create", {
        planId: plan.id,
        billingCycle,
      });

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error(data.error || "Failed to initiate checkout");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-blue-500" />

            {/* Close / Skip button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  <span>One Last Step</span>
                </div>
                <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2">
                  Choose Your Plan
                </h2>
                <p className="text-slate-400 text-sm">
                  Select a plan to activate your account and start growing.
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span
                  className={`text-sm font-medium ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}
                >
                  Monthly
                </span>
                <button
                  onClick={() =>
                    setBillingCycle((prev) =>
                      prev === "monthly" ? "annually" : "monthly",
                    )
                  }
                  className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-colors focus:outline-none hover:border-emerald-500/50"
                >
                  <motion.div
                    className="absolute top-[2px] left-0 w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                    animate={{ x: billingCycle === "annually" ? 28 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span
                  className={`text-sm font-medium flex items-center gap-2 ${billingCycle === "annually" ? "text-white" : "text-slate-400"}`}
                >
                  Annually
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
                    20% Off
                  </span>
                </span>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan, index) => {
                  const isPopular =
                    plan.name.toLowerCase().includes("pro") || plan.popular;
                  const price =
                    billingCycle === "annually"
                      ? Math.round(plan.price * 0.8)
                      : plan.price;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative border rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                        isPopular
                          ? "bg-gradient-to-b from-[#111] to-[#0a0a0a] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                          : "bg-white/5 border-white/10 hover:border-emerald-500/30"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}

                      <h3 className="text-xl font-display font-bold text-white mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 mb-5">
                        Perfect for establishing your digital presence.
                      </p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-display font-bold text-white">
                            {plan.currency === "GBP" ? "£" : "$"}
                            {price}
                          </span>
                          <span className="text-lg font-bold text-emerald-400">
                            +VAT
                          </span>
                          <span className="text-slate-500 text-sm ml-1">
                            / mo{" "}
                            {billingCycle === "annually" && "(billed annually)"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Total inc. 20% UK VAT:{" "}
                          {plan.currency === "GBP" ? "£" : "$"}
                          {Math.round(price * 1.2)}
                        </p>
                      </div>

                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2.5 text-sm text-slate-300"
                          >
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                            </div>
                            <span
                              className={
                                isPopular && i === 2
                                  ? "text-emerald-400 font-medium"
                                  : ""
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleCheckout(plan)}
                        disabled={processingId === plan.id}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                          isPopular
                            ? "bg-emerald-500 hover:bg-emerald-400 text-[#050505] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                            : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                        }`}
                      >
                        {processingId === plan.id ? (
                          "Processing..."
                        ) : (
                          <>
                            Get Started{" "}
                            {isPopular && <Rocket className="w-4 h-4" />}
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Skip link */}
              <div className="text-center mt-6">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                >
                  Skip for now, I'll add a plan later
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stripe Checkout overlay */}
          {clientSecret && (
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                clientSecret={clientSecret}
                onClose={() => {
                  setClientSecret(null);
                  queryClient.invalidateQueries({ queryKey: ["verifyMe"] });
                  setShowHasSiteModal(true);
                }}
              />
            </StripeProvider>
          )}
          <HasSiteModal
            isOpen={showHasSiteModal}
            onYes={handleHasSite}
            onNo={() => {
              setShowHasSiteModal(false);
              setShowNewSiteModal(true);
            }}
            onSkip={() => {
              setShowHasSiteModal(false);
              queryClient.invalidateQueries({ queryKey: ["verifyMe"] });
              setTimeout(onClose, 100);
            }}
          />

          <NewSiteRequestModal
            isOpen={showNewSiteModal}
            onClose={() => {
              setShowNewSiteModal(false);
              onClose();
            }}
            onSubmitted={() => {
              setShowNewSiteModal(false);
              onClose();
              onGoToRequests();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
