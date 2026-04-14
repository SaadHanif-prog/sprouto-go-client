import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
  UserPlus,
  AlertCircle,
  Check,
  Zap,
  Rocket,
  Star,
  TrendingUp,
  Shield,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import Logo from "./Logo";
// import PrivacyPolicy from './PrivacyPolicy';
import CookiesPolicy from "./CookiesPolicy";
import DataUsage from "./DataUsage";
import { mockPlans } from "../types";
import type { CreateSignup } from "../types/auth.types";
import { useLogin, useSignup } from "../hooks new/auth.hook";
import ForgotPasswordModal from "./ForgotPassword";
import PlanSelectionModal from "./PlanSelectionModal";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login({
  onLogin,
  setActiveTab,
}: {
  onLogin: () => void;
  setActiveTab: any;
}) {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<
    "landing" | "auth" | "privacy" | "cookies" | "data"
  >("landing");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState<
    "Mr" | "Mrs" | "Ms" | "Miss" | "Dr" | "Other"
  >("Mr");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const plans = mockPlans;
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const [signupData, setSignupData] = useState({
    firstName: "",
    surname: "",
    companyName: "",
    companyNumber: "",
    addressLine1: "",
    addressLine2: "",
    county: "",
    city: "",
    postcode: "",
  });

  const validateUKPostcode = (postcode: string) => {
  const regex = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  return regex.test(postcode.trim());
};

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

const handleNextStep = (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (signupStep === 1) {
    const missing: string[] = [];

    if (!signupData.firstName.trim()) missing.push("First Name");
    if (!signupData.surname.trim()) missing.push("Surname");
    if (!email.trim()) missing.push("Email");
    if (!password) missing.push("Password");
    if (!confirmPassword) missing.push("Confirm Password");

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSignupStep(2);
  }
};

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!isSignUp) {
    // Login validation
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
  }

  if (isSignUp && signupStep < 2) {
    handleNextStep(e);
    return;
  }

  if (isSignUp && signupStep === 2) {
    // Step 2 validation
    if (!signupData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!signupData.companyNumber.trim()) {
      toast.error("Company number is required");
      return;
    }
    if (!signupData.addressLine1.trim()) {
      toast.error("Address line 1 is required");
      return;
    }
    if (!signupData.city.trim()) {
      toast.error("City / Town is required");
      return;
    }
    if (!signupData.postcode.trim()) {
      toast.error("Postcode is required");
      return;
    }
    if (!validateUKPostcode(signupData.postcode)) {
      toast.error("Please enter a valid UK postcode (e.g. SW1A 1AA)");
      return;
    }
  }

  setIsLoading(true);

  if (isSignUp) {
    const signupPayload: CreateSignup = {
      role: "client",
      title,
      firstname: signupData.firstName,
      surname: signupData.surname,
      email,
      password,
      company: {
        name: signupData.companyName,
        number: signupData.companyNumber,
      },
      address: {
        line1: signupData.addressLine1,
        county: signupData.county,
        city: signupData.city,
        postcode: signupData.postcode,
      },
      subscription: {
        plan: "starter",
        billingCycle: "monthly",
      },
    };

    signupMutation.mutate(signupPayload, {
      onSuccess: () => {
        setIsLoading(false);
        toast.success("Account created! Please select a plan to continue.");
        setIsPlanModalOpen(true);
      },
      onError: (error: any) => {
        setIsLoading(false);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Signup failed, please try again.";
        toast.error(message);
        setError(message);
      },
    });

    return;
  }

  loginMutation.mutate(
    { email, password },
    {
      onSuccess: () => {
        setIsLoading(false);
        toast.success("Welcome back!");
        onLogin();
      },
      onError: (error: any) => {
        setIsLoading(false);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password.";
        toast.error(message);
        setError(message);
      },
    },
  );
};
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setViewMode("landing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Logo className="w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              SproutoGO
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <button
              onClick={() => {
                setIsSignUp(false);
                setViewMode("auth");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 space-y-4">
                <a
                  href="#features"
                  className="text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-slate-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setViewMode("auth");
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-left"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero / Login Section */}
      <section className="relative min-h-screen pt-20 flex items-center justify-center p-6">
        {/* Immersive Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Animated Emerald Blob */}
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/30 blur-[120px] rounded-full mix-blend-screen"
          />

          {/* Animated Blue Blob */}
          <motion.div
            animate={{
              x: [0, -100, 100, 0],
              y: [0, 100, -50, 0],
              scale: [1, 1.5, 0.9, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen"
          />

          {/* Animated Purple Blob */}
          <motion.div
            animate={{
              x: [0, 150, -100, 0],
              y: [0, 50, 150, 0],
              scale: [0.8, 1.2, 1, 0.8],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen"
          />

          {/* Pulsating Light Overlay */}
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 mix-blend-overlay"
          />

          {/* Grainy Noise Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          {viewMode === "landing" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-8 invisible">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Logo className="w-12 h-12" />
                </div>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-8">
                Your Partners for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                  Micro Businesses.
                </span>
              </h1>

              <p className="text-2xl text-slate-400 font-light leading-relaxed mb-12 max-w-2xl">
                Purpose built for micro businesses. We redefine your digital
                presence using our bio-diverse system, so you can focus on
                scaling your business.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setViewMode("auth");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-bold rounded-full text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center gap-2"
                >
                  Start Growing Now <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium tracking-wider uppercase text-xs shadow-sm">
                    Ready
                  </div>
                  <div className="w-4 h-[1px] bg-white/20"></div>
                  <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium tracking-wider uppercase text-xs shadow-sm">
                    Steady
                  </div>
                  <div className="w-4 h-[1px] bg-white/20"></div>
                  <div className="px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider uppercase text-xs shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    Grow...
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Left Side: Branding & Copy */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex flex-col justify-center"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Logo className="w-10 h-10" />
                  </div>
                  <span className="text-3xl font-display font-bold text-white tracking-tight">
                    SproutoGO
                  </span>
                </div>

                <h1 className="font-display text-5xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                  Your Partners for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    Micro Businesses.
                  </span>
                </h1>

                <p className="text-xl text-slate-400 font-light leading-relaxed mb-10 max-w-lg">
                  Purpose built for micro businesses. We redefine your digital
                  presence using our bio-diverse system, so you can focus on
                  scaling your business.
                </p>

                <div className="flex items-center gap-3">
                  <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium tracking-wider uppercase text-xs shadow-sm">
                    Ready
                  </div>
                  <div className="w-6 h-[1px] bg-white/20"></div>
                  <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-medium tracking-wider uppercase text-xs shadow-sm">
                    Steady
                  </div>
                  <div className="w-6 h-[1px] bg-white/20"></div>
                  <div className="px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold tracking-wider uppercase text-xs shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    Grow...
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Login Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2,
                }}
                className="w-full max-w-md mx-auto relative z-10"
              >
                <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                  <div className="flex lg:hidden justify-center mb-8">
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <Logo className="w-12 h-12" />
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight mb-2 lg:hidden">
                      SproutoGO
                    </h2>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-2 hidden lg:block">
                      {isSignUp ? "Create your account" : "Welcome back"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {isSignUp
                        ? "Sign up to get started"
                        : "Sign in to manage your sites and targets"}
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {isSignUp ? (
                      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {/* Step Indicators */}
                        <div className="flex items-center justify-center mb-6 px-2 gap-2">
                          {[1, 2].map((step) => (
                            <div key={step} className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${signupStep >= step ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-400"}`}
                              >
                                {step}
                              </div>
                              {step < 2 && (
                                <div
                                  className={`w-12 h-1 mx-2 rounded-full transition-colors ${signupStep > step ? "bg-emerald-500" : "bg-white/10"}`}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {signupStep === 1 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                              Personal Details
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-1 col-span-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Title
                                </label>
                                <select
                                  value={title}
                                  onChange={(e) =>
                                    setTitle(
                                      e.target.value as
                                        | "Mr"
                                        | "Mrs"
                                        | "Ms"
                                        | "Miss"
                                        | "Dr"
                                        | "Other",
                                    )
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all appearance-none"
                                  required
                                >
                                  <option value="Mr" className="bg-[#141414]">
                                    Mr
                                  </option>
                                  <option value="Mrs" className="bg-[#141414]">
                                    Mrs
                                  </option>
                                  <option value="Ms" className="bg-[#141414]">
                                    Ms
                                  </option>
                                  <option value="Miss" className="bg-[#141414]">
                                    Miss
                                  </option>
                                  <option value="Dr" className="bg-[#141414]">
                                    Dr
                                  </option>
                                  <option
                                    value="Other"
                                    className="bg-[#141414]"
                                  >
                                    Other
                                  </option>
                                </select>
                              </div>
                              <div className="space-y-1 col-span-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  value={signupData.firstName}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      firstName: e.target.value,
                                    })
                                  }
                                  placeholder="First Name"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Surname
                                </label>
                                <input
                                  type="text"
                                  value={signupData.surname}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      surname: e.target.value,
                                    })
                                  }
                                  placeholder="Surname"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="email@company.com"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Create Password
                                </label>
                                <input
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Confirm Password
                                </label>
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                  placeholder="••••••••"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {signupStep === 2 && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                            <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                              Company Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Company Name
                                </label>
                                <input
                                  type="text"
                                  value={signupData.companyName}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      companyName: e.target.value,
                                    })
                                  }
                                  placeholder="Acme Corp"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Company Number
                                </label>
                                <input
                                  type="text"
                                  value={signupData.companyNumber}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      companyNumber: e.target.value,
                                    })
                                  }
                                  placeholder="12345678"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-4 pt-2">
                              <h4 className="text-sm font-semibold text-white border-b border-white/10 pb-2">
                                Company Address
                              </h4>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  First Line
                                </label>
                                <input
                                  type="text"
                                  value={signupData.addressLine1}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      addressLine1: e.target.value,
                                    })
                                  }
                                  placeholder="123 Business Rd"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Second Line
                                </label>
                                <input
                                  type="text"
                                  value={signupData.addressLine2}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      addressLine2: e.target.value,
                                    })
                                  }
                                  placeholder="Suite 100 (Optional)"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                    County
                                  </label>
                                  <input
                                    type="text"
                                    value={signupData.county}
                                    onChange={(e) =>
                                      setSignupData({
                                        ...signupData,
                                        county: e.target.value,
                                      })
                                    }
                                    placeholder="Greater London"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                    City / Town
                                  </label>
                                  <input
                                    type="text"
                                    value={signupData.city}
                                    onChange={(e) =>
                                      setSignupData({
                                        ...signupData,
                                        city: e.target.value,
                                      })
                                    }
                                    placeholder="London"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                                  Postcode
                                </label>
                                <input
                                  type="text"
                                  value={signupData.postcode}
                                  onChange={(e) =>
                                    setSignupData({
                                      ...signupData,
                                      postcode: e.target.value,
                                    })
                                  }
                                  placeholder="SW1A 1AA"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                                  required
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                            required
                          />
                        </div>
                        {error && (
                          <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p>{error}</p>
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex gap-3 mt-4">
                      {isSignUp && signupStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setSignupStep(signupStep - 1)}
                          disabled={isLoading}
                          className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl px-4 py-3 flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`${isSignUp && signupStep > 1 ? "w-2/3" : "w-full"} bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]`}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>
                            {isSignUp
                              ? signupStep < 2
                                ? "Next Step"
                                : "Proceed to Payment"
                              : "Sign In"}{" "}
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center flex justify-between">
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(!isSignUp);
                        setSignupStep(1);
                        setError("");
                      }}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {isSignUp
                        ? "Already have an account? Sign in"
                        : "Don't have an account? Sign up"}
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                      <Lock className="w-3 h-3" /> Secure Bio-Diverse Platform
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {viewMode === "landing" && (
        <>
          {/* Stats / Social Proof Section */}
          <section className="py-20 bg-[#050505] border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <h4 className="text-4xl font-display font-bold text-white">
                    £2M+
                  </h4>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                    Client Revenue Generated
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <h4 className="text-4xl font-display font-bold text-emerald-400">
                    500+
                  </h4>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                    Microbusinesses Scaled
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <h4 className="text-4xl font-display font-bold text-blue-400">
                    98%
                  </h4>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                    Client Retention Rate
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <h4 className="text-4xl font-display font-bold text-purple-400">
                    24/7
                  </h4>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                    Dedicated Support
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-32 bg-[#0a0a0a] relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>The Process</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-display font-bold mb-6 text-white"
                >
                  How We Scale{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
                    Your Business
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-slate-400 max-w-2xl mx-auto"
                >
                  We don't just give you tools; we become your dedicated digital
                  growth team.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-blue-500/0" />

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto bg-[#141414] border-2 border-emerald-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <span className="text-3xl font-display font-bold text-emerald-400">
                      1
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    Sign Up Instantly
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Create your account in seconds. No lengthy onboarding, just
                    immediate access to your new digital growth hub.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto bg-[#141414] border-2 border-blue-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <span className="text-3xl font-display font-bold text-blue-400">
                      2
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    We Redefine Your Presence
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Our innovative AI engine Go's finds the trends, while our
                    bio-diverse system builds your site, refines the keywords,
                    and enhances the analytics.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="relative text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto bg-[#141414] border-2 border-purple-500/30 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                    <span className="text-3xl font-display font-bold text-purple-400">
                      3
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    You Scale
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Watch your traffic, leads, and revenue grow through our
                    transparent dashboard while you focus on running your
                    business.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Dynamic Features Section */}
          <section
            id="features"
            className="py-32 relative z-10 bg-[#050505] border-t border-white/5 overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                >
                  <Globe className="w-4 h-4" />
                  <span>Next-Gen Platform</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl font-display font-bold mb-6"
                >
                  Supercharge Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    Growth
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-slate-400 max-w-2xl mx-auto"
                >
                  Everything a micro business needs to thrive online. We
                  redefine your digital presence using our bio-diverse system so
                  you can focus on what you do best.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">
                    Smart Automation
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    We leverage our innovative AI engine Go's to handle the
                    heavy lifting. Our bio-diverse system automates repetitive
                    tasks, generates insights, and accelerates your growth.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                    Local & Global GEO
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    Dominate local search results and reach more customers with
                    our comprehensive auditing, tracking, and optimisation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                    Done-For-You Management
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    We are your dedicated digital team. We redefine your online
                    presence using our bio-diverse system end-to-end, so you can
                    focus entirely on running your micro business.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-32 bg-[#0a0a0a] relative z-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-display font-bold mb-6 text-white"
                >
                  Loved by{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    Founders
                  </span>
                </motion.h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Sarah Jenkins",
                    role: "E-commerce Founder",
                    text: "The speed at which SproutoGO developed our website was incredible. The entire process was seamless, and their bio-diverse system means I just drop a request and it's handled instantly. As a founder, getting my time back is priceless.",
                    rating: 5,
                  },
                  {
                    name: "David Chen",
                    role: "Tech Startup Founder",
                    text: "The live analytics and geo-auditor tools are absolute game-changers. Being able to track exactly where our traffic is coming from globally in real-time has completely transformed how we target our campaigns. It's brilliant.",
                    rating: 5,
                  },
                  {
                    name: "Emma Thompson",
                    role: "Boutique Business Owner",
                    text: "Truly loved by founders. The seamless blend of rapid website development, instant task execution, and live SEO auditing is unmatched. They deliver top-tier partner work at lightning speed without the usual headaches.",
                    rating: 5,
                  },
                ].map((testimonial, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-8 rounded-3xl relative"
                  >
                    <div className="flex gap-1 mb-6 text-emerald-400">
                      {[...Array(testimonial.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[2px]">
                        <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section
            id="pricing"
            className="py-32 relative z-10 bg-[#050505] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
                >
                  <Zap className="w-4 h-4" />
                  <span>Unbeatable Value</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-6xl font-display font-bold mb-6"
                >
                  Simple, Transparent{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                    Pricing
                  </span>
                </motion.h2>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                  Choose the plan that fits your business needs. No hidden fees,
                  just pure growth.
                </p>

                <div className="flex items-center justify-center gap-4 mb-12">
                  <span
                    className={`text-sm font-medium ${billingCycle === "monthly" ? "text-white" : "text-slate-400"}`}
                  >
                    Monthly
                  </span>
                  <button
                    onClick={() =>
                      setBillingCycle((prev) =>
                        prev === "monthly" ? "annual" : "monthly",
                      )
                    }
                    className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-colors focus:outline-none"
                  >
                    <motion.div
                      animate={{ x: billingCycle === "annual" ? 28 : 2 }}
                      className="absolute top-[2px] left-0 w-6 h-6 rounded-full bg-emerald-400 shadow-sm"
                    />
                  </button>
                  <span
                    className={`text-sm font-medium flex items-center gap-2 ${billingCycle === "annual" ? "text-white" : "text-slate-400"}`}
                  >
                    Annually
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-wider font-bold">
                      20% Off
                    </span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, index) => {
                  const isPopular =
                    plan.name.toLowerCase().includes("pro") || plan.popular;
                  const price =
                    billingCycle === "annual"
                      ? Math.round(plan.price * 0.8)
                      : plan.price;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className={`backdrop-blur-xl border rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 shadow-2xl flex flex-col ${
                        isPopular
                          ? "bg-gradient-to-b from-[#111] to-[#0a0a0a] border-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                          : "bg-[#0a0a0a]/80 border-white/10 hover:border-emerald-500/30"
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-full h-1 ${isPopular ? "bg-gradient-to-r from-emerald-400 to-blue-500" : "bg-gradient-to-r from-slate-500 to-slate-400 opacity-50"}`}
                      />

                      {isPopular && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                          Most Popular
                        </div>
                      )}

                      <div className="mb-8">
                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Perfect for establishing your digital presence.
                        </p>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-5xl font-display font-bold text-white">
                            {plan.currency === "GBP"
                              ? "£"
                              : plan.currency === "USD"
                                ? "$"
                                : plan.currency}
                            {price}
                          </span>
                          <span className="text-2xl font-bold text-emerald-400">
                            +VAT
                          </span>
                          <span className="text-slate-500 font-medium ml-1">
                            / month{" "}
                            {billingCycle === "annual" && "(billed annually)"}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-2">
                          Total inc. 20% UK VAT:{" "}
                          {plan.currency === "GBP"
                            ? "£"
                            : plan.currency === "USD"
                              ? "$"
                              : plan.currency}
                          {Math.round(price * 1.2)}
                        </div>
                      </div>

                      <ul className="space-y-4 mb-10 flex-1">
                        {plan.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-slate-300"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-emerald-400" />
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
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setIsSignUp(true);
                          setViewMode("auth");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          isPopular
                            ? "bg-emerald-500 hover:bg-emerald-400 text-[#050505] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                            : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                        }`}
                      >
                        Start Growing Now{" "}
                        {isPopular && <Rocket className="w-5 h-5" />}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 border-t border-white/5 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-center text-emerald-400">
                      <Logo className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight text-white">
                      SproutoGO
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    82 King Street
                    <br />
                    Manchester
                    <br />
                    M2 4WQ
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <a
                        href="#features"
                        onClick={(e) => {
                          if (viewMode !== "landing") {
                            e.preventDefault();
                            setViewMode("landing");
                            setTimeout(
                              () =>
                                document
                                  .getElementById("features")
                                  ?.scrollIntoView(),
                              100,
                            );
                          }
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                        href="#pricing"
                        onClick={(e) => {
                          if (viewMode !== "landing") {
                            e.preventDefault();
                            setViewMode("landing");
                            setTimeout(
                              () =>
                                document
                                  .getElementById("pricing")
                                  ?.scrollIntoView(),
                              100,
                            );
                          }
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsSignUp(false);
                          setViewMode("auth");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Sign In
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setIsSignUp(true);
                          setViewMode("auth");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Sign Up
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li>
                      <Link
                        to="/privacy"
                        className="hover:text-white transition-colors"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/terms"
                        className="hover:text-white transition-colors"
                      >
                        Terms & Conditions
                      </Link>
                    </li>{" "}
                    <li>
                      <button
                        onClick={() => {
                          setViewMode("cookies");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        Cookies Policy
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setViewMode("data");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors"
                      >
                        How We Use Your Data
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
                <p>
                  &copy; {new Date().getFullYear()} SproutoGO. All rights
                  reserved.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
      {/* {viewMode === 'privacy' && <PrivacyPolicy onBack={() => { setViewMode('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />} */}
      {viewMode === "cookies" && (
        <CookiesPolicy
          onBack={() => {
            setViewMode("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {viewMode === "data" && (
        <DataUsage
          onBack={() => {
            setViewMode("landing");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
      <PlanSelectionModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          onLogin();
        }}
        onGoToSites={() => {
          setIsPlanModalOpen(false);
          onLogin();
          setActiveTab?.("sites");
        }}
        onGoToRequests={() => {
          setIsPlanModalOpen(false);
          onLogin();
          setActiveTab?.("requests");
        }}
      />
    </div>
  );
}
