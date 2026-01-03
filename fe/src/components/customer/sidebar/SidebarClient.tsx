"use client";

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
    { href: "/dashboard/favorites", label: "Yêu thích", icon: Heart },
    {
      href: "/dashboard/billing",
      label: "Thanh toán & Hóa đơn",
      icon: CreditCard,
    },
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
    //  chưa có hồ sơ
    if (!profile) {
      return {
        href: "/dashboard/register_agency/terms",
        label: "Đăng ký đại lý",
        icon: Bandage,
      };
    }

    // Có hồ sơ và đã đc duyệt
    if (profile.status === "approved") {
      return {
        href: "/agency/dashboard",
        label: "Đại lý của bạn",
        icon: Building2,
      };
    }

    // có hò sơ đang chờ duyệt hoặc bị reject
    return {
      href: "/dashboard/register_agency/status",
      label: "Trạng thái đăng ký đại lý",
      icon: Bandage,
    };
  })();

  const allLinks = [...links, agencyLink];

  return (
    <div className="w-full bg-slate-50 shadow rounded-2xl p-4 h-fit md:sticky md:top-10">
      {/* Thông tin user */}
      <div className="flex flex-col items-center text-center border-b pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <h2 className="mt-2 font-semibold">{user?.username}</h2>
        <p className="text-sm text-gray-500 break-all">{user?.email}</p>
      </div>

      <ul className="space-y-2 w-full">
        {allLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          const btn = (
            <Button
              variant={isActive ? "secondary" : "ghost"}
              disabled={!!item.disabled}
              className={`w-full justify-start ${
                isActive ? "font-semibold" : ""
              }`}
            >
              <Icon className="w-4 h-4 mr-2" /> {item.label}
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
