"use client";

import { FaChevronRight } from "react-icons/fa";
import { IExperience } from "../interfaces/components";
import Image from "next/image";
import { useState } from "react";

const ExperienceCard = ({ data }: { data: IExperience }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((open) => !open);

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
        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-ink/30 sm:gap-4"
      >
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 sm:h-12 sm:w-12">
            <Image
              src={data.logo}
              alt={data.company}
              className="h-7 w-7 object-contain"
            />
          </div>
          <div className="flex min-w-0 flex-col">
            <h3 className="text-base font-medium text-ink">{data.company}</h3>
            <p className="text-xs font-light text-ink/60">{data.role}</p>
            <p className="mt-0.5 text-[11px] font-light text-ink/40 sm:hidden">
              {data.duration}
              {data.location && ` · ${data.location}`}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <div className="hidden flex-col items-end sm:flex">
            <p className="text-xs font-light text-ink/50">{data.duration}</p>
            {data.location && (
              <p className="text-[11px] font-light text-ink/40">
                {data.location}
              </p>
            )}
          </div>
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
          <ul className="mt-4 space-y-2">
            {data.description.map((item, index) => (
              <li
                key={index}
                className="relative pl-6 text-sm font-light text-ink/60"
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

export default ExperienceCard;
