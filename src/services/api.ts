// src/services/api.ts
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export async function createSession(): Promise<string> {
  const r = await axios.post(`${API_BASE}/api/session`);
  return r.data.sessionId;
}

export async function getSessionHistory(sessionId: string) {
  const r = await axios.get(`${API_BASE}/api/session/${sessionId}`);
  return r.data.history;
}

export async function sendMessage(sessionId: string, message: string) {
  const r = await axios.post(`${API_BASE}/api/chat/message`, { sessionId, message });
  return r.data;
}

export async function resetSession(sessionId: string) {
  const r = await axios.delete(`${API_BASE}/api/session/${sessionId}`);
  return r.data;
}
