"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLoginModal } from "@/contexts/LoginModalContext";
import LoginForm from "../../auth/customer/LoginForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const LoginModal = () => {
  const { isOpen, closeLoginModal } = useLoginModal();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeLoginModal}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden z-[200]">
          <DialogHeader className="px-6 pt-4 pb-0">
            <VisuallyHidden>
              <DialogTitle className="text-lg font-semibold">
                Đăng nhập VietTravel
              </DialogTitle>
            </VisuallyHidden>
          </DialogHeader>

          <div className="p-4 sm:p-6 ">
            <LoginForm onSuccess={closeLoginModal} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default LoginModal;
