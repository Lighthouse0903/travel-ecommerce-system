"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Header1 = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between bg-transparent text-sm px-4 py-2 h-[5vh]">
        <div className="flex flex-wrap items-center gap-3 text-center sm:text-left">
          <span>Hotline: 1900 9999</span>
          <span className="hidden sm:inline">Email: support@viettravel.vn</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap items-center gap-3">
            {user?.roles?.includes(2) ? (
              <Link href="/agency/dashboard" className="hover:underline">
                Đại lý của bạn
              </Link>
            ) : (
              <Link href="#" className="hover:underline">
                Đăng kí đại lý
              </Link>
            )}

            <span className="hidden sm:inline-block">|</span>
            <Link href="#" className="hover:underline">
              Hỗ trợ
            </Link>
            <span className="hidden sm:inline-block">|</span>
            <Link href="#" className="hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header1;
