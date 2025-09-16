// src/types/chat.ts
export type Role = "user" | "assistant" | "system";

export interface Message {
  id?: string;
  role: Role;
  content: string;
  createdAt?: string;
}
