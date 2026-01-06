"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useChatService } from "@/services/chatService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLoginModal } from "@/contexts/LoginModalContext";

import FloatingChatButton from "./FloatingChatButton";
import FloatingChatWindow from "./FloatingChatWindow";

type Props = {
  agencyUserId?: string;
  agencyName: string;
  agencyAvatarUrl?: string | null;
};

const TourDetailChatWidget: React.FC<Props> = ({
  agencyUserId,
  agencyName,
  agencyAvatarUrl = null,
}) => {
  const { user } = useAuth();
  const { createOrGetConversation } = useChatService();
  const { openLoginModal } = useLoginModal();

  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingStart, setLoadingStart] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const partner = useMemo(
    () => ({
      user_id: agencyUserId ?? "",
      full_name: agencyName,
      avatar_url: agencyAvatarUrl,
    }),
    [agencyUserId, agencyName, agencyAvatarUrl]
  );

  const handleOpen = useCallback(async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để trò chuyện với đại lý");
      openLoginModal();
      return;
    }
    if (!agencyUserId) return;

    setOpen(true);
    setUnreadCount(0);

    if (conversationId) return;

    setLoadingStart(true);
    try {
      const res = await createOrGetConversation(agencyUserId);
      if (res.success) {
        setConversationId(res.data.conversation_id);
      } else {
        toast.error("Không thể bắt đầu cuộc trò chuyện");
      }
    } finally {
      setLoadingStart(false);
    }
  }, [
    user,
    agencyUserId,
    conversationId,
    createOrGetConversation,
    openLoginModal,
  ]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Window animate */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="floating-chat-window"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <FloatingChatWindow
              open={open}
              loadingStart={loadingStart}
              onClose={handleClose}
              conversationId={conversationId}
              partnerName={partner.full_name}
              partnerAvatarUrl={partner.avatar_url}
              onIncomingMessageWhileClosed={() =>
                setUnreadCount((prev) => prev + 1)
              }
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Button nảy nảy nhẹ khi đóng */}
      <motion.div
        animate={
          open ? { y: 0, scale: 1 } : { y: [0, -6, 0], scale: [1, 1.03, 1] }
        }
        transition={
          open
            ? { duration: 0.15 }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <FloatingChatButton
          avatarUrl={partner.avatar_url}
          label={partner.full_name}
          unreadCount={unreadCount}
          disabled={!agencyUserId}
          onClick={handleOpen}
        />
      </motion.div>
    </div>
  );
};

export default TourDetailChatWidget;
