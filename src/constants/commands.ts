import { ICommand, ICommandGroup } from "../interfaces/components";
import { CAL_BOOKING, Links } from "./links";
import {
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineCodeBracket,
  HiOutlineDocumentText,
  HiOutlineEnvelope,
  HiOutlineHome,
  HiOutlineSquare2Stack,
} from "react-icons/hi2";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

/**
 * Sections carry both an anchor and an href: the menu scrolls to the anchor
 * when that section is on screen, and otherwise routes to the href, which is
 * what happens on phones where Experience and Skills live on their own pages.
 */
const sections: ICommand[] = [
  {
    id: "experience",
    label: "Experience",
    icon: HiOutlineBriefcase,
    shortcut: "E",
    keywords: "work jobs roles career playarka",
    anchor: "experience",
    href: "/experience",
  },
  {
    id: "skills",
    label: "Skills",
    icon: HiOutlineBookOpen,
    shortcut: "S",
    keywords: "stack tools languages frameworks coursework",
    anchor: "skills",
    href: "/skills",
  },
  {
    id: "projects",
    label: "Projects",
    icon: HiOutlineCodeBracket,
    shortcut: "P",
    keywords: "work built apps side projects",
    anchor: "projects",
    href: "/projects",
  },
  {
    id: "github",
    label: "GitHub",
    icon: FaGithub,
    shortcut: "G",
    keywords: "contributions activity commits graph",
    anchor: "github",
    href: "/#github",
  },
];

const booking: ICommand[] = CAL_BOOKING
  ? [
      {
        id: "book",
        label: "Book a Call",
        icon: HiOutlineCalendarDays,
        shortcut: "B",
        keywords: "meeting calendar cal.com schedule 15 min contact",
      },
    ]
  : [];

const general: ICommand[] = [
  {
    id: "copy-link",
    label: "Copy Link",
    icon: HiOutlineSquare2Stack,
    shortcut: "C",
    keywords: "share url clipboard",
  },
  ...booking,
  {
    id: "email",
    label: "Send an Email",
    icon: HiOutlineEnvelope,
    shortcut: "M",
    keywords: "mail contact reach out hire",
    href: Links.email,
  },
  {
    id: "resume",
    label: "View Resume",
    icon: HiOutlineDocumentText,
    shortcut: "R",
    keywords: "cv pdf download",
    href: Links.resume,
    external: true,
  },
  {
    id: "home",
    label: "Go Home",
    icon: HiOutlineHome,
    shortcut: "H",
    keywords: "start top intro",
    href: "/",
  },
];

const socials: ICommand[] = [
  {
    id: "github-profile",
    label: "GitHub Profile",
    icon: FaGithub,
    keywords: "code repos source mr-dev-prince",
    href: Links.github,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    keywords: "connect network hire",
    href: Links.linkedin,
    external: true,
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: FaTwitter,
    keywords: "x tweets social",
    href: Links.twitter,
    external: true,
  },
  {
    id: "leetcode",
    label: "LeetCode",
    icon: SiLeetcode,
    keywords: "dsa problems algorithms",
    href: Links.leetcode,
    external: true,
  },
];

export const CommandGroups: ICommandGroup[] = [
  { heading: "Sections", items: sections },
  { heading: "General", items: general },
  { heading: "Socials", items: socials },
];

export const AllCommands: ICommand[] = CommandGroups.flatMap(
  (group) => group.items,
);
