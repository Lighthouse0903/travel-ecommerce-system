import {
  Shield,
  BadgeCheck,
  PiggyBank,
  Undo2,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import type { Policy } from "@/types/tour";

interface AgencyPolicyViewProps {
  policy: Policy | null;
}

const AgencyPolicyView = ({ policy }: AgencyPolicyViewProps) => {
  return (
    <section className="bg-slate-50 border shadow-md rounded-xl p-5 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Chính sách</h2>

      <div className="bg-white border-0 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-slate-700" />
          <h3 className="font-medium text-slate-800">Điều khoản & hoàn huỷ</h3>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex gap-3">
            <Undo2 className="w-4 h-4 mt-0.5 text-slate-500" />
            <div>
              <div className="text-xs text-muted-foreground">Hoàn tiền</div>
              <div className="font-medium break-words">
                {policy?.refund_policy || "—"}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <PiggyBank className="w-4 h-4 mt-0.5 text-slate-500" />
            <div>
              <div className="text-xs text-muted-foreground">Đặt cọc</div>
              <div className="font-medium">
                {Number(policy?.deposit_percent ?? 0)}%
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <BadgeCheck className="w-4 h-4 mt-0.5 text-slate-500" />
            <div>
              <div className="text-xs text-muted-foreground">Phí huỷ</div>
              <div className="font-medium break-words">
                {policy?.cancellation_fee || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencyPolicyView;
