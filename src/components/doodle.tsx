"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DoodleKind, IDoodle } from "../interfaces/components";
import {
  installAudioUnlock,
  playBeep,
  playChime,
  playKey,
  playMouse,
  playScrollTick,
  startAmbient,
  stopAmbient,
} from "../lib/sounds";

interface IArt {
  rotate: number;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { pointerEvents: "all" as const },
};

const keyClass =
  "fill-transparent transition-[fill] duration-150 hover:fill-white/30";
const pressClass =
  "fill-transparent transition-[fill] duration-100 active:fill-white/30";

/** setTimeout that is cleared when the component unmounts. */
const useTimers = () => {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
};

const Keyboard = () => (
  <svg width="170" height="66" viewBox="0 0 170 66" {...stroke}>
    <rect x="1" y="1" width="168" height="64" rx="8" />
    {[12, 12, 11].map((count, row) =>
      Array.from({ length: count }, (_, i) => (
        <rect
          key={`${row}-${i}`}
          x={9 + i * 12.6 + row * 3}
          y={8 + row * 12}
          width="9"
          height="8"
          rx="2"
          className={keyClass}
          onPointerEnter={playKey}
        />
      )),
    )}
    {[
      { x: 9, width: 30 },
      { x: 45, width: 72 },
      { x: 123, width: 38 },
    ].map((key) => (
      <rect
        key={key.x}
        x={key.x}
        y="44"
        width={key.width}
        height="8"
        rx="2"
        className={keyClass}
        onPointerEnter={playKey}
      />
    ))}
  </svg>
);

const Mouse = () => (
  <svg
    width="56"
    height="112"
    viewBox="0 0 56 112"
    {...stroke}
    onWheel={playScrollTick}
  >
    <path d="M28 24c0-7 9-7 9-13s-9-6-9-10" />
    <rect x="4" y="24" width="48" height="84" rx="24" />
    <path d="M28 24v10M28 48v6M4 54h48" />
    <rect x="24" y="34" width="8" height="14" rx="4" />
    <path
      d="M28 24A24 24 0 0 0 4 48V54H28Z"
      stroke="none"
      className={pressClass}
      onPointerDown={() => playMouse("down")}
      onPointerUp={() => playMouse("up")}
    />
    <path
      d="M28 24A24 24 0 0 1 52 48V54H28Z"
      stroke="none"
      className={pressClass}
      onPointerDown={() => playMouse("down")}
      onPointerUp={() => playMouse("up")}
    />
  </svg>
);

const Pill = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) =>
  onClick ? (
    <button
      type="button"
      tabIndex={-1}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className="rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-1 text-xs font-light text-white/80 transition-colors hover:bg-white/10"
    >
      {children}
    </button>
  ) : (
    <span className="rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-1 text-xs font-light text-white/60">
      {children}
    </span>
  );

const KEEP_OFFER_DELAY_MS = 10000;
const LEAVE_GRACE_MS = 500;

const Headphones = ({ rotate }: IArt) => {
  const [playing, setPlaying] = useState(false);
  const [locked, setLocked] = useState(false);
  const [offerKeep, setOfferKeep] = useState(false);
  const [keep, setKeep] = useState(false);
  const offerTimer = useRef<number>(undefined);
  const leaveTimer = useRef<number>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(offerTimer.current);
      window.clearTimeout(leaveTimer.current);
      stopAmbient();
    },
    [],
  );

  const begin = () => {
    if (startAmbient()) {
      setPlaying(true);
      setLocked(false);
    } else {
      setLocked(true);
    }
  };

  const stop = () => {
    stopAmbient();
    setPlaying(false);
    setOfferKeep(false);
  };

  const onEnter = () => {
    window.clearTimeout(leaveTimer.current);
    begin();
    if (!keep) {
      window.clearTimeout(offerTimer.current);
      offerTimer.current = window.setTimeout(
        () => setOfferKeep(true),
        KEEP_OFFER_DELAY_MS,
      );
    }
  };

  const onLeave = () => {
    window.clearTimeout(offerTimer.current);
    setLocked(false);
    if (keep) return;
    leaveTimer.current = window.setTimeout(stop, LEAVE_GRACE_MS);
  };

  const toggleKeep = () => {
    if (keep) {
      setKeep(false);
      stop();
    } else {
      setKeep(true);
      if (!playing) begin();
    }
  };

  return (
    <div
      className="flex flex-col items-center gap-2"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <svg
        width="140"
        height="128"
        viewBox="0 0 140 128"
        {...stroke}
        onPointerDown={() => !playing && begin()}
      >
        <path d="M20 78C20 32 44 10 70 10s50 22 50 68" />
        <path d="M28 78C28 38 48 18 70 18s42 20 42 60" />
        <path d="M20 78h8M112 78h8" />
        <path d="M24 78v6M116 78v6" />
        <rect x="6" y="84" width="36" height="42" rx="16" />
        <rect x="98" y="84" width="36" height="42" rx="16" />
        <path d="M14 96c2-4 18-4 20 0M106 96c2-4 18-4 20 0" />
        <circle
          cx="24"
          cy="110"
          r="1.6"
          fill={playing ? "currentColor" : "none"}
        />
        <circle
          cx="116"
          cy="110"
          r="1.6"
          fill={playing ? "currentColor" : "none"}
        />
        <g
          className="transition-opacity duration-500"
          style={{ opacity: playing ? 1 : 0 }}
        >
          <path d="M2 99c-2 3-2 9 0 12M138 99c2 3 2 9 0 12" />
        </g>
      </svg>
      <div
        className="flex h-7 items-center whitespace-nowrap"
        style={{ rotate: `${-rotate}deg` }}
      >
        {locked ? (
          <Pill>Click to play music</Pill>
        ) : keep ? (
          <Pill onClick={toggleKeep}>Stop music</Pill>
        ) : offerKeep ? (
          <Pill onClick={toggleKeep}>Keep playing</Pill>
        ) : null}
      </div>
    </div>
  );
};

const RaspberryPi = () => {
  const [power, setPower] = useState(false);
  const [activity, setActivity] = useState(false);
  const later = useTimers();

  const toggle = () => {
    if (power) {
      if (!playChime([659, 440], 0.16, 0.3, 0.09)) return;
      setPower(false);
      setActivity(false);
      return;
    }
    if (!playChime([523, 784], 0.18, 0.35, 0.1)) return;
    setPower(true);
    [80, 260, 420, 640, 800, 1050].forEach((ms, i) =>
      later(() => setActivity(i % 2 === 0), ms),
    );
  };

  return (
    <svg
      width="176"
      height="112"
      viewBox="0 0 176 112"
      {...stroke}
      onPointerDown={toggle}
    >
      <rect x="2" y="2" width="166" height="104" rx="8" />
      <circle cx="14" cy="14" r="3" />
      <circle cx="72" cy="14" r="3" />
      <circle cx="14" cy="94" r="3" />
      <circle cx="72" cy="94" r="3" />
      <rect x="60" y="5" width="102" height="12" rx="1.5" />
      <path d="M65 8.5h92M65 13.5h92" strokeDasharray="1.5 2.7" />
      <rect x="60" y="40" width="26" height="26" rx="2" />
      <rect x="96" y="44" width="18" height="18" rx="2" />
      <rect x="146" y="28" width="26" height="20" rx="2" />
      <rect x="146" y="54" width="26" height="20" rx="2" />
      <rect x="146" y="82" width="26" height="22" rx="2" />
      <rect x="20" y="98" width="12" height="10" rx="1.5" />
      <rect x="44" y="98" width="18" height="10" rx="1.5" />
      <circle cx="82" cy="100" r="4" />
      <rect x="22" y="34" width="8" height="40" rx="1.5" />
      <rect
        x="8"
        y="44"
        width="5"
        height="3"
        rx="0.5"
        fill={power ? "currentColor" : "none"}
      />
      <rect
        x="8"
        y="52"
        width="5"
        height="3"
        rx="0.5"
        fill={activity ? "currentColor" : "none"}
      />
    </svg>
  );
};

const EspBoard = () => {
  const [lit, setLit] = useState(false);
  const later = useTimers();

  const blink = (times: number) => {
    for (let i = 0; i < times; i++) {
      later(() => setLit(true), i * 220);
      later(() => setLit(false), i * 220 + 110);
    }
  };

  const boot = () => {
    playBeep(1200, 0.09);
    blink(1);
  };

  const reset = () => {
    playBeep(1600, 0.06);
    later(() => playBeep(2200, 0.08), 90);
    blink(3);
  };

  return (
    <svg
      width="70"
      height="144"
      viewBox="0 0 70 144"
      {...stroke}
      onPointerDown={boot}
    >
      <rect x="6" y="2" width="58" height="134" rx="4" />
      <rect x="17" y="8" width="36" height="34" rx="2" />
      <path d="M22 14v6h4v-6h4v6h4v-6h4v6h4v-6h4v6" />
      <path d="M10 50v80M60 50v80" strokeDasharray="2 3.2" />
      <rect x="27" y="62" width="16" height="16" rx="1.5" />
      <circle
        cx="21"
        cy="52"
        r="1.5"
        fill={lit ? "currentColor" : "none"}
        className="transition-[fill] duration-100"
      />
      <rect
        x="13"
        y="118"
        width="8"
        height="6"
        rx="1"
        className={pressClass}
        onPointerDown={(e) => {
          e.stopPropagation();
          reset();
        }}
      />
      <rect
        x="49"
        y="118"
        width="8"
        height="6"
        rx="1"
        className={pressClass}
        onPointerDown={(e) => {
          e.stopPropagation();
          boot();
        }}
      />
      <rect x="27" y="128" width="16" height="14" rx="2.5" />
    </svg>
  );
};

const doodles: Record<DoodleKind, (props: IArt) => React.ReactElement> = {
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  raspberryPi: RaspberryPi,
  espBoard: EspBoard,
};

const Doodle = ({ kind, className = "", rotate = 0, float = 6 }: IDoodle) => {
  const reduceMotion = useReducedMotion();
  const Art = doodles[kind];

  useEffect(installAudioUnlock, []);

  return (
    <motion.div
      aria-hidden
      className={`absolute hidden cursor-pointer select-none text-white/25 transition-colors duration-300 hover:text-white xl:block ${className}`}
      style={{ rotate }}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -float, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Art rotate={rotate} />
      </motion.div>
    </motion.div>
  );
};

export default Doodle;
