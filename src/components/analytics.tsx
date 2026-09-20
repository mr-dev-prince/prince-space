"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GOATCOUNTER } from "../constants/links";

declare global {
  interface Window {
    goatcounter?: { count?: (opts: { path: string }) => void };
  }
}

const Analytics = () => {
  const pathname = usePathname();
  const counted = useRef<string | null>(null);

  useEffect(() => {
    // count.js records the landing view itself, so skip the first pathname and
    // only report client-side navigations after it.
    if (counted.current === null || counted.current === pathname) {
      counted.current = pathname;
      return;
    }
    counted.current = pathname;
    window.goatcounter?.count?.({ path: pathname });
  }, [pathname]);

  return (
    <Script
      src={GOATCOUNTER.script}
      data-goatcounter={GOATCOUNTER.endpoint}
      strategy="afterInteractive"
    />
  );
};

export default Analytics;
