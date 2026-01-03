"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import type { ConversationSummary } from "@/types/chat";
import { formatTimeHHMM } from "@/utils/formatTime";

type Props = {
  item: ConversationSummary;
  currentUserId?: string | null;
  hrefPrefix?: string;
};

const SidebarChatItem: React.FC<Props> = ({
  item,
  currentUserId,
  hrefPrefix = "/agency/dashboard/chat",
}) => {
  const partnerName = item.partner?.username || "U";
  const lastTime = item.last_message?.created_at ?? item.updated_at ?? "";
  const timeLabel = formatTimeHHMM(lastTime);
  const unread = item.unread_count ?? 0;

  const lastMsg = item.last_message;
  const isMine = !!(lastMsg && lastMsg.sender?.user_id === currentUserId);

  const lastPreview = useMemo(() => {
    if (!lastMsg) return "Chưa có tin nhắn nào";
    return `${isMine ? "Bạn: " : ""}${lastMsg.content}`;
  }, [lastMsg, isMine]);

  return (
    <Link href={`${hrefPrefix}/${item.conversation_id}`}>
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition cursor-pointer">
        {/* Avatar */}
        <div className="relative">
          <div className="w-[45px] h-[45px] rounded-full bg-slate-400 flex items-center justify-center text-white font-semibold text-sm">
            {partnerName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* infor */}
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="font-semibold text-[15px] text-slate-900">
            {item.partner?.full_name}
          </span>
          <span className="text-xs text-slate-400 truncate">{lastPreview}</span>
        </div>

        {/* time và unread */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] text-slate-500">{timeLabel}</span>

          {unread > 0 && (
            <span className="bg-blue-500 text-white text-[11px] px-2 py-[2px] rounded-full">
              {unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default SidebarChatItem;
