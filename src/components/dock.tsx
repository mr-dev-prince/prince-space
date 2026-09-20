"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineCalendarDays,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2";
import { CAL_BOOKING } from "../constants/links";
import { openBooking } from "../lib/cal";
import {
  holdAmbient,
  installAudioUnlock,
  onAmbientChange,
  startAmbient,
  stopAmbient,
} from "../lib/sounds";
import { useTheme } from "./theme-provider";

const DockButton = ({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 backdrop-blur-xl transition-colors ${
      active
        ? "bg-ink/15 text-ink"
        : "bg-surface/80 text-ink/60 hover:bg-ink/10 hover:text-ink"
    }`}
  >
    <span className="relative flex h-5 w-5 items-center justify-center">
      {children}
    </span>
    <span
      aria-hidden
      className="pointer-events-none absolute right-full mr-2.5 hidden whitespace-nowrap rounded-lg border border-ink/10 bg-panel/90 px-2.5 py-1 text-xs font-light text-ink/70 opacity-0 shadow-[0_10px_30px_-12px_var(--shadow)] backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100 md:block"
    >
      {label}
    </span>
  </button>
);

const BAR_DELAYS = [0, 0.18, 0.36, 0.1, 0.28];

const Equalizer = ({ playing }: { playing: boolean }) => (
  <span aria-hidden className="flex h-4 w-4 items-end justify-center gap-[2px]">
    {BAR_DELAYS.map((delay, index) => (
      <span
        key={index}
        data-playing={playing}
        className="equalizer-bar h-full w-[2px] rounded-full bg-current"
        style={{ animationDelay: `${delay}s` }}
      />
    ))}
  </span>
);

const Dock = () => {
  const { theme, toggleTheme } = useTheme();
  const [playing, setPlaying] = useState(false);

  // Audio stays locked until the page has seen a gesture, and the doodle that
  // normally arms it only exists on the home page.
  useEffect(installAudioUnlock, []);

  // Whichever control starts or stops the pad, the button reflects it.
  useEffect(() => onAmbientChange(setPlaying), []);

  const toggleMusic = useCallback(() => {
    if (playing) {
      holdAmbient(false);
      stopAmbient(1.2, true);
      return;
    }
    holdAmbient(true);
    if (!startAmbient()) holdAmbient(false);
  }, [playing]);

  const book = useCallback(() => {
    if (!CAL_BOOKING) return;
    if (!openBooking(CAL_BOOKING, theme)) {
      window.open(`https://cal.com/${CAL_BOOKING}`, "_blank", "noreferrer");
    }
  }, [theme]);

  return (
    <div
      className="fixed right-4 z-50 flex flex-col gap-2.5 bottom-[calc(env(safe-area-inset-bottom)+5rem)] md:bottom-6 md:right-6"
      role="group"
      aria-label="Site controls"
    >
      <DockButton
        label={theme === "dark" ? "Switch to light" : "Switch to dark"}
        onClick={toggleTheme}
      >
        {/* Both icons are mounted and swapped by CSS on the theme attribute, so
            the right one is painted before React hydrates. */}
        <HiOutlineMoon size={18} className="theme-icon theme-icon-moon" />
        <HiOutlineSun size={18} className="theme-icon theme-icon-sun" />
      </DockButton>

      {CAL_BOOKING && (
        <DockButton label="Book a 15 min call" onClick={book}>
          <HiOutlineCalendarDays size={18} />
        </DockButton>
      )}

      <DockButton
        label={playing ? "Pause music" : "Play music"}
        onClick={toggleMusic}
        active={playing}
      >
        <Equalizer playing={playing} />
      </DockButton>
    </div>
  );
};

export default Dock;
