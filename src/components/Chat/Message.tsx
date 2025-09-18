// src/components/Chat/Message.tsx
import React from "react";
import type { ChatMessage } from "../../hooks/useChat";

type Props = {
  message: ChatMessage;
};

const Message: React.FC<Props> = ({ message }) => {
  const { role, content, docs } = message;

  const isUser = role === "user";
  const containerClass = isUser ? "message message-user" : "message message-assistant";

  return (
    <div className={containerClass} role={isUser ? "article" : "article"}>
      <div className="message-bubble">
        <div className="message-content">{content}</div>

        {/* If backend returned supporting docs, show small summary links */}
        {Array.isArray(docs) && docs.length > 0 && (
          <div className="message-docs">
            <strong>References:</strong>
            <ul>
              {docs.map((d: any, idx: number) => (
                <li key={d.id ?? idx}>
                  {d.meta?.title ? `${d.meta.title}` : d.id}
                  {d.meta?.url ? (
                    <>
                      {" — "}
                      <a href={d.meta.url} target="_blank" rel="noreferrer">
                        link
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
