import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export interface SproutoAIChatPayload {
  message: string;
  sessionId: string;
}

export interface SproutoAIChatResponse {
  success: boolean;
  data: {
    role: "model";
    content: string;
  };
}

export interface SproutoAIAnalysePayload {
  siteUrl: string;
  siteName: string;
  question: string;
  sessionId: string;
}

/* ================= API CALLS ================= */

/**
 * Send a message to the SproutoAI full-page assistant.
 * Backed by the same /api/ai/chat endpoint but with a
 * site-scoped sessionId so it stays isolated from the
 * global AIChat widget sessions.
 */
export const sendSproutoAIMessage = async (
  payload: SproutoAIChatPayload
): Promise<SproutoAIChatResponse> => {
  const { data } = await apiClient.post<SproutoAIChatResponse>(
    `${ENDPOINTS.sproutoai}/chat`,
    payload
  );
  return data;
};

/**
 * Clear / reset the SproutoAI session for a given site.
 */
export const clearSproutoAISession = async (
  sessionId: string
): Promise<void> => {
  await apiClient.delete(`${ENDPOINTS.sproutoai}/chat/${sessionId}`);
};