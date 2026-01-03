import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SideBar from "@/components/customer/sidebar/Sidebar";
import PageTransition from "@/components/common/animations/PageTransition";

export default function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-[99%] md:w-[95%] flex flex-col md:flex-row gap-1 md:gap-5 px-0 mt-6">
        {/* Mobile Sidebar Trigger */}
        <div className="flex items-center justify-between md:hidden mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border border-gray-300 shadow-sm"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[80%] sm:w-[60%] p-0 z-[150]"
            >
              <SheetHeader className="px-4 py-3 border-b">
                <SheetTitle className="text-lg font-semibold">
                  Bảng điều khiển
                </SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <SideBar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-[25%] sticky top-6 self-start">
          <div className="rounded-xl bg-white">
            <SideBar />
          </div>
        </aside>
        {/* Main content */}
        <div className="flex-1 rounded-xl bg-slate-50 shadow-xl">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
