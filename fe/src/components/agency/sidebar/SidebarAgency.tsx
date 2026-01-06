"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UserSquare2,
  FolderOpen,
  PlusSquare,
  MessageCircle,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const SidebarAgency = () => {
  const { user } = useAuth();
  const pathname = usePathname() ?? "";

  const links: SidebarItem[] = [
    {
      href: "/agency/dashboard",
      label: "Trang tổng quan",
      icon: LayoutDashboard,
    },
    {
      href: "/agency/dashboard/profile",
      label: "Hồ sơ đại lý",
      icon: UserSquare2,
    },
    {
      href: "/agency/dashboard/tours",
      label: "Tour của tôi",
      icon: FolderOpen,
    },
    {
      href: "/agency/dashboard/tours/create",
      label: "Tạo tour mới",
      icon: PlusSquare,
    },
    {
      href: "/agency/dashboard/chat",
      label: "Chat với khách hàng",
      icon: MessageCircle,
    },
    {
      href: "/agency/dashboard/bookings",
      label: "Đơn đặt tour",
      icon: ShoppingBag,
    },
    {
      href: "/agency/dashboard/revenue",
      label: "Doanh thu & Báo cáo",
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-full h-fit md:sticky md:top-10 rounded-2xl bg-card border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col items-center text-center border-b border-slate-200 pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 ring-1 ring-slate-200 flex items-center justify-center text-xl font-semibold text-slate-700">
          {user?.username?.[0]?.toUpperCase() ?? "A"}
        </div>
        <h2 className="mt-2 font-semibold text-slate-900 truncate max-w-full">
          {user?.full_name || user?.username || "Agency"}
        </h2>
        <p className="text-sm text-slate-500 break-all">{user?.email}</p>
      </div>

      <ul className="space-y-2 w-full">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const classes = isActive
            ? "font-semibold bg-sky-100 text-blue-700 hover:bg-sky-100"
            : "text-slate-700 hover:bg-slate-50";

          const btn = (
            <Button
              variant="ghost"
              disabled={!!item.disabled}
              className={`w-full justify-start rounded-xl ${classes}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );

          return (
            <li key={item.href}>
              {item.disabled ? btn : <Link href={item.href}>{btn}</Link>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarAgency;
