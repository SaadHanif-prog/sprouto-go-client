import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

import {
  sendChatMessage,
  clearChatSession,
  type ChatMessagePayload,
  type ChatMessageResponse,
} from "@/src/api/ai-api";

/**
 * Hook to send a message to the Sprouto AI chat assistant.
 *
 * Usage:
 *   const { mutateAsync, isPending } = useSendChatMessage();
 *   const response = await mutateAsync({ message: "Hello", sessionId: "user-123", siteId: "abc" });
 */
export const useSendChatMessage = () => {
  return useMutation<ChatMessageResponse, AxiosError<any>, ChatMessagePayload>({
    mutationFn: (payload) => sendChatMessage(payload),

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reach Sprouto AI"
      );
    },
  });
};

/**
 * Hook to clear/reset the current AI chat session.
 *
 * Usage:
 *   const { mutate } = useClearChatSession();
 *   mutate("user-123");
 */
export const useClearChatSession = () => {
  return useMutation<void, AxiosError<any>, string>({
    mutationFn: (sessionId) => clearChatSession(sessionId),

    onSuccess: () => {
      toast.success("Chat session reset");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to clear chat session"
      );
    },
  });
};