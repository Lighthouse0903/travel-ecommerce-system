import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";

interface Props {
  title: string;
  onBack: () => void;
}

const BookingDetailHeaderAgency = ({ title, onBack }: Props) => {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-3">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/agency/dashboard/bookings">
                Đơn đặt tour
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-muted-foreground">
                Chi tiết
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-xl text-slate-700"
          onClick={() => window.location.reload()}
        >
          Cập nhật trạng thái
        </Button>

        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    </div>
  );
};

export default BookingDetailHeaderAgency;
