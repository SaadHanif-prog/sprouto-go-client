import { apiClient } from "@/src/api/apiClient";
import ENDPOINTS from "@/src/api/endpoints";

// Types
type Site = {
  id: string; 
  name: string;
  url: string;
  userId: string;
  plan: "starter" | "pro";
  entitlementId: string;
  liveUrl?: string;
  gaMeasurementId?: string;
};

export interface CreateSitePayload {
  url: string;
  name: string;
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