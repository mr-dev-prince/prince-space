type CalFn = ((...args: unknown[]) => void) & { q: unknown[][] };
type CalGlobal = CalFn & { ns: Record<string, CalFn>; loaded?: boolean };

declare global {
  interface Window {
    Cal?: CalGlobal;
  }
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";
const NAMESPACE = "book";

const push = (fn: CalFn, args: unknown[]) => {
  fn.q.push(args);
};

/**
 * Cal's embed.js throws unless a queueing stub already exists on window, so
 * this is their official loader transcribed from @calcom/embed-snippet. Calls
 * made before the script arrives are queued and replayed once it loads, which
 * is what lets the 90KB script stay unfetched until someone asks to book.
 */
const installStub = () => {
  if (window.Cal) return;

  const cal = function (...args: unknown[]) {
    const self = window.Cal as CalGlobal;
    if (!self.loaded) {
      self.ns = {};
      self.q = self.q || [];
      document.head.appendChild(document.createElement("script")).src =
        EMBED_SRC;
      self.loaded = true;
    }
    if (args[0] === "init") {
      const api = ((...queued: unknown[]) => push(api, queued)) as CalFn;
      api.q = api.q || [];
      const namespace = args[1];
      if (typeof namespace === "string") {
        self.ns[namespace] = self.ns[namespace] || api;
        push(self.ns[namespace], args);
        push(self, ["initNamespace", namespace]);
      } else {
        push(self, args);
      }
      return;
    }
    push(self, args);
  } as CalGlobal;

  cal.q = [];
  cal.ns = {};
  window.Cal = cal;
};

let initialised = false;

/**
 * Opens the Cal.com booking modal in the given theme, so the embed matches the
 * page it opened over. Returns false if the embed can't run.
 */
export const openBooking = (
  calLink: string,
  theme: "dark" | "light" = "dark",
): boolean => {
  if (typeof window === "undefined") return false;
  try {
    installStub();
    const cal = window.Cal;
    if (!cal) return false;

    if (!initialised) {
      cal("init", NAMESPACE);
      initialised = true;
    }
    // Re-sent every open, which is how a theme switch between bookings lands.
    cal.ns[NAMESPACE]("ui", { theme });
    cal.ns[NAMESPACE]("modal", {
      calLink,
      config: { layout: "month_view", theme },
    });
    return true;
  } catch {
    return false;
  }
};
