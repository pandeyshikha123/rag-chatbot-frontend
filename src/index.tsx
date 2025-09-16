// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import ChatInterface from "./components/Chat/ChatInterface";
import "./styles/globals.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ChatInterface />
  </React.StrictMode>
);
