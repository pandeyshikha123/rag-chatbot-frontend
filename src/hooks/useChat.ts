// src/hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
import { createSession, sendMessage as apiSendMessage } from "../services/api";

/**
 * ChatMessage type used by UI components.
 */
export type ChatMessage = {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  docs?: any[]; // optional list of documents returned by backend
  createdAt?: string;
};

export function useChat(initialSessionId?: string) {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const loadingRef = useRef(false);

  // create session when hook mounts or when sessionId is null
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!sessionId) {
        try {
          const s = await createSession();
          if (mounted) setSessionId(s);
        } catch (err) {
          console.error("createSession failed:", err);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sessionId]); // include sessionId to satisfy eslint/react-hooks

  // sendMessage - public API (used by ChatInterface)
  async function sendMessage(userText: string) {
    if (!sessionId) {
      console.warn("useChat: sessionId not ready yet");
      return;
    }

    const userMsg: ChatMessage = {
      role: "user",
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      loadingRef.current = true;
      const res = await apiSendMessage(sessionId, userText);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.reply || "",
        docs: res.docs || [],
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      console.error("sendMessage failed:", err);
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry — an error occurred contacting the server.",
        createdAt: new Date().toISOString(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      loadingRef.current = false;
    }
  }

  function reset() {
    setMessages([]);
    // create new session
    (async () => {
      try {
        const s = await createSession();
        setSessionId(s);
      } catch (err) {
        console.error("reset createSession failed:", err);
      }
    })();
  }

  return { sessionId, messages, sendMessage, reset };
}

export default useChat;
