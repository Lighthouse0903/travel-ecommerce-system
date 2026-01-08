import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string;
};

const DestinationCard = ({
  title,
  subtitle,
  href = "#",
  imageUrl = "/images/placeholder.jpg",
}: Props) => {
  return (
    <Link
      href={href}
      className="group relative block h-full overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col justify-end p-4">
        <h3 className="text-white text-xl sm:text-2xl font-semibold drop-shadow">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-white/85 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
    </Link>
  );
};

const FavouriteDestination = () => {
  return (
    <section className="relative bg-background flex items-center justify-center">
      <div className="w-[95%] md:w-[90%]">
        <div className="flex flex-col items-center p-2">
          <h2 className="text-center text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-2">
            Điểm đến yêu thích
          </h2>
          <p className="text-center text-sm sm:text-base text-muted-foreground mb-3">
            Khám phá các điểm đến được yêu thích nhất!
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 mb-6">
          {/* LỚN bên trái */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 sm:row-span-2 min-h-[220px] sm:min-h-[420px] lg:min-h-[460px]">
            <DestinationCard
              title="Hà Nội"
              href="/tours?destination=Hà+Nội"
              subtitle="Phố cổ • Hồ Gươm"
              imageUrl="https://i.pinimg.com/736x/3f/33/89/3f3389dfe22f751628cfeb2bcc8352a9.jpg"
            />
          </div>

          {/* Hàng trên - 2 card */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <DestinationCard
              title="Đà Nẵng"
              href="/tours?destination=Đà+Nẵng"
              subtitle="Bà Nà • Cầu Vàng"
              imageUrl="https://i.pinimg.com/1200x/29/de/a2/29dea2d798175ed8c280896c630f9ecd.jpg"
            />
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <DestinationCard
              title="TP Hồ Chí Minh"
              href="/tours?destination=Hồ+Chí+Minh"
              subtitle="Sôi động • Ẩm thực"
              imageUrl="https://i.pinimg.com/1200x/32/a0/82/32a0826b769a3d948cbe5c2ac223362e.jpg"
            />
          </div>

          {/* Hàng dưới - 2 card */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <DestinationCard
              title="Phú Quốc"
              href="/tours?destination=Phú+Quốc"
              subtitle="Biển xanh • Nghỉ dưỡng"
              imageUrl="https://i.pinimg.com/1200x/ff/8d/c1/ff8dc1ecb5269399e00033fbc92e934c.jpg"
            />
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4 min-h-[200px]">
            <DestinationCard
              title="Đà Lạt"
              href="/tours?destination=Đà+Lạt"
              subtitle="Săn mây • Cà phê"
              imageUrl="https://i.pinimg.com/1200x/ff/7d/88/ff7d88f2b21d85620add19520c288aa2.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavouriteDestination;
