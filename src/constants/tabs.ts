import { ITab } from "../interfaces/components";
import {
  HiBriefcase,
  HiHome,
  HiOutlineBriefcase,
  HiOutlineHome,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiSparkles,
  HiSquares2X2,
} from "react-icons/hi2";

export const Tabs: ITab[] = [
  { label: "Home", href: "/", icon: HiOutlineHome, activeIcon: HiHome },
  {
    label: "Experience",
    href: "/experience",
    icon: HiOutlineBriefcase,
    activeIcon: HiBriefcase,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: HiOutlineSquares2X2,
    activeIcon: HiSquares2X2,
  },
  {
    label: "Skills",
    href: "/skills",
    icon: HiOutlineSparkles,
    activeIcon: HiSparkles,
  },
];
