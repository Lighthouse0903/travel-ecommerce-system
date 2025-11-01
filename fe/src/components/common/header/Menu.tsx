"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TOUR_CATEGORIES = [
  {
    slug: "sapa",
    name: "Tour Sapa",
    description:
      "Khám phá vùng núi Tây Bắc, ngắm ruộng bậc thang và bản làng yên bình.",
    image: "/images/sapa.jpg",
  },
  {
    slug: "ha-giang",
    name: "Tour Hà Giang",
    description: "Trải nghiệm đèo Mã Pí Lèng, cao nguyên đá Đồng Văn hùng vĩ.",
    image: "/images/ha-giang.jpg",
  },
  {
    slug: "ha-long",
    name: "Tour Hạ Long",
    description: "Thưởng ngoạn vịnh Hạ Long – kỳ quan thiên nhiên thế giới.",
    image: "/images/ha-long.jpg",
  },
  {
    slug: "phu-quoc",
    name: "Tour Phú Quốc",
    description: "Thiên đường biển đảo, nơi nghỉ dưỡng và khám phá tuyệt vời.",
    image: "/images/phu-quoc.jpg",
  },
];

// ---- MenuRow: cho desktop / tablet ----
export const MenuRow = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row items-center gap-6">
        {/* Trang chủ */}
        <NavigationMenuItem>
          <Link
            href="/"
            className={cn(
              "group relative inline-block text-base px-1 py-1 transition-all duration-300",
              pathname === "/"
                ? "text-slate-700 font-semibold"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Trang chủ
            <span
              className={cn(
                "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                pathname === "/" ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "left center" }}
            />
          </Link>
        </NavigationMenuItem>

        {/* Danh mục tour  */}
        <NavigationMenuItem>
          <Popover>
            <PopoverTrigger>
              <div
                className={cn(
                  "group relative inline-block text-base px-1 py-1 transition-all duration-300 text-slate-500 hover:text-slate-700 cursor-pointer"
                )}
              >
                Danh mục tour
                <span
                  className={cn(
                    "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
                  )}
                  style={{ transformOrigin: "left center" }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[690px] text-sm text-slate-600 z-[150]">
              <div className="grid grid-cols-3 gap-x-3">
                <div className="flex flex-col items-start justify-center">
                  <h1 className="text-xl font-medium text-gray-900 mb-5">
                    Miền Bắc
                  </h1>
                  <div className="flex flex-col gap-y-3 items-start justify-center text-gray-800">
                    {TOUR_CATEGORIES.map((tour) => (
                      <Link key={tour.slug} href={`/tours/${tour.slug}`}>
                        {tour.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center">
                  <h1 className="text-xl font-medium text-gray-900 mb-5">
                    Miền Trung
                  </h1>
                  <div className="flex flex-col gap-y-3 items-start justify-center text-gray-800">
                    <p>
                      <Link href="#">Sapa</Link>
                    </p>
                    <p>
                      <Link href="#">Hà Giang</Link>
                    </p>
                    <p>
                      <Link href="#">Cao Bằng - Bắc Kạn</Link>
                    </p>
                    <p>
                      <Link href="#">Ninh Bình</Link>
                    </p>
                    <p>
                      <Link href="#">Hạ Long</Link>
                    </p>
                    <p>
                      <Link href="#">Cát Bà</Link>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center">
                  <h1 className="text-xl font-medium text-gray-900 mb-5">
                    Miền Nam
                  </h1>
                  <div className="flex flex-col gap-y-3 items-start justify-center text-gray-800">
                    <p>
                      <Link href="/">Phú Quốc</Link>
                    </p>
                    <p>
                      <Link href="#">Côn Đảo</Link>
                    </p>
                    <p>
                      <Link href="#">Bến Tre</Link>
                    </p>
                    <p>
                      <Link href="#">Cần Thơ</Link>
                    </p>
                    <p>
                      <Link href="#">Kiên Giang</Link>
                    </p>
                    <p>
                      <Link href="#">Cà Mau</Link>
                    </p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </NavigationMenuItem>

        {/* Về chúng tôi */}
        <NavigationMenuItem>
          <Link
            href="/about"
            className={cn(
              "group relative inline-block text-base px-1 py-1 transition-all duration-300",
              pathname.startsWith("/about")
                ? "text-slate-700 font-semibold"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Về chúng tôi
            <span
              className={cn(
                "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                pathname.startsWith("/about") ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "left center" }}
            />
          </Link>
        </NavigationMenuItem>

        {/* Ưu đãi */}
        <NavigationMenuItem>
          <Link
            href="/promotion"
            className={cn(
              "group relative inline-block text-base px-1 py-1 transition-all duration-300",
              pathname.startsWith("/promotion")
                ? "text-slate-700 font-semibold"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Ưu đãi
            <span
              className={cn(
                "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                pathname.startsWith("/promotion") ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "left center" }}
            />
          </Link>
        </NavigationMenuItem>

        {/* Liên hệ */}
        <NavigationMenuItem>
          <Link
            href="/contact"
            className={cn(
              "group relative inline-block text-base px-1 py-1 transition-all duration-300",
              pathname.startsWith("/contact")
                ? "text-slate-700 font-semibold"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Liên hệ
            <span
              className={cn(
                "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                pathname.startsWith("/contact") ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "left center" }}
            />
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// ---- MenuCol: cho mobile  ----
export const MenuCol = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-start gap-4 mt-7">
      <Link
        href="/"
        className={cn(
          "text-md font-normal transition-all duration-200",
          pathname === "/" ? "text-slate-700" : "text-slate-500"
        )}
      >
        Trang chủ
      </Link>

      <Link
        href="/tours"
        className={cn(
          "text-md font-normal transition-all duration-200",
          pathname.startsWith("/tours") ? "text-slate-700" : "text-slate-500"
        )}
      >
        Danh mục tour
      </Link>

      <Link
        href="/about"
        className={cn(
          "text-md font-normal transition-all duration-200",
          pathname.startsWith("/about") ? "text-slate-700" : "text-slate-500"
        )}
      >
        Về chúng tôi
      </Link>

      <Link
        href="/promotion"
        className={cn(
          "text-md font-normal transition-all duration-200",
          pathname.startsWith("/promotion")
            ? "text-slate-700"
            : "text-slate-500"
        )}
      >
        Ưu đãi
      </Link>

      <Link
        href="/contact"
        className={cn(
          "text-md font-normal transition-all duration-200",
          pathname.startsWith("/contact") ? "text-slate-700" : "text-slate-500"
        )}
      >
        Liên hệ
      </Link>
    </div>
  );
};
