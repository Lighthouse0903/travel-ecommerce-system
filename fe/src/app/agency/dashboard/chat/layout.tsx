import SidebarChat from "@/components/common/chat/SidebarChat";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex items-start justify-center gap-3 h-[calc(90vh-80px)]">
      <div className="w-[40%] overflow-hidden">
        <SidebarChat />
      </div>
      <div className="flex-1 h-full"> {children}</div>
    </div>
  );
}
