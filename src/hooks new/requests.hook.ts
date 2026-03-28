import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRequest,
  getRequests,
  assignRequest,
} from "../api/request.api";

/* ================= GET REQUESTS ================= */

export const useGetRequests = (siteId?: string) => {
  return useQuery({
    queryKey: ["requests", siteId || "all"],
    queryFn: () => getRequests(siteId),
  });
};

/* ================= CREATE REQUEST ================= */

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,

    onSuccess: (_, variables) => {
      // 🔥 invalidate BOTH admin + client views
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["requests", variables.siteId],
      });
    },
  });
};

/* ================= ASSIGN REQUEST ================= */

export const useAssignRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      developerId,
    }: {
      requestId: string;
      developerId: string;
    }) => assignRequest(requestId, { developerId }),

    onSuccess: () => {
      // 🔥 refresh everything (admin + client)
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
};