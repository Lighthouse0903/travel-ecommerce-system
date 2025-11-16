import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const AccountPopoverContent = ({ onClose }: { onClose?: () => void }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose?.();
  };

  return (
    <div className="w-64 p-2 z-[150]">
      {/* Header */}
      <div className="flex items-center gap-3 p-2">
        {/* avt */}
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
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Thông tin cá nhân
        </Link>
        <Link
          href="/bookings"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Đơn đã đặt
        </Link>
        <Link
          href="/wishlist"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Yêu thích
        </Link>
        <Link
          href="/payments"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Thanh toán & hóa đơn
        </Link>
        <Link
          href="/dashboard/register_agency"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Đăng kí đại lý
        </Link>
        <Link
          href="/dashboard/change_password"
          onClick={onClose}
          className="px-2 py-2 hover:bg-slate-50 rounded"
        >
          Đổi mật khẩu
        </Link>
      </div>

      <hr className="my-2" />
      {/* đăng xuất */}
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
