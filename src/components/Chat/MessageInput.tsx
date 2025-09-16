// src/components/Chat/MessageInput.tsx
import React, { useState } from "react";

interface Props {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

const MessageInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [value, setValue] = useState("");

  const send = async () => {
    if (!value.trim()) return;
    await onSend(value.trim());
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) === false && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="message-input">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        placeholder="Type your question about the news..."
        disabled={disabled}
      />
      <button onClick={send} disabled={disabled || !value.trim()}>Send</button>
    </div>
  );
};

export default MessageInput;
