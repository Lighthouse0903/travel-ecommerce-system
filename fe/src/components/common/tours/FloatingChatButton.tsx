"use client";

import React from "react";
import Image from "next/image";

type Props = {
  avatarUrl?: string | null;
  label: string;
  unreadCount?: number;
  disabled?: boolean;
  onClick: () => void;
};

const FloatingChatButton: React.FC<Props> = ({
  avatarUrl,
  label,
  unreadCount = 0,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={`Chat với ${label}`}
      className={`
        relative
        flex items-center justify-center
        w-14 h-14 rounded-full shadow-lg
        transition-all
      `}
    >
      {/* Avatar */}
      {avatarUrl ? (
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-slate-200">
          <Image
            src={avatarUrl}
            alt={label}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <span className="text-white font-semibold text-lg">
          {label.charAt(0).toUpperCase()}
        </span>
      )}

      {/* Unread badge */}
      {!disabled && unreadCount > 0 && (
        <span
          className="
            absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1
            flex items-center justify-center
            rounded-full bg-red-500 text-white text-[11px] font-semibold
          "
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default FloatingChatButton;
