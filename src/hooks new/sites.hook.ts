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
  getSites,
  type CreateSitePayload,
  type GetSitesResponse,
} from "@/src/api/sites.api";

// GET SITES
export const useGetSites = (): UseQueryResult<
  GetSitesResponse,
  AxiosError
> => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
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