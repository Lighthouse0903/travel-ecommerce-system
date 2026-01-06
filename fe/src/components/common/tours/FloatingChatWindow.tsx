"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

import CustomerChatRoom from "../chat/CustomerChatRoom";

type Props = {
  open: boolean;
  loadingStart: boolean;
  conversationId: string | null;

  partnerName: string;
  partnerAvatarUrl?: string | null;

  onClose: () => void;

  onIncomingMessageWhileClosed?: () => void;
};

const FloatingChatWindow: React.FC<Props> = ({
  open,
  loadingStart,
  conversationId,
  partnerName,
  partnerAvatarUrl,
  onClose,
}) => {
  if (!open) return null;

  const initial = partnerName?.charAt(0)?.toUpperCase() || "U";
  const shortId = conversationId
    ? conversationId.slice(0, 8).toUpperCase()
    : null;

  return (
    <div className="h-[560px] w-[380px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-primary/20 bg-primary px-4 py-3 text-primary-foreground">
        <div className="flex items-center gap-3">
          {partnerAvatarUrl ? (
            <Image
              src={partnerAvatarUrl}
              alt={partnerName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 text-sm font-semibold">
              {initial}
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <span className="font-semibold">{partnerName}</span>
            {shortId ? (
              <span className="text-xs opacity-80">#{shortId}</span>
            ) : null}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Đóng chat"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground transition hover:bg-primary-foreground/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="h-[calc(560px-57px)] bg-background">
        {loadingStart ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Đang mở cuộc trò chuyện…
          </div>
        ) : conversationId ? (
          <CustomerChatRoom
            agencyName={partnerName}
            agencyAvatarUrl={partnerAvatarUrl}
            convId={conversationId}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Không thể mở cuộc trò chuyện
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingChatWindow;
