import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import DashboardAgencySidebar from "@/components/agency/sidebar/Sidebar";
import PageTransition from "@/components/common/animations/PageTransition";

export default function AgencyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full bg-background flex justify-center items-start">
      <div className="w-[99%] md:w-[95%] flex flex-col md:flex-row gap-1 md:gap-5 px-0 my-6">
        {/* Mobile Sidebar Trigger */}
        <div className="flex items-center justify-between md:hidden mb-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border border-slate-200 bg-card shadow-sm"
              >
                <Menu className="h-5 w-5 text-slate-700" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[80%] sm:w-[60%] p-0 z-[150] bg-card border-r border-slate-200"
            >
              <SheetHeader className="px-4 py-3 border-b border-slate-200">
                <SheetTitle className="text-lg font-semibold text-slate-900">
                  Bảng điều khiển đại lý
                </SheetTitle>
              </SheetHeader>

              <div className="p-4">
                <DashboardAgencySidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-[25%] sticky top-6 self-start">
          <div className="rounded-2xl bg-card border border-slate-200 shadow-sm">
            <DashboardAgencySidebar />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 rounded-2xl bg-card border border-slate-200 shadow-sm">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
