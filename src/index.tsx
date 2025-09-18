// // src/index.tsx
// import React from "react";
// import ReactDOM from "react-dom/client";
// import ChatInterface from "./components/Chat/ChatInterface";
// import "./styles/globals.scss";
// import "./index.css";


// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <ChatInterface />
//   </React.StrictMode>
// );
// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";    // <- MAKE SURE THIS LINE IS PRESENT

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
