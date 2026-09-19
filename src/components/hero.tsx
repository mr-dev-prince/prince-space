"use client";

import Image from "next/image";
import prince from "../assets/prince.png";

import Button from "./button";
import { ISocialButton } from "../interfaces/components";
import { Links } from "../constants/links";

import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaRegFileAlt,
  FaCog,
} from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const Underlined = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block font-normal text-white">
    {children}
    <svg
      className="absolute -bottom-1.5 -left-[2.5%] h-[8px] w-[105%] text-white/40"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M1,7 Q50,2 98,6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M2,3 Q50,8 99,4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </span>
);

const Hero = () => {
  return (
    <section className="flex w-full flex-col justify-center px-4 py-8 text-white/80 sm:px-6 sm:py-10 md:min-h-[430px] md:py-4">
      <div className="mb-5 flex w-full items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-[#1a1a1a] p-1 sm:h-20 sm:w-20">
            <Image
              src={prince}
              alt="Prince Chaurasia"
              priority
              className="h-full w-full rounded-xl bg-white/10 object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
            <h1 className="font-serif text-xl tracking-tight text-white sm:text-2xl">
              Hi, I&apos;m Prince Chaurasia
            </h1>
            <p className="font-serif text-base tracking-wide text-white/60 sm:text-lg">
              cse • firmware • ai
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Command menu"
          className="hidden items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-5 py-1.5 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 md:flex"
        >
          <span>⌘</span>
          <span>K</span>
        </button>
      </div>
      <div className="max-w-2xl space-y-2 text-[15px] font-light leading-relaxed text-white/60 sm:text-base">
        <p>
          i am a <Underlined>computer science graduate</Underlined> currently
          working as a <Underlined>software engineer</Underlined> and building
          cool things.
        </p>
        <p className="leading-loose">
          i use <span className="text-white">react</span> to build frontends,{" "}
          <span className="text-white">fastify</span> and{" "}
          <span className="text-white">fastAPI</span> for backends,{" "}
          <span className="text-white">Next.js</span> to create complete
          full-stack web apps, and by using modern databases like{" "}
          <span className="text-white">PostgreSQL</span> and{" "}
          <span className="text-white">MongoDB</span>.
        </p>
      </div>
      <div className="mt-4">
        <Button
          text="Let's Talk! "
          icon={<FaCog className="text-white/80 group-hover:animate-spin" />}
          onClick={() => {
            window.location.href = Links.email;
          }}
        />
      </div>
      <div className="mt-6 space-y-3 sm:space-y-4">
        <p className="text-sm text-white/60">
          Here are my <span className="text-white">socials</span>
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <SocialButton
            icon={<FaGithub />}
            label="GitHub"
            link={Links.github}
          />
          <SocialButton
            icon={<FaTwitter />}
            label="Twitter"
            link={Links.twitter}
          />
          <SocialButton
            icon={<FaLinkedin />}
            label="LinkedIn"
            link={Links.linkedin}
          />
          <SocialButton
            icon={<SiLeetcode />}
            label="LeetCode"
            link={Links.leetcode}
          />
          <SocialButton
            icon={<FaEnvelope />}
            label="Email"
            link={Links.email}
          />
          <SocialButton
            icon={<FaRegFileAlt />}
            label="Resume"
            link={Links.resume}
          />
        </div>
      </div>
    </section>
  );
};

const SocialButton = ({ icon, label, link }: ISocialButton) => (
  <a
    href={link}
    target={link.startsWith("http") ? "_blank" : undefined}
    rel={link.startsWith("http") ? "noreferrer" : undefined}
    className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-[#0f0f0f] px-3 py-1.5 text-sm font-light text-white/70 transition-colors hover:bg-white/10 sm:py-1"
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default Hero;
