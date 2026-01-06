import {
  Shield,
  BadgeCheck,
  PiggyBank,
  Undo2,
  Building2,
  Phone,
  Mail,
  Info,
} from "lucide-react";
import type { Policy } from "@/types/tour";

interface PolicyViewProps {
  policy: Policy | null;
  agency?: {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
}

const PolicyView = ({ policy, agency }: PolicyViewProps) => {
  const depositPercent = Number(policy?.deposit_percent ?? 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
          Chính sách & Thông tin liên hệ
        </h2>
        <p className="text-sm text-muted-foreground">
          Quy định hoàn huỷ và kênh liên hệ của đại lý
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
              <Shield className="h-5 w-5" />
            </span>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                Điều khoản & hoàn huỷ
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Thông tin có thể thay đổi theo từng tour
              </p>
            </div>
          </div>

          <div className="space-y-4 px-4 py-4 text-sm text-slate-700">
            <div className="flex gap-3">
              <Undo2 className="mt-0.5 h-4 w-4 text-slate-500" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Hoàn tiền</div>
                <div className="font-medium break-words">
                  {policy?.refund_policy || "—"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <PiggyBank className="mt-0.5 h-4 w-4 text-slate-500" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Đặt cọc</div>
                <div className="font-medium">{depositPercent}%</div>
              </div>
            </div>

            <div className="flex gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-slate-500" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Phí huỷ</div>
                <div className="font-medium break-words">
                  {policy?.cancellation_fee || "—"}
                </div>
              </div>
            </div>

            {!policy?.refund_policy &&
              !policy?.cancellation_fee &&
              depositPercent === 0 && (
                <div className="flex gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-muted-foreground">
                  <Info className="mt-0.5 h-4 w-4" />
                  <span>Chưa có thông tin chính sách cho tour này.</span>
                </div>
              )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start gap-3 border-b border-slate-200 bg-slate-50 px-4 py-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
              <Building2 className="h-5 w-5" />
            </span>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                Thông tin liên hệ
              </h3>
              <p className="mt-1 text-xs text-slate-600">
                Liên hệ đại lý để được hỗ trợ
              </p>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 text-sm text-slate-700">
            {agency?.name ? (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-slate-900">
                  {agency.name}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">—</div>
            )}

            {agency?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span>{agency.phone}</span>
              </div>
            )}

            {agency?.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail className="h-4 w-4 text-slate-500" />
                <span>{agency.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyView;
