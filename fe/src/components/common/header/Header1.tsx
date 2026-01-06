"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";
import { cn } from "@/lib/utils";

const Header1 = () => {
  const { user } = useAuth();
  const { loading, profile } = useAgencyProfile();

  const linkClass =
    "text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4";

  const renderAgencyLink = () => {
    if (!user) return null;

    if (loading) {
      return (
        <span className="text-muted-foreground cursor-not-allowed">
          Đang kiểm tra đại lý...
        </span>
      );
    }

    if (!profile) {
      return (
        <Link href="/dashboard/register_agency/terms" className={linkClass}>
          Đăng ký đại lý
        </Link>
      );
    }

    if (profile.status === "approved") {
      return (
        <Link href="/agency/dashboard" className={linkClass}>
          Đại lý của bạn
        </Link>
      );
    }

    return (
      <Link href="/dashboard/register_agency/status" className={linkClass}>
        Trạng thái đăng ký đại lý
      </Link>
    );
  };

  const agencyLink = renderAgencyLink();

  return (
    <div
      className={cn(
        "w-full",
        "bg-card border-b border-border",
        "h-10 px-4",
        "flex flex-wrap items-center justify-between gap-2",
        "text-sm text-muted-foreground"
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span>
          Hotline:{" "}
          <span className="text-foreground/90 font-medium">1900 9999</span>
        </span>
        <span className="hidden sm:inline">
          Email:{" "}
          <span className="text-foreground/80">support@viettravel.vn</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {agencyLink}

        {agencyLink && (
          <span className="hidden sm:inline-block text-border">|</span>
        )}

        <Link href="#" className={linkClass}>
          Hỗ trợ
        </Link>

        <span className="hidden sm:inline-block text-border">|</span>

        <Link href="#" className={linkClass}>
          FAQ
        </Link>
      </div>
    </div>
  );
};

export default Header1;
