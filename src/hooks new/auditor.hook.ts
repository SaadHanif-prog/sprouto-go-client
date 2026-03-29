import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAudit,
  sendChatMessage,
  downloadTargetsCsv,
  type ChatPayload,
  type CsvPayload,
} from "@/src/api/auditor-api";

/* ================= FETCH AUDIT (runs on mount, cached per url) ================= */

export const useGetAudit = (url?: string) => {
  return useQuery({
    queryKey: ["auditor", url],
    queryFn: () => fetchAudit(url!),
    enabled: !!url,
    // No staleTime — always fresh from Gemini on mount
    staleTime: 0,
    retry: 1,
  });
};

/* ================= RE-RUN (manual refresh) ================= */

export const useReRunAudit = (url?: string) => {
  return useMutation({
    mutationFn: () => fetchAudit(url!),
  });
};

/* ================= CHAT ================= */

export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: (payload: ChatPayload) => sendChatMessage(payload),
  });
};

/* ================= DOWNLOAD CSV ================= */

export const useDownloadTargetsCsv = () => {
  return useMutation({
    mutationFn: ({ payload, siteName }: { payload: CsvPayload; siteName: string }) =>
      downloadTargetsCsv(payload, siteName),
  });
};