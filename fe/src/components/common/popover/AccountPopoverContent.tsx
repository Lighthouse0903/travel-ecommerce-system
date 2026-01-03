"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";

type MenuLink = {
  href: string;
  label: string;
  disabled?: boolean;
};

const AccountPopoverContent = ({ onClose }: { onClose?: () => void }) => {
  const { user, logout } = useAuth();
  const { loading, profile } = useAgencyProfile();

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  const baseLinks: MenuLink[] = [
    { href: "/dashboard/profile", label: "Thông tin cá nhân" },
    { href: "/dashboard/orders", label: "Đơn hàng của tôi" },
    { href: "/dashboard/favorites", label: "Yêu thích" },
    { href: "/dashboard/billing", label: "Thanh toán & Hóa đơn" },
    { href: "/dashboard/change_password", label: "Đổi mật khẩu" },
  ];

  const agencyLink = (() => {
    if (loading) {
      return {
        href: "/dashboard/register_agency/terms",
        label: "Đang kiểm tra đại lý...",
        disabled: true,
      };
    }

    if (!profile) {
      return {
        href: "/dashboard/register_agency/terms",
        label: "Đăng ký đại lý",
      };
    }

    if (profile.status === "approved") {
      return {
        href: "/agency/dashboard",
        label: "Đại lý của bạn",
      };
    }

    return {
      href: "/dashboard/register_agency/status",
      label: "Trạng thái đăng ký đại lý",
    };
  })();

  const links = [...baseLinks, agencyLink];

  return (
    <div className="w-64 p-2 z-[150]">
      {/* Header */}
      <div className="flex items-center gap-3 p-2">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-slate-200">
          <span className="text-sm font-medium text-slate-600">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">{user?.username}</span>
          <span className="text-xs text-gray-500 truncate">{user?.email}</span>
        </div>
      </div>

      <hr className="my-2" />

      <div className="flex flex-col text-sm">
        {links.map((item) =>
          item.disabled ? (
            <span
              key={item.href}
              className="px-2 py-2 rounded text-gray-400 cursor-not-allowed"
            >
              {item.label}
            </span>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="px-2 py-2 hover:bg-slate-50 rounded"
            >
              {item.label}
            </Link>
          )
        )}
      </div>

      <hr className="my-2" />

      {/* Logout */}
      <div className="px-2">
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AccountPopoverContent;
