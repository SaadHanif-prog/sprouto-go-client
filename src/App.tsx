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

import { useSelector } from "react-redux";
import { RootState } from "@/src/global-states/store";

import Logo from "./components/Logo";
import Dashboard from "./components/Dashboard";
import SiteRequests from "./components/SiteRequests";
import Targets from "./components/Targets";
import Plans from "./components/Plans";
import AIChat from "./components/AIChat";
import SuperAdmin from "./components/SuperAdmin";
import SEOAuditor from "./components/SEOAuditor";
import Profile from "./components/Profile";
import Login from "./components/Login";

import { Role, Site, Client, mockClients } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useLogout } from "./hooks new/auth.hook";
import ProtectedRoute from "./components/ProtectedRoute";

export type Tab =
  | "dashboard"
  | "requests"
  | "targets"
  | "auditor"
  | "plans"
  | "superadmin"
  | "profile";

const mockSites: Site[] = [
  {
    id: "site-1",
    name: "Sprouto Main",
    url: "sprouto.com",
    plan: "Pro",
    liveUrl: "",
    gaMeasurementId: "",
    clientId: "c1",
  },
  {
    id: "site-2",
    name: "Sprouto Blog",
    url: "blog.sprouto.com",
    plan: "Starter",
    liveUrl: "",
    gaMeasurementId: "",
    clientId: "c2",
  },
];

export default function App() {
  //  Redux Auth
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role;

  const logoutMutation = useLogout();

  const [activeTab, setActiveTab] = useLocalStorage<Tab>(
    "sprouto_tab",
    "dashboard",
  );
  const [allSites, setAllSites] = useLocalStorage<Site[]>(
    "sprouto_sites",
    mockSites,
  );
  const [clients, setClients] = useLocalStorage<Client[]>(
    "sprouto_clients",
    mockClients,
  );
  const [clientEmail] = useLocalStorage<string>("sprouto_client_email", "");
  const [selectedSiteId, setSelectedSiteId] = useLocalStorage<string>(
    "sprouto_selected_site",
    mockSites[0].id,
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSiteSelectorOpen, setIsSiteSelectorOpen] = useState(false);

  // Filter sites
  const currentClient =
    clients.find((c) => c.email === clientEmail) ||
    clients.find((c) => c.email === user?.email) ||
    clients.find((c) => allSites.some((s) => s.clientId === c.id));
  const visibleSites =
    userRole === "superadmin" || userRole === "admin"
      ? allSites
      : currentClient
        ? allSites.filter((s) => s.clientId === currentClient.id)
        : allSites;

  // Ensure valid site
  useEffect(() => {
    if (
      visibleSites.length > 0 &&
      !visibleSites.find((s) => s.id === selectedSiteId)
    ) {
      setSelectedSiteId(visibleSites[0].id);
    }
  }, [visibleSites, selectedSiteId, setSelectedSiteId]);

  // Prevent non-superadmin access
  useEffect(() => {
    if (activeTab === "superadmin" && userRole !== "superadmin") {
      setActiveTab("dashboard");
    }
  }, [activeTab, userRole, setActiveTab]);

  const selectedSite =
    visibleSites.find((s) => s.id === selectedSiteId) || visibleSites[0];

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
      <div className="min-h-screen bg-[#050505] flex overflow-hidden font-sans text-slate-300 selection:bg-emerald-500/30">
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

          <div className="p-4">
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
                    {visibleSites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedSiteId(site.id);
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
                        <span className="text-xs text-slate-500">
                          {site.url}
                        </span>
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setActiveTab("plans");
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
          </div>

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

        {/* Main */}
        <main
          className={`flex-1 flex flex-col h-screen overflow-hidden relative bg-[#050505] transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-0" : "lg:ml-[-280px]"
          }`}
        >
          {" "}
          <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-10">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-slate-400 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {currentClient?.companyDetails?.name ||
                  currentClient?.name ||
                  selectedSite?.name ||
                  "SproutoGO"}
              </h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              {/* System Status */}
              <div className="hidden md:flex items-center gap-3 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <span className="text-slate-300 font-medium">
                  System Online
                </span>
              </div>

              {/* User Avatar */}
              <div
                onClick={() => setActiveTab("profile")}
                className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 shadow-lg overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-colors"
              >
                <img src="https://picsum.photos/seed/user/100/100" alt="User" />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${selectedSiteId}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {activeTab === "dashboard" && <Dashboard site={selectedSite} />}
                {activeTab === "requests" && (
                  <SiteRequests
                    siteId={selectedSiteId}
                    role={userRole}
                    sitePlan={selectedSite.plan}
                  />
                )}
                {activeTab === "targets" && <Targets siteId={selectedSiteId} />}
                {activeTab === "auditor" && <SEOAuditor site={selectedSite} />}
                {activeTab === "plans" && <Plans siteId={selectedSiteId} />}
                {activeTab === "profile" &&
                  (currentClient ? (
                    <Profile currentClient={currentClient} />
                  ) : (
                    <div className="text-white text-center mt-10">
                      Loading profile...
                    </div>
                  ))}
                {activeTab === "superadmin" && userRole === "superadmin" && (
                  <SuperAdmin sites={allSites} setSites={setAllSites} />
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
