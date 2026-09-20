"use client";

import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { GOATCOUNTER } from "../constants/links";

const ViewCount = () => {
  const [views, setViews] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(GOATCOUNTER.counter, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        // GoatCounter preformats with spaces as separators; restyle it here.
        const digits = String(data?.count ?? "").replace(/\D/g, "");
        if (!digits) return;
        setViews(Number(digits).toLocaleString("en-US"));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  // Stays empty until a real number arrives, so nothing invented is shown.
  if (!views) return null;

  return (
    <span
      className="flex items-center gap-1.5"
      title={`${views} page views, counted by GoatCounter`}
    >
      <FaRegEye size={12} aria-hidden />
      {views}
    </span>
  );
};

export default ViewCount;
