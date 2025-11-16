import TourFilter from "@/components/customer/tours/TourFilter";

export default function TourLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[95%]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-3 space-x-4 py-4 sm:py-10">
            <TourFilter />
          </div>
          <div className="lg:col-span-9 py-4 sm:py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
