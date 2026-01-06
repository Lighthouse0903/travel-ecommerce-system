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
    <div className="flex h-[calc(95vh-120px)] flex-col overflow-hidden rounded-tr-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-primary/20 bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-semibold uppercase">
          {partnerInitial}
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold">{partnerName}</span>
          {partnerIdShort ? (
            <span className="text-xs opacity-80">@{partnerIdShort}</span>
          ) : null}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 space-y-2 overflow-y-auto bg-muted/30 p-4"
        onMouseEnter={sendRead}
      >
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Đang tải tin nhắn…
          </div>
        ) : messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">Chưa có tin nhắn.</div>
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

      {/* Input */}
      <div className="border-t border-border bg-card">
        <ChatInput
          value={text}
          onChange={setText}
          onSend={sendMessage}
          onFocus={sendRead}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
