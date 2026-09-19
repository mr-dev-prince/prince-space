import Link from "next/link";
import { ILinkButton } from "../interfaces/components";

const LinkButton = ({
  href,
  text,
  icon,
  iconPosition = "right",
}: ILinkButton) => (
  <Link
    href={href}
    className="flex group items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-[#0f0f0f] hover:bg-white/10 transition-colors text-white text-sm font-medium"
  >
    {iconPosition === "left" && icon}
    {text}
    {iconPosition === "right" && icon}
  </Link>
);

export default LinkButton;
