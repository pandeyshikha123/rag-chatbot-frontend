// src/hooks/useChat.ts
import { useEffect, useRef, useState } from "react";
import * as api from "../services/api";
import { socketConnect } from "../services/socket";
import type { Message } from "../types/chat";
import { v4 as uuidv4 } from "uuid";

/**
 * useChat
 * - creates a session on mount
 * - returns messages, sendMessage, reset
 */
export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const sid = await api.createSession();
        if (!mounted) return;
        setSessionId(sid);

        const hist = await api.getSessionHistory(sid);
        if (!mounted) return;
        // hist may be array of {role,content} objects
        setMessages(hist || []);

        // connect socket and listen
        socketRef.current = socketConnect(sid);
        socketRef.current.on("assistant_message", (payload: any) => {
          setMessages(prev => [...prev, { role: "assistant", content: payload.content, id: uuidv4() }]);
        });
      } catch (err) {
        console.error("useChat init error", err);
      }
    })();

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  async function sendMessage(content: string) {
    if (!sessionId) throw new Error("No session");
    // immediate local echo
    const userMsg: Message = { role: "user", content, id: uuidv4() };
    setMessages(prev => [...prev, userMsg]);

    try {
      // send to backend (response arrives via socket)
      await api.sendMessage(sessionId, content);
    } catch (err) {
      console.error("sendMessage error", err);
      // optionally append an error assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "Error sending message.", id: uuidv4() }]);
    }
  }

  async function reset() {
    if (!sessionId) return;
    try {
      await api.resetSession(sessionId);
      // create new session
      const sid = await api.createSession();
      setSessionId(sid);
      setMessages([]);
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = socketConnect(sid);
      socketRef.current.on("assistant_message", (payload: any) => {
        setMessages(prev => [...prev, { role: "assistant", content: payload.content, id: uuidv4() }]);
      });
    } catch (err) {
      console.error("reset error", err);
    }
  }

  return { sessionId, messages, sendMessage, reset };
}
