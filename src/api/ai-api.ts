import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

/* ================= TYPES ================= */

export interface ChatMessagePayload {
  message: string;
  sessionId: string;
  siteId: string;
}

export interface ChatMessageResponse {
  success: boolean;
  data: {
    role: "model";
    content: string;
  };
}

/* ================= API ================= */

export const sendChatMessage = async (
  payload: ChatMessagePayload
): Promise<ChatMessageResponse> => {
  const { data } = await apiClient.post<ChatMessageResponse>(
    `${ENDPOINTS.ai}/chat`,
    payload
  );
  return data;
};

export const clearChatSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`${ENDPOINTS.ai}/chat/${sessionId}`);
};