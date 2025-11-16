"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  UserSquare2,
  FolderOpen,
  PlusSquare,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const SidebarClient = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const links = [
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
      href: "/agency/dashboard/bookings",
      label: "Đơn đặt tour",
      icon: ShoppingBag,
    },
    {
      href: "/agency/dashboard/statistics",
      label: "Doanh thu & Báo cáo",
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-full bg-slate-50 shadow-md rounded-xl p-4 h-fit md:sticky md:top-10">
      {/* Thông tin đại lý */}
      <div className="flex flex-col items-center text-center border-b pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
          {user?.username?.[0]?.toUpperCase() ?? "A"}
        </div>
        <h2 className="mt-2 font-semibold truncate">{user?.username}</h2>
        <p className="text-sm text-gray-500 break-all">{user?.email}</p>
      </div>

      {/* Menu chức năng */}
      <ul className="space-y-2 w-full">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link href={item.href} prefetch>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start truncate ${
                    isActive ? "font-semibold" : ""
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" /> {item.label}
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarClient;
