"use client";

import React from "react";
import Image from "next/image";

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

  return (
    <div
      className="
        w-[380px] h-[560px]
        bg-white rounded-xl shadow-2xl
        border overflow-hidden
      "
    >
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {partnerAvatarUrl ? (
            <Image
              src={partnerAvatarUrl}
              alt={partnerName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-semibold">
              {partnerName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900">{partnerName}</span>
            {conversationId && (
              <span className="text-xs text-slate-400">
                #{conversationId.slice(0, 8).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-700 text-xl leading-none"
          aria-label="Đóng chat"
        >
          ×
        </button>
      </div>

      <div className="h-[calc(560px-57px)]">
        {loadingStart ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Đang mở cuộc trò chuyện…
          </div>
        ) : conversationId ? (
          <CustomerChatRoom
            agencyName={partnerName}
            agencyAvatarUrl={partnerAvatarUrl}
            convId={conversationId}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Không thể mở cuộc trò chuyện
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingChatWindow;
