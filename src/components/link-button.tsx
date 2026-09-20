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
    className="flex group items-center gap-2 px-4 py-2 rounded-xl border border-ink/10 bg-surface hover:bg-ink/10 transition-colors text-ink text-sm font-medium"
  >
    {iconPosition === "left" && icon}
    {text}
    {iconPosition === "right" && icon}
  </Link>
);

export default LinkButton;
