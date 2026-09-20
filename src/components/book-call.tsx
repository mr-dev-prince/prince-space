"use client";

import { useState } from "react";
import { FaRegCalendarCheck } from "react-icons/fa";
import { openBooking } from "../lib/cal";

const BookCall = ({ calLink }: { calLink: string }) => {
  const [failed, setFailed] = useState(false);
  const href = `https://cal.com/${calLink}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        // Fall through to the plain link if the embed can't open.
        if (failed) return;
        if (openBooking(calLink)) e.preventDefault();
        else setFailed(true);
      }}
      className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
    >
      <FaRegCalendarCheck size={13} />
      Book a 15 min call
    </a>
  );
};

export default BookCall;
