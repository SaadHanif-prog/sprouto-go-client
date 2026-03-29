import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export interface PageBreakdown {
  url: string;
  health: number;
  keyword: string;
  status: "Good" | "Needs Work" | "Critical";
}

export interface AuditData {
  healthScore: number;
  organicTraffic: number;
  criticalIssues: number;
  trendingKeywords: string[];
  pageBreakdown: PageBreakdown[];
}

export interface AuditResponse {
  success: boolean;
  data: AuditData;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface ChatPayload {
  url?: string;
  siteName?: string;
  messages: ChatMessage[];
  auditContext?: AuditData | null;
}

export interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

export interface CsvPayload {
  url: string;
  auditContext?: AuditData | null;
}

/* ================= API ================= */

export const fetchAudit = async (url: string): Promise<AuditResponse> => {
  const { data } = await apiClient.post<AuditResponse>(
    `${ENDPOINTS.auditor}/audit`,
    { url }
  );
  return data;
};

export const sendChatMessage = async (payload: ChatPayload): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>(
    `${ENDPOINTS.auditor}/chat`,
    payload
  );
  return data;
};

export const downloadTargetsCsv = async (
  payload: CsvPayload,
  siteName: string
): Promise<void> => {
  const response = await apiClient.post(
    `${ENDPOINTS.auditor}/targets-csv`,
    payload,
    { responseType: "blob" }
  );
  const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${siteName.replace(/\s+/g, "_")}_SEO_Targets_Next_Month.csv`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};