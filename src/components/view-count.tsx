import { FaRegEye } from "react-icons/fa";
import { GOATCOUNTER } from "../constants/links";

/**
 * Read on the server so the figure is baked into the HTML.
 *
 * GoatCounter is listed on EasyPrivacy (`||goatcounter.com^$third-party`), so
 * fetching this from the browser means the request is blocked for anyone
 * running an ad blocker or Brave, and the counter silently disappears for
 * them. Revalidating hourly is finer grained than GoatCounter's own cache,
 * which holds this endpoint for up to four hours anyway.
 */
const getViews = async (): Promise<string | null> => {
  try {
    const res = await fetch(GOATCOUNTER.counter, {
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const digits = String(data?.count ?? "").replace(/\D/g, "");
    return digits ? Number(digits).toLocaleString("en-US") : null;
  } catch {
    return null;
  }
};

const ViewCount = async () => {
  const views = await getViews();

  // Stays absent until a real number arrives, so nothing invented is shown.
  if (!views) return null;

  return (
    <span
      className="flex items-center gap-1.5 rounded-xl border border-ink/5 bg-surface px-3 py-1 text-ink/70"
      title={`${views} page views, counted by GoatCounter`}
    >
      <FaRegEye size={13} aria-hidden />
      <span className="tabular-nums">{views}</span>
      <span className="text-ink/40">views</span>
    </span>
  );
};

export default ViewCount;
