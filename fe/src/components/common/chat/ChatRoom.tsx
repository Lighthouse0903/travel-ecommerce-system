"use client";

import React, { useMemo } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useChatRoom } from "@/hooks/useChatRoom";

import MessageBubble from "@/components/common/chat/MessageBubble";
import ChatInput from "@/components/common/chat/ChatInput";
import { shortCode } from "@/utils/formatID";

type Props = {
  convId: string;
};

const ChatRoom: React.FC<Props> = ({ convId }) => {
  const { user } = useAuth();
  const currentUserId = user?.user_id ?? null;

  const {
    partnerName,
    partnerInitial,
    isLoading,
    messages,
    listRef,
    text,
    setText,
    sendMessage,
    sendRead,
  } = useChatRoom(convId);

  const partnerIdShort = useMemo(() => {
    if (!currentUserId) return null;
    const other = messages.find(
      (m) => m.sender.user_id !== currentUserId
    )?.sender;
    if (!other?.user_id) return null;
    return shortCode(other.user_id);
  }, [messages, currentUserId]);

  return (
    <div className="h-[calc(95vh-120px)] flex flex-col rounded-tr-xl bg-white border overflow-hidden">
      {/* header */}
      <div className="px-4 py-3 border-b flex items-center gap-3 bg-white">
        <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-semibold">
          {partnerInitial}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-slate-900">{partnerName}</span>
          {partnerIdShort && (
            <span className="text-xs text-slate-400">@{partnerIdShort}</span>
          )}
        </div>
      </div>

      {/* MEssages */}
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

      {/* Button */}
      <ChatInput
        value={text}
        onChange={setText}
        onSend={sendMessage}
        onFocus={sendRead}
      />
    </div>
  );
};

export default ChatRoom;
