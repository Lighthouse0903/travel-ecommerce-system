import SidebarChat from "@/components/agency/sidebar/SidebarChat";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex items-center justify-center gap-3">
      <div className="w-[40%] bg-slate-500">
        <SidebarChat />
      </div>
      <div className="flex-1 bg-red-600"> {children}</div>
    </div>
  );
}
