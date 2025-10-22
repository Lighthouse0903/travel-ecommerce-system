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

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours", label: "Danh mục tour" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/promotion", label: "Ưu đãi" },
  { href: "/contact", label: "Liên hệ" },
];

// ---- MenuRow: cho desktop / tablet ----
export const MenuRow = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row items-center gap-6">
        {links.map(({ href, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));

          return (
            <NavigationMenuItem key={href}>
              <Link
                href={href}
                className={cn(
                  "group relative inline-block text-base px-1 py-1 transition-all duration-300",
                  isActive
                    ? "text-slate-700 font-semibold"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {label}
                <span
                  className={cn(
                    "absolute left-0 bottom-[-5px] h-[2px] w-full rounded bg-slate-500 transition-transform duration-300 ease-in-out",
                    isActive ? "scale-x-100" : "scale-x-0"
                  )}
                  style={{ transformOrigin: "left center" }}
                />
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// ---- MenuCol: cho mobile  ----
export const MenuCol = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col top items-start gap-4 mt-7">
      {links.map(({ href, label }) => {
        const isActive =
          pathname === href ||
          (href !== "/" && pathname.startsWith(`${href}/`));

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-md font-normal transition-all duration-200",
              isActive ? "text-slate-700 " : "text-slate-500"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};
