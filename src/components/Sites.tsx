import { useState } from "react";
import { useGetSites, useCreateSite } from "@/src/hooks new/sites.hook";

export default function Sites() {
  const [url, setUrl] = useState("");

  const { data, isLoading } = useGetSites();
  const { mutate: addSite, isPending } = useCreateSite();

  const sites = data?.data || [];

  console.log("SItesss", sites);

  const handleAdd = () => {
    if (!url.trim()) return;

    addSite({
      url, // ✅ removed userId (handled by backend)
    });

    setUrl("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-white">Manage Sites</h2>

      {/* Add Site */}
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white"
        />
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="px-4 py-3 bg-emerald-500 rounded-xl text-black font-semibold"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : sites.length === 0 ? (
          <p className="text-slate-400">No sites yet</p>
        ) : (
          sites.map((site: any) => (
            <div
              key={site._id}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-white"
            >
              {site.url}
            </div>
          ))
        )}
      </div>
    </div>
  );
}