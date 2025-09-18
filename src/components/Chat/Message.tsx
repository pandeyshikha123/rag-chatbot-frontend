// src/components/Chat/Message.tsx
import React, { useEffect, useState } from "react";
import type { ChatMessage } from "../../hooks/useChat";

type Props = {
  message: ChatMessage & { loading?: boolean }; // helper hint: messages may carry loading flag
};

function renderParagraphs(text?: string) {
  if (!text) return null;
  // split paragraphs on two newlines and preserve single-line breaks inside paragraphs
  const paras = String(text).split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paras.map((p, i) => <p key={i} className="message-paragraph">{p}</p>);
}

const TypingDots: React.FC = () => (
  <div className="typing-dots" aria-hidden>
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
  </div>
);

const Message: React.FC<Props> = ({ message }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // text shown by typed animation
  const [displayed, setDisplayed] = useState<string>(isUser ? (message.content || "") : "");

  useEffect(() => {
    // If message gets replaced/updated (e.g. loading -> content), reset displayed
    setDisplayed(isUser ? (message.content || "") : "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message?.id]); // only restart animation when message identity changes

  useEffect(() => {
    // For assistant messages with content => type out char-by-char
    if (isAssistant && !message.loading && message.content) {
      let i = 0;
      const full = String(message.content);
      setDisplayed(""); // start clean
      const speed = 14; // ms per character (adjust to taste)
      const interval = setInterval(() => {
        i++;
        setDisplayed(full.slice(0, i));
        if (i >= full.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }
    // For user or loading cases we don't run the typing interval here
    return;
  }, [isAssistant, message.loading, message.content]);

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="message-bubble">
        {/* Header label for assistant */}
        {!isUser && <div className="message-role">Assistant</div>}

        {/* Loading / typing indicator */}
        {message.loading ? (
          <div className="message-loading">
            <div className="loading-text">Assistant is typing</div>
            <TypingDots />
          </div>
        ) : (
          // final content area: show typed text (with paragraph rendering)
          <div className="message-content">
            {/* If we have the typed text available, render paragraphs from it.
                Use displayed during animation to avoid rendering incomplete markup */}
            {renderParagraphs(displayed)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
