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

export interface GetAllSitesResponse {
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

export interface UpdateSiteSettingsPayload {
  propertyId?: string;
  liveUrl?: string;
}

// UPDATE SITE SETTINGS (Super Admin)
export const updateSiteSettings = async (
  siteId: string,
  payload: UpdateSiteSettingsPayload
) => {
  const { data } = await apiClient.patch(
    `${ENDPOINTS.sites}/${siteId}/settings`,
    payload
  );
  return data;
};


// GET ALL SITES (Super Admin)
export const getAllSites = async (): Promise<GetAllSitesResponse> => {
  const { data } = await apiClient.get(`${ENDPOINTS.sites}/all`);
  return data;
};