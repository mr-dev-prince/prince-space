import BookCall from "./book-call";
import Reveal from "./reveal";
import Row from "./row";
import { CAL_BOOKING, Links } from "../constants/links";

const YEAR = 2026;

const Contact = () => (
  <Row>
    <Reveal>
      <div
        id="contact"
        className="flex scroll-mt-24 flex-col justify-between gap-16 py-6 sm:min-h-[260px]"
      >
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
              Prince Chaurasia
            </p>
            <p className="text-sm font-light text-white/60 sm:text-base">
              Software Engineer at{" "}
              <a
                href={Links.playarka}
                target="_blank"
                rel="noreferrer"
                className="text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
              >
                Playarka
              </a>{" "}
              &amp; building cool things ✦
            </p>
          </div>
          {CAL_BOOKING && <BookCall calLink={CAL_BOOKING} />}
        </div>

        <div className="flex items-end justify-between gap-4 text-xs font-light text-white/40">
          <a
            href={Links.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white/70"
          >
            devprince.space
          </a>
          <div className="flex flex-col items-end gap-0.5">
            <span>Made with ♡</span>
            <span>© {YEAR} Prince Chaurasia</span>
          </div>
        </div>
      </div>
    </Reveal>
  </Row>
);

export default Contact;
