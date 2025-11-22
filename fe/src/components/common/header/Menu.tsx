"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// Menu trên màn desktop/tablet
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

        {/* Danh mục tour */}
        <NavigationMenuItem>
          <Link
            href="/tours"
            className={cn(
              "group relative inline-block text-base px-1 py-1 transition-all duration-300",
              pathname.startsWith("/tours")
                ? "text-slate-700 font-semibold"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Danh mục tour
            <span
              className={cn(
                "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                pathname.startsWith("/tours") ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transformOrigin: "left center" }}
            />
          </Link>
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

// Menu dành cho màn nhỏ dưới md hoặc mobile
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
