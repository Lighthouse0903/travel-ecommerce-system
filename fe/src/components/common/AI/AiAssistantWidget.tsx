"use client";

import { useState } from "react";
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: BotMessage = {
      id: crypto.randomUUID(),
      content: input,
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
        await sleep(i === 0 ? 500 : 250);

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
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: "❌ Có lỗi xảy ra, vui lòng thử lại.",
          isBot: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BotFloatingButton avatarUrl={avatarUrl} onClick={() => setOpen(true)} />

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
    </>
  );
}
