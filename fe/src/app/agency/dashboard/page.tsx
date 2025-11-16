import {
  BarChart3,
  ShoppingBag,
  FolderOpen,
  DollarSign,
  Users,
} from "lucide-react";

export default function AgencyDashboardPage() {
  // Dữ liệu mẫu hardcode
  const stats = [
    {
      icon: ShoppingBag,
      label: "Đơn đặt tour",
      value: 124,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: FolderOpen,
      label: "Tour đang hoạt động",
      value: 12,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: DollarSign,
      label: "Tổng doanh thu",
      value: "52.400.000₫",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Users,
      label: "Khách hàng",
      value: 86,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="w-full space-y-6 rounded-xl p-3 shadow-md">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Trang tổng quan</h1>
        <p className="text-gray-500 text-sm">
          Chào mừng bạn quay lại, đây là tình hình kinh doanh của bạn hôm nay.
        </p>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <h2 className="text-xl font-bold mt-1">{item.value}</h2>
              </div>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Biểu đồ hoặc thông tin chi tiết (placeholder) */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-semibold">Tổng quan doanh thu</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Biểu đồ doanh thu sẽ hiển thị tại đây (đang sử dụng dữ liệu giả lập).
        </p>
        <div className="mt-6 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          [Biểu đồ doanh thu - Coming soon]
        </div>
      </div>
    </div>
  );
}
