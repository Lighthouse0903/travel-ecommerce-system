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
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
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
          <div className="flex items-center gap-x-2 cursor-pointer">
            {user ? (
              <>
                <div className="rounded-full w-8 h-8 flex justify-center items-center bg-secondary border border-border ring-2 ring-ring/25 ring-offset-2 ring-offset-background transition-colors">
                  <span className="text-sm font-semibold text-foreground/80">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>

                <span className="hidden sm:inline text-foreground/90">
                  {user.username}
                </span>
              </>
            ) : (
              <>
                <FaRegUser
                  size={23}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                />
                <span className="hidden sm:inline text-muted-foreground hover:text-primary transition-colors">
                  Tài khoản
                </span>
              </>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          collisionPadding={12}
          className="z-[150] w-[280px] p-0 bg-card border border-slate-200 shadow-lg rounded-xl"
        >
          {user ? (
            <AccountPopoverContent />
          ) : (
            <div className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Bạn chưa đăng nhập
              </p>

              <div className="h-px bg-border" />

              <button
                onClick={() => {
                  setOpenPopover(false);
                  setOpenLogin(true);
                }}
                className="w-full font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary-hover transition-colors"
              >
                Đăng nhập
              </button>

              <p className="text-sm text-muted-foreground">
                Bạn chưa có tài khoản?{" "}
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setOpenRegister(true);
                  }}
                  className="text-primary hover:underline underline-offset-4"
                >
                  Đăng ký ngay
                </button>
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Dialog đăng nhập */}
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent className="max-w-[700px] bg-card text-card-foreground border-border z-[9999]">
          <VisuallyHidden>
            <DialogTitle>Đăng nhập</DialogTitle>
          </VisuallyHidden>
          <LoginForm onSuccess={() => setOpenLogin(false)} />
        </DialogContent>
      </Dialog>

      {/* Dialog đăng kí */}
      <Dialog open={openRegister} onOpenChange={setOpenRegister}>
        <DialogContent className="max-w-[700px] bg-card text-card-foreground border-border z-[9999]">
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
