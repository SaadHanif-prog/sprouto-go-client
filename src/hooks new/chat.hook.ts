import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

/* ── Types ─────────────────────────────────────────────────────────── */

export interface ChatMessage {
  _id: string;
  requestId: string;
  senderId: {
    _id: string;
    firstname: string;
    surname: string;
    email: string;
    role: string;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Hook ──────────────────────────────────────────────────────────── */

/**
 * useChat – real-time chat for a single request room.
 *
 * @param requestId  The request._id to listen on (pass null/undefined to skip)
 * @param token      JWT access token for socket auth
 */
export function useChat(requestId: string | null | undefined, token: string | null | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Connect once, reuse across re-renders ─────────────────────── */
  useEffect(() => {
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || process.env.VITE_SOCKET_URL || "", {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:error", ({ message }: { message: string }) => {
      setError(message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  /* ── Join / leave room whenever requestId changes ──────────────── */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !requestId) return;

    setMessages([]);
    setError(null);

    socket.emit("chat:join", { requestId });

    socket.on("chat:history", ({ messages: history }: { messages: ChatMessage[] }) => {
      setMessages(history);
    });

    socket.on("chat:message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("chat:leave", { requestId });
      socket.off("chat:history");
      socket.off("chat:message");
    };
  }, [requestId]);

  /* ── Send ──────────────────────────────────────────────────────── */
  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !requestId || !text.trim()) return;
      socketRef.current.emit("chat:send", { requestId, text });
    },
    [requestId]
  );

  return { messages, sendMessage, connected, error };
}