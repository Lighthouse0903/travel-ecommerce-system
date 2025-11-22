import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";
import React from "react";

interface ActivesCardProps {
  onConfirmed: () => void;
  onCanceled: () => void;
  confirmLoading?: boolean;
  cancelLoading?: boolean;
  disabled?: boolean;
}

const ActivesCard: React.FC<ActivesCardProps> = ({
  onCanceled,
  onConfirmed,
  confirmLoading,
  cancelLoading,
  disabled,
}) => {
  const allDisabled = disabled || confirmLoading || cancelLoading;
  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Hành động</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={onConfirmed}
          disabled={allDisabled}
          className="w-full justify-center bg-blue-500 hover:bg-blue-400 hover:text-slate-100"
        >
          {confirmLoading ? "Đang xác nhận..." : "Xác nhận đơn đặt tour"}
        </Button>
        <Button
          onClick={onCanceled}
          disabled={allDisabled}
          className="w-full justify-center bg-red-600 text-white hover:bg-red-400 hover:text-slate-100"
        >
          {cancelLoading ? "Đang hủy..." : "Hủy đơn đặt tour"}
        </Button>
        <Separator />
        <Button
          variant="outline"
          className="w-full justify-center"
          disabled={allDisabled}
        >
          Liên hệ khách hàng
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivesCard;
