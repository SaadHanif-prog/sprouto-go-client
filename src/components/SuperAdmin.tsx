import { useState } from "react";
import apiClient from "../api/apiClient";
import { motion } from "motion/react";
import {
  Users,
  Package,
  Plus,
  Trash2,
  Save,
  Sparkles,
  Globe,
} from "lucide-react";
import {
  Plan,
  Addon,
  Client,
  mockPlans,
  mockAddons,
  mockClients,
} from "../types";
import { Site } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useGetAllUsers } from "../hooks new/auth.hook";
import { useGetAllSites, useUpdateSiteSettings } from "../hooks new/sites.hook";

interface SuperAdminProps {
  sites: Site[];
}

function SiteCard({ site }: { site: Site }) {
  const { mutate: updateSettings, isPending } = useUpdateSiteSettings();
  const [liveUrl, setLiveUrl] = useState(site.liveUrl || "");
  const [propertyId, setPropertyId] = useState(site.propertyId || "");

  const handleSave = () => {
    updateSettings({ siteId: site.id, payload: { liveUrl, propertyId } });
  };

  const isDirty =
    liveUrl !== (site.liveUrl || "") || propertyId !== (site.propertyId || "");

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{site.name}</h3>
          <p className="text-sm text-slate-400">{site.url}</p>
        </div>

        <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs border border-emerald-500/20">
          {site.plan}
        </span>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Live URL (Unlocks Preview)
          </label>

          <input
            type="url"
            placeholder="https://..."
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
          />

          {liveUrl && (
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> Preview unlocked for client
            </p>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t border-white/5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Google Analytics (Property ID)
          </label>

          <input
            type="text"
            placeholder="123456789"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-colors"
          />

          <p className="text-xs text-slate-500 mt-1">
            Connect GA4 Property ID to provide real analytics data.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#050505] font-medium rounded-lg transition-colors text-sm"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const { data: usersData, refetch } = useGetAllUsers();

  const [activeTab, setActiveTab] = useLocalStorage<
    "clients" | "plans" | "sites"
  >("sprouto_admin_tab", "clients");

  const [plans, setPlans] = useLocalStorage<Plan[]>(
    "sprouto_plans_v2",
    mockPlans,
  );

  const [addons, setAddons] = useLocalStorage<Addon[]>(
    "sprouto_addons",
    mockAddons,
  );

  const [clients, setClients] = useLocalStorage<Client[]>(
    "sprouto_clients",
    mockClients,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const [cancelModal, setCancelModal] = useState<{
    open: boolean;
    subscriptionId: string | null;
  }>({
    open: false,
    subscriptionId: null,
  });

  const { data: allSitesData } = useGetAllSites();
  const allSites = allSitesData?.data ?? [];

  const handleSavePlans = async () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const addPlan = () => {
    setPlans([
      ...plans,
      {
        id: "p" + Date.now(),
        name: "New Plan",
        price: 0,
        currency: "GBP",
        features: ["Feature 1"],
        webhookUrl: "",
        secretKey: "",
      },
    ]);
  };

  const removePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const updatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(plans.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const getPlans = (entitlements: any[] = []) => {
    if (!entitlements.length) return "-";

    return (
      <div className="space-y-2">
        {entitlements.map((item) => (
          <div
            key={item.stripeSubscriptionId}
            className="flex items-center justify-between gap-3 bg-white/5 px-3 py-2 rounded-lg"
          >
            <div className="min-w-0">
              <p className="capitalize text-emerald-400 font-medium">
                {item.plan}
              </p>

              {item.expiresAt && (
                <p className="text-[11px] text-slate-500">
                  Ends: {new Date(item.expiresAt).toLocaleDateString()}
                </p>
              )}

              {item.cancelAtPeriodEnd && (
                <p className="text-[11px] text-yellow-400">
                  Status: Cancelling
                </p>
              )}
            </div>

            {item.cancelAtPeriodEnd ? (
              <span className="px-3 py-1 text-xs rounded-lg bg-yellow-500/15 text-yellow-400">
                Cancelling
              </span>
            ) : (
              <button
                disabled={cancelLoading === item.stripeSubscriptionId}
                onClick={() =>
                  setCancelModal({
                    open: true,
                    subscriptionId: item.stripeSubscriptionId,
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50"
              >
                {cancelLoading === item.stripeSubscriptionId
                  ? "Cancelling..."
                  : "Cancel"}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getAddons = (addonEntitlements: any[] = []) => {
    if (!addonEntitlements.length) return "-";

    return (
      <div className="space-y-2">
        {addonEntitlements.map((item) => (
          <div
            key={item.stripeSubscriptionId}
            className="flex items-center justify-between gap-3 bg-white/5 px-3 py-2 rounded-lg"
          >
            <div className="min-w-0">
              <p className="text-blue-400 font-medium">{item.addonId}</p>

              {item.expiresAt && (
                <p className="text-[11px] text-slate-500">
                  Ends: {new Date(item.expiresAt).toLocaleDateString()}
                </p>
              )}

              {item.cancelAtPeriodEnd && (
                <p className="text-[11px] text-yellow-400">
                  Status: Cancelling
                </p>
              )}
            </div>

            {item.cancelAtPeriodEnd ? (
              <span className="px-3 py-1 text-xs rounded-lg bg-yellow-500/15 text-yellow-400">
                Cancelling
              </span>
            ) : (
              <button
                disabled={cancelLoading === item.stripeSubscriptionId}
                onClick={() =>
                  setCancelModal({
                    open: true,
                    subscriptionId: item.stripeSubscriptionId,
                  })
                }
                className="px-3 py-1 text-xs rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 disabled:opacity-50"
              >
                {cancelLoading === item.stripeSubscriptionId
                  ? "Cancelling..."
                  : "Cancel"}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCancel = async () => {
    if (!cancelModal.subscriptionId) return;

    try {
      setCancelLoading(cancelModal.subscriptionId);

      await apiClient.post("/subscription/cancel", {
        subscriptionId: cancelModal.subscriptionId,
      });

      await refetch?.();

      setCancelModal({
        open: false,
        subscriptionId: null,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to cancel subscription");
    } finally {
      setCancelLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("clients")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "clients"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> Clients
        </button>

        {/* <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'plans'
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" /> Plans & Add-ons
        </button> */}

        <button
          onClick={() => setActiveTab("sites")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "sites"
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" /> Sites & Previews
        </button>
      </div>

      {/* CLIENTS TAB */}
      {activeTab === "clients" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-x-auto"
        >
          <table className="w-full min-w-[1100px] text-left text-sm">
            {" "}
            <thead className="bg-white/5 border-b border-white/10 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Client Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Add-ons</th>
                <th className="px-6 py-4 font-medium">Stripe ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersData?.data?.map((client: any) => (
                <tr
                  key={client._id}
                  className="hover:bg-white/5 transition-colors align-top"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {client.firstname} {client.surname}
                  </td>

                  <td className="px-6 py-4 text-slate-400">{client.email}</td>

                  <td className="px-6 py-4 text-slate-500 capitalize">
                    {client.role}
                  </td>

                  <td className="px-6 py-4 min-w-[280px]">
                    {getPlans(client.entitlements)}
                  </td>

                  <td className="px-6 py-4 min-w-[280px]">
                    {getAddons(client.addonEntitlements)}
                  </td>

                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {client.subscription?.stripeCustomerId || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* PLANS TAB */}
      {activeTab === "plans" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Manage Plans</h2>

            <div className="flex gap-3">
              <button
                onClick={addPlan}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" /> Add Plan
              </button>

              <button
                onClick={handleSavePlans}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-medium rounded-lg transition-colors text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) =>
                      updatePlan(plan.id, "name", e.target.value)
                    }
                    className="bg-transparent text-xl font-bold text-white border-b border-white/20 focus:border-emerald-500 outline-none pb-1"
                  />

                  <button
                    onClick={() => removePlan(plan.id)}
                    className="text-rose-400 hover:text-rose-300 p-2 bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">£</span>

                  <input
                    type="number"
                    value={plan.price}
                    onChange={(e) =>
                      updatePlan(plan.id, "price", Number(e.target.value))
                    }
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-24 outline-none focus:border-emerald-500"
                  />

                  <span className="text-slate-500 text-sm">/ month</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Webhook URL
                    </label>

                    <input
                      type="text"
                      value={plan.webhookUrl || ""}
                      onChange={(e) =>
                        updatePlan(plan.id, "webhookUrl", e.target.value)
                      }
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Secret Key
                    </label>

                    <input
                      type="password"
                      value={plan.secretKey || ""}
                      onChange={(e) =>
                        updatePlan(plan.id, "secretKey", e.target.value)
                      }
                      placeholder="sk_test_..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Features
                    </label>

                    <button
                      onClick={() =>
                        updatePlan(plan.id, "features", [
                          ...plan.features,
                          "New Feature",
                        ])
                      }
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...plan.features];
                            newFeatures[index] = e.target.value;
                            updatePlan(plan.id, "features", newFeatures);
                          }}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500"
                        />

                        <button
                          onClick={() => {
                            const newFeatures = plan.features.filter(
                              (_, i) => i !== index,
                            );

                            updatePlan(plan.id, "features", newFeatures);
                          }}
                          className="text-rose-400 hover:text-rose-300 p-2 bg-rose-500/10 rounded-lg shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) =>
                      setAddons(
                        addons.map((a) =>
                          a.id === addon.id
                            ? { ...a, name: e.target.value }
                            : a,
                        ),
                      )
                    }
                    className="bg-transparent text-lg font-bold text-white border-b border-white/20 focus:border-emerald-500 outline-none pb-1 w-full mr-4"
                  />

                  <button
                    onClick={() =>
                      setAddons(addons.filter((a) => a.id !== addon.id))
                    }
                    className="text-rose-400 hover:text-rose-300 p-2 bg-rose-500/10 rounded-lg shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">£</span>

                  <input
                    type="number"
                    value={addon.price}
                    onChange={(e) =>
                      setAddons(
                        addons.map((a) =>
                          a.id === addon.id
                            ? {
                                ...a,
                                price: Number(e.target.value),
                              }
                            : a,
                        ),
                      )
                    }
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white w-24 outline-none focus:border-emerald-500"
                  />

                  <span className="text-slate-500 text-sm">/ month</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">
                      Description
                    </label>

                    <textarea
                      value={addon.desc}
                      onChange={(e) =>
                        setAddons(
                          addons.map((a) =>
                            a.id === addon.id
                              ? {
                                  ...a,
                                  desc: e.target.value,
                                }
                              : a,
                          ),
                        )
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none focus:border-emerald-500 h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SITES TAB */}
      {activeTab === "sites" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Manage Client Sites
            </h2>

            <p className="text-sm text-slate-400">
              Enter a Live URL to unlock the site preview for the client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </motion.div>
      )}

      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              <div>
                <h3 className="text-white text-lg font-semibold">
                  Cancel Subscription
                </h3>
                <p className="text-sm text-slate-400">
                  This will cancel at the end of the billing period.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-300">
                Are you sure you want to cancel this subscription?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setCancelModal({
                    open: false,
                    subscriptionId: null,
                  })
                }
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                Keep Active
              </button>

              <button
                onClick={handleCancel}
                disabled={!!cancelLoading}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 disabled:opacity-50 transition-colors"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
