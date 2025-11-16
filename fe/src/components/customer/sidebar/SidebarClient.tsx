"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  Heart,
  ShoppingBag,
  CreditCard,
  Edit,
  Building2,
  Bandage,
  RotateCcwKey,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const SidebarClient = () => {
  const { user } = useAuth();

  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/profile",
      label: "Thông tin cá nhân",
      icon: User,
    },
    {
      href: "/dashboard/orders",
      label: "Đơn đã đặt",
      icon: ShoppingBag,
    },
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

  const agencyLink = user?.roles?.includes(2)
    ? { href: "/agency/dashboard", label: "Đại lý của bạn", icon: Building2 }
    : {
        href: "/dashboard/register_agency",
        label: "Đăng ký đại lý",
        icon: Bandage,
      };

  return (
    <div className="w-full bg-slate-50 shadow rounded-2xl p-4 h-fit md:sticky md:top-10">
      {/* THông tin user */}
      <div className="flex flex-col items-center text-center border-b pb-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
          {user?.username?.[0]?.toUpperCase() ?? "U"}
        </div>
        <h2 className="mt-2 font-semibold">{user?.username}</h2>
        <p className="text-sm text-gray-500 break-all">{user?.email}</p>
      </div>

      <ul className="space-y-2 w-full">
        {[...links, agencyLink].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link href={item.href} prefetch>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
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
