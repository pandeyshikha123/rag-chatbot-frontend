// src/services/api.ts
import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_BASE as string) || "http://localhost:4000";

type SessionResponse = { sessionId: string };
type SendMessageResponse = {
  reply: string;
  docs?: Array<any>;
};
type SearchResponse = {
  docs: Array<{
    id: string;
    score?: number;
    text?: string;
    meta?: any;
  }>;
};

export async function createSession(): Promise<string> {
  const r = await axios.post<SessionResponse>(`${API_BASE}/api/session`);
  return r.data.sessionId;
}

export async function getSessionHistory(sessionId: string) {
  const r = await axios.get(`${API_BASE}/api/session/${sessionId}`);
  return r.data.history;
}

export async function sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
  const r = await axios.post<SendMessageResponse>(`${API_BASE}/api/chat/message`, { sessionId, message });
  return r.data;
}

export async function resetSession(sessionId: string) {
  const r = await axios.delete(`${API_BASE}/api/session/${sessionId}`);
  return r.data;
}

/**
 * search - optional utility to call backend vector search directly.
 * Backend expects POST /api/search { query, k }
 */
export async function search(query: string, k = 5): Promise<SearchResponse> {
  const r = await axios.post<SearchResponse>(`${API_BASE}/api/search`, { query, k });
  return r.data;
}

export default {
  createSession,
  getSessionHistory,
  sendMessage,
  resetSession,
  search,
};
