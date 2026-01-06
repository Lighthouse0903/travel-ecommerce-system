"use client";

import { useEffect, useRef } from "react";
import { X, SendHorizonal } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const inputClass =
  "bg-background border-border focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0";

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
      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-primary/20 bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 ring-2 ring-primary-foreground/20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary-foreground/15 text-primary-foreground">
                AI
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight">
              <div className="text-sm font-semibold">Trợ lý AI</div>
              <div className="text-xs opacity-80">
                Hỏi đáp tour & hỗ trợ nhanh
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        {/* Body */}
        <CardContent className="h-[300px] space-y-2 overflow-y-auto bg-muted/30 p-3 text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={[
                  "max-w-[80%] rounded-xl px-3 py-2",
                  msg.isBot
                    ? "border border-border bg-background text-foreground rounded-bl-none"
                    : "bg-primary text-primary-foreground rounded-br-none",
                ].join(" ")}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.isBot && msg.responseTime !== undefined ? (
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    ⏱ {msg.responseTime}s
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="text-xs text-muted-foreground">
              🤖 Bot đang trả lời...
            </div>
          ) : null}

          <div ref={bottomRef} />
        </CardContent>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border bg-card p-3">
          <Input
            className={inputClass}
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
            className="shrink-0"
          >
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BotChatWindow;
