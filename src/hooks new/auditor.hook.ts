import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAudit,
  sendChatMessage,
  downloadTargetsCsv,
  type ChatPayload,
  type CsvPayload,
} from "@/src/api/auditor-api";
import type { AuditData } from "@/src/api/auditor-api";

/* ================= STORAGE HELPERS ================= */

const storageKey = (url: string) => `auditor_cache_${url}`;

const readCache = (url: string): AuditData | null => {
  try {
    const raw = localStorage.getItem(storageKey(url));
    return raw ? (JSON.parse(raw) as AuditData) : null;
  } catch {
    return null;
  }
};

const writeCache = (url: string, data: AuditData) => {
  try {
    localStorage.setItem(storageKey(url), JSON.stringify(data));
  } catch {
    // storage quota exceeded or SSR — silently ignore
  }
};

const clearCache = (url: string) => {
  try {
    localStorage.removeItem(storageKey(url));
  } catch {}
};

/* ================= FETCH AUDIT ================= */
// On mount: returns the localStorage cache immediately (no network call).
// Only hits the API when there is no cached value.

export const useGetAudit = (url?: string) => {
  return useQuery({
    queryKey: ["auditor", url],
    queryFn: async () => {
      // Return the persisted value if it exists — no API call
      const cached = readCache(url!);
      if (cached) return { data: cached, success: true };

      // No cache → fetch from API and persist
      const result = await fetchAudit(url!);
      if (result?.data) writeCache(url!, result.data);
      return result;
    },
    enabled: !!url,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
};

/* ================= RE-RUN (manual refresh) ================= */
// Clears localStorage first, then fetches fresh data and re-persists.

export const useReRunAudit = (url?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (url) clearCache(url);
      const result = await fetchAudit(url!);
      if (result?.data && url) writeCache(url, result.data);
      return result;
    },
    onSuccess: (result) => {
      // Sync the TanStack query cache so the component re-renders with fresh data
      queryClient.setQueryData(["auditor", url], result);
    },
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