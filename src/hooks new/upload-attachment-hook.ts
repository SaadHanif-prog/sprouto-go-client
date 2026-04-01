import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { createRequest, CreateRequestPayload } from "../api/request.api";


// UPLOAD FILE
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),

    onSuccess: () => {
      toast.success("Request created successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Failed to create request");
    },
  });
};