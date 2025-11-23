"use client";
import React, { useState } from "react";
import { MenuIcon } from "lucide-react";
import { FaRegBell } from "react-icons/fa";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { MenuCol, MenuRow } from "./Menu";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

import AccountSection from "./AccountSection";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Header2 = () => {
  const { access, user } = useAuth();
  console.log("Access_token:", access);
  console.log("User_login:", user);
  return (
    <div className="h-[12vh] w-full flex items-center justify-between bg-transparent px-2 sm:px-5">
      <Link href={"/"}>
        {/* Logo */}
        <div className="flex justify-start items-center gap-x-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden">
            <img
              src={"/images/logo.jpg"}
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
          <FaRegBell size={23} className="text-gray-700 shrink-0" />
          {/* <span className="hidden sm:inline">Yêu thích</span> */}
        </div>

        {/* Xử lý sự kiện đăng kí đăng nhập */}
        <AccountSection />

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
