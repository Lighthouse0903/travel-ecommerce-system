"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  ShoppingBag,
  CreditCard,
  Building2,
  Bandage,
  RotateCcwKey,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";
import Link from "next/link";

type SidebarItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
};

const SidebarClient = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { loading, profile } = useAgencyProfile();

  const links: SidebarItem[] = [
    { href: "/dashboard/profile", label: "Thông tin cá nhân", icon: User },
    { href: "/dashboard/orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
    // { href: "/dashboard/favorites", label: "Yêu thích", icon: Heart },
    // {
    //   href: "/dashboard/billing",
    //   label: "Thanh toán & Hóa đơn",
    //   icon: CreditCard,
    // },
    {
      href: "/dashboard/change_password",
      label: "Đổi mật khẩu",
      icon: RotateCcwKey,
    },
  ];

  const agencyLink: SidebarItem = (() => {
    if (loading) {
      return {
        href: "/dashboard/register_agency/terms",
        label: "Đang kiểm tra đại lý...",
        icon: Bandage,
        disabled: true,
      };
    }
    if (!profile) {
      return {
        href: "/dashboard/register_agency/terms",
        label: "Đăng ký đại lý",
        icon: Bandage,
      };
    }

    if (profile.status === "approved") {
      return {
        href: "/agency/dashboard",
        label: "Đại lý của bạn",
        icon: Building2,
      };
    }

    return {
      href: "/dashboard/register_agency/status",
      label: "Trạng thái đăng ký đại lý",
      icon: Bandage,
    };
  })();

  const allLinks = [...links, agencyLink];

  return (
    <div className="w-full h-fit md:sticky md:top-10 rounded-2xl bg-card border border-slate-200 shadow-sm p-4">
      <div className="flex flex-col items-center text-center border-b border-slate-200 pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-sky-50 ring-1 ring-slate-200 flex items-center justify-center text-xl font-semibold text-slate-700">
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <h2 className="mt-2 font-semibold text-slate-900">{user?.full_name}</h2>
        <p className="text-sm text-slate-500 break-all">{user?.email}</p>
      </div>

      <ul className="space-y-2 w-full">
        {allLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const btn = (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              disabled={!!item.disabled}
              className={`w-full justify-start rounded-xl ${
                isActive
                  ? "font-semibold bg-sky-100 text-blue-700 hover:bg-sky-100"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          );

          return (
            <li key={item.href}>
              {item.disabled ? (
                btn
              ) : (
                <Link href={item.href} prefetch>
                  {btn}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarClient;
