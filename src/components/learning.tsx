"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuMaximize,
  LuMinimize,
} from "react-icons/lu";
import {
  ILearningSlide,
  ILearningTopic,
  SlideBlock,
  SlideListItem,
} from "../interfaces/components";
import {
  CardGrid,
  EntityDiagram,
  FitBox,
  FlowDiagram,
  SequenceDiagram,
  SpectrumDiagram,
} from "./diagrams";
import { LearningTracks } from "../constants/learning";
import HorizontalLines from "./horizontal-lines";
import LinkButton from "./link-button";

/** Slides are laid out at this size and scaled to the screen, like a projector. */
const CANVAS_W = 1280;
const CANVAS_H = 720;

type Position = { topic: number; slide: number };
type Direction = { x: number; y: number };

const pad = (value: number) => String(value).padStart(2, "0");

const isText = (block: SlideBlock) =>
  block.type === "text" || block.type === "list" || block.type === "note";

/** Renders the little markdown the notes use: **bold**, `code` and [links](url). */
const Inline = ({ text }: { text: string }) => (
  <>
    {text
      .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
      .map((part, index) => {
        if (part.startsWith("**")) {
          return (
            <strong key={index} className="font-medium text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-ink/10 px-1 py-0.5 text-[0.9em]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <a
              key={index}
              href={link[2]}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline decoration-blue-500/50 underline-offset-4 transition-colors hover:decoration-blue-500"
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
  </>
);

const List = ({
  items,
  depth = 0,
}: {
  items: SlideListItem[];
  depth?: number;
}) => (
  <ul className={depth ? "mt-2 space-y-1.5" : "space-y-3.5"}>
    {items.map((item, index) => {
      const text = typeof item === "string" ? item : item.text;
      return (
        <li
          key={index}
          className={`relative font-light ${
            depth
              ? "pl-5 text-[16px] leading-[1.5] text-ink/55"
              : "pl-7 text-[19px] leading-[1.5] text-ink/80"
          }`}
        >
          <span
            className={`absolute rounded-full ${
              depth
                ? "left-1 top-[10px] h-1.5 w-1.5 bg-ink/30"
                : "left-0 top-[10px] h-2 w-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
            }`}
          />
          <Inline text={text} />
          {typeof item !== "string" && (
            <List items={item.items} depth={depth + 1} />
          )}
        </li>
      );
    })}
  </ul>
);

const Block = ({ block }: { block: SlideBlock }) => {
  switch (block.type) {
    case "text":
      return (
        <p className="text-[19px] font-light leading-[1.5] text-ink/80">
          <Inline text={block.text} />
        </p>
      );
    case "list":
      return <List items={block.items} />;
    case "note":
      return (
        <p className="rounded-r-xl border-l-2 border-blue-500 bg-blue-500/[0.06] py-3 pl-5 pr-4 text-[17px] font-light italic text-ink/70">
          <Inline text={block.text} />
        </p>
      );
    case "cards":
      return <CardGrid columns={block.columns} items={block.items} />;
    case "flow":
      return (
        <FitBox>
          <FlowDiagram {...block} />
        </FitBox>
      );
    case "sequence":
      return (
        <FitBox>
          <SequenceDiagram {...block} />
        </FitBox>
      );
    case "entities":
      return (
        <FitBox>
          <EntityDiagram {...block} />
        </FitBox>
      );
    case "spectrum":
      return (
        <FitBox>
          <SpectrumDiagram {...block} />
        </FitBox>
      );
  }
};

const Slide = ({
  slide,
  topic,
  topicIndex,
  slideIndex,
}: {
  slide: ILearningSlide;
  topic: ILearningTopic;
  topicIndex: number;
  slideIndex: number;
}) => {
  const text = slide.blocks.filter(isText);
  const visuals = slide.blocks.filter((block) => !isText(block));
  const split =
    text.length > 0 && visuals.length > 0 && slide.layout !== "stack";
  const slideCount = topic.slides.length;

  return (
    <div className="relative flex h-full w-full flex-col px-[72px] pb-[64px] pt-[44px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[13px] uppercase tracking-[0.2em] text-ink/45">
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[12px] font-medium text-blue-500">
            {pad(topicIndex + 1)}
          </span>
          {topic.title}
        </div>
        <span className="text-[13px] tabular-nums tracking-widest text-ink/40">
          {pad(slideIndex + 1)} / {pad(slideCount)}
        </span>
      </div>
      <h2 className="mt-5 font-serif text-[46px] leading-[1.12] tracking-wide text-ink">
        {slide.title}
      </h2>
      <div
        className={`mt-8 flex min-h-0 flex-1 ${split ? "gap-14" : "flex-col gap-6"}`}
      >
        {text.length > 0 && (
          <div
            className={`flex flex-col gap-5 ${split ? "w-[440px] shrink-0 justify-center" : ""}`}
          >
            {text.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
        )}
        {visuals.length > 0 && (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6">
            {visuals.map((block, index) => (
              <div key={index} className="flex min-h-0 flex-1">
                <Block block={block} />
              </div>
            ))}
          </div>
        )}
      </div>
      {slideCount > 1 && (
        <div className="absolute inset-x-[72px] bottom-[30px] flex gap-1.5">
          {topic.slides.map((_, index) => (
            <span
              key={index}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              {index <= slideIndex && (
                <motion.span
                  className="block h-full rounded-full bg-blue-500"
                  initial={{ width: index === slideIndex ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const RoundButton = ({
  label,
  onClick,
  disabled,
  large,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  large?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    onClick={onClick}
    disabled={disabled}
    className={`flex shrink-0 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink disabled:invisible ${
      large ? "h-9 w-9 sm:h-12 sm:w-12" : "h-8 w-8"
    }`}
  >
    {children}
  </button>
);

// The slides carry icon components, which cannot cross from a server page into
// a client component as props, so the deck reads them here instead.
const tracks = LearningTracks;

const LearningDeck = () => {
  const reduceMotion = useReducedMotion();
  const [trackId, setTrackId] = useState(tracks[0]?.id);
  const [position, setPosition] = useState<Position>({ topic: 0, slide: 0 });
  const [direction, setDirection] = useState<Direction>({ x: 0, y: 0 });
  const [deckWidth, setDeckWidth] = useState<number | null>(null);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<[number, number] | null>(null);

  const track = tracks.find((item) => item.id === trackId) ?? tracks[0];
  const topic = track?.topics[position.topic];
  const slide = topic?.slides[position.slide];

  const go = useCallback(
    (topicIndex: number, slideIndex: number) => {
      const next = track?.topics[topicIndex];
      if (!next?.slides[slideIndex]) return false;
      if (topicIndex === position.topic && slideIndex === position.slide) {
        return false;
      }
      setDirection(
        topicIndex !== position.topic
          ? { x: Math.sign(topicIndex - position.topic), y: 0 }
          : { x: 0, y: Math.sign(slideIndex - position.slide) },
      );
      setPosition({ topic: topicIndex, slide: slideIndex });
      // A hash keeps the slide shareable without a navigation per step.
      window.history.replaceState(
        null,
        "",
        `#${track.id}/${next.id}/${slideIndex + 1}`,
      );
      return true;
    },
    [track, position],
  );

  const prevTopic = useCallback(
    () => go(position.topic - 1, 0),
    [go, position],
  );
  const nextTopic = useCallback(
    () => go(position.topic + 1, 0),
    [go, position],
  );
  const prevSlide = useCallback(
    () => go(position.topic, position.slide - 1),
    [go, position],
  );
  const nextSlide = useCallback(
    () => go(position.topic, position.slide + 1),
    [go, position],
  );

  // Opening a shared link lands on the slide it names.
  useEffect(() => {
    const [trackPart, topicPart, slidePart] = window.location.hash
      .slice(1)
      .split("/");
    const linked = tracks.find((item) => item.id === trackPart);
    const topicIndex =
      linked?.topics.findIndex((item) => item.id === topicPart) ?? -1;
    if (!linked || topicIndex < 0) return;
    const slides = linked.topics[topicIndex].slides.length;
    const slideIndex = Math.min(
      Math.max((Number(slidePart) || 1) - 1, 0),
      slides - 1,
    );
    setTrackId(linked.id);
    setPosition({ topic: topicIndex, slide: slideIndex });
  }, []);

  // The deck is the largest 16:9 box the stage can hold.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const fit = () => {
      const { width, height } = stage.getBoundingClientRect();
      const w = Math.floor(Math.min(width, (height * 16) / 9));
      setDeckWidth(w > 0 ? w : null);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const moves: Record<string, () => boolean> = {
      ArrowLeft: prevTopic,
      ArrowRight: nextTopic,
      ArrowUp: prevSlide,
      ArrowDown: nextSlide,
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      const move = moves[event.key];
      if (move?.()) event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prevTopic, nextTopic, prevSlide, nextSlide]);

  if (!track || !topic || !slide) return null;

  const slideCount = topic.slides.length;
  const prevTopicData = track.topics[position.topic - 1];
  const nextTopicData = track.topics[position.topic + 1];
  const distance = reduceMotion ? 0 : 90;
  const variants = {
    enter: (d: Direction) => ({
      opacity: 0,
      x: d.x * distance,
      y: d.y * distance,
    }),
    center: { opacity: 1, x: 0, y: 0 },
    exit: (d: Direction) => ({
      opacity: 0,
      x: -d.x * distance,
      y: -d.y * distance,
    }),
  };

  const selectTrack = (id: string) => {
    setTrackId(id);
    setDirection({ x: 0, y: 0 });
    setPosition({ topic: 0, slide: 0 });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen();
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4 pb-3 [@media(max-height:500px)]:hidden">
        <div className="flex min-w-0 flex-col">
          <h1 className="font-serif text-xl tracking-wide text-ink sm:text-2xl">
            What I&apos;m Learning
          </h1>
          <p className="hidden text-xs font-light text-ink/55 sm:block">
            My notes, as slides.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div role="tablist" aria-label="Tracks" className="flex gap-2">
            {tracks.map((item) => {
              const active = item.id === track.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  title={item.title}
                  onClick={() => selectTrack(item.id)}
                  className={`rounded-xl border px-3 py-1 text-sm transition-colors ${
                    active
                      ? "border-ink/20 bg-ink/10 font-medium text-ink"
                      : "border-ink/5 bg-surface font-light text-ink/70 hover:bg-ink/10"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="hidden md:block">
            <LinkButton
              href="/"
              text="Back home"
              iconPosition="left"
              icon={
                <FaArrowLeft
                  size={11}
                  className="text-ink/80 transition-transform group-hover:-translate-x-0.5"
                />
              }
            />
          </div>
        </div>
      </header>
      <div className="[@media(max-height:500px)]:hidden">
        <HorizontalLines />
      </div>

      <div
        ref={rootRef}
        className="flex min-h-0 flex-1 flex-col gap-2 bg-canvas pt-3 max-md:portrait:flex-none [&:fullscreen]:p-6"
      >
        <div className="grid h-9 grid-cols-[1fr_auto_1fr] items-center gap-3">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5"
          >
            <span className="shrink-0 rounded-xl border border-ink/10 bg-surface px-2.5 py-0.5 text-xs text-ink/70">
              {track.label}
            </span>
            <LuChevronRight size={12} className="shrink-0 text-ink/30" />
            <span className="truncate rounded-xl border border-ink/10 bg-surface px-2.5 py-0.5 text-xs text-ink">
              {topic.title}
            </span>
          </nav>
          <RoundButton
            label="Previous slide"
            onClick={prevSlide}
            disabled={position.slide === 0}
          >
            <LuChevronUp size={16} />
          </RoundButton>
          <div className="flex items-center justify-end gap-2">
            <span className="hidden rounded-xl border border-ink/10 bg-surface px-2.5 py-0.5 text-xs tabular-nums text-ink/60 sm:block">
              {position.slide + 1} / {slideCount}
            </span>
            {canFullscreen && (
              <RoundButton
                label={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={toggleFullscreen}
              >
                {fullscreen ? (
                  <LuMinimize size={14} />
                ) : (
                  <LuMaximize size={14} />
                )}
              </RoundButton>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-stretch gap-2 sm:gap-4 max-md:portrait:flex-none">
          <div className="flex items-center">
            <RoundButton
              large
              label={
                prevTopicData
                  ? `Previous topic: ${prevTopicData.title}`
                  : "Previous topic"
              }
              onClick={prevTopic}
              disabled={!prevTopicData}
            >
              <LuChevronLeft size={20} />
            </RoundButton>
          </div>

          <div
            ref={stageRef}
            className="relative flex min-w-0 flex-1 items-center justify-center max-md:portrait:aspect-video"
          >
            <div
              className={`relative touch-none overflow-hidden rounded-2xl border border-ink/10 shadow-[0_30px_80px_-40px_var(--shadow)] ${
                deckWidth ? "" : "invisible aspect-video w-full"
              }`}
              style={
                deckWidth
                  ? { width: deckWidth, height: (deckWidth * 9) / 16 }
                  : undefined
              }
              onTouchStart={(event) => {
                const touch = event.touches[0];
                touchStart.current = [touch.clientX, touch.clientY];
              }}
              onTouchEnd={(event) => {
                const start = touchStart.current;
                touchStart.current = null;
                if (!start) return;
                const touch = event.changedTouches[0];
                const dx = touch.clientX - start[0];
                const dy = touch.clientY - start[1];
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
                if (Math.abs(dx) > Math.abs(dy)) {
                  if (dx < 0) nextTopic();
                  else prevTopic();
                } else if (dy < 0) nextSlide();
                else prevSlide();
              }}
            >
              <div
                className="slide-grid absolute left-0 top-0 origin-top-left"
                style={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                  transform: `scale(${(deckWidth ?? CANVAS_W) / CANVAS_W})`,
                }}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <motion.section
                    key={`${track.id}/${topic.id}/${position.slide}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    aria-roledescription="slide"
                    aria-label={`${slide.title}, ${position.slide + 1} of ${slideCount}`}
                    className="absolute inset-0"
                  >
                    <Slide
                      slide={slide}
                      topic={topic}
                      topicIndex={position.topic}
                      slideIndex={position.slide}
                    />
                  </motion.section>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <RoundButton
              large
              label={
                nextTopicData
                  ? `Next topic: ${nextTopicData.title}`
                  : "Next topic"
              }
              onClick={nextTopic}
              disabled={!nextTopicData}
            >
              <LuChevronRight size={20} />
            </RoundButton>
          </div>
        </div>

        <div className="grid h-9 grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {track.topics.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Topic ${index + 1}: ${item.title}`}
                  title={item.title}
                  onClick={() => go(index, 0)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === position.topic
                      ? "w-6 bg-blue-500"
                      : "w-1.5 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
            <span className="hidden text-xs font-light text-ink/45 sm:block">
              Topic {position.topic + 1} of {track.topics.length}
            </span>
          </div>
          <motion.div
            animate={
              reduceMotion || position.slide === slideCount - 1
                ? undefined
                : { y: [0, 3, 0] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <RoundButton
              label="Next slide"
              onClick={nextSlide}
              disabled={position.slide === slideCount - 1}
            >
              <LuChevronDown size={16} />
            </RoundButton>
          </motion.div>
          <p className="hidden justify-self-end text-xs font-light text-ink/40 lg:block">
            ← → topics · ↑ ↓ slides
          </p>
        </div>

        <p className="hidden text-center text-xs font-light text-ink/45 max-md:portrait:block">
          Turn your phone sideways for a bigger view.
        </p>
      </div>
    </>
  );
};

export default LearningDeck;
