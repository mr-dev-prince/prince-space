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
  | "network";

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
  IButton,
  ISocialButton,
};
