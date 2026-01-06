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

  const initial = partnerName.charAt(0).toUpperCase();

  return (
    <Link href={`${hrefPrefix}/${item.conversation_id}`} className="block">
      <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-muted/40">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {initial}
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[15px] font-semibold text-foreground">
              {item.partner?.full_name || "Người dùng"}
            </span>

            <span className="shrink-0 text-[11px] text-muted-foreground">
              {timeLabel}
            </span>
          </div>

          <div className="mt-0.5 flex items-center justify-between gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {lastPreview}
            </span>

            {unread > 0 ? (
              <span className="shrink-0 rounded-full bg-primary px-2 py-[2px] text-[11px] text-primary-foreground">
                {unread}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SidebarChatItem;
