"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  avatarUrl: string;
  onClick: () => void;
};

const BotFloatingButton: React.FC<Props> = ({ onClick, avatarUrl }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Chat với trợ lý AI"
      title="Chat với trợ lý AI"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-primary text-white
        shadow-xl
        flex items-center justify-center
        text-2xl
        hover:scale-105 active:scale-95
        transition
      "
    >
      <Avatar className="w-14 h-14 border">
        <AvatarImage src={avatarUrl} alt="AI Assistant" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
    </button>
  );
};
export default BotFloatingButton;
