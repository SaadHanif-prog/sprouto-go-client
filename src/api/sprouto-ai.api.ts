import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

export interface SproutoAIChatPayload {
  message: string;
  sessionId: string;
  siteId: string; // ← new: pass the site's DB id
}

export interface SproutoAIChatResponse {
  success: boolean;
  data: {
    role: "model";
    content: string;
  };
}

export const sendSproutoAIMessage = async (
  payload: SproutoAIChatPayload
): Promise<SproutoAIChatResponse> => {
  const { data } = await apiClient.post<SproutoAIChatResponse>(
    `${ENDPOINTS.sproutoai}/chat`,
    payload
  );
  return data;
};

export const clearSproutoAISession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`${ENDPOINTS.sproutoai}/chat/${sessionId}`);
};