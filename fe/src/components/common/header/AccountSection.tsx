"use client";
import React, { useState } from "react";

import { FaRegUser } from "react-icons/fa";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import LoginForm from "@/components/auth/customer/LoginForm";
import RegisterForm from "@/components/auth/customer/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";

import AccountPopoverContent from "../popover/AccountPopoverContent";

const AccountSection = () => {
  const { user } = useAuth();
  const [openPopover, setOpenPopover] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <div className="flex items-center gap-x-1 cursor-pointer">
            {user ? (
              <>
                <div className="rounded-full w-10 h-10 flex justify-center items-center bg-slate-300">
                  <span className="text-sm font-medium text-slate-600">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.username}</span>
              </>
            ) : (
              <>
                <FaRegUser size={23} className="text-gray-700 shrink-0" />
                <span className="hidden sm:inline">Tài khoản</span>
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0 z-[150] space-y-2">
          {user ? (
            <AccountPopoverContent />
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">Bạn chưa đăng nhập</p>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent" />
              <button
                onClick={() => {
                  setOpenPopover(false);
                  setOpenLogin(true);
                }}
                className="w-full font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Đăng nhập
              </button>
              <p className="text-sm text-gray-700">
                Bạn chưa có tài khoản?{" "}
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setOpenRegister(true);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Dialog đăng nhập*/}
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent className="max-w-[700px] bg-white z-[9999]">
          <VisuallyHidden>
            <DialogTitle>Đăng nhập</DialogTitle>
          </VisuallyHidden>
          <LoginForm onSuccess={() => setOpenLogin(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog đăng kí*/}
      <Dialog open={openRegister} onOpenChange={setOpenRegister}>
        <DialogContent className="max-w-[700px] bg-white z-[9999]">
          <VisuallyHidden>
            <DialogTitle>Đăng ký</DialogTitle>
          </VisuallyHidden>
          <RegisterForm onSuccess={() => setOpenRegister(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AccountSection;
