"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  applyTheme,
  currentTheme,
  DEFAULT_THEME,
  storeTheme,
  Theme,
  THEME_COLOR,
} from "../lib/theme";

interface IThemeContext {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext>({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type ViewTransition = { ready: Promise<void>; finished: Promise<void> };

const startViewTransition = (update: () => void): ViewTransition | null => {
  const start = (
    document as unknown as {
      startViewTransition?: (cb: () => void) => ViewTransition;
    }
  ).startViewTransition;
  return start ? start.call(document, update) : null;
};

const SWEEP_MS = 1000;
const SWEEP_STYLE_ID = "theme-sweep";

/**
 * Few enough blocks that each one gets a visible turn. Every block owns its own
 * slice of the sweep and none of the slices overlap, so exactly one block is
 * ever opening; with many more than this a slice would be down to a frame or
 * two and they would read as arriving together again.
 */
const TILE_COUNT = 14;
const TILE_MS = SWEEP_MS / TILE_COUNT;
/** Samples per block, so a block grows rather than snapping open. */
const STEPS_PER_TILE = 5;
const SWEEP_STEPS = TILE_COUNT * STEPS_PER_TILE;

/** Shortest side a block may be split down to. */
const MIN_TILE = 72;
/** Where along a side a split may land, kept off the ends to avoid slivers. */
const SPLIT_MIN = 0.36;
const SPLIT_MAX = 0.64;
/** Blocks grow from their centres, so they overlap slightly to hide seams. */
const BLEED = 1;

interface IRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ITile extends IRect {
  delay: number;
}

const easeOut = (p: number) => 1 - (1 - p) ** 3;

const shuffle = <T,>(items: T[]) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

/**
 * Cuts the viewport into blocks of mixed size, then hands out start times in
 * random order.
 *
 * Splitting one block in two at a time, picked at random, is what leaves a mix
 * of sizes: a block that keeps being picked ends up small while one that is
 * never picked stays large. Shuffling is what makes them arrive all over the
 * screen rather than as a front moving across it.
 */
const buildTiles = (): ITile[] => {
  const rects: IRect[] = [
    { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight },
  ];

  while (rects.length < TILE_COUNT) {
    const options = rects
      .map((rect, index) => ({ rect, index }))
      .filter(({ rect }) => Math.max(rect.w, rect.h) >= MIN_TILE * 2);
    if (!options.length) break;

    const { rect, index } = options[Math.floor(Math.random() * options.length)];
    const ratio = SPLIT_MIN + Math.random() * (SPLIT_MAX - SPLIT_MIN);
    // Cut across the longer side, so blocks stay blocks rather than ribbons.
    const across = rect.w >= rect.h;
    const head = across
      ? { x: rect.x, y: rect.y, w: rect.w * ratio, h: rect.h }
      : { x: rect.x, y: rect.y, w: rect.w, h: rect.h * ratio };
    const tail = across
      ? { x: rect.x + head.w, y: rect.y, w: rect.w - head.w, h: rect.h }
      : { x: rect.x, y: rect.y + head.h, w: rect.w, h: rect.h - head.h };
    rects.splice(index, 1, head, tail);
  }

  return shuffle(rects).map((rect, index) => ({
    ...rect,
    delay: index * TILE_MS,
  }));
};

/** One solid mask layer per block; the layer count has to come from mask-image. */
const tileMask = (tiles: ITile[]) =>
  tiles.map(() => "linear-gradient(#000, #000)").join(", ");

/**
 * Each block opens on its own clock, which no pair of keyframes could express,
 * so the sweep is sampled instead and every step carries the size and centre of
 * every block at that instant. Timing stays linear because the easing is
 * already baked into each block's own progress.
 */
const sampleSweep = (tiles: ITile[]) =>
  Array.from({ length: SWEEP_STEPS }, (_, step) => {
    const elapsed = (step / (SWEEP_STEPS - 1)) * SWEEP_MS;
    const sizes: string[] = [];
    const positions: string[] = [];

    for (const tile of tiles) {
      const progress = easeOut(
        Math.min(1, Math.max(0, (elapsed - tile.delay) / TILE_MS)),
      );
      const w = (tile.w + BLEED) * progress;
      const h = (tile.h + BLEED) * progress;
      sizes.push(`${w.toFixed(1)}px ${h.toFixed(1)}px`);
      positions.push(
        `${(tile.x + (tile.w - w) / 2).toFixed(1)}px ${(
          tile.y +
          (tile.h - h) / 2
        ).toFixed(1)}px`,
      );
    }

    return { sizes: sizes.join(", "), positions: positions.join(", ") };
  });

const tileFrames = (tiles: ITile[]): Keyframe[] => {
  const mask = tileMask(tiles);
  return sampleSweep(tiles).map(({ sizes, positions }) => ({
    maskImage: mask,
    maskSize: sizes,
    maskPosition: positions,
  }));
};

/**
 * The sweep runs as a stylesheet put in place before the transition starts,
 * not as an animation attached from script once it reports ready.
 *
 * Script cannot reach these pseudo-elements until `ready` resolves, yet the
 * layer is already on screen by then. A script animation also has to fill
 * forwards to hold its last frame, and that filled animation stayed attached
 * after the transition ended: on the next switch it re-applied its final
 * frame, holding the mask wide open, so the whole page showed the new theme
 * before any block had opened. A stylesheet is in force the moment the
 * pseudo-element exists and leaves nothing behind when it is removed.
 */
const sweepStyle = (shift: string, tiles: ITile[]) => {
  const samples = sampleSweep(tiles);
  const steps = samples
    .map(
      ({ sizes, positions }, i) =>
        `${((i / (samples.length - 1)) * 100).toFixed(2)}%{mask-size:${sizes};mask-position:${positions}}`,
    )
    .join("");

  const style = document.createElement("style");
  style.id = SWEEP_STYLE_ID;
  style.textContent =
    `:root[data-theme-shift="${shift}"]::view-transition-${
      shift === "spread" ? "new" : "old"
    }(root){` +
    `mask-image:${tileMask(tiles)};mask-repeat:no-repeat;` +
    // Closing runs the same blocks backwards, so one set of keyframes serves both.
    `animation:theme-sweep ${SWEEP_MS}ms linear ${
      shift === "spread" ? "" : "reverse "
    }both}` +
    `@keyframes theme-sweep{${steps}}`;
  return style;
};

/**
 * Fallback for browsers without view transitions: paint the colour that is
 * leaving over the page and run the same blocks by hand. Going light the
 * overlay is the new canvas opening up, going dark it is the old one closing.
 */
const wipe = (toLight: boolean, commit: () => void) => {
  const frames = tileFrames(buildTiles());
  const ordered = toLight ? frames : [...frames].reverse();
  const overlay = document.createElement("div");
  overlay.className = "theme-wipe";
  overlay.style.background = THEME_COLOR[toLight ? "light" : "dark"];
  overlay.style.maskRepeat = "no-repeat";
  Object.assign(overlay.style, ordered[0]);
  document.body.appendChild(overlay);

  if (!toLight) commit();

  const animation = overlay.animate(ordered, {
    duration: SWEEP_MS,
    fill: "forwards",
  });

  animation.finished
    .catch(() => {})
    .then(() => {
      if (toLight) commit();
      overlay.remove();
    });
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // The boot script has already themed the document; this only catches React up.
  useEffect(() => setTheme(currentTheme()), []);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      setTheme(next);
      storeTheme(next);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      commit();
      return;
    }

    const toLight = next === "light";
    const root = document.documentElement;

    // Light opens into the incoming snapshot; dark closes the outgoing one.
    const shift = toLight ? "spread" : "converge";
    document.getElementById(SWEEP_STYLE_ID)?.remove();
    const style = sweepStyle(shift, buildTiles());
    document.head.append(style);
    root.dataset.themeShift = shift;

    const transition = startViewTransition(() => flushSync(commit));

    if (!transition) {
      style.remove();
      delete root.dataset.themeShift;
      wipe(toLight, commit);
      return;
    }

    void transition.finished
      .catch(() => {})
      .then(() => {
        style.remove();
        // A second toggle can interrupt this one; leave its direction alone.
        if (root.dataset.themeShift === shift) delete root.dataset.themeShift;
      });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
