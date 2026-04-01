import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

export interface CreateRequestPayload {
  siteId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  attachmentUrl?: string; // 👈 add this
}

// CREATE REQUEST
export const createRequest = async (payload: CreateRequestPayload) => {
  const { data } = await apiClient.post(`/requests`, payload);
  return data;
};