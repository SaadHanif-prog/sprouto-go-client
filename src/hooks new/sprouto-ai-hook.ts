import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import {
  sendSproutoAIMessage,
  clearSproutoAISession,
  type SproutoAIChatPayload,
  type SproutoAIChatResponse,
} from "@/src/api/sprouto-ai.api";

export const useSendSproutoAIMessage = () => {
  return useMutation<SproutoAIChatResponse, AxiosError<any>, SproutoAIChatPayload>({
    mutationFn: (payload) => sendSproutoAIMessage(payload),
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to reach SproutoAI");
    },
  });
};

export const useClearSproutoAISession = () => {
  return useMutation<void, AxiosError<any>, string>({
    mutationFn: (sessionId) => clearSproutoAISession(sessionId),
    onSuccess: () => toast.success("SproutoAI session reset"),
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to clear SproutoAI session");
    },
  });
};