import { Check } from "lucide-react";

const items = [
  "Giấy phép đăng ký kinh doanh (bản màu)",
  "CCCD/CMND người đại diện pháp luật",
  "Logo đại lý & hình ảnh nhận diện",
  "Tài khoản ngân hàng doanh nghiệp",
];

const CheckList = () => {
  return (
    <section className="w-full py-12">
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Checklist trước khi đăng ký
          </h2>
        </div>

        <div className="rounded-2xl border bg-blue-50/50 p-5 sm:p-6">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Vui lòng chuẩn bị sẵn các tài liệu sau (bản mềm/scan) để quá trình
            đăng ký diễn ra thuận lợi:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {items.map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
                  <Check className="h-4 w-4" />
                </div>
                <div className="text-sm sm:text-base text-foreground">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 text-xs sm:text-sm text-muted-foreground">
            Gợi ý: Định dạng PDF/JPG/PNG, ảnh rõ nét và đầy đủ thông tin để xét
            duyệt nhanh hơn.
          </div>
        </div>
      </div>
    </section>
  );
};
export default CheckList;
