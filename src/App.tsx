import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Settings,
  Target,
  MessageSquare,
  LogOut,
  ChevronDown,
  CreditCard,
  ShieldAlert,
  Search,
  Plus,
  Menu,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/global-states/store";

import {
  setSites,
  setSelectedSite,
  selectSites,
  selectSelectedSite,
  selectSelectedSiteId,
} from "@/src/global-states/slices/siteSlice";

import Logo from "./components/Logo";
import Dashboard from "./components/Dashboard";
import SiteRequests from "./components/SiteRequests";
import Targets from "./components/Targets";
import Plans from "./components/Plans";
import AIChat from "./components/AIChat";
import SuperAdmin from "./components/SuperAdmin";
import SEOAuditor from "./components/SEOAuditor";
import Profile from "./components/Profile";
import Sites from "./components/Sites";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useLogout } from "./hooks new/auth.hook";
import ProtectedRoute from "./components/ProtectedRoute";
import { useGetSites } from "./hooks new/sites.hook";

export type Tab =
  | "dashboard"
  | "requests"
  | "targets"
  | "auditor"
  | "plans"
  | "superadmin"
  | "profile"
  | "sites";

export default function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;

  const dispatch = useDispatch();
  const logoutMutation = useLogout();

  const { data } = useGetSites();

  const sites = useSelector(selectSites);
  const selectedSite = useSelector(selectSelectedSite);
  const selectedSiteId = useSelector(selectSelectedSiteId);

  // sync API → Redux
  useEffect(() => {
    if (data?.data?.length) {
      dispatch(setSites(data.data));
    }
  }, [data?.data]);

  const [activeTab, setActiveTab] = useLocalStorage<Tab>(
    "sprouto_tab",
    "dashboard",
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSiteSelectorOpen, setIsSiteSelectorOpen] = useState(false);

  const visibleSites = sites;

  // Prevent non-superadmin access
  useEffect(() => {
    if (activeTab === "superadmin" && userRole !== "superadmin") {
      setActiveTab("dashboard");
    }
  }, [activeTab, userRole, setActiveTab]);

  const navItems =
  userRole === "superadmin"
    ? ([
        { id: "superadmin", label: "Super Admin", icon: ShieldAlert },
        { id: "dashboard", label: "Overview", icon: LayoutDashboard },
        { id: "requests", label: "All Requests", icon: Settings },
        { id: "targets", label: "Monthly Targets", icon: Target },
        { id: "auditor", label: "GEO/SEO Auditor", icon: Search },
        { id: "plans", label: "Plans & Upgrades", icon: CreditCard },
      ] as const)
    : userRole === "developer"
    ? ([
        { id: "requests", label: "Assigned Requests", icon: Settings },
      ] as const)
    : ([
        { id: "dashboard", label: "Overview", icon: LayoutDashboard },
        {
          id: "requests",
          label: userRole === "admin" ? "All Requests" : "Site Requests",
          icon: Settings,
        },
        { id: "targets", label: "Monthly Targets", icon: Target },
        { id: "auditor", label: "GEO/SEO Auditor", icon: Search },
        { id: "plans", label: "Plans & Upgrades", icon: CreditCard },
      ] as const);
  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#050505] flex overflow-hidden font-sans text-slate-300 selection:bg-emerald-500/30">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -280 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed lg:relative z-50 h-full w-[280px] bg-[#0a0a0a] border-r border-white/5 flex flex-col"
        >
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                <Logo className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-white">SproutoGO</span>
            </div>
          </div>

         {userRole !== "developer" &&   <div className="p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              Your Sites ({visibleSites.length})
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSiteSelectorOpen(!isSiteSelectorOpen)}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-3 rounded-xl transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-white">
                    {selectedSite?.name || "No Site Selected"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedSite?.url || "No URL"}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isSiteSelectorOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSiteSelectorOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 w-full mt-2 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {visibleSites.map((site: any) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          dispatch(setSelectedSite(site.id));
                          setIsSiteSelectorOpen(false);
                        }}
                        className={`w-full flex flex-col items-start px-4 py-3 hover:bg-white/5 transition-colors ${
                          selectedSiteId === site.id
                            ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                            : "border-l-2 border-transparent"
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            selectedSiteId === site.id
                              ? "text-emerald-400"
                              : "text-white"
                          }`}
                        >
                          {site.name}
                        </span>
                      </button>
                    ))}

                    {/* ✅ ADD NEW SITE (RESTORED — ONLY CHANGE) */}
                    <button
                      onClick={() => {
                        setActiveTab("sites");
                        setIsSiteSelectorOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors border-t border-white/5"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Site
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>}
          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={() => logoutMutation.mutate()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Main (UNCHANGED) */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#050505]">
          <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-400 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {user?.firstname || user?.email || "SproutoGO"}
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-300 font-medium">
                  System Online
                </span>
              </div>

              <div
                onClick={() => setActiveTab("profile")}
                className="flex justify-center items-center w-10 h-10 rounded-full bg-white/5 border border-white/20 cursor-pointer"
              >
               <span>{user?.firstname[0]}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div key={`${activeTab}-${selectedSiteId}`}>
                {activeTab === "dashboard" && <Dashboard site={selectedSite} />}
                {activeTab === "requests" && (
                  <SiteRequests
                    role={userRole}
                    sitePlan={selectedSite?.plan}
                  />
                )}
                {activeTab === "targets" && (
                  <Targets site={selectedSite} />
                )}
                {activeTab === "auditor" && (
                  <SEOAuditor site={selectedSite} />
                )}
                {activeTab === "plans" && (
                  <Plans siteId={selectedSiteId} />
                )}
                {activeTab === "sites" && <Sites />}
                {activeTab === "profile" && (
                  <Profile currentClient={user} />
                )}
                {activeTab === "superadmin" &&
                  userRole === "superadmin" && (
                    <SuperAdmin sites={sites} />
                  )}
              </motion.div>
            </AnimatePresence>
          </div>

          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6 text-white" />
            </button>
          )}

          <AnimatePresence>
            {isChatOpen && <AIChat onClose={() => setIsChatOpen(false)} />}
          </AnimatePresence>
        </main>
      </div>
    </ProtectedRoute>
  );
}
