"use client";

import { FaExternalLinkAlt, FaGithub, FaServer } from "react-icons/fa";
import { ILink, LinkKind } from "../interfaces/components";

const icons: Record<LinkKind, React.ReactNode> = {
  github: <FaGithub size={12} />,
  live: <FaExternalLinkAlt size={10} />,
  server: <FaServer size={11} />,
  external: <FaExternalLinkAlt size={10} />,
};

const LinkPill = ({ label, href, kind = "external" }: ILink) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    onClick={(e) => e.stopPropagation()}
    className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-white/5 bg-[#0f0f0f] hover:bg-white/10 transition-colors text-white/70 text-xs font-light"
  >
    {icons[kind]}
    <span>{label}</span>
  </a>
);

export default LinkPill;
