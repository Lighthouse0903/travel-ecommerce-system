"use client";

import React from "react";
import type { MessageSummary } from "@/types/chat";
import { formatTimeHHMM } from "@/utils/formatTime";

type Props = {
  message: MessageSummary;
  isMine: boolean;
};

const MessageBubble: React.FC<Props> = ({ message, isMine }) => {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[70%]">
        <div
          className={`rounded-2xl px-3 py-2 text-sm break-words ${
            isMine ? "bg-sky-500 text-white" : "bg-white border text-slate-900"
          }`}
        >
          {message.content}
        </div>

        <div
          className={`mt-1 text-[11px] text-slate-400 ${
            isMine ? "text-right" : "text-left"
          }`}
        >
          {formatTimeHHMM(message.created_at)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
