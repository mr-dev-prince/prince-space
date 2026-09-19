"use client";

import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { IProject } from "../interfaces/components";
import Icon from "./icon";
import LinkPill from "./link-pill";

const ProjectCard = ({ data }: { data: IProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((open) => !open);
  const pills = data.links.map((link) => (
    <LinkPill key={link.label} {...link} />
  ));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-white/30 sm:gap-4"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Icon name={data.icon} />
          <div className="flex min-w-0 flex-col">
            <h3 className="text-base font-medium text-white">{data.name}</h3>
            <p className="text-xs font-light text-white/60">{data.tagline}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="hidden items-center gap-2 sm:flex">{pills}</div>
          <FaChevronRight
            size={10}
            color="gray"
            className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          />
        </div>
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 flex flex-wrap gap-2 sm:hidden">{pills}</div>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {data.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-light text-white/60"
              >
                {tech}
              </span>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {data.description.map((item, index) => (
              <li
                key={index}
                className="relative pl-6 text-sm font-light text-white/60"
              >
                <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
