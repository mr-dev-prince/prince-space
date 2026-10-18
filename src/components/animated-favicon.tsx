"use client";

import { useEffect } from "react";

const SIZE = 64;

/**
 * The same `</>` as public/favicon.svg, kept in sync by hand. Only Firefox
 * animates an SVG favicon, so other browsers get these frames swapped in
 * from script instead.
 */
const open = (ink: string) =>
  `<path d="M20 17 5 32l15 15" stroke="${ink}"/>`;
const SLASH = `<path d="M37 12 27 52" stroke="#3b82f6"/>`;
const close = (ink: string) =>
  `<path d="M44 17l15 15-15 15" stroke="${ink}"/>`;

const svg = (marks: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
  `<g fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${marks}</g>` +
  `</svg>`;

/** The tag types itself out, then holds before starting over. */
const FRAMES = [
  { marks: (ink: string) => open(ink), ms: 220 },
  { marks: (ink: string) => open(ink) + SLASH, ms: 220 },
  { marks: (ink: string) => open(ink) + SLASH + close(ink), ms: 2400 },
];

/**
 * The background is transparent, so the brackets follow the browser's own
 * light or dark tab strip rather than the site's theme toggle.
 */
const INK = { light: "#111111", dark: "#ffffff" };

/** Rasterised, because Safari does not draw SVG favicons. */
const toPng = (source: string) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = SIZE;
      canvas.getContext("2d")?.drawImage(image, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = reject;
    image.src = `data:image/svg+xml,${encodeURIComponent(source)}`;
  });

const render = (ink: string) =>
  Promise.all(FRAMES.map((frame) => toPng(svg(frame.marks(ink)))));

const setFavicon = (href: string) => {
  document
    .querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')
    .forEach((link) => {
      link.type = "image/png";
      link.href = href;
    });
};

const AnimatedFavicon = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    let timer: number | undefined;
    let cancelled = false;

    Promise.all([render(INK.light), render(INK.dark)])
      .then(([light, dark]) => {
        if (cancelled) return;
        // The page loads showing the full tag, so the first pause is a hold.
        let index = FRAMES.length - 1;
        const tick = () => {
          index = (index + 1) % FRAMES.length;
          setFavicon((darkScheme.matches ? dark : light)[index]);
          timer = window.setTimeout(tick, FRAMES[index].ms);
        };
        timer = window.setTimeout(tick, FRAMES[index].ms);
      })
      // The static favicon from the metadata is still there to fall back on.
      .catch(() => {});

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return null;
};

export default AnimatedFavicon;
