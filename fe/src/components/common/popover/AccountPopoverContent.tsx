"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    // { href: "/dashboard/favorites", label: "Yêu thích" },
    // { href: "/dashboard/billing", label: "Thanh toán & Hóa đơn" },
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
      return { href: "/agency/dashboard", label: "Đại lý của bạn" };
    }
    return {
      href: "/dashboard/register_agency/status",
      label: "Trạng thái đăng ký đại lý",
    };
  })();

  const links = [...baseLinks, agencyLink];

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="pb-3 pt-3 px-3">
        <VisuallyHidden>
          <CardTitle>Tài khoản</CardTitle>
        </VisuallyHidden>

        <div className="flex items-center gap-3">
          <div className="rounded-full w-10 h-10 flex justify-center items-center bg-secondary border border-border ring-2 ring-ring/20 ring-offset-2 ring-offset-background">
            <span className="text-sm font-semibold text-foreground/80">
              {user?.username?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground leading-5">
              {user?.username}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.email}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1 px-3">
        <div className="h-px bg-border mb-2" />

        <div className="flex flex-col text-sm">
          {links.map((item) =>
            item.disabled ? (
              <span
                key={item.href}
                className="px-2 py-2 rounded text-muted-foreground/60 cursor-not-allowed"
              >
                {item.label}
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="px-2 py-2 rounded-md transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 px-3">
        <div className="w-full">
          <div className="h-px bg-border mb-2" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/15 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccountPopoverContent;
