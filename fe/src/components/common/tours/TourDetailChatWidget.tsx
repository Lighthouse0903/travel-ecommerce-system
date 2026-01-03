"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loadingStart, setLoadingStart] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { openLoginModal } = useLoginModal();

  const partner = useMemo(
    () => ({
      user_id: agencyUserId ?? "",
      full_name: agencyName,
      avatar_url: agencyAvatarUrl,
    }),
    [agencyUserId, agencyName, agencyAvatarUrl]
  );

  // click vào buttonchat
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
  }, [user, agencyUserId, conversationId]);

  // handle đóng
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) setUnreadCount(0);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      <FloatingChatWindow
        open={open}
        loadingStart={loadingStart}
        onClose={handleClose}
        conversationId={conversationId}
        partnerName={partner.full_name}
        partnerAvatarUrl={partner.avatar_url}
        onIncomingMessageWhileClosed={() => setUnreadCount((prev) => prev + 1)}
      />

      <FloatingChatButton
        avatarUrl={partner.avatar_url}
        label={partner.full_name}
        unreadCount={unreadCount}
        disabled={!agencyUserId}
        onClick={handleOpen}
      />
    </div>
  );
};
export default TourDetailChatWidget;
