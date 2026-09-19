"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs } from "../constants/tabs";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const BottomTabs = () => {
  const pathname = usePathname() ?? "/";

  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-black/90 to-transparent"
      />
      <div className="border-t border-white/10 bg-black/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <ul className="grid h-16 grid-cols-4">
          {Tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            const Icon = active ? tab.activeIcon : tab.icon;
            return (
              <li key={tab.href} className="h-full">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium tracking-wide transition-colors ${
                    active ? "text-white" : "text-white/45 active:text-white/80"
                  }`}
                >
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      active ? "bg-white/10" : "bg-transparent"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomTabs;
