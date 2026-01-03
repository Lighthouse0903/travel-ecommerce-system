"use client";

import React, { useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useChatRoom } from "@/hooks/useChatRoom";

import MessageBubble from "@/components/common/chat/MessageBubble";
import ChatInput from "@/components/common/chat/ChatInput";

type Props = {
  convId: string;
  agencyName: string;
  agencyAvatarUrl?: string | null;
};

const CustomerChatRoom: React.FC<Props> = ({ convId }) => {
  const { user } = useAuth();
  const currentUserId = user?.user_id ?? null;

  const { isLoading, messages, listRef, text, setText, sendMessage, sendRead } =
    useChatRoom(convId);
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50"
        onMouseEnter={sendRead}
      >
        {isLoading ? (
          <div className="text-sm text-slate-500">Đang tải tin nhắn…</div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-slate-500">Chưa có tin nhắn.</div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.message_id}
              message={m}
              isMine={m.sender.user_id === currentUserId}
            />
          ))
        )}
      </div>

      <ChatInput
        value={text}
        onChange={setText}
        onSend={sendMessage}
        onFocus={sendRead}
      />
    </div>
  );
};

export default CustomerChatRoom;
