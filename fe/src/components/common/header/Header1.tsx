"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";

const Header1 = () => {
  const { user } = useAuth();
  const { loading, profile } = useAgencyProfile();

  const renderAgencyLink = () => {
    if (!user) return null;

    if (loading) {
      return (
        <span className="text-gray-400 cursor-not-allowed">
          Đang kiểm tra đại lý...
        </span>
      );
    }

    if (!profile) {
      return (
        <Link
          href="/dashboard/register_agency/terms"
          className="hover:underline"
        >
          Đăng ký đại lý
        </Link>
      );
    }

    if (profile.status === "approved") {
      return (
        <Link href="/agency/dashboard" className="hover:underline">
          Đại lý của bạn
        </Link>
      );
    }

    return (
      <Link
        href="/dashboard/register_agency/status"
        className="hover:underline"
      >
        Trạng thái đăng ký đại lý
      </Link>
    );
  };

  const agencyLink = renderAgencyLink();

  return (
    <div className="flex flex-wrap items-center justify-between bg-transparent text-sm px-4 py-2 h-[5vh]">
      <div className="flex flex-wrap items-center gap-3">
        <span>Hotline: 1900 9999</span>
        <span className="hidden sm:inline">Email: support@viettravel.vn</span>
      </div>

      <div className="flex items-center gap-3">
        {agencyLink}

        {agencyLink && <span className="hidden sm:inline-block">|</span>}

        <Link href="#" className="hover:underline">
          Hỗ trợ
        </Link>

        <span className="hidden sm:inline-block">|</span>

        <Link href="#" className="hover:underline">
          FAQ
        </Link>
      </div>
    </div>
  );
};

export default Header1;
