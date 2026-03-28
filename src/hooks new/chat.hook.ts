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

export function useChat(
  requestId: string | null | undefined,
  token: string | null | undefined,
) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Create socket once per token ──────────────────────────────── */
  useEffect(() => {
    if (!token) {
      console.log("❌ No token, socket not initialized");
      return;
    }

    console.log("✅ Initializing socket with token:", token);

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      setConnected(true);
      setError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ CONNECT ERROR:", err.message);
      setError(err.message);
      setConnected(false);
    });

    socket.on("chat:error", ({ message }: { message: string }) => {
      console.log("❌ CHAT ERROR:", message);
      setError(message);
    });

    return () => {
      console.log("🧹 Cleaning up socket");
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  /* ── Join / leave room when requestId changes ──────────────────── */
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !requestId) return;

    console.log("📥 Joining room:", requestId);

    setMessages([]);
    setError(null);

    socket.emit("chat:join", { requestId });

    const handleHistory = ({ messages: history }: { messages: ChatMessage[] }) => {
      console.log("📜 History received:", history.length);
      setMessages(history);
    };

    const handleMessage = (msg: ChatMessage) => {
      console.log("💬 New message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:history", handleHistory);
    socket.on("chat:message", handleMessage);

    return () => {
      console.log("🚪 Leaving room:", requestId);
      socket.emit("chat:leave", { requestId });
      socket.off("chat:history", handleHistory);
      socket.off("chat:message", handleMessage);
    };
  }, [requestId]);

  /* ── Send ──────────────────────────────────────────────────────── */
  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !requestId || !text.trim()) return;

      console.log("📤 Sending message:", text);

      socketRef.current.emit("chat:send", { requestId, text });
    },
    [requestId],
  );

  return { messages, sendMessage, connected, error };
}