// src/hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
  loading?: boolean; // temporary assistant "typing" indicator
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

    // 1) push user message (visible immediately)
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    // 2) push temporary assistant loading message
    const tempId = uuidv4();
    const loadingMsg: ChatMessage = {
      id: tempId,
      role: "assistant",
      content: "",
      loading: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, loadingMsg]);

    try {
      loadingRef.current = true;
      // 3) call backend
      const res = await apiSendMessage(sessionId, userText);

      // final assistant message
      const assistantMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: res?.reply || "",
        docs: res?.docs || [],
        createdAt: new Date().toISOString(),
        loading: false,
      };

      // 4) replace the temporary loading message with assistantMsg
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...assistantMsg } : msg))
      );
    } catch (err) {
      console.error("sendMessage failed:", err);
      // replace loading message with an error bubble
      const errMsg: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry — an error occurred contacting the server.",
        createdAt: new Date().toISOString(),
        loading: false,
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...errMsg } : msg))
      );
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
