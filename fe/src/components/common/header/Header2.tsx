import React from "react";
import { LucideClover, MenuIcon, User } from "lucide-react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MenuCol, MenuRow } from "./Menu";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LoginForm from "@/components/auth/customer/LoginForm";
import RegisterForm from "@/components/auth/customer/RegiterForm";
import Link from "next/link";

const Header2 = () => {
  return (
    <div className="h-[12vh] w-full flex items-center justify-between bg-transparent px-2 sm:px-5">
      <Link href={"/"}>
        {/* Logo */}
        <div className="flex justify-start items-center gap-x-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden">
            <img
              src={"./images/logo.jpg"}
              alt="ảnh logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-serif text-2xl text-slate-600">VietTravel</span>
        </div>
      </Link>

      {/* Menu navigate ngang trên màn desktop/ tablet*/}
      <div className="hidden lg:inline">
        <MenuRow />
      </div>
      <div className="flex items-center justify-between gap-x-3">
        <div className="flex items-center justify-between">
          <FaRegHeart size={23} />
          <span className="hidden sm:inline">Yêu thích</span>
        </div>

        {/* Xử lý sự kiện đăng kí đăng nhập */}
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center justify-between">
              <FaRegUser size={23} />
              <span className="hidden sm:inline">Tài khoản</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 space-y-2 z-[150] ">
            <p className="text-sm text-gray-600">Bạn chưa đăng nhập</p>
            <hr />
            <Dialog>
              <DialogTrigger className="w-full font-primary bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                Đăng nhập
              </DialogTrigger>
              <DialogContent
                className="w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[800px] 
             h-[60vh] sm:h-auto max-w-none bg-white z-[150] overflow-y-auto"
              >
                <VisuallyHidden>
                  <DialogTitle>Đăng nhập</DialogTitle>
                </VisuallyHidden>
                <LoginForm />
              </DialogContent>
            </Dialog>
            <p className="text-sm text-gray-700">
              Bạn chưa có tài khoản?{" "}
              <Dialog>
                <DialogTrigger className="text-blue-600 hover:underline">
                  Đăng kí ngay
                </DialogTrigger>
                <DialogContent
                  className="w-[90vw] sm:w-[600px] md:w-[700px] lg:w-[800px] 
             h-[60vh] sm:h-auto max-w-none bg-white z-[150] overflow-y-auto"
                >
                  <VisuallyHidden>
                    <DialogTitle>Đăng kí</DialogTitle>
                  </VisuallyHidden>
                  <RegisterForm />
                </DialogContent>
              </Dialog>
            </p>
          </PopoverContent>
        </Popover>

        {/* Menu dọc: trên mobile */}

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon size={23} />
            </SheetTrigger>
            <SheetContent className="z-[9990] w-[60vw]">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Menu Navigation</SheetTitle>
                </VisuallyHidden>
                <MenuCol />
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Header2;
