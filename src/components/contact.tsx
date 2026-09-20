import { FaEnvelope } from "react-icons/fa";
import BookCall from "./book-call";
import Reveal from "./reveal";
import Row from "./row";
import { CAL_BOOKING, Links } from "../constants/links";

const Contact = () => (
  <Row>
    <Reveal>
      <div id="contact" className="flex flex-col gap-4 scroll-mt-24">
        <p className="max-w-xl text-sm font-light leading-relaxed text-white/60 sm:text-base">
          Building something, hiring, or just want to talk shop? Grab fifteen
          minutes on my calendar, or send me an email and I&apos;ll reply.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {CAL_BOOKING && <BookCall calLink={CAL_BOOKING} />}
          <a
            href={Links.email}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <FaEnvelope size={13} className="text-white/80" />
            Email me
          </a>
        </div>
      </div>
    </Reveal>
  </Row>
);

export default Contact;
