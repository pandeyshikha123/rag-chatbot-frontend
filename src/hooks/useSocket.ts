import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

/**
 * useSocket
 * - If sessionId is provided, the hook connects automatically and joins the room.
 * - Returns a ref to the socket (may be null before connected).
 *
 * Usage:
 * const socketRef = useSocket(sessionId);
 * socketRef.current?.emit('some_event', payload);
 */
export function useSocket(sessionId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const base = process.env.REACT_APP_API_BASE || "http://localhost:4000";
    const socket = io(base, { autoConnect: true });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { sessionId });
    });

    // cleanup on unmount or when sessionId changes
    return () => {
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      } catch (e) {
        // ignore
      }
    };
  }, [sessionId]);

  return socketRef;
}

export default useSocket;
