import { FaArrowLeft } from "react-icons/fa";
import LinkButton from "./link-button";
import Reveal from "./reveal";
import { IPageHeader } from "../interfaces/components";

const PageHeader = ({ title, subtitle }: IPageHeader) => (
  <Reveal className="flex items-start justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6">
    <div className="flex min-w-0 flex-col gap-1">
      <h1 className="font-serif text-xl tracking-wide text-ink sm:text-2xl">
        {title}
      </h1>
      {subtitle && <p className="text-sm font-light text-ink/60">{subtitle}</p>}
    </div>
    <div className="hidden shrink-0 md:block">
      <LinkButton
        href="/"
        text="Back home"
        iconPosition="left"
        icon={
          <FaArrowLeft
            size={11}
            className="text-ink/80 transition-transform group-hover:-translate-x-0.5"
          />
        }
      />
    </div>
  </Reveal>
);

export default PageHeader;
