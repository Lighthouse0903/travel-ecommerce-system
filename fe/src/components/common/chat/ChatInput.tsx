"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const ChatInput: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  onFocus,
  placeholder = "Nhập tin nhắn…",
  disabled = false,
}) => {
  return (
    <div className="p-3 border-t flex gap-2 bg-white">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        disabled={disabled}
        className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none disabled:bg-slate-100 disabled:text-slate-400"
        placeholder={placeholder}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500"
      >
        Gửi
      </button>
    </div>
  );
};
export default ChatInput;
