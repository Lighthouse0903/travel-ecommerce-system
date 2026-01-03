"use client";

import React from "react";
import { SlCursor } from "react-icons/sl";

const Chat = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-xl">
      <div className="flex flex-col items-center gap-4 md:gap-6 select-none px-4">
        {/* Icon tròn */}
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-white border flex items-center justify-center shadow-inner">
            <SlCursor className="text-3xl bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          <p className="text-gray-800 text-base sm:text-lg font-medium tracking-wide">
            Chưa chọn cuộc trò chuyện nào
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs">
            Hãy chọn một hội thoại ở danh sách bên trái để xem nội dung tin nhắn
            và trả lời khách hàng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
