import type { StaticImageData } from "next/image";
import type { IconType } from "react-icons";

type IconKey =
  | "compass"
  | "wallet"
  | "chip"
  | "book"
  | "mobile"
  | "landmark"
  | "leaf"
  | "network"
  | "video";

type LinkKind = "github" | "live" | "server" | "external";

interface ILink {
  label: string;
  href: string;
  kind?: LinkKind;
}

interface IExperience {
  company: string;
  logo: StaticImageData;
  role: string;
  duration: string;
  location?: string;
  description: string[];
}

interface IProject {
  name: string;
  tagline: string;
  icon: IconKey;
  stack: string[];
  links: ILink[];
  description: string[];
  featured?: boolean;
  image?: StaticImageData;
}

type SlideListItem = string | { text: string; items: SlideListItem[] };

type DiagramTone = "good" | "bad" | "accent";

interface IFlowNode {
  id: string;
  label: string;
  sub?: string;
  icon?: IconType;
  /** Centre of the node, in the diagram's own coordinates. */
  x: number;
  y: number;
  w?: number;
  h?: number;
  /**
   * card: icon beside text. tile: icon above wrapping text. ghost: a dashed,
   * maybe-later component. chip: a small floating annotation.
   */
  kind?:
    | "card"
    | "tile"
    | "pill"
    | "db"
    | "circle"
    | "diamond"
    | "hex"
    | "ghost"
    | "chip"
    | "group";
  tone?: DiagramTone;
  /** A slow pulse that marks the node the slide is about. */
  glow?: boolean;
}

interface IFlowEdge {
  from: string;
  to: string;
  label?: string;
  /** Corners the edge bends through on its way from one node to the other. */
  via?: [number, number][];
  /** Which way a curved edge leaves and enters its nodes; picked from the layout by default. */
  anchor?: "x" | "y";
  both?: boolean;
  /** Ends in a cross rather than an arrowhead: the write that never lands. */
  blocked?: boolean;
  /** Sends a dot travelling along the edge. */
  pulse?: boolean;
  tone?: DiagramTone;
}

interface ISequenceActor {
  label: string;
  icon?: IconType;
}

interface ISequenceMessage {
  from: number;
  to: number;
  label: string;
  tone?: DiagramTone;
}

/** A section shades every message after it, up to the next section. */
type SequenceStep = ISequenceMessage | { section: string; tone?: DiagramTone };

interface IEntity {
  name: string;
  fields: { name: string; type: string; key?: "PK" | "FK" }[];
}

interface ISlideCard {
  title: string;
  text?: string;
  icon?: IconType;
  /** Large lettering in place of an icon, like the A in ACID. */
  badge?: string;
  tone?: DiagramTone;
  meta?: { label: string; value: string }[];
}

type SlideBlock =
  | { type: "text"; text: string }
  | { type: "list"; items: SlideListItem[] }
  | { type: "note"; text: string }
  | { type: "cards"; columns: number; items: ISlideCard[] }
  | {
      type: "flow";
      width: number;
      height: number;
      nodes: IFlowNode[];
      edges: IFlowEdge[];
    }
  | {
      type: "sequence";
      actors: ISequenceActor[];
      steps: SequenceStep[];
      width?: number;
    }
  | {
      type: "entities";
      entities: [IEntity, IEntity];
      relation: string;
      cardinality: [string, string];
    }
  | {
      type: "spectrum";
      steps: { label: string; badge?: string }[];
      from: string;
      to: string;
    };

interface ILearningSlide {
  title: string;
  /** split: text beside the visual. stack: text above it. Defaults to split. */
  layout?: "split" | "stack";
  blocks: SlideBlock[];
}

interface ILearningTopic {
  id: string;
  title: string;
  summary: string;
  slides: ILearningSlide[];
}

interface ILearningTrack {
  id: string;
  label: string;
  title: string;
  topics: ILearningTopic[];
}

type DoodleKind =
  "keyboard" | "mouse" | "headphones" | "raspberryPi" | "espBoard";

interface IDoodle {
  kind: DoodleKind;
  className?: string;
  rotate?: number;
  float?: number;
}

interface IReveal {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

interface ILinkButton {
  href: string;
  text: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

interface ISkill {
  name: string;
  icon: IconType;
  color?: string;
}

interface ISkillGroup {
  category: string;
  items: string[];
}

interface IContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface IHeading {
  text: string;
}

interface IPageHeader {
  title: string;
  subtitle?: string;
}

interface ITab {
  label: string;
  href: string;
  icon: IconType;
  activeIcon: IconType;
}

interface ICommand {
  id: string;
  label: string;
  icon: IconType;
  /** Letter shown as "shift + <letter>" and bound while the menu is open. */
  shortcut?: string;
  /** Extra words the search matches on, beyond the label. */
  keywords?: string;
  /** Element id to scroll to when that section is on screen. */
  anchor?: string;
  href?: string;
  external?: boolean;
}

interface ICommandGroup {
  heading: string;
  items: ICommand[];
}

interface IButton {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface ISocialButton {
  icon: React.ReactNode;
  label: string;
  link: string;
}

export type {
  IconKey,
  LinkKind,
  ILink,
  IExperience,
  IProject,
  SlideListItem,
  DiagramTone,
  IFlowNode,
  IFlowEdge,
  ISequenceActor,
  ISequenceMessage,
  SequenceStep,
  IEntity,
  ISlideCard,
  SlideBlock,
  ILearningSlide,
  ILearningTopic,
  ILearningTrack,
  ILinkButton,
  IReveal,
  DoodleKind,
  IDoodle,
  ISkill,
  ISkillGroup,
  IContributionDay,
  IHeading,
  IPageHeader,
  ITab,
  ICommand,
  ICommandGroup,
  IButton,
  ISocialButton,
};
