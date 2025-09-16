// src/components/Chat/ChatInterface.tsx
import React, { useState } from "react";
import { useChat } from "../../hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatInterface: React.FC = () => {
  const { messages, sendMessage, reset } = useChat();
  const [pending, setPending] = useState(false);

  const onSend = async (text: string) => {
    setPending(true);
    try {
      await sendMessage(text);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>RAG News Chatbot</h2>
        <button onClick={reset} className="reset-btn">Reset Session</button>
      </header>
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} disabled={pending} />
    </div>
  );
};

export default ChatInterface;
