"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { LuKeyRound, LuLink, LuRabbit, LuSnail } from "react-icons/lu";
import {
  DiagramTone,
  IEntity,
  IFlowEdge,
  IFlowNode,
  ISequenceActor,
  ISlideCard,
  SequenceStep,
} from "../interfaces/components";

type Point = [number, number];
type Tone = DiagramTone | "default";

const HEAD = 9;
/** Breathing room between an edge's end and the node it points at. */
const GAP = 4;
const EASE = [0.22, 1, 0.36, 1] as const;

const tones: Record<
  Tone,
  {
    card: string;
    chip: string;
    text: string;
    stroke: string;
    head: string;
    ring: string;
    band: string;
    dot: string;
  }
> = {
  default: {
    card: "border-ink/15 bg-gradient-to-b from-ink/[0.07] to-ink/[0.02]",
    chip: "bg-ink/[0.08] text-ink/80",
    text: "text-ink/70",
    stroke: "stroke-ink/45",
    head: "fill-ink/55",
    ring: "border-ink/30",
    band: "fill-ink/[0.03]",
    dot: "fill-blue-500 text-blue-500",
  },
  accent: {
    card: "border-blue-500/50 bg-gradient-to-b from-blue-500/[0.16] to-blue-500/[0.04]",
    chip: "bg-blue-500/15 text-blue-500",
    text: "text-blue-500",
    stroke: "stroke-blue-500/80",
    head: "fill-blue-500",
    ring: "border-blue-500/50",
    band: "fill-blue-500/[0.06]",
    dot: "fill-blue-500 text-blue-500",
  },
  good: {
    card: "border-green-500/50 bg-gradient-to-b from-green-500/[0.16] to-green-500/[0.04]",
    chip: "bg-green-500/15 text-green-500",
    text: "text-green-500",
    stroke: "stroke-green-500/80",
    head: "fill-green-500",
    ring: "border-green-500/50",
    band: "fill-green-500/[0.06]",
    dot: "fill-green-500 text-green-500",
  },
  bad: {
    card: "border-red-500/50 bg-gradient-to-b from-red-500/[0.16] to-red-500/[0.04]",
    chip: "bg-red-500/15 text-red-500",
    text: "text-red-500",
    stroke: "stroke-red-500/80",
    head: "fill-red-500",
    ring: "border-red-500/50",
    band: "fill-red-500/[0.06]",
    dot: "fill-red-500 text-red-500",
  },
};

const SHADOW = "shadow-[0_12px_32px_-16px_var(--shadow)]";

/**
 * Scales a fixed-size visual down to whatever room the slide layout leaves it,
 * so diagrams can be drawn at one size and still never spill out of a slide.
 */
export const FitBox = ({
  children,
  max = 1.15,
}: {
  children: React.ReactNode;
  max?: number;
}) => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content) return;
    const fit = () => {
      if (!content.offsetWidth || !content.offsetHeight) return;
      setScale(
        Math.min(
          max,
          box.clientWidth / content.offsetWidth,
          box.clientHeight / content.offsetHeight,
        ),
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    observer.observe(content);
    return () => observer.disconnect();
  }, [max]);

  return (
    <div
      ref={outer}
      className="flex h-full min-h-0 w-full min-w-0 items-center justify-center"
    >
      <div
        ref={inner}
        className="w-max shrink-0"
        style={{
          transform: `scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const fmt = ([x, y]: Point) => `${+x.toFixed(1)},${+y.toFixed(1)}`;

/** The point `distance` along the way from `point` towards `toward`. */
const back = ([x, y]: Point, [tx, ty]: Point, distance: number): Point => {
  const length = Math.hypot(tx - x, ty - y) || 1;
  return [
    x + ((tx - x) / length) * distance,
    y + ((ty - y) / length) * distance,
  ];
};

const arrowHead = (tip: Point, from: Point) => {
  const angle = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const [bx, by] = back(tip, from, HEAD);
  const sin = Math.sin(angle) * 5;
  const cos = Math.cos(angle) * 5;
  return `M${fmt(tip)} L${fmt([bx - sin, by + cos])} L${fmt([bx + sin, by - cos])} Z`;
};

/** Keyframe times that keep a dot at one speed along segments of any length. */
const travelTimes = (points: Point[]) => {
  const lengths = points
    .slice(1)
    .map((point, index) =>
      Math.hypot(point[0] - points[index][0], point[1] - points[index][1]),
    );
  const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
  let covered = 0;
  return [0, ...lengths.map((length) => (covered += length) / total)];
};

const size = (node: IFlowNode): Point => {
  if (node.kind === "circle") {
    const w = node.w ?? 72;
    return [w, w];
  }
  if (node.kind === "chip") return [node.w ?? 110, node.h ?? 32];
  return [node.w ?? 180, node.h ?? 60];
};

/** Where a line from the node's centre towards `toward` leaves its outline. */
const border = (node: IFlowNode, toward: Point): Point => {
  const [w, h] = size(node);
  const dx = toward[0] - node.x;
  const dy = toward[1] - node.y;
  if (!dx && !dy) return [node.x, node.y];
  const hw = w / 2;
  const hh = h / 2;
  const t =
    node.kind === "circle"
      ? hw / Math.hypot(dx, dy)
      : node.kind === "diamond"
        ? 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh)
        : 1 / Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
  const length = Math.hypot(dx, dy);
  return [
    node.x + dx * t + (dx / length) * GAP,
    node.y + dy * t + (dy / length) * GAP,
  ];
};

/** The middle of one side of a node, nudged out by the gap. */
const side = (node: IFlowNode, axis: "x" | "y", sign: number): Point => {
  const [w, h] = size(node);
  return axis === "x"
    ? [node.x + sign * (w / 2 + GAP), node.y]
    : [node.x, node.y + sign * (h / 2 + GAP)];
};

const roundedPath = (points: Point[]) => {
  let d = `M${fmt(points[0])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [prev, corner, next] = [points[i - 1], points[i], points[i + 1]];
    const radius = Math.min(
      14,
      Math.hypot(corner[0] - prev[0], corner[1] - prev[1]) / 2,
      Math.hypot(next[0] - corner[0], next[1] - corner[1]) / 2,
    );
    d += ` L${fmt(back(corner, prev, radius))} Q${fmt(corner)} ${fmt(back(corner, next, radius))}`;
  }
  return `${d} L${fmt(points[points.length - 1])}`;
};

interface IEdgeGeometry {
  d: string;
  /** Points along the edge, for the travelling dot to follow. */
  samples: Point[];
  tip: Point;
  tipFrom: Point;
  start: Point;
  startFrom: Point;
  label: Point;
}

const edgeGeometry = (
  edge: IFlowEdge,
  from: IFlowNode,
  to: IFlowNode,
): IEdgeGeometry => {
  const via = edge.via ?? [];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const endGap = edge.blocked ? 9 : HEAD;
  const trimStart = (start: Point, after: Point) =>
    edge.both ? back(start, after, HEAD) : start;

  // Bent edges follow their corners, rounded off.
  if (via.length) {
    const start = border(from, via[0]);
    const tip = border(to, via[via.length - 1]);
    const points: Point[] = [
      trimStart(start, via[0]),
      ...via,
      back(tip, via[via.length - 1], endGap),
    ];
    let label = points[0];
    let longest = -1;
    for (let i = 0; i < points.length - 1; i++) {
      const [a, b] = [points[i], points[i + 1]];
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (length > longest) {
        longest = length;
        label = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      }
    }
    return {
      d: roundedPath(points),
      samples: points,
      tip,
      tipFrom: via[via.length - 1],
      start,
      startFrom: via[0],
      label,
    };
  }

  // Lined-up nodes get a straight edge.
  if (Math.abs(dx) < 2 || Math.abs(dy) < 2) {
    const start = border(from, [to.x, to.y]);
    const tip = border(to, [from.x, from.y]);
    const a = trimStart(start, tip);
    const b = back(tip, start, endGap);
    return {
      d: `M${fmt(a)} L${fmt(b)}`,
      samples: [a, b],
      tip,
      tipFrom: start,
      start,
      startFrom: tip,
      label: [(start[0] + tip[0]) / 2, (start[1] + tip[1]) / 2],
    };
  }

  // Everything else curves out of one side and into the facing side.
  const axis = edge.anchor ?? (Math.abs(dx) >= Math.abs(dy) ? "x" : "y");
  const sign = Math.sign(axis === "x" ? dx : dy);
  const start = side(from, axis, sign);
  const tip = side(to, axis, -sign);
  const along = (point: Point, distance: number): Point =>
    axis === "x"
      ? [point[0] + sign * distance, point[1]]
      : [point[0], point[1] + sign * distance];
  const end = along(tip, -endGap);
  const begin = edge.both ? along(start, HEAD) : start;
  const c1: Point =
    axis === "x"
      ? [(begin[0] + end[0]) / 2, begin[1]]
      : [begin[0], (begin[1] + end[1]) / 2];
  const c2: Point =
    axis === "x"
      ? [(begin[0] + end[0]) / 2, end[1]]
      : [end[0], (begin[1] + end[1]) / 2];
  const at = (t: number): Point => {
    const u = 1 - t;
    const mix = (i: 0 | 1) =>
      u ** 3 * begin[i] +
      3 * u * u * t * c1[i] +
      3 * u * t * t * c2[i] +
      t ** 3 * end[i];
    return [mix(0), mix(1)];
  };
  return {
    d: `M${fmt(begin)} C${fmt(c1)} ${fmt(c2)} ${fmt(end)}`,
    samples: Array.from({ length: 25 }, (_, i) => at(i / 24)),
    tip,
    tipFrom: end,
    start,
    startFrom: begin,
    label: at(0.5),
  };
};

const ArrowHead = ({
  tip,
  from,
  tone,
}: {
  tip: Point;
  from: Point;
  tone: Tone;
}) => (
  <path
    d={arrowHead(tip, from)}
    strokeLinejoin="round"
    strokeWidth={1.5}
    className={`${tones[tone].head} ${tones[tone].stroke}`}
  />
);

/** A dotted rail with dots marching along it. */
const FlowLine = ({ d, tone }: { d: string; tone: Tone }) => (
  <>
    <path d={d} fill="none" strokeWidth={2} className="stroke-ink/[0.07]" />
    <path
      d={d}
      fill="none"
      strokeWidth={2.75}
      strokeLinecap="round"
      className={`diagram-flow ${tones[tone].stroke}`}
    />
  </>
);

const EdgePath = ({
  geometry,
  edge,
  delay,
}: {
  geometry: IEdgeGeometry;
  edge: IFlowEdge;
  delay: number;
}) => {
  const reduceMotion = useReducedMotion();
  const tone = edge.tone ?? "default";
  const { tip, samples } = geometry;
  const loop = {
    duration: 2.2,
    repeat: Infinity,
    repeatDelay: 0.4,
    delay: delay + 0.3,
  };
  const travel = {
    ...loop,
    times: travelTimes(samples),
    ease: "linear" as const,
  };

  return (
    <motion.g
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <FlowLine d={geometry.d} tone={tone} />
      {edge.blocked ? (
        <g>
          <circle
            cx={tip[0]}
            cy={tip[1]}
            r={9}
            strokeWidth={1.25}
            className="fill-red-500/15 stroke-red-500/70"
          />
          <path
            d={`M${tip[0] - 3.5},${tip[1] - 3.5} L${tip[0] + 3.5},${tip[1] + 3.5} M${tip[0] + 3.5},${tip[1] - 3.5} L${tip[0] - 3.5},${tip[1] + 3.5}`}
            strokeWidth={1.75}
            strokeLinecap="round"
            className="stroke-red-500"
          />
        </g>
      ) : (
        <ArrowHead tip={tip} from={geometry.tipFrom} tone={tone} />
      )}
      {edge.both && (
        <ArrowHead tip={geometry.start} from={geometry.startFrom} tone={tone} />
      )}
      {edge.pulse && !reduceMotion && (
        <motion.circle
          r={4.5}
          className={`diagram-dot ${tones[tone].dot}`}
          initial={{ cx: samples[0][0], cy: samples[0][1], opacity: 0 }}
          animate={{
            cx: samples.map((point) => point[0]),
            cy: samples.map((point) => point[1]),
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            cx: travel,
            cy: travel,
            opacity: { ...loop, times: [0, 0.1, 0.9, 1] },
          }}
        />
      )}
    </motion.g>
  );
};

const IconChip = ({
  icon: Icon,
  tone,
  round,
}: {
  icon: NonNullable<IFlowNode["icon"]>;
  tone: Tone;
  round?: boolean;
}) => (
  <span
    className={`flex h-10 w-10 shrink-0 items-center justify-center ${round ? "rounded-full" : "rounded-xl"} ${tones[tone].chip}`}
  >
    <Icon size={19} />
  </span>
);

const NodeText = ({ node, center }: { node: IFlowNode; center?: boolean }) => (
  <div
    className={`flex min-w-0 flex-col ${center ? "items-center text-center" : ""}`}
  >
    <span className="text-[15px] font-medium leading-tight text-ink">
      {node.label}
    </span>
    {node.sub && (
      <span className="mt-1 text-[12.5px] font-light leading-snug text-ink/55">
        {node.sub}
      </span>
    )}
  </div>
);

/** A shape drawn in SVG behind the node's text: cylinders, diamonds, hexagons. */
const ShapeNode = ({
  node,
  w,
  h,
}: {
  node: IFlowNode;
  w: number;
  h: number;
}) => {
  const id = useId().replace(/:/g, "");
  const tone = node.tone ?? "default";
  const colour = tone === "default" ? "text-ink" : tones[tone].text;
  const outline = {
    stroke: "currentColor",
    strokeOpacity: 0.45,
    strokeWidth: 1.25,
    strokeLinejoin: "round" as const,
  };

  let body: React.ReactNode;
  if (node.kind === "db") {
    const ry = Math.min(14, h * 0.13);
    const rx = w / 2 - 1;
    const top = ry + 1;
    const bottom = h - ry - 1;
    const cylinder = `M1,${top} V${bottom} A${rx},${ry} 0 0 0 ${w - 1},${bottom} V${top} Z`;
    const band = (y: number) => `M1,${y} A${rx},${ry} 0 0 0 ${w - 1},${y}`;
    body = (
      <>
        <path d={cylinder} className="fill-panel" />
        <path d={cylinder} fill={`url(#${id})`} {...outline} />
        {[0.36, 0.68].map((at) => (
          <path
            key={at}
            d={band(top + (bottom - top) * at)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.2}
          />
        ))}
        <ellipse cx={w / 2} cy={top} rx={rx} ry={ry} className="fill-panel" />
        <ellipse
          cx={w / 2}
          cy={top}
          rx={rx}
          ry={ry}
          fill="currentColor"
          fillOpacity={0.14}
          {...outline}
          strokeOpacity={0.55}
        />
      </>
    );
  } else {
    const points =
      node.kind === "diamond"
        ? `${w / 2},1 ${w - 1},${h / 2} ${w / 2},${h - 1} 1,${h / 2}`
        : `18,1 ${w - 18},1 ${w - 1},${h / 2} ${w - 18},${h - 1} 18,${h - 1} 1,${h / 2}`;
    body = (
      <>
        <polygon points={points} className="fill-panel" />
        <polygon points={points} fill={`url(#${id})`} {...outline} />
      </>
    );
  }

  return (
    <>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className={`absolute inset-0 h-full w-full overflow-visible ${colour}`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity={0.16} />
            <stop offset="100%" stopColor="currentColor" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        {body}
      </svg>
      <div
        className={`relative flex h-full w-full flex-col items-center justify-center gap-1.5 px-6 text-center ${node.kind === "db" ? "pt-5" : ""}`}
      >
        {node.icon && (
          <node.icon
            size={18}
            className={tone === "default" ? "text-ink/70" : tones[tone].text}
          />
        )}
        <NodeText node={node} center />
      </div>
    </>
  );
};

const Node = ({ node, index }: { node: IFlowNode; index: number }) => {
  const reduceMotion = useReducedMotion();
  const [w, h] = size(node);
  const tone = node.tone ?? "default";
  const styles = tones[tone];
  const kind = node.kind ?? "card";
  const round = kind === "circle" || kind === "pill" || kind === "chip";

  let shell = `border bg-panel ${SHADOW} ${styles.card} ${round ? "rounded-full" : "rounded-2xl"}`;
  let content: React.ReactNode;
  switch (kind) {
    case "db":
    case "diamond":
    case "hex":
      shell = "";
      content = <ShapeNode node={node} w={w} h={h} />;
      break;
    case "circle":
      content = (
        <>
          <span
            className={`flex h-full w-full items-center justify-center ${tone === "default" ? "text-ink/80" : styles.text}`}
          >
            {node.icon && <node.icon size={w * 0.38} />}
          </span>
          {node.label && (
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium text-ink/80">
              {node.label}
            </span>
          )}
        </>
      );
      break;
    case "chip":
      shell += ` flex items-center justify-center px-3 text-[12px] font-medium ${tone === "default" ? "text-ink/70" : styles.text}`;
      content = node.label;
      break;
    case "ghost":
      shell = "rounded-2xl border border-dashed border-ink/30 bg-canvas";
      content = (
        <motion.div
          className="flex h-full w-full items-center gap-3 px-4"
          animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          {node.icon && <IconChip icon={node.icon} tone={tone} />}
          <NodeText node={node} />
        </motion.div>
      );
      break;
    case "tile":
      content = (
        <div className="flex h-full w-full flex-col items-start gap-3 p-4">
          {node.icon && <IconChip icon={node.icon} tone={tone} />}
          <NodeText node={node} />
        </div>
      );
      break;
    default:
      content = (
        <div
          className={`flex h-full w-full items-center gap-3 ${kind === "pill" ? "pl-2 pr-5" : "px-4"} ${node.icon ? "" : "justify-center"}`}
        >
          {node.icon && (
            <IconChip icon={node.icon} tone={tone} round={kind === "pill"} />
          )}
          <NodeText node={node} center={!node.icon} />
        </div>
      );
  }

  return (
    <motion.div
      className="absolute"
      style={{ left: node.x - w / 2, top: node.y - h / 2, width: w, height: h }}
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
    >
      {node.glow && !reduceMotion && (
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute -inset-2 border ${styles.ring} ${round ? "rounded-full" : "rounded-[22px]"}`}
          animate={{ opacity: [0, 0.9, 0], scale: [0.96, 1.04, 1.08] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <div className={`relative h-full w-full ${shell}`}>{content}</div>
    </motion.div>
  );
};

export const FlowDiagram = ({
  width,
  height,
  nodes,
  edges,
}: {
  width: number;
  height: number;
  nodes: IFlowNode[];
  edges: IFlowEdge[];
}) => {
  const reduceMotion = useReducedMotion();
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const groups = nodes.filter((node) => node.kind === "group");
  const items = nodes.filter((node) => node.kind !== "group");
  const edgeDelay = items.length * 0.07 + 0.15;
  const geometries = edges.map((edge) =>
    edgeGeometry(edge, byId[edge.from], byId[edge.to]),
  );

  return (
    <div className="relative" style={{ width, height }}>
      {groups.map((group) => {
        const [w, h] = size(group);
        return (
          <motion.div
            key={group.id}
            className="absolute rounded-3xl border border-dashed border-ink/20 bg-ink/[0.02]"
            style={{
              left: group.x - w / 2,
              top: group.y - h / 2,
              width: w,
              height: h,
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="absolute -top-3 left-5 rounded-full border border-ink/15 bg-canvas px-3 py-0.5 text-[11px] uppercase tracking-widest text-ink/55">
              {group.label}
            </span>
          </motion.div>
        );
      })}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {edges.map((edge, index) => (
          <EdgePath
            key={`${edge.from}-${edge.to}-${index}`}
            edge={edge}
            geometry={geometries[index]}
            delay={edgeDelay + index * 0.06}
          />
        ))}
      </svg>
      {edges.map((edge, index) =>
        edge.label ? (
          <motion.span
            key={`label-${index}`}
            className={`absolute whitespace-nowrap rounded-full border border-ink/10 bg-canvas px-2.5 py-0.5 text-[11.5px] font-medium ${tones[edge.tone ?? "default"].text}`}
            style={{
              left: geometries[index].label[0],
              top: geometries[index].label[1],
              x: "-50%",
              y: "-50%",
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: edgeDelay + index * 0.06 + 0.2,
            }}
          >
            {edge.label}
          </motion.span>
        ) : null,
      )}
      {items.map((node, index) => (
        <Node key={node.id} node={node} index={index} />
      ))}
    </div>
  );
};

export const SequenceDiagram = ({
  actors,
  steps,
  width = 620,
}: {
  actors: ISequenceActor[];
  steps: SequenceStep[];
  width?: number;
}) => {
  const reduceMotion = useReducedMotion();
  const pad = 94;
  const spacing = (width - pad * 2) / Math.max(actors.length - 1, 1);
  const xs = actors.map((_, index) => pad + index * spacing);
  const headerHeight = 58;

  let cursor = headerHeight + 18;
  const rows = steps.map((step) => {
    const y = cursor;
    cursor += "section" in step ? 34 : 50;
    return { step, y };
  });
  const height = cursor + 14;
  const bands = rows
    .map((row, index) => ({ ...row, index }))
    .filter((row) => "section" in row.step)
    .map((row, index, sections) => ({
      ...row,
      end: sections[index + 1]?.y ?? cursor,
    }));
  const delayOf = (index: number) => (reduceMotion ? 0 : 0.3 + index * 0.2);

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        {bands.map((band) => (
          <motion.rect
            key={band.index}
            x={6}
            y={band.y + 4}
            width={width - 12}
            height={band.end - band.y - 6}
            rx={14}
            className={tones[band.step.tone ?? "default"].band}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: delayOf(band.index) }}
          />
        ))}
        {xs.map((x) => (
          <line
            key={x}
            x1={x}
            y1={headerHeight}
            x2={x}
            y2={height - 6}
            strokeDasharray="3 6"
            strokeLinecap="round"
            strokeWidth={1.5}
            className="stroke-ink/20"
          />
        ))}
        {rows.map(({ step, y }, index) => {
          if ("section" in step) return null;
          const tone = step.tone ?? "default";
          const x1 = xs[step.from];
          const x2 = xs[step.to];
          const lineY = y + 34;
          const tip: Point = [x2 - Math.sign(x2 - x1) * 5, lineY];
          const end = back(tip, [x1, lineY], HEAD);
          return (
            <motion.g
              key={index}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: delayOf(index) }}
            >
              <circle cx={x1} cy={lineY} r={3.5} className={tones[tone].head} />
              <FlowLine d={`M${fmt([x1, lineY])} L${fmt(end)}`} tone={tone} />
              <ArrowHead tip={tip} from={[x1, lineY]} tone={tone} />
            </motion.g>
          );
        })}
      </svg>
      {actors.map((actor, index) => (
        <motion.div
          key={actor.label}
          className={`absolute top-0 flex h-[58px] w-[176px] items-center gap-2.5 rounded-2xl border bg-panel px-3 ${SHADOW} ${tones.default.card}`}
          style={{ left: xs[index], x: "-50%" }}
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
        >
          {actor.icon && <IconChip icon={actor.icon} tone="default" />}
          <span className="text-[14px] font-medium leading-tight text-ink">
            {actor.label}
          </span>
        </motion.div>
      ))}
      {rows.map(({ step, y }, index) => {
        const delay = delayOf(index) + 0.1;
        if ("section" in step) {
          return (
            <motion.span
              key={index}
              className={`absolute left-4 rounded-full px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-widest ${tones[step.tone ?? "default"].chip}`}
              style={{ top: y + 12 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay }}
            >
              {step.section}
            </motion.span>
          );
        }
        return (
          <motion.span
            key={index}
            className={`absolute whitespace-nowrap rounded-full border border-ink/10 bg-canvas px-2.5 py-0.5 text-[12px] ${step.tone ? `font-medium ${tones[step.tone].text}` : "text-ink/80"}`}
            style={{
              left: (xs[step.from] + xs[step.to]) / 2,
              top: y + 8,
              x: "-50%",
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
          >
            {step.label}
          </motion.span>
        );
      })}
    </div>
  );
};

const EntityCard = ({ entity, delay }: { entity: IEntity; delay: number }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={`w-[250px] shrink-0 overflow-hidden rounded-2xl border border-ink/15 bg-panel ${SHADOW}`}
    >
      <div className="flex items-center justify-between border-b border-ink/10 bg-gradient-to-b from-blue-500/[0.12] to-transparent px-4 py-3">
        <span className="text-[15px] font-semibold tracking-wider text-ink">
          {entity.name}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-ink/40">
          table
        </span>
      </div>
      <div className="flex flex-col py-1.5">
        {entity.fields.map((field) => (
          <div
            key={field.name}
            className="grid grid-cols-[1fr_auto_2.75rem] items-center gap-x-3 px-4 py-1.5 text-[13px]"
          >
            <span className="font-light text-ink/85">{field.name}</span>
            <span className="font-light text-ink/40">{field.type}</span>
            {field.key ? (
              <span
                className={`flex items-center justify-center gap-1 rounded-md py-0.5 text-[10px] font-semibold ${
                  field.key === "PK"
                    ? "bg-amber-500/15 text-amber-500"
                    : "bg-blue-500/15 text-blue-500"
                }`}
              >
                {field.key === "PK" ? (
                  <LuKeyRound size={10} />
                ) : (
                  <LuLink size={10} />
                )}
                {field.key}
              </span>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const EntityDiagram = ({
  entities: [left, right],
  relation,
  cardinality: [one, many],
}: {
  entities: [IEntity, IEntity];
  relation: string;
  cardinality: [string, string];
}) => (
  <div className="flex items-center">
    <EntityCard entity={left} delay={0} />
    <div className="relative h-[80px] w-[150px] shrink-0">
      <svg
        viewBox="0 0 150 80"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <FlowLine d="M4,40 L132,40" tone="accent" />
        {/* One: a single bar. */}
        <path
          d="M14,31 L14,49"
          strokeWidth={2}
          strokeLinecap="round"
          className="stroke-blue-500"
        />
        {/* Many: a crow's foot. */}
        <path
          d="M130,40 L146,30 M130,40 L146,40 M130,40 L146,50"
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          className="stroke-blue-500"
        />
      </svg>
      <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border border-ink/10 bg-canvas px-2.5 py-0.5 text-[11.5px] font-medium text-ink/75">
        {relation}
      </span>
      <span className="absolute bottom-2 left-2 text-[12px] font-semibold text-blue-500">
        {one}
      </span>
      <span className="absolute bottom-2 right-2 text-[12px] font-semibold text-blue-500">
        {many}
      </span>
    </div>
    <EntityCard entity={right} delay={0.15} />
  </div>
);

export const SpectrumDiagram = ({
  steps,
  from,
  to,
}: {
  steps: { label: string; badge?: string }[];
  from: string;
  to: string;
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex w-[620px] flex-col gap-6 pt-3">
      <div className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.09, ease: EASE }}
            className={`relative flex h-[136px] flex-col justify-between rounded-2xl border bg-panel p-4 ${SHADOW} ${
              step.badge ? tones.accent.card : tones.default.card
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest text-ink/40">
              Level {index + 1}
            </span>
            <div className="flex gap-1">
              {steps.map((_, bar) => (
                <span
                  key={bar}
                  className={`h-1.5 flex-1 rounded-full ${bar <= index ? "bg-blue-500" : "bg-ink/10"}`}
                />
              ))}
            </div>
            <span className="text-[15px] font-medium leading-tight text-ink">
              {step.label}
            </span>
            {step.badge && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                {step.badge}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="relative h-2 rounded-full bg-gradient-to-r from-ink/10 via-blue-500/40 to-blue-500">
          <span className="spectrum-dot absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.8)]" />
        </div>
        <div className="flex justify-between gap-4 text-[12.5px] font-light text-ink/55">
          <span className="flex items-center gap-1.5">
            <LuRabbit size={15} /> {from}
          </span>
          <span className="flex items-center gap-1.5">
            {to} <LuSnail size={15} />
          </span>
        </div>
      </div>
    </div>
  );
};

export const CardGrid = ({
  columns,
  items,
}: {
  columns: number;
  items: ISlideCard[];
}) => {
  const reduceMotion = useReducedMotion();
  const gap = 20;
  return (
    <div
      className="flex h-full w-full flex-wrap content-center justify-center"
      style={{ gap }}
    >
      {items.map((item, index) => {
        const tone = item.tone ?? "default";
        return (
          <motion.div
            key={item.title}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
            className={`flex flex-col gap-3 rounded-2xl border bg-panel p-5 ${SHADOW} ${tones[tone].card}`}
            style={{
              width: `calc((100% - ${(columns - 1) * gap}px) / ${columns})`,
            }}
          >
            {item.badge ? (
              <span className="bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text font-serif text-[56px] leading-none text-transparent">
                {item.badge}
              </span>
            ) : (
              item.icon && <IconChip icon={item.icon} tone={tone} />
            )}
            <span className="text-[18px] font-medium leading-tight text-ink">
              {item.title}
            </span>
            {item.text && (
              <span className="text-[14.5px] font-light leading-relaxed text-ink/60">
                {item.text}
              </span>
            )}
            {item.meta && (
              <div className="mt-1 flex flex-col">
                {item.meta.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 border-t border-ink/10 py-3"
                  >
                    <span className="text-[11px] uppercase tracking-widest text-ink/45">
                      {row.label}
                    </span>
                    <span className="text-[17px] font-medium text-ink">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
