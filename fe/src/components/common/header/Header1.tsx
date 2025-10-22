import Link from "next/link";

const Header1 = () => {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between bg-transparent text-sm px-4 py-2 h-[5vh]">
        <div className="flex flex-wrap items-center gap-3 text-center sm:text-left">
          <span>Hotline: 1900 9999</span>
          <span className="hidden sm:inline">Email: support@viettravel.vn</span>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="#" className="hover:underline">
              Đăng kí đại lý
            </Link>
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
