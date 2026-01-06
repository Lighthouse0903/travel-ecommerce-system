"use client";

import React from "react";
import { SendHorizonal } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onFocus?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const inputClass =
  "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none " +
  "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 " +
  "disabled:bg-muted/40 disabled:text-muted-foreground";

const ChatInput: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  onFocus,
  placeholder = "Nhập tin nhắn…",
  disabled = false,
}) => {
  return (
    <div className="flex gap-2 border-t border-border bg-card p-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={disabled}
        className={inputClass}
        placeholder={placeholder}
      />

      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="
          flex items-center justify-center
          rounded-lg
          bg-primary px-4 py-2
          text-sm text-primary-foreground
          transition
          hover:bg-primary/90
          disabled:bg-muted
          disabled:text-muted-foreground
        "
        aria-label="Gửi tin nhắn"
      >
        <SendHorizonal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatInput;
