"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

/**
 * Menu desktop / tablet
 */
export const MenuRow = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (active: boolean) =>
    cn(
      "text-base px-1 py-1 transition-colors duration-200",
      active
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-primary"
    );

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-row items-center gap-6">
        <NavigationMenuItem>
          <Link href="/" className={linkClass(isActive("/"))}>
            Trang chủ
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/tours" className={linkClass(isActive("/tours"))}>
            Danh mục tour
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/about" className={linkClass(isActive("/about"))}>
            Về chúng tôi
          </Link>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
          <Link href="/promotion" className={linkClass(isActive("/promotion"))}>
            Ưu đãi
          </Link>
        </NavigationMenuItem> */}

        <NavigationMenuItem>
          <Link href="/contact" className={linkClass(isActive("/contact"))}>
            Liên hệ
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

/**
 * Menu mobile
 */
export const MenuCol = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const colLinkClass = (active: boolean) =>
    cn(
      "text-base transition-colors duration-200",
      active
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-primary"
    );

  return (
    <div className="flex flex-col items-start gap-4 mt-7">
      <Link href="/" className={colLinkClass(isActive("/"))}>
        Trang chủ
      </Link>

      <Link href="/tours" className={colLinkClass(isActive("/tours"))}>
        Danh mục tour
      </Link>

      <Link href="/about" className={colLinkClass(isActive("/about"))}>
        Về chúng tôi
      </Link>

      {/* <Link href="/promotion" className={colLinkClass(isActive("/promotion"))}>
        Ưu đãi
      </Link> */}

      <Link href="/contact" className={colLinkClass(isActive("/contact"))}>
        Liên hệ
      </Link>
    </div>
  );
};
