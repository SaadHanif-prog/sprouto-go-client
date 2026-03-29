import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTarget,
  deleteTarget,
  getTargets,
  updateTarget,
  type CreateTargetPayload,
  type UpdateTargetPayload,
} from "@/src/api/targets.api";

const TARGETS_KEY = "targets";

/* ================= GET TARGETS ================= */

export const useGetTargets = (siteId?: string) => {
  return useQuery({
    queryKey: [TARGETS_KEY, siteId],
    queryFn: () => getTargets(siteId!),
    enabled: !!siteId,
    staleTime: 1000 * 60 * 5, // 5 min cache
    retry: 1,
  });
};

/* ================= CREATE TARGET ================= */

export const useCreateTarget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTargetPayload) => createTarget(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TARGETS_KEY, variables.siteId] });
    },
  });
};

/* ================= UPDATE TARGET ================= */

export const useUpdateTarget = (siteId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTargetPayload }) =>
      updateTarget(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TARGETS_KEY, siteId] });
    },
  });
};

/* ================= DELETE TARGET ================= */

export const useDeleteTarget = (siteId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTarget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TARGETS_KEY, siteId] });
    },
  });
};