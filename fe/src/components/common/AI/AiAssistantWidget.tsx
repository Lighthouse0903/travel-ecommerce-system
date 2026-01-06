"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import BotFloatingButton from "./BotFloatingButton";
import BotChatWindow, { BotMessage } from "./BotChatWindow";
import { sendMessageToChatbot } from "@/services/chatbotService";

type Props = {
  avatarUrl: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AiAssistantWidget({ avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: BotMessage = {
      id: crypto.randomUUID(),
      content: input.trim(),
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageToChatbot(userMessage.content);

      const lines = res.answer
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      for (let i = 0; i < lines.length; i++) {
        await sleep(i === 0 ? 450 : 220);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            content: lines[i],
            isBot: true,
            responseTime:
              i === lines.length - 1 ? res.response_time : undefined,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "Có lỗi xảy ra, vui lòng thử lại.",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  return (
    <>
      {/* Floating button: nảy nảy khi chưa mở */}
      <motion.div
        className="fixed bottom-0 right-0 z-50"
        animate={
          open ? { y: 0, scale: 1 } : { y: [0, -15, 0], scale: [1, 1.03, 1] }
        }
        transition={
          open
            ? { duration: 0.15 }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <BotFloatingButton
          avatarUrl={avatarUrl}
          onClick={() => setOpen(true)}
        />
      </motion.div>

      {/* Window: animate open/close */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="bot-window"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <BotChatWindow
              open={open}
              avatarUrl={avatarUrl}
              messages={messages}
              loading={loading}
              input={input}
              onInputChange={setInput}
              onSend={handleSend}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
