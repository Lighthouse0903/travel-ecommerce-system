"use client";

import React from "react";
import Image from "next/image";
import { ConversationSummary } from "@/types/chat";

export const mockConversations: ConversationSummary[] = [
  {
    partner_id: "user-001",
    partner_name: "Nguyễn Văn An",
    partner_avatar:
      "https://i.pinimg.com/736x/c7/f4/db/c7f4dbb40b978ecbb7a95d13f32d0001.jpg",
    last_message: "Anh ơi tour này còn chỗ không ạ?",
    last_time: "2025-11-20T10:12:00+07:00",
    unread_count: 2,
    isOnline: true,
  },
  {
    partner_id: "user-002",
    partner_name: "Trần Thị Bích",
    partner_avatar:
      "https://i.pinimg.com/736x/c7/f4/db/c7f4dbb40b978ecbb7a95d13f32d0001.jpg",
    last_message: "Cảm ơn bạn nhiều nhé!",
    last_time: "2025-11-19T18:45:00+07:00",
    unread_count: 0,
    isOnline: false,
  },
  {
    partner_id: "user-003",
    partner_name: "Hoàng Minh",
    partner_avatar:
      "https://i.pinimg.com/736x/c7/f4/db/c7f4dbb40b978ecbb7a95d13f32d0001.jpg",
    last_message: "Lịch trình ngày 2 thế nào bạn?",
    last_time: "2025-11-18T09:30:00+07:00",
    unread_count: 5,
    isOnline: true,
  },
  {
    partner_id: "user-004",
    partner_name: "Chi Travel Agency",
    partner_avatar:
      "https://i.pinimg.com/736x/c7/f4/db/c7f4dbb40b978ecbb7a95d13f32d0001.jpg",
    last_message: "Ok em nhé!",
    last_time: "2025-11-17T14:20:00+07:00",
    unread_count: 0,
    isOnline: false,
  },
  {
    partner_id: "user-005",
    partner_name: "Đại lý Miền Bắc",
    partner_avatar:
      "https://i.pinimg.com/736x/c7/f4/db/c7f4dbb40b978ecbb7a95d13f32d0001.jpg",
    last_message: "Hóa đơn đã gửi bạn qua email nhé.",
    last_time: "2025-11-16T20:10:00+07:00",
    unread_count: 1,
    isOnline: false,
  },
];

const SidebarChat = () => {
  return (
    <div className="h-full w-full bg-slate-900 text-white p-3">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-3">Tin nhắn</h2>

      {/* List conversations */}
      <div className="flex flex-col gap-1 overflow-y-auto h-[calc(100%-40px)]">
        {mockConversations.map((item) => {
          const timeLabel = item.last_time
            ? new Date(item.last_time).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={item.partner_id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              {/* Avatar + online dot */}
              <div className="relative">
                <Image
                  src={item.partner_avatar ?? "/avatar.png"}
                  width={45}
                  height={45}
                  alt={item.partner_name}
                  className="rounded-full object-cover"
                />

                {item.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <span className="font-medium text-[15px]">
                  {item.partner_name}
                </span>

                <span className="text-xs text-slate-400 truncate max-w-[160px]">
                  {item.last_message}
                </span>
              </div>

              {/* Time + unread badge */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-slate-500">{timeLabel}</span>

                {item.unread_count && item.unread_count > 0 && (
                  <span className="bg-blue-500 text-white text-[11px] px-2 py-[2px] rounded-full">
                    {item.unread_count}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SidebarChat;
