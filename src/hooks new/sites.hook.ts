import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

import {
  createSite,
  getAllSites,
  GetAllSitesResponse,
  getSites,
  updateSiteSettings,
  UpdateSiteSettingsPayload,
  type CreateSitePayload,
  type GetSitesResponse,
} from "@/src/api/sites.api";
import { useSelector } from "react-redux";

// GET SITES
export const useGetSites = (): UseQueryResult<
  GetSitesResponse,
  AxiosError
> => {
  const user = useSelector((state: any) => state.auth.user);

  return useQuery({
    queryKey: ["sites", user?.userId], 
    queryFn: getSites,
    enabled: !!user, 
  });
};

// CREATE SITE
export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSitePayload) => createSite(payload),

    onSuccess: () => {
      toast.success("Site added successfully");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to add site");
    },
  });
};



export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      siteId,
      payload,
    }: {
      siteId: string;
      payload: UpdateSiteSettingsPayload;
    }) => updateSiteSettings(siteId, payload),

    onSuccess: () => {
      toast.success("Site settings saved");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to update site settings");
    },
  });
};



// GET ALL SITES (Super Admin)
export const useGetAllSites = (): UseQueryResult<GetAllSitesResponse, AxiosError> => {
  return useQuery({
    queryKey: ["sites", "all"],
    queryFn: getAllSites,
  });
};