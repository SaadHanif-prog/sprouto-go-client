import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

// Types
export interface Site {
  _id: string;
  userId: string;
  url: string;
  createdAt: string;
}

export interface CreateSitePayload {
  url: string; // ✅ removed userId
}

export interface GetSitesResponse {
  success: boolean;
  data: Site[];
}

// CREATE SITE
export const createSite = async (payload: CreateSitePayload) => {
  const { data } = await apiClient.post(`${ENDPOINTS.sites}/create`, payload);
  return data;
};

// GET USER SITES
export const getSites = async (): Promise<GetSitesResponse> => {
  const { data } = await apiClient.get(`${ENDPOINTS.sites}/`);
  return data;
};