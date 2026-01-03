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
    // load lần đầu
    fetchData(true);

    // refresh khi quay lại tab
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
    <div className="h-full w-full bg-slate-50 text-gray-900 p-3 rounded-tl-xl border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Tin nhắn</h2>
        <button
          onClick={handleManualRefresh}
          className="text-xs px-2 py-1 rounded-full border border-slate-300 hover:bg-slate-100"
        >
          Làm mới
        </button>
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto h-[calc(100%-40px)]">
        {/* Skeleton */}
        {isLoading && convs.length === 0 ? (
          <SidebarChatSkeleton count={5} />
        ) : (
          <>
            {convs.map((item) => (
              <SidebarChatItem
                key={item.conversation_id} // ✅ dùng id, không dùng idx
                item={item}
                currentUserId={currentUserId}
                hrefPrefix="/agency/dashboard/chat"
              />
            ))}

            {/* empty state */}
            {!isLoading && convs.length === 0 && (
              <div className="text-sm text-slate-500 p-3">
                Chưa có cuộc trò chuyện nào.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default SidebarChat;
