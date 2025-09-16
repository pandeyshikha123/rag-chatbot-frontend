// src/components/Chat/Message.tsx
import React from "react";
import type { Message } from "../../types/chat";

const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`message ${message.role}`} aria-label={message.role}>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

export default MessageComponent;
