// src/components/Chat/MessageList.tsx
import React from "react";
import type { Message } from "../../types/chat";
import MessageComponent from "./Message";

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="message-list" role="log" aria-live="polite">
      {messages.map((m, idx) => <MessageComponent key={m.id ?? idx} message={m} />)}
    </div>
  );
};

export default MessageList;
