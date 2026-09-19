import Image from "next/image";
import { IProject } from "../interfaces/components";
import LinkPill from "./link-pill";

const FeaturedProjectCard = ({ data }: { data: IProject }) => {
  const primary =
    data.links.find((link) => link.kind === "live") ?? data.links[0];

  return (
    <div className="group flex flex-col gap-3">
      <a
        href={primary.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${data.name}`}
        className="block overflow-hidden rounded-xl border border-white/10 bg-[#0f0f0f]"
      >
        {data.image && (
          <Image
            src={data.image}
            alt={`${data.name} landing page`}
            placeholder="blur"
            sizes="(min-width: 1280px) 540px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        )}
      </a>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-base font-medium text-white">
            {data.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {data.links.map((link) => (
              <LinkPill key={link.label} {...link} />
            ))}
          </div>
        </div>
        <p
          className="truncate text-xs font-light text-white/60"
          title={data.tagline}
        >
          {data.tagline}
        </p>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;
