// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import "./index.css";

/**
 * Minimal Chat UI wrapper that connects to your existing hooks/components.
 * This file intentionally keeps the UI self-contained so the page is centered,
 * uses the styles in src/index.css, and looks consistent before & after messages.
 *
 * If you already have a ChatInterface component, you can instead use:
 *   import ChatInterface from "./components/Chat/ChatInterface";
 *   and render <ChatInterface /> inside .chat-card
 *
 * For now this file implements a lightweight UI that calls the backend directly
 * (so you can see the centered container & styled button immediately).
 */

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

type Doc = { id: string; score?: number; text?: string; meta?: any };

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string; refs?: Doc[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const areaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // create a session on mount
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/session`, { method: "POST" });
        const j = await r.json();
        setSessionId(j.sessionId);
      } catch (err) {
        console.error("session create failed", err);
      }
    })();
  }, []);

  // scroll to bottom when messages change
  useEffect(() => {
    if (!areaRef.current) return;
    // slight delay to allow rendering
    setTimeout(() => {
      areaRef.current!.scrollTop = areaRef.current!.scrollHeight;
    }, 50);
  }, [messages]);

  async function send() {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setText("");
    setLoading(true);

    try {
      const payload = { sessionId, message: trimmed, k: 3 };
      const r = await fetch(`${API_BASE}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      // if API returns docs use them as references
      setMessages((m) => [...m, { role: "assistant", text: j.reply || (j.message ?? ""), refs: j.docs }]);
    } catch (err) {
      console.error("send failed", err);
      setMessages((m) => [...m, { role: "assistant", text: "Sorry — something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="app-shell">
      <header className="header">
        <h1>RAG News Chatbot</h1>
      </header>

      <main className="chat-container">
        <section className="chat-card" role="application" aria-label="Chat">
          <div className="controls">
            <button
              className="btn-reset"
              onClick={() => {
                setMessages([]);
                // optionally request backend reset
                if (sessionId) fetch(`${API_BASE}/api/session/${sessionId}`, { method: "DELETE" }).catch(() => {});
              }}
            >
              Reset Session
            </button>
          </div>

          <div ref={areaRef} className="message-area" id="messages">
            {messages.length === 0 && (
              <div style={{ color: "#6b7280", padding: 18 }}>
                Ask me about the news — the bot will search indexed docs and return the best matches.
              </div>
            )}

            {messages.map((m, idx) => (
              <div key={idx} className={`message-row ${m.role === "assistant" ? "assistant" : "user"}`}>
                <div className={`bubble ${m.role === "assistant" ? "assistant" : "user"}`}>
                  {m.role === "assistant" && <div className="meta">Assistant</div>}
                  <div>{m.text}</div>

                  {m.refs && m.refs.length > 0 && (
                    <div className="references" aria-hidden={false}>
                      <strong>References:</strong>
                      <ul>
                        {m.refs.map((d: Doc) => (
                          <li key={d.id}>
                            {(d.meta?.title || d.id) + " — "}
                            {d.meta?.url ? (
                              <a href={d.meta.url} target="_blank" rel="noreferrer">
                                link
                              </a>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="input-row" role="form" aria-label="Send message">
            <textarea
              placeholder="Type your question about the news..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Message input"
            />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {loading ? <div className="loader" aria-hidden="true" /> : null}
              <button className="btn-send" onClick={send} disabled={loading}>
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
