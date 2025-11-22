import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";
import React from "react";
interface CustomerInforCardProps {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_email: string;
}

const CustomerInforCard: React.FC<CustomerInforCardProps> = ({
  customer_name,
  customer_email,
  customer_phone,
  customer_address,
}) => {
  return (
    <div>
      <Card className="shadow-sm border">
        <CardHeader className="pb-4">
          <CardTitle className="text-md font-semibold">
            Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="mt-1 rounded-full bg-slate-200 p-2">
              <User className="h-4 w-4 text-slate-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500">Họ tên</p>
              <p className="text-sm font-semibold text-slate-900">
                {customer_name}
              </p>
              <p className="text-xs text-slate-500">
                {customer_address || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="mt-1 rounded-full bg-slate-200 p-2">
              <Phone className="h-4 w-4 text-slate-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500">
                Số điện thoại
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {customer_phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="mt-1 rounded-full bg-slate-200 p-2">
              <Mail className="h-4 w-4 text-slate-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-slate-500">Email</p>
              <p className="text-sm font-semibold text-slate-900 break-words">
                {customer_email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInforCard;
