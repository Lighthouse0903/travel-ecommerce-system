"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ConversationSummary } from "@/types/chat";
import { useChatService } from "@/services/chatService";
import { useAuth } from "@/contexts/AuthContext";

import SidebarChatItem from "./SidebarChatItem";
import SidebarChatSkeleton from "./SidebarChatSkeleton";

const SidebarChat: React.FC = () => {
  const [convs, setConvs] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getListConversations } = useChatService();
  const { user } = useAuth();
  const currentUserId = user?.user_id ?? null;

  const isMountedRef = useRef(true);

  const fetchData = async (showLoading: boolean) => {
    if (!user) return;
    if (showLoading) setIsLoading(true);

    try {
      const res = await getListConversations();
      if (!isMountedRef.current) return;

      if (res.success) {
        setConvs(res.data);
      } else {
        toast.error("Lỗi khi lấy danh sách hội thoại");
      }
    } finally {
      if (showLoading && isMountedRef.current) setIsLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (!user) return;

    fetchData(true);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      isMountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const handleManualRefresh = async () => {
    await fetchData(true);
  };

  return (
    <div className="h-full w-full rounded-tl-xl border border-border bg-card text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-3">
        <div className="leading-tight">
          <h2 className="text-base font-semibold">Tin nhắn</h2>
          <p className="text-xs text-muted-foreground">
            Danh sách hội thoại gần đây
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition hover:bg-muted/40"
        >
          Làm mới
        </button>
      </div>

      {/* List */}
      <div className="h-[calc(100%-64px)] overflow-y-auto p-2">
        {isLoading && convs.length === 0 ? (
          <SidebarChatSkeleton count={5} />
        ) : convs.length > 0 ? (
          <div className="flex flex-col gap-1">
            {convs.map((item) => (
              <SidebarChatItem
                key={item.conversation_id}
                item={item}
                currentUserId={currentUserId}
                hrefPrefix="/agency/dashboard/chat"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
            Chưa có cuộc trò chuyện nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarChat;
