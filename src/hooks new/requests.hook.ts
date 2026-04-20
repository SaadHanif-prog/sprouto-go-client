import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

import {
  createRequest,
  getRequests,
  assignRequest,
  completeRequest,
  uploadRequestAttachment
} from "../api/request.api";

/* ================= GET REQUESTS ================= */

export const useGetRequests = (siteId?: string) => {
  return useQuery({
    queryKey: ["requests", siteId || "all"],
    queryFn: () => getRequests(siteId),
  });
};

/* ================= CREATE REQUEST (with optional file) ================= */

export const useCreateRequestWithUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      payload,
    }: {
      file?: File;
      payload: {
        siteId?: string;
        requestForNewSite?: string;
        title: string;
        description: string;
        priority: string;
      };
    }) => createRequest(payload, file), // ← single call, file sent as multipart

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      toast.success("Request created successfully");
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to create request"
      );
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
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request assigned successfully");
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to assign request"
      );
    },
  });
};

/* ================= COMPLETE REQUEST ================= */

export const useCompleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId }: { requestId: string }) =>
      completeRequest(requestId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Task marked as completed");
    },

    onError: (error: AxiosError<any>) => {
      toast.error(
        error.response?.data?.message || "Failed to complete request"
      );
    },
  });
};

export const useUploadRequestAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, files }: { requestId: string; files: File[] }) =>
      uploadRequestAttachment(requestId, files),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Files uploaded successfully");
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });
};