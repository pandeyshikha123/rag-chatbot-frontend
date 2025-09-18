// src/components/Chat/MessageList.tsx
import React from "react";
import type { ChatMessage } from "../../hooks/useChat";
import MessageComponent from "./Message";

type Props = {
  messages: ChatMessage[];
};

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.map((m, idx) => (
        <MessageComponent key={m.id ?? idx} message={m} />
      ))}
    </div>
  );
};

export default MessageList;
