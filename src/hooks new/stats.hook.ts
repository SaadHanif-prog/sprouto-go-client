import { useQuery } from "@tanstack/react-query";
import { getAiStats } from "@/src/api/stats.api";

/* ================= GET AI STATS ================= */

export const useGetAiStats = (url?: string) => {
  return useQuery({
    queryKey: ["ai-stats", url],
    queryFn: () => getAiStats({ url: url! }),
    enabled: !!url,          // only fires when url is truthy
    staleTime: 1000 * 60 * 10, // cache for 10 min — no need to re-hit Gemini on every render
    retry: 1,
  });
};