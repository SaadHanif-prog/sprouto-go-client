import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

import {
  sendSproutoAIMessage,
  clearSproutoAISession,
  type SproutoAIChatPayload,
  type SproutoAIChatResponse,
} from "@/src/api/sprouto-ai.api";

/* ================= HOOKS ================= */

/**
 * Hook to send a message to the SproutoAI full-page assistant.
 *
 * Uses the same backend endpoint as the global AIChat widget
 * but is kept as a separate hook so concerns stay isolated.
 *
 * Usage:
 *   const { mutateAsync, isPending } = useSendSproutoAIMessage();
 *   const response = await mutateAsync({ message: "...", sessionId: "site-abc-user-123" });
 */
export const useSendSproutoAIMessage = () => {
  return useMutation<
    SproutoAIChatResponse,
    AxiosError<any>,
    SproutoAIChatPayload
  >({
    mutationFn: (payload) => sendSproutoAIMessage(payload),

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reach SproutoAI"
      );
    },
  });
};

/**
 * Hook to clear / reset the SproutoAI session for a given site.
 *
 * Usage:
 *   const { mutate } = useClearSproutoAISession();
 *   mutate("site-abc-user-123");
 */
export const useClearSproutoAISession = () => {
  return useMutation<void, AxiosError<any>, string>({
    mutationFn: (sessionId) => clearSproutoAISession(sessionId),

    onSuccess: () => {
      toast.success("SproutoAI session reset");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to clear SproutoAI session"
      );
    },
  });
};