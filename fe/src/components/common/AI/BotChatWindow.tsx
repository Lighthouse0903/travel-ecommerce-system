"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";

export type BotMessage = {
  id: string;
  content: string;
  isBot: boolean;
  responseTime?: number;
};

type Props = {
  open: boolean;
  avatarUrl: string;
  messages: BotMessage[];
  loading: boolean;
  input: string;

  onInputChange: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
};

const BotChatWindow: React.FC<Props> = ({
  open,
  avatarUrl,
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onClose,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-[90px] z-50 w-[360px] max-w-[95vw]">
      <Card className="rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-9 h-9">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="font-semibold">Trợ lý AI</div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        {/* Body */}
        <CardContent className="h-[300px] bg-slate-50 p-3 space-y-2 overflow-y-auto text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`
    max-w-[80%] px-3 py-2 rounded-xl
    ${
      msg.isBot
        ? "bg-white text-slate-900 border rounded-bl-none"
        : "bg-[#1877F2] text-white rounded-br-none"
    }
  `}
              >
                <div>{msg.content}</div>

                {msg.isBot && msg.responseTime !== undefined && (
                  <div className="mt-1 text-[10px] text-slate-400">
                    ⏱ {msg.responseTime}s
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-xs text-muted-foreground">
              🤖 Bot đang trả lời...
            </div>
          )}

          <div ref={bottomRef} />
        </CardContent>

        {/* Footer */}
        <div className="p-3 border-t flex gap-2">
          <Input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Nhập câu hỏi..."
            disabled={loading}
          />
          <Button
            onClick={onSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="
    bg-[#1877F2] hover:bg-[#166FE5]
    disabled:opacity-50
    shrink-0
  "
          >
            <SendHorizonal className="w-4 h-4 text-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BotChatWindow;
