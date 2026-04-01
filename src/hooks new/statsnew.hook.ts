import {
  useQuery,
  useMutation,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

// API
import { getAiStats, connectGoogle } from "@/src/api/stats-new.api";

// Types
import type { AiStatsResponse, GetAiStatsPayload } from "@/src/api/stats-new.api";

interface ErrorResponse {
  message: string;
}

// ================= GET AI STATS =================
export const useGetAiStats = (
  payload: GetAiStatsPayload
): UseQueryResult<AiStatsResponse, AxiosError<ErrorResponse>> => {
  return useQuery({
    queryKey: ["aiStats", payload.siteId],
    queryFn: () => getAiStats(payload),
    enabled: !!payload.siteId,
  });
};

// ================= CONNECT GOOGLE =================
export const useConnectGoogle = () => {
  return () => connectGoogle();
};