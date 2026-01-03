"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { useChatService } from "@/services/chatService";
import type { MessageSummary, WsMessageEvent } from "@/types/chat";

type UseChatRoomReturn = {
  messages: MessageSummary[];
  isLoading: boolean;
  text: string;
  setText: (val: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  partnerName: string;
  partnerInitial: string;
  wsReady: boolean;
  sendMessage: () => void;
  sendRead: () => void;
};

export function useChatRoom(convId: string): UseChatRoomReturn {
  const { user, access } = useAuth();
  const currentUserId = user?.user_id ?? null;

  const { getAllMessagesInConversation } = useChatService();

  const [messages, setMessages] = useState<MessageSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [wsReady, setWsReady] = useState(false);

  // partnerName
  const partner = useMemo(() => {
    if (!currentUserId) return null;
    return (
      messages.find((m) => m.sender.user_id !== currentUserId)?.sender || null
    );
  }, [messages, currentUserId]);

  const partnerName = useMemo(() => {
    return partner?.full_name || partner?.username || "Cuộc hội thoại";
  }, [partner]);

  const partnerInitial = useMemo(() => {
    return (partner?.username || "U").charAt(0).toUpperCase();
  }, [partner]);

  // Load lịch sử messages bằng API
  useEffect(() => {
    if (!user) return;
    if (!convId) return;

    let alive = true;

    const fetchAllMessage = async () => {
      setIsLoading(true);
      try {
        const res = await getAllMessagesInConversation(convId);
        if (!alive) return;

        if (res.success) {
          setMessages(res.data);
        } else {
          toast.error("Không lấy được tin nhắn");
        }
      } catch (e) {
        if (!alive) return;
        console.log(e);
        toast.error("Lỗi hệ thống khi tải tin nhắn");
      } finally {
        if (alive) setIsLoading(false);
      }
    };

    fetchAllMessage();

    return () => {
      alive = false;
    };
  }, [user, convId]);

  //  Auto scroll xuống cuối khi messages đổi
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  //  Connect WebSocket + handle message/read
  useEffect(() => {
    if (!user) return;
    if (!convId) return;
    if (!access) return;

    // reset trạng thái
    setWsReady(false);

    // đóng ws cũ nếu có
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${convId}/?token=${access}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsReady(true);
      // mở phòng thì gửi read
      ws.send(JSON.stringify({ type: "read" }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as WsMessageEvent;

        if (payload.type === "message") {
          setMessages((prev) => [...prev, payload.data]);
          return;
        }

        if (payload.type === "read") {
          // partner đọc -> mark các tin của mình là read
          if (payload.reader_id !== currentUserId && currentUserId) {
            setMessages((prev) =>
              prev.map((m) =>
                m.sender.user_id === currentUserId ? { ...m, is_read: true } : m
              )
            );
          }
          return;
        }
      } catch (e) {
        console.warn("WS parse error:", e);
      }
    };

    ws.onclose = () => {
      setWsReady(false);
    };

    ws.onerror = (e) => {
      console.log("WS error", e);
      setWsReady(false);
    };

    return () => {
      ws.close();
    };
  }, [user, convId, access, currentUserId]);

  const sendMessage = () => {
    const ws = wsRef.current;
    const content = text.trim();

    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (!content) return;

    ws.send(JSON.stringify({ type: "message", content }));
    setText("");
  };

  const sendRead = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "read" }));
  };

  return {
    messages,
    isLoading,
    text,
    setText,
    listRef,
    partnerName,
    partnerInitial,
    wsReady,
    sendMessage,
    sendRead,
  };
}
