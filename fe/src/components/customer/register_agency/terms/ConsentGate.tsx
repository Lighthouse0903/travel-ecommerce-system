import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const ConsentGate = () => {
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (!agreed) return;
    localStorage.setItem("agency_terms_v1", "true");

    router.push("/dashboard/register_agency/apply");
  };

  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-background p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-semibold">
              Xác nhận đồng ý
            </h3>
            <p className="text-sm text-muted-foreground">
              Bạn cần đồng ý với các điều khoản trên để tiếp tục quy trình đăng
              ký tài khoản Đối tác.
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 flex gap-3 items-start">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
            />
            <label
              htmlFor="agree"
              className="text-sm leading-relaxed cursor-pointer"
            >
              <span className="font-medium">
                Tôi đã đọc, hiểu và đồng ý với Điều khoản & Quy định v1.0
              </span>
              <br />
              <span className="text-muted-foreground text-xs">
                Tôi cam kết các thông tin cung cấp trong quá trình đăng ký là
                chính xác và chịu trách nhiệm trước pháp luật.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Hủy bỏ
            </Button>

            <Button
              className=" bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
              onClick={handleContinue}
              disabled={!agreed}
            >
              Tiếp tục đăng ký
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsentGate;
